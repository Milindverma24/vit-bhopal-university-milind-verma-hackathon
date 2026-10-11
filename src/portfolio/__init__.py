"""
RiskPulse AI — Portfolio & Quantitative Engines
Exposes Tactical Index Rebalancing (Module A) and Strategic Portfolio Stress Testing (Module B).
"""

from pathlib import Path
import sys

_ROOT = Path(__file__).resolve().parent.parent.parent
_BACKEND = _ROOT / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from app.services.index_rebalancing.rebalancer import TacticalIndexRebalancer, rebalancer
from app.services.portfolio.portfolio_manager import PortfolioManager
from app.services.stress_testing.stress_engine import PortfolioStressEngine, STANDARD_SCENARIOS

__all__ = [
    "TacticalIndexRebalancer",
    "rebalancer",
    "PortfolioManager",
    "PortfolioStressEngine",
    "STANDARD_SCENARIOS"
]
