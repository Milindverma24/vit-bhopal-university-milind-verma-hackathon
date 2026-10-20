#!/usr/bin/env python3
"""
RiskPulse AI — Unified CLI Runner & Entry Point
S&P Global & CRISIL Campus Hackathon 2026

Usage:
    python run.py                 # Runs backend (8000) AND React frontend (5173) together
    python run.py --backend-only  # Runs only the backend API on http://127.0.0.1:8000
    python run.py --open          # Runs everything and automatically opens browser
    python run.py --test          # Runs backend unit and regression tests
    python run.py --seed          # Pre-seeds synthetic data & baseline index
    python run.py --docs          # Re-generates docs/architecture.png and docs/presentation.pdf
"""

import os
import sys
import time
import socket
import signal
import shutil
import argparse
import subprocess
from pathlib import Path

# Add root and backend to python path
ROOT_DIR = Path(__file__).resolve().parent
BACKEND_DIR = ROOT_DIR / "backend"
FRONTEND_DIR = ROOT_DIR / "frontend"

if str(ROOT_DIR) not in sys.path:
    sys.path.insert(0, str(ROOT_DIR))
if str(BACKEND_DIR) not in sys.path:
    sys.path.insert(0, str(BACKEND_DIR))


def is_port_in_use(port: int, host: str = "127.0.0.1") -> bool:
    """Check if a network port is already open and in use."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.settimeout(0.3)
        return s.connect_ex((host, port)) == 0


def free_port(port: int, host: str = "127.0.0.1") -> None:
    """
    If a port is already occupied (e.g., from a previous crash or Ctrl+C),
    safely terminate the stale process holding it so the port is free to use.
    """
    if not is_port_in_use(port, host):
        return

    print(f"🔄  Port {port} is currently occupied — cleaning up stale process...")
    if shutil.which("lsof"):
        try:
            out = subprocess.check_output(["lsof", "-ti", f":{port}"], text=True).strip()
            pids = [int(p) for p in out.splitlines() if p.strip()]
            current_pid = os.getpid()
            for pid in pids:
                if pid != current_pid:
                    try:
                        os.kill(pid, signal.SIGTERM)
                    except ProcessLookupError:
                        pass
            time.sleep(0.4)

            # If still active, send SIGKILL
            if is_port_in_use(port, host):
                for pid in pids:
                    if pid != current_pid:
                        try:
                            os.kill(pid, signal.SIGKILL)
                        except ProcessLookupError:
                            pass
                time.sleep(0.2)
        except Exception:
            pass


def run_backend(host="127.0.0.1", port=8000, reload=True):
    """Run the FastAPI backend with uvicorn."""
    import uvicorn

    free_port(port, host)

    print("\n" + "=" * 72)
    print("🚀  Starting RiskPulse AI Backend Application")
    print(f"📡  REST API Base:       http://{host}:{port}")
    print(f"📖  Swagger Docs:        http://{host}:{port}/docs")
    print(f"🩺  Health Check:        http://{host}:{port}/api/health")
    print("=" * 72 + "\n")

    # Scope hot-reload directory to backend and src to avoid spurious reloads
    # when frontend assets build or SQLite writes to riskpulse.db
    reload_dirs = [str(BACKEND_DIR), str(ROOT_DIR / "src")] if reload else None

    try:
        uvicorn.run(
            "src.main:app",
            host=host,
            port=port,
            reload=reload,
            reload_dirs=reload_dirs,
            log_level="info",
        )
    except KeyboardInterrupt:
        print("\n🛑  Backend service stopped gracefully.")


def run_all(host="127.0.0.1", port=8000, reload=True, open_browser=False):
    """
    Start the React frontend (Vite) in the background and the FastAPI backend
    in the foreground. Manages child process groups for a clean, leak-free shutdown.
    """
    npm = shutil.which("npm")
    vite_proc = None

    # Free any dangling processes from previous runs
    free_port(port, host)
    free_port(5173, host)

    if npm is None:
        print("⚠️   npm not found in PATH — please install Node.js 20+ to run the React frontend.")
        print("    Continuing with backend only.\n")
    else:
        # Check node_modules
        if not (FRONTEND_DIR / "node_modules").exists():
            print("📦  Installing frontend dependencies (first run only)...")
            subprocess.run([npm, "install"], cwd=FRONTEND_DIR, check=True)
            print("✅  Frontend dependencies installed successfully.\n")

        # Spawn Vite in its own process group so all child Node processes terminate on Ctrl+C
        popen_kwargs = {}
        if hasattr(os, "setsid"):
            popen_kwargs["preexec_fn"] = os.setsid

        vite_proc = subprocess.Popen(
            [npm, "run", "dev", "--", "--host", "127.0.0.1", "--port", "5173"],
            cwd=FRONTEND_DIR,
            **popen_kwargs
        )

    def cleanup_frontend():
        if vite_proc and vite_proc.poll() is None:
            try:
                if hasattr(os, "killpg"):
                    os.killpg(os.getpgid(vite_proc.pid), signal.SIGTERM)
                else:
                    vite_proc.terminate()
                vite_proc.wait(timeout=2)
            except Exception:
                try:
                    if hasattr(os, "killpg"):
                        os.killpg(os.getpgid(vite_proc.pid), signal.SIGKILL)
                    else:
                        vite_proc.kill()
                except Exception:
                    pass

    # Optional auto-open browser
    if open_browser:
        import threading
        import webbrowser

        def _open():
            time.sleep(1.8)
            webbrowser.open("http://localhost:5173")

        threading.Thread(target=_open, daemon=True).start()

    print("\n" + "=" * 74)
    print("⚡  RiskPulse AI — Real-Time Financial Risk Intelligence Platform")
    print("=" * 74)
    if npm is not None:
        print("🖥️   React Frontend:       http://localhost:5173   <-- OPEN IN BROWSER")
    print(f"📡  FastAPI REST API:     http://{host}:{port}")
    print(f"📖  Interactive Docs:     http://{host}:{port}/docs")
    print(f"🩺  Health Check:         http://{host}:{port}/api/health")
    print("=" * 74)
    print("💡  Press Ctrl+C at any time to cleanly stop both services.\n")

    try:
        # Backend runs in the foreground
        reload_dirs = [str(BACKEND_DIR), str(ROOT_DIR / "src")] if reload else None
        import uvicorn
        uvicorn.run(
            "src.main:app",
            host=host,
            port=port,
            reload=reload,
            reload_dirs=reload_dirs,
            log_level="info",
        )
    except KeyboardInterrupt:
        print("\n🛑  Stopping RiskPulse AI services...")
    finally:
        cleanup_frontend()
        print("✅  All services stopped cleanly.\n")


def run_tests():
    """Run the test suite."""
    import pytest
    print("🧪  Running RiskPulse AI Test Suite...")
    exit_code = pytest.main(["-v", "backend/tests"])
    sys.exit(exit_code)


def run_seed():
    """Seed baseline constituents, synthetic portfolio, and sample signals."""
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
    """Generate architecture diagram and PDF slide presentation."""
    print("🎨  Generating docs/architecture.png & presentation.pdf...")
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
    parser.add_argument("--open", action="store_true", help="Automatically open http://localhost:5173 in browser")
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
        run_all(
            host=args.host,
            port=args.port,
            reload=not args.no_reload,
            open_browser=args.open,
        )


if __name__ == "__main__":
    main()
