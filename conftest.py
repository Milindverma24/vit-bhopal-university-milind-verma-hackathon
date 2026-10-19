"""Pytest bootstrap: run tests against a throwaway SQLite DB so they never touch (or depend on) the app's real database."""
import os
import tempfile

_tmp = tempfile.mkdtemp(prefix="riskpulse_test_")
os.environ["DATABASE_URL"] = f"sqlite:///{_tmp}/test.db"
