from pathlib import Path
import yaml
from pydantic import BaseModel

ROOT = Path(__file__).resolve().parents[1]
CONFIG_DIR = ROOT / "config"
CONFIG_FILE = CONFIG_DIR / "overthinker.yaml"


class ModelConfig(BaseModel):
    provider: str = "openai"          # or "ollama"
    model_name: str = "gpt-4.1-mini"
    api_base: str | None = None       # e.g. http://host.docker.internal:11434
    api_key_env: str | None = "OPENAI_API_KEY"
    temperature: float = 0.4
    max_tokens: int = 1500


class ScheduleConfig(BaseModel):
    autopilot: bool = False
    poll_minutes: int = 30
    rate_limit_per_day: int = 6
    quiet_hours: str = "02:00-04:00"  # HH:MM-HH:MM


class OverthinkerConfig(BaseModel):
    model: ModelConfig = ModelConfig()
    schedule: ScheduleConfig = ScheduleConfig()


def load_config() -> OverthinkerConfig:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    if not CONFIG_FILE.exists():
        cfg = OverthinkerConfig()
        save_config(cfg)
        return cfg
    with CONFIG_FILE.open("r", encoding="utf-8") as f:
        raw = yaml.safe_load(f) or {}
    return OverthinkerConfig(**raw)


def save_config(cfg: OverthinkerConfig) -> None:
    CONFIG_DIR.mkdir(parents=True, exist_ok=True)
    with CONFIG_FILE.open("w", encoding="utf-8") as f:
        yaml.safe_dump(cfg.model_dump(), f, sort_keys=False)
