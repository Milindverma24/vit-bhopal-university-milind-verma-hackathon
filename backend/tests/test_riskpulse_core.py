import pytest
import numpy as np
from datetime import datetime
from fastapi.testclient import TestClient

import sys
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.main import app
from app.services.nlp.pipeline import risk_engine
from app.services.nlp.sentiment import FinancialSentimentAnalyzer
from app.services.event_classification.classifier import EventClassifier
from app.services.impact_scoring.scorer import ImpactScorer
from app.services.preprocessing.text_cleaner import TextCleaner
from app.services.preprocessing.deduplicator import Deduplicator
from app.services.entity_extraction.extractor import EntityExtractor
from app.services.index_rebalancing.rebalancer import TacticalIndexRebalancer
from app.services.stress_testing.stress_engine import PortfolioStressEngine
from app.database import SessionLocal

client = TestClient(app)

# ==================== NLP ENGINE TESTS ====================

def test_sentiment_positive_detection():
    analyzer = FinancialSentimentAnalyzer()
    score, label, method, conf = analyzer.analyze(
        "Company delivered a record profit beat, surging 25% year-over-year with robust revenue growth."
    )
    assert score > 0.20
    assert label == "Positive"
    assert conf > 0.60

def test_sentiment_negative_detection():
    analyzer = FinancialSentimentAnalyzer()
    score, label, method, conf = analyzer.analyze(
        "Quarterly results slumped significantly as operating profit plunged and management issued an urgent profit warning."
    )
    assert score < -0.20
    assert label == "Negative"
    assert conf > 0.60

def test_sentiment_negation_handling():
    analyzer = FinancialSentimentAnalyzer()
    # Negated positive term ("did not outperform" / "failed to beat") -> should NOT be positive
    score_negated, label_negated, _, _ = analyzer.analyze(
        "The firm failed to beat revenue estimates and did not outperform peer benchmarks."
    )
    assert score_negated <= 0.0
    assert label_negated in ["Negative", "Neutral"]

    # Negated negative term ("did not decline") -> should be positive or neutral
    score_rev, label_rev, _, _ = analyzer.analyze(
        "Despite high volatility, profit margins did not decline this quarter."
    )
    assert score_rev >= 0.0

def test_sentiment_neutral_handling():
    analyzer = FinancialSentimentAnalyzer()
    score, label, _, _ = analyzer.analyze(
        "The board held its scheduled quarterly administrative session in Chicago today."
    )
    assert abs(score) <= 0.15
    assert label == "Neutral"

def test_event_classification_categories():
    classifier = EventClassifier()

    cat1, conf1, ev1 = classifier.classify("The company filed for Chapter 11 bankruptcy protection following debt default.")
    assert cat1 == "Default or Bankruptcy"
    assert "bankruptcy" in ev1 or "chapter 11" in ev1

    cat2, conf2, ev2 = classifier.classify("Federal Trade Commission filed an antitrust lawsuit alleging monopolistic behavior.")
    assert cat2 == "Regulatory Action"

    cat3, conf3, ev3 = classifier.classify("Federal Reserve raises overnight benchmark rate by 50 basis points.")
    assert cat3 in ["Interest Rate Change", "Monetary Policy"]

    cat4, conf4, ev4 = classifier.classify("Foreign naval vessel incurs missile strike, sparking escalating geopolitical conflict and trade sanctions.")
    assert cat4 == "Geopolitical Event"

def test_impact_score_boundaries_and_logic():
    scorer = ImpactScorer()

    # Bankruptcy is inherently critical/high impact even if text is terse
    score_bankrupt, level_bankrupt, rat_b, _ = scorer.score(
        event_type="Default or Bankruptcy",
        sentiment_score=-0.85,
        is_market_wide=False,
        text="Company filed for Chapter 11 bankruptcy liquidation."
    )
    assert 8 <= score_bankrupt <= 10
    assert level_bankrupt in ["High", "Critical"]

    # Routine other event with neutral sentiment should have low impact
    score_routine, level_routine, rat_r, _ = scorer.score(
        event_type="Other",
        sentiment_score=0.0,
        is_market_wide=False,
        text="The committee will convene on Tuesday."
    )
    assert 1 <= score_routine <= 3
    assert level_routine in ["Minimal", "Low"]

def test_entity_extraction_and_cashtags():
    extractor = EntityExtractor()
    entities, meta = extractor.extract(
        text="Traders are watching $NVDA as Nvidia announces new enterprise processors.",
        headline="NVIDIA Stock Jumps"
    )
    assert meta["primary_ticker"] == "NVDA"
    assert meta["primary_company"] == "NVIDIA Corporation"
    assert any(e.ticker == "NVDA" and e.is_primary for e in entities)

def test_text_cleaner_and_deduplication():
    cleaner = TextCleaner()
    cleaned = cleaner.clean("<p>Breaking news on &amp; $AAPL &quot;record high&quot; https://bloomberg.com/link   </p>")
    assert "<p>" not in cleaned
    assert "&amp;" not in cleaned
    assert "AAPL" in cleaned

    dedup = Deduplicator()
    t1 = "Apple Inc reports record quarterly earnings beat with surging iPhone sales"
    t2 = "Apple Inc. reports record quarterly earnings beat with surging iPhone sales!"
    assert not dedup.is_duplicate(t1)
    assert dedup.is_duplicate(t2)  # Normalized tokens are identical

# ==================== MODULE A: REBALANCING TESTS ====================

def test_rebalancing_constraints_and_normalization():
    db = SessionLocal()
    try:
        reb = TacticalIndexRebalancer(
            min_weight=0.02,
            max_weight=0.18,
            max_turnover=0.25
        )
        reb.initialize_constituents(db)
        run = reb.rebalance(db)

        # 1. Total allocation must equal 100% (within floating point precision)
        total_weight = sum(a["executed_weight"] for a in run.allocations)
        assert abs(total_weight - 1.0) < 1e-3

        # 2. Every single constituent must satisfy box constraints
        for a in run.allocations:
            assert a["executed_weight"] >= 0.019  # min_weight tolerance
            assert a["executed_weight"] <= 0.181  # max_weight tolerance

        # 3. Turnover must be bounded by max_turnover
        assert run.turnover <= 0.255
    finally:
        db.close()

# ==================== MODULE B: STRESS TESTING TESTS ====================

def test_portfolio_stress_calculations():
    db = SessionLocal()
    try:
        # Run standard geopolitical escalation
        run = PortfolioStressEngine.run_stress_test(db, scenario_id="geopolitical_escalation")
        
        # Portfolio value before stress must be approximately $500M
        assert abs(run.portfolio_value_before - 500_000_000.0) < 1e5
        
        # Stressed value must be lower (positive loss)
        assert run.portfolio_value_after < run.portfolio_value_before
        assert run.absolute_loss > 0
        assert run.percentage_loss > 0

        # Asset class loss breakdowns must be populated
        assert "Equity Holding" in run.loss_by_asset_class
        assert "Corporate Bond" in run.loss_by_asset_class
        
        # Cash should have $0 loss
        assert run.loss_by_asset_class.get("Liquid Cash", 0.0) == 0.0
    finally:
        db.close()

# ==================== REST API TESTS ====================

def test_api_health_endpoint():
    resp = client.get("/api/health")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] == "healthy"
    assert "version" in data

def test_api_interactive_analyze():
    resp = client.post("/api/analyze", json={
        "text": "JPMorgan Chase reported record investment banking fees and strong net interest income.",
        "headline": "JPMorgan Q2 Earnings Surge",
        "source_type": "financial_news"
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data["primary_ticker"] == "JPM"
    assert data["sentiment_score"] > 0.1
    assert data["impact_score"] >= 4
    assert "signal_id" in data

def test_api_signals_list_and_filter():
    resp = client.get("/api/signals?page=1&page_size=5")
    assert resp.status_code == 200
    data = resp.json()
    assert "items" in data
    assert len(data["items"]) <= 5
    assert data["total"] > 0
