# ASTRA-X Overthinker v2

ASTRA-X Overthinker is a FastAPI planning system for running structured goal iterations with a local UI, scheduler controls, model configuration, feedback capture, and persistent run history.

The project now runs against PostgreSQL by default and stores application data in the `astrax` database under the `dev` schema with `overthinker_` table names.

## What It Does

- Manages goals by scope: `daily`, `weekly`, and `yearly`
- Captures operator feedback for later planning iterations
- Runs manual or scheduled planning loops through a configurable model backend
- Persists current and archived run history with model metadata
- Provides a browser UI for goals, runs, feedback, runtime settings, and storage settings
- Supports live storage migration between SQLite and PostgreSQL through the control panel/API

## Current Storage Layout

Default backend:

- PostgreSQL
- Database: `astrax`
- Schema: `dev`
- Table prefix: `overthinker_`

Primary tables:

- `dev.overthinker_goal_documents`
- `dev.overthinker_goal_items`
- `dev.overthinker_feedback`
- `dev.overthinker_runs`
- `dev.overthinker_run_sections`

Legacy markdown import is still supported from:

- `data/goals/`
- `data/feedback/`
- `data/runs/current/`
- `data/runs/past/`

## Project Structure

```text
.
├─ overthinker/
│  ├─ api/         # FastAPI routes
│  ├─ core/        # config, models, paths
│  ├─ resources/   # bundled prompt defaults
│  ├─ services/    # planner, scheduler, model calls
│  └─ storage/     # SQLite/PostgreSQL repositories and migration helpers
├─ tests/          # smoke tests
├─ ui/             # browser UI
├─ config/         # runtime config (ignored by git)
├─ data/           # runtime data and legacy imports (ignored by git)
├─ app.py          # ASGI entrypoint
└─ run_server.py   # local server launcher
```

## Run Locally

```powershell
python -m venv .venv
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python run_server.py
```

Open:

`http://localhost:8432/`

## Operating Flow

1. Add or edit goals in the `Goals` tab.
2. Add operator feedback in the `Feedback` tab when priorities or constraints change.
3. Run a manual iteration from the `Runs` tab or enable scheduler/autopilot in `Control Panel`.
4. Review the current plan and archived history in the `Runs` tab.
5. Adjust model, scheduler, runtime, and storage settings in `Control Panel`.

## Configuration

Runtime config is stored in:

- `config/overthinker.yaml`

Prompt overrides can be placed in:

- `data/private/prompts/`

The app ships with default prompt files under:

- `overthinker/resources/prompts/`

## Backend Notes

- `SQLiteRepository` remains available as a local fallback backend.
- `PostgresRepository` is the default production-style backend for this repo.
- The planner records `provider`, `configured_model`, and `effective_model` on each run.
- The control panel now exposes storage configuration as first-class settings.

## Testing

```powershell
python -m unittest discover -s tests -v
```

## Status

This repository has been recovered into a working state:

- UI is live on `localhost:8432`
- PostgreSQL storage is active
- Goals, runs, feedback, scheduler config, and storage config are functional
- Live planning iterations have been verified through the HTTP API
