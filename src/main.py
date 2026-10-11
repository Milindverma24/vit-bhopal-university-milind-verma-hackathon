"""
RiskPulse AI — Primary Application Entry Point
Supports running directly via:
    uvicorn src.main:app --host 127.0.0.1 --port 8000 --reload
or:
    python -m src.main
or:
    python src/main.py
"""

from pathlib import Path
import sys

_ROOT = Path(__file__).resolve().parent.parent
_BACKEND = _ROOT / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from app.main import app

if __name__ == "__main__":
    import uvicorn
    print("=" * 70)
    print("Starting RiskPulse AI Backend Application via src/main.py")
    print("API Documentation: http://127.0.0.1:8000/docs")
    print("Health Status:     http://127.0.0.1:8000/api/health")
    print("=" * 70)
    uvicorn.run("src.main:app", host="127.0.0.1", port=8000, reload=True)
