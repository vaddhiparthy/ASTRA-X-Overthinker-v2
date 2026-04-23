from __future__ import annotations

import unittest
from pathlib import Path
from uuid import uuid4
from unittest.mock import AsyncMock, patch

from fastapi.testclient import TestClient

from overthinker.app import create_app
from overthinker.core.models import GoalItem, Scope
from overthinker.services.llm import LLMCallResult
from overthinker.services.planner import run_iteration
from overthinker.storage.repository import SQLiteRepository


class RepositoryTests(unittest.TestCase):
    def make_db_path(self) -> Path:
        root = Path("data/private/test-work")
        root.mkdir(parents=True, exist_ok=True)
        return root / f"{uuid4().hex}.sqlite3"

    def test_initialize_keeps_new_scopes_empty(self) -> None:
        db_path = self.make_db_path()
        try:
            repository = SQLiteRepository(db_path)
            repository.initialize()

            daily = repository.get_goal_document(Scope.DAILY)
            weekly = repository.get_goal_document(Scope.WEEKLY)

            self.assertEqual(len(daily.items), 0)
            self.assertEqual(len(weekly.items), 0)
        finally:
            db_path.unlink(missing_ok=True)

    def test_run_persists_model_metadata(self) -> None:
        db_path = self.make_db_path()
        try:
            repository = SQLiteRepository(db_path)
            repository.initialize()
            repository.save_goal_document(
                Scope.DAILY,
                [GoalItem(title="Test daily goal", order=0)],
                "",
            )

            record = repository.create_run(
                Scope.DAILY,
                "## Path to Completion\nTest\n\n## Summary\nDone",
                trigger="manual",
                provider="ollama",
                configured_model="configured-model",
                effective_model="effective-model",
            )

            self.assertEqual(record.provider, "ollama")
            self.assertEqual(record.configured_model, "configured-model")
            self.assertEqual(record.effective_model, "effective-model")
            self.assertEqual(len(repository.list_run_sections(record.run_id)), 2)
        finally:
            db_path.unlink(missing_ok=True)


class AppTests(unittest.TestCase):
    def test_root_redirects_to_ui(self) -> None:
        app = create_app()
        with TestClient(app) as client:
            response = client.get("/", follow_redirects=False)
            self.assertEqual(response.status_code, 307)
            self.assertEqual(response.headers.get("location"), "/ui/overthinker.html")

    def test_health_exposes_scope_readiness(self) -> None:
        app = create_app()
        with patch("overthinker.api.routes.fetch_ollama_models", new=AsyncMock(return_value=["qwen2.5:7b-instruct"])):
            with TestClient(app) as client:
                response = client.get("/api/health")
        self.assertEqual(response.status_code, 200)
        payload = response.json()
        self.assertIn("scope_readiness", payload)
        self.assertTrue(any(entry["scope"] == "daily" for entry in payload["scope_readiness"]))


class PlannerTests(unittest.IsolatedAsyncioTestCase):
    async def test_run_iteration_returns_model_metadata(self) -> None:
        root = Path("data/private/test-work")
        root.mkdir(parents=True, exist_ok=True)
        db_path = root / f"{uuid4().hex}.sqlite3"
        try:
            repository = SQLiteRepository(db_path)
            repository.initialize()
            repository.save_goal_document(
                Scope.DAILY,
                [GoalItem(title="Test daily goal", order=0)],
                "",
            )
            with patch(
                "overthinker.services.planner.call_llm",
                new=AsyncMock(
                    return_value=LLMCallResult(
                        content="## Path to Completion\nTest\n\n## Summary\nDone",
                        provider="ollama",
                        configured_model="configured-model",
                        effective_model="effective-model",
                    )
                ),
            ):
                result = await run_iteration(Scope.DAILY, repository=repository)
        finally:
            db_path.unlink(missing_ok=True)

        self.assertEqual(result["provider"], "ollama")
        self.assertEqual(result["configured_model"], "configured-model")
        self.assertEqual(result["effective_model"], "effective-model")


if __name__ == "__main__":
    unittest.main()
