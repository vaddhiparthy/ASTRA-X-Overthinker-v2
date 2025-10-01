from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from overthinker.config import load_config, save_config, OverthinkerConfig
from overthinker.storage import (
    init_dirs,
    read_goals,
    write_goals,
    read_current_run,
    move_current_to_past,
    append_feedback,
    read_feedback,
)
from overthinker.engine import run_iteration
from overthinker.scheduler import OverthinkerScheduler

Scope = Literal["daily", "weekly", "yearly"]

ROOT = Path(__file__).resolve().parent

app = FastAPI(title="ASTRA-X Overthinker v2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ui_dir = ROOT / "ui"
if ui_dir.exists():
    app.mount("/ui", StaticFiles(directory=str(ui_dir), html=True), name="ui")

scheduler = OverthinkerScheduler()


@app.on_event("startup")
async def startup():
    init_dirs()
    scheduler.start()


@app.on_event("shutdown")
async def shutdown():
    scheduler.shutdown()


class GoalsPayload(BaseModel):
    text: str


class RunPayload(BaseModel):
    scope: Scope


class FeedbackPayload(BaseModel):
    scope: Scope
    text: str


class ConfigPayload(BaseModel):
    model: dict
    schedule: dict


@app.get("/")
async def root():
    return {"status": "ok", "service": "overthinker-v2"}


@app.get("/api/goals/{scope}")
async def get_goals(scope: Scope):
    return {"scope": scope, "text": read_goals(scope)}


@app.post("/api/goals/{scope}")
async def set_goals(scope: Scope, payload: GoalsPayload):
    write_goals(scope, payload.text)
    return {"ok": True}


@app.post("/api/run")
async def run_once(payload: RunPayload):
    cfg = load_config()
    try:
        result = await run_iteration(payload.scope, cfg)
        return {"ok": True, **result}
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.get("/api/run/status/{scope}")
async def run_status(scope: Scope):
    content = read_current_run(scope)
    return {"scope": scope, "current_markdown": content}


@app.post("/api/run/complete/{scope}")
async def mark_complete(scope: Scope):
    moved = move_current_to_past(scope)
    if not moved:
        raise HTTPException(status_code=400, detail="No current run to move.")
    return {"ok": True, "archived_as": moved}


@app.post("/api/feedback")
async def add_feedback(payload: FeedbackPayload):
    append_feedback(payload.scope, payload.text)
    return {"ok": True}


@app.get("/api/feedback/{scope}")
async def get_feedback(scope: Scope):
    return {"scope": scope, "text": read_feedback(scope)}


@app.get("/api/config")
async def get_config():
    cfg = load_config()
    return cfg.model_dump()


@app.post("/api/config")
async def set_config(payload: ConfigPayload):
    current = load_config()
    new_cfg = OverthinkerConfig(
        model=current.model.__class__(**payload.model),
        schedule=current.schedule.__class__(**payload.schedule),
    )
    save_config(new_cfg)
    scheduler.reload()
    return {"ok": True}
