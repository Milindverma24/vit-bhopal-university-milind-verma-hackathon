"""
RiskPulse AI — NLP & Model Source Code
Exposes the core AI/NLP risk engine, sentiment analysis, event classification,
entity extraction, and impact scoring models.
"""

from pathlib import Path
import sys

_ROOT = Path(__file__).resolve().parent.parent.parent
_BACKEND = _ROOT / "backend"
if str(_BACKEND) not in sys.path:
    sys.path.insert(0, str(_BACKEND))

from app.services.nlp.pipeline import NLPRiskEngine, risk_engine
from app.services.nlp.sentiment import FinancialSentimentAnalyzer
from app.services.event_classification.classifier import EventClassifier
from app.services.impact_scoring.scorer import ImpactScorer
from app.services.entity_extraction.extractor import EntityExtractor

__all__ = [
    "NLPRiskEngine",
    "risk_engine",
    "FinancialSentimentAnalyzer",
    "EventClassifier",
    "ImpactScorer",
    "EntityExtractor"
]
