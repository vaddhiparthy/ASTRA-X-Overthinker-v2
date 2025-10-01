from datetime import datetime, time

from apscheduler.schedulers.asyncio import AsyncIOScheduler

from .config import load_config, OverthinkerConfig
from .engine import run_iteration


class OverthinkerScheduler:
    def __init__(self):
        self.scheduler = AsyncIOScheduler()
        self.cfg: OverthinkerConfig | None = None

    def _parse_quiet(self, s: str) -> tuple[time, time]:
        try:
            a, b = s.split("-")
            h1, m1 = map(int, a.split(":"))
            h2, m2 = map(int, b.split(":"))
            return time(h1, m1), time(h2, m2)
        except Exception:
            return time(2, 0), time(4, 0)

    def _in_quiet(self, cfg: OverthinkerConfig) -> bool:
        now = datetime.now().time()
        start, end = self._parse_quiet(cfg.schedule.quiet_hours)
        if start < end:
            return start <= now <= end
        # overnight wrap
        return now >= start or now <= end

    async def _run_all_scopes(self):
        cfg = self.cfg or load_config()
        if self._in_quiet(cfg):
            return
        for scope in ("yearly", "weekly", "daily"):
            try:
                await run_iteration(scope, cfg)
            except Exception:
                continue

    def start(self):
        self.cfg = load_config()
        if not self.cfg.schedule.autopilot:
            return
        minutes = max(5, self.cfg.schedule.poll_minutes)
        self.scheduler.add_job(self._run_all_scopes, "interval", minutes=minutes)
        self.scheduler.start()

    def reload(self):
        running = self.scheduler.running
        if running:
            self.scheduler.remove_all_jobs()
        self.cfg = load_config()
        if self.cfg.schedule.autopilot:
            minutes = max(5, self.cfg.schedule.poll_minutes)
            self.scheduler.add_job(self._run_all_scopes, "interval", minutes=minutes)
            if not running:
                self.scheduler.start()

    def shutdown(self):
        if self.scheduler.running:
            self.scheduler.shutdown(wait=False)
