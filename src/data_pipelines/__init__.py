"""
RiskPulse AI — Data Pipelines Source Code
Exposes the multi-source financial data ingestion adapters (NewsAPI, GDELT,
social feeds, synthetic generator, and deduplication logic).
"""

from pathlib import Path
import sys

_ROOT = Path(__file__).resolve().parent.parent.parent
_BACKEND = _ROOT / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from app.services.ingestion.news_adapter import NewsIngestionAdapter
from app.services.ingestion.social_adapter import SocialIngestionAdapter
from app.services.ingestion.synthetic_generator import SyntheticDataGenerator

__all__ = [
    "NewsIngestionAdapter",
    "SocialIngestionAdapter",
    "SyntheticDataGenerator"
]
