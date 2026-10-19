#!/usr/bin/env python3
"""
RiskPulse AI — Unified CLI Runner & Entry Point
S&P Global & CRISIL Campus Hackathon 2026

Usage:
    python run.py                 # Runs backend (8000) AND React frontend (5173) together
    python run.py --backend-only  # Runs only the backend API on http://127.0.0.1:8000
    python run.py --test          # Runs backend unit and regression tests
    python run.py --seed          # Pre-seeds synthetic data & baseline index
    python run.py --docs          # Re-generates docs/architecture.png and docs/presentation.pdf
"""

import sys
import argparse
from pathlib import Path

# Add root and backend to python path
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))

def run_backend(host="127.0.0.1", port=8000, reload=True):
    import uvicorn
    print("=" * 72)
    print("🚀  Starting RiskPulse AI Backend Application")
    print(f"📡  REST API Base:       http://{host}:{port}")
    print(f"📖  Swagger Docs:        http://{host}:{port}/docs")
    print(f"🩺  Health Check:        http://{host}:{port}/api/health")
    print("=" * 72)
    uvicorn.run("src.main:app", host=host, port=port, reload=reload)

def run_all(host="127.0.0.1", port=8000, reload=True):
    """Start the React frontend (Vite) in the background, then run the backend in the foreground."""
    import shutil, subprocess, atexit
    frontend = ROOT_DIR / "frontend"
    npm = shutil.which("npm")
    proc = None
    if npm is None:
        print("⚠️  npm not found - install Node.js 20+ to run the frontend. Starting backend only.")
    else:
        if not (frontend / "node_modules").exists():
            print("📦  Installing frontend dependencies (first run only)...")
            subprocess.run([npm, "install"], cwd=frontend, check=True)
        proc = subprocess.Popen([npm, "run", "dev", "--", "--host", "127.0.0.1"], cwd=frontend)
        atexit.register(lambda: proc.poll() is None and proc.terminate())
        print("🖥️  React Frontend:      http://localhost:5173   <-- open this in your browser")
    run_backend(host=host, port=port, reload=reload)

def run_tests():
    import pytest
    print("🧪  Running RiskPulse AI Test Suite...")
    exit_code = pytest.main(["-v", "backend/tests"])
    sys.exit(exit_code)

def run_seed():
    print("🌱  Seeding baseline constituents, synthetic portfolio, and sample signals...")
    from app.database import engine, Base, SessionLocal
    from app.services.index_rebalancing.rebalancer import rebalancer
    from app.services.portfolio.portfolio_manager import PortfolioManager
    from app.services.ingestion.synthetic_generator import SyntheticDataGenerator
    from app.api.routes import _init_source_statuses

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        _init_source_statuses(db)
        rebalancer.initialize_constituents(db)
        PortfolioManager.initialize_portfolio(db)
        SyntheticDataGenerator.save_synthetic_files()
        print("✅  Database initialization and pre-seeding completed successfully!")
    finally:
        db.close()

def run_docs():
    print("🎨  Generating docs/architecture.png...")
    import subprocess
    cmd = [sys.executable, str(ROOT_DIR / "scripts" / "generate_docs_assets.py")]
    subprocess.run(cmd, check=True)
    print("✅  Documentation assets generated!")

def main():
    parser = argparse.ArgumentParser(description="RiskPulse AI Unified Entry Point")
    parser.add_argument("--test", action="store_true", help="Run pytest test suite")
    parser.add_argument("--seed", action="store_true", help="Initialize and seed database")
    parser.add_argument("--docs", action="store_true", help="Generate docs assets")
    parser.add_argument("--host", default="127.0.0.1", help="Host to bind (default: 127.0.0.1)")
    parser.add_argument("--port", type=int, default=8000, help="Port to bind (default: 8000)")
    parser.add_argument("--backend-only", action="store_true", help="Do not start the React frontend")
    parser.add_argument("--no-reload", action="store_true", help="Disable auto-reload")

    args = parser.parse_args()

    if args.test:
        run_tests()
    elif args.seed:
        run_seed()
    elif args.docs:
        run_docs()
    elif args.backend_only:
        run_backend(host=args.host, port=args.port, reload=not args.no_reload)
    else:
        run_all(host=args.host, port=args.port, reload=not args.no_reload)

if __name__ == "__main__":
    main()
