"""
RiskPulse AI — Source Package
Root application, data pipelines, and model source code for S&P Global & CRISIL Hackathon 2026.
"""

from pathlib import Path
import sys

# Ensure backend directory is in Python path for unified module resolution
_ROOT = Path(__file__).resolve().parent.parent
_BACKEND = _ROOT / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))
