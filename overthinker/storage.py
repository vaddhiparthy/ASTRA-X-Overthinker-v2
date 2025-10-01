from pathlib import Path
from datetime import datetime

ROOT = Path(__file__).resolve().parents[1]
DATA_DIR = ROOT / "data"
GOALS_DIR = DATA_DIR / "goals"
RUNS_DIR = DATA_DIR / "runs"
RUNS_CURRENT_DIR = RUNS_DIR / "current"
RUNS_PAST_DIR = RUNS_DIR / "past"
FEEDBACK_DIR = DATA_DIR / "feedback"


def init_dirs():
    for p in (GOALS_DIR, RUNS_CURRENT_DIR, RUNS_PAST_DIR, FEEDBACK_DIR):
        p.mkdir(parents=True, exist_ok=True)
    # Ensure default empty goal and feedback files exist
    for scope in ("daily", "weekly", "yearly"):
        f = GOALS_DIR / f"{scope}.md"
        if not f.exists():
            f.write_text("", encoding="utf-8")
        fb = FEEDBACK_DIR / f"{scope}.md"
        if not fb.exists():
            fb.write_text("", encoding="utf-8")


def read_goals(scope: str) -> str:
    f = GOALS_DIR / f"{scope}.md"
    return f.read_text(encoding="utf-8") if f.exists() else ""


def write_goals(scope: str, text: str) -> None:
    f = GOALS_DIR / f"{scope}.md"
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_text(text.strip() + "\n", encoding="utf-8")


def read_feedback(scope: str) -> str:
    f = FEEDBACK_DIR / f"{scope}.md"
    return f.read_text(encoding="utf-8") if f.exists() else ""


def append_feedback(scope: str, text: str) -> None:
    if not text.strip():
        return
    f = FEEDBACK_DIR / f"{scope}.md"
    f.parent.mkdir(parents=True, exist_ok=True)
    stamp = datetime.now().isoformat(timespec="seconds")
    with f.open("a", encoding="utf-8") as out:
        out.write(f"\n[{stamp}]\n{text.strip()}\n")


def get_current_run_file(scope: str) -> Path:
    RUNS_CURRENT_DIR.mkdir(parents=True, exist_ok=True)
    return RUNS_CURRENT_DIR / f"{scope}.md"


def read_current_run(scope: str) -> str:
    f = get_current_run_file(scope)
    return f.read_text(encoding="utf-8") if f.exists() else ""


def write_current_run(scope: str, content: str, run_id: str) -> None:
    f = get_current_run_file(scope)
    header = f"# {scope.capitalize()} • {run_id}\n\nLast updated: {datetime.now().isoformat(timespec='seconds')}\n\n"
    f.write_text(header + content.strip() + "\n", encoding="utf-8")


def move_current_to_past(scope: str) -> str | None:
    cur = get_current_run_file(scope)
    if not cur.exists():
        return None
    RUNS_PAST_DIR.mkdir(parents=True, exist_ok=True)
    ts = datetime.now().strftime("%Y%m%d%H%M%S")
    new_name = f"{scope[0].upper()}-{ts}.md"
    dest = RUNS_PAST_DIR / new_name
    dest.write_text(cur.read_text(encoding="utf-8"), encoding="utf-8")
    cur.unlink()
    return new_name
