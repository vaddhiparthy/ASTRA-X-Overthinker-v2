from __future__ import annotations

import os
from dataclasses import dataclass
from pathlib import Path
from typing import Any

import httpx

from overthinker.core.config import OverthinkerConfig, load_config
from overthinker.core.paths import DEFAULT_PROMPTS_DIR, PROMPT_OVERRIDE_DIR


PROMPT_FILES = {
    "planner": "system_planner.txt",
    "persona_general": "persona_general.txt",
}


@dataclass
class LLMCallResult:
    content: str
    provider: str
    configured_model: str
    effective_model: str


def _read_prompt(path: Path) -> str:
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8").strip()


def load_system_prompts() -> dict[str, str]:
    prompts: dict[str, str] = {}
    for key, filename in PROMPT_FILES.items():
        override = _read_prompt(PROMPT_OVERRIDE_DIR / filename)
        default = _read_prompt(DEFAULT_PROMPTS_DIR / filename)
        prompts[key] = override or default
    return prompts


async def fetch_ollama_models(
    base_url: str = "http://127.0.0.1:11434", timeout_seconds: int = 10
) -> list[str]:
    base = base_url.rstrip("/")
    try:
        async with httpx.AsyncClient(timeout=timeout_seconds) as client:
            response = await client.get(f"{base}/api/tags")
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise ValueError(f"Ollama is unavailable: {exc}") from exc

    payload = response.json()
    return [item.get("name") for item in payload.get("models", []) if item.get("name")]


def choose_preferred_ollama_model(available_models: list[str], configured_model: str) -> str:
    normalized = [model for model in available_models if model]
    if not normalized:
        raise ValueError("No Ollama models are installed locally.")
    if configured_model and configured_model in normalized:
        return configured_model

    preferred_prefixes = (
        "qwen2.5",
        "qwen3",
        "llama3.1",
        "llama3",
        "glm-4.7",
        "llama3.2",
    )
    for prefix in preferred_prefixes:
        for model in normalized:
            if model.startswith(prefix):
                return model
    return normalized[0]


async def call_llm(
    messages: list[dict[str, Any]], cfg: OverthinkerConfig | None = None
) -> LLMCallResult:
    cfg = cfg or load_config()
    model_cfg = cfg.model
    timeout = httpx.Timeout(model_cfg.request_timeout_seconds)

    if model_cfg.provider.lower() == "ollama":
        base = (model_cfg.api_base or "http://127.0.0.1:11434").rstrip("/")
        effective_model = model_cfg.model_name
        try:
            available_models = await fetch_ollama_models(
                base_url=base,
                timeout_seconds=model_cfg.request_timeout_seconds,
            )
            if effective_model not in available_models:
                suggested_model = choose_preferred_ollama_model(
                    available_models, model_cfg.model_name
                )
                raise ValueError(
                    f"Configured Ollama model '{effective_model}' is not installed. "
                    f"Suggested model: '{suggested_model}'."
                )
            last_error: Exception | None = None
            response = None
            for _ in range(2):
                try:
                    async with httpx.AsyncClient(timeout=timeout) as client:
                        response = await client.post(
                            f"{base}/api/chat",
                            json={
                                "model": effective_model,
                                "messages": messages,
                                "stream": False,
                            },
                        )
                    break
                except httpx.ReadTimeout as exc:
                    last_error = exc
            if response is None:
                raise ValueError(
                    f"Ollama request timed out after {model_cfg.request_timeout_seconds}s."
                ) from last_error
            response.raise_for_status()
        except httpx.HTTPError as exc:
            raise ValueError(f"Ollama request failed: {exc}") from exc
        data = response.json()
        return LLMCallResult(
            content=data.get("message", {}).get("content", "").strip(),
            provider=model_cfg.provider,
            configured_model=model_cfg.model_name,
            effective_model=effective_model,
        )

    base = (model_cfg.api_base or "https://api.openai.com").rstrip("/")
    api_key = os.getenv(model_cfg.api_key_env, "").strip()
    if not api_key:
        raise ValueError(
            f"Missing API key in environment variable '{model_cfg.api_key_env}'."
        )

    try:
        async with httpx.AsyncClient(timeout=timeout) as client:
            response = await client.post(
                f"{base}/v1/chat/completions",
                headers={"Authorization": f"Bearer {api_key}"},
                json={
                    "model": model_cfg.model_name,
                    "temperature": model_cfg.temperature,
                    "max_tokens": model_cfg.max_tokens,
                    "messages": messages,
                },
            )
        response.raise_for_status()
    except httpx.HTTPError as exc:
        raise ValueError(f"Model request failed: {exc}") from exc
    data = response.json()
    return LLMCallResult(
        content=data["choices"][0]["message"]["content"].strip(),
        provider=model_cfg.provider,
        configured_model=model_cfg.model_name,
        effective_model=data.get("model", model_cfg.model_name),
    )
