import os
from pathlib import Path
from typing import List, Dict, Any

import httpx

from .config import OverthinkerConfig, load_config

ROOT = Path(__file__).resolve().parents[1]
PROMPTS_DIR = ROOT / "prompts"


def _read_prompt(name: str) -> str:
    path = PROMPTS_DIR / name
    if not path.exists():
        return ""
    return path.read_text(encoding="utf-8")


def load_system_prompts() -> dict:
    return {
        "planner": _read_prompt("system_planner.txt"),
        "refiner": _read_prompt("system_refiner.txt"),
        "summarizer": _read_prompt("system_summarizer.txt"),
        "persona_general": _read_prompt("persona_general.txt"),
    }


async def call_llm(messages: List[Dict[str, Any]], cfg: OverthinkerConfig | None = None) -> str:
    if cfg is None:
        cfg = load_config()
    m = cfg.model
    if m.provider == "ollama":
        base = m.api_base or "http://host.docker.internal:11434"
        url = base.rstrip("/") + "/api/chat"
        payload = {
            "model": m.model_name,
            "messages": messages,
            "stream": False,
        }
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, json=payload)
            r.raise_for_status()
            data = r.json()
            return data.get("message", {}).get("content", "")
    else:
        # Generic OpenAI-compatible /v1/chat/completions
        base = (m.api_base or "https://api.openai.com").rstrip("/")
        url = base + "/v1/chat/completions"
        key = os.getenv(m.api_key_env or "OPENAI_API_KEY", "")
        headers = {"Authorization": f"Bearer {key}"} if key else {}
        payload = {
            "model": m.model_name,
            "temperature": m.temperature,
            "max_tokens": m.max_tokens,
            "messages": messages,
        }
        async with httpx.AsyncClient(timeout=60) as client:
            r = await client.post(url, headers=headers, json=payload)
            r.raise_for_status()
            data = r.json()
            return data["choices"][0]["message"]["content"]
