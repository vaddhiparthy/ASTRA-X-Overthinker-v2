from datetime import datetime
from typing import Literal, Dict, Any

from .config import OverthinkerConfig, load_config
from .storage import (
    read_goals,
    read_feedback,
    read_current_run,
    write_current_run,
)
from .llm import load_system_prompts, call_llm

Scope = Literal["daily", "weekly", "yearly"]


def _new_run_id(scope: Scope) -> str:
    stamp = datetime.now().strftime("%Y%m%d%H%M")
    prefix = {"daily": "D", "weekly": "W", "yearly": "Y"}[scope]
    return f"{prefix}-{stamp}"


async def run_iteration(scope: Scope, cfg: OverthinkerConfig | None = None) -> Dict[str, Any]:
    if cfg is None:
        cfg = load_config()
    prompts = load_system_prompts()
    goals_text = read_goals(scope).strip()
    if not goals_text:
        raise ValueError(f"No goals found for scope '{scope}'. Edit data/goals/{scope}.md first.")

    prev_plan = read_current_run(scope).strip()
    feedback = read_feedback(scope).strip()

    sys = prompts["planner"] or "You are an autonomous planner that iteratively refines goals."
    persona = prompts["persona_general"]

    user_payload = f"""
[GOAL_SCOPE]
{scope}

[GOALS]
{goals_text}

[PREVIOUS_PLAN]
{prev_plan or "(none yet)"}

[FEEDBACK_FROM_USER]
{feedback or "(no feedback yet)"}

[INSTRUCTIONS]
- Focus ONLY on the goals text above.
- Output markdown with sections:
  - Path to completion
  - Steps (numbered)
  - Summary
"""

    messages = [
        {"role": "system", "content": sys},
        {"role": "system", "content": persona},
        {"role": "user", "content": user_payload},
    ]

    reply = await call_llm(messages, cfg)
    run_id = _new_run_id(scope)
    write_current_run(scope, reply, run_id)

    return {
        "scope": scope,
        "run_id": run_id,
        "ts": datetime.now().isoformat(timespec="seconds"),
        "plan_markdown": reply,
    }
