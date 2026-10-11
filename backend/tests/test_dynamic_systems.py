import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import SessionLocal
from app.models.models import IndexConstituent, RebalanceRun, SyntheticPortfolioHolding, RiskSignal
from app.services.stress_testing.stress_engine import EVENT_TO_SCENARIO_MAP

client = TestClient(app)

def test_news_ingestion_endpoint_structure_and_duplicate_tracking():
    # 1. Fetch news with small count
    resp = client.post("/api/ingestion/news/refresh?count=5")
    assert resp.status_code == 200
    data = resp.json()
    assert data["status"] in ["success", "partial_success"]
    assert "fetched_count" in data
    assert "inserted_count" in data
    assert "duplicate_count" in data
    assert "rate_limited" in data
    assert data["rate_limited"] is False
    assert data["fetched_count"] > 0
    assert data["inserted_count"] + data["duplicate_count"] == data["fetched_count"]

    # 2. Repeated call with the exact same items should detect duplicates
    resp2 = client.post("/api/ingestion/news/refresh?count=5")
    assert resp2.status_code == 200
    data2 = resp2.json()
    assert data2["duplicate_count"] > 0

def test_rebalance_preview_does_not_mutate_constituents():
    db = SessionLocal()
    try:
        # Record weights before preview
        initial_weights = {
            c.ticker: c.current_weight 
            for c in db.query(IndexConstituent).all()
        }
        initial_runs_count = db.query(RebalanceRun).count()

        # Call preview
        resp = client.post("/api/index/rebalance", json={
            "alpha": 0.5,
            "beta": 0.3,
            "max_turnover": 0.25,
            "min_weight": 0.02,
            "max_weight": 0.20,
            "preview_only": True
        })
        assert resp.status_code == 200
        data = resp.json()
        assert "allocations" in data
        assert len(data["allocations"]) == len(initial_weights)
        assert "turnover" in data
        assert data["turnover"] >= 0.0
        assert data["parameters"]["preview_only"] is True

        # Verify DB weights were NOT changed
        post_weights = {
            c.ticker: c.current_weight 
            for c in db.query(IndexConstituent).all()
        }
        assert initial_weights == post_weights

        # Verify no RebalanceRun record was inserted into database
        post_runs_count = db.query(RebalanceRun).count()
        assert initial_runs_count == post_runs_count
    finally:
        db.close()

def test_rebalance_execution_persists_and_computes_one_way_turnover():
    db = SessionLocal()
    try:
        initial_runs_count = db.query(RebalanceRun).count()

        # Call execution
        resp = client.post("/api/index/rebalance", json={
            "alpha": 0.5,
            "beta": 0.3,
            "max_turnover": 0.30,
            "min_weight": 0.02,
            "max_weight": 0.20,
            "preview_only": False
        })
        assert resp.status_code == 200
        data = resp.json()
        assert data.get("run_id") is not None
        assert data["parameters"]["preview_only"] is False
        assert data["turnover"] >= 0.0

        # Proposed weights must sum to 1.0 within tolerance
        total_proposed = sum(a["proposed_weight"] for a in data["allocations"])
        assert abs(total_proposed - 1.0) < 1e-3

        # Verify RebalanceRun persisted
        post_runs_count = db.query(RebalanceRun).count()
        assert post_runs_count == initial_runs_count + 1

        # Check latest record
        latest_run = db.query(RebalanceRun).order_by(RebalanceRun.timestamp.desc()).first()
        assert latest_run.run_id == data["run_id"]
        assert abs(latest_run.turnover - data["turnover"]) < 1e-4
    finally:
        db.close()

def test_stress_engine_reconciliation_with_corporate_loans():
    resp = client.post("/api/stress/run", json={
        "scenario_id": "geopolitical_escalation"
    })
    assert resp.status_code == 200
    data = resp.json()

    # Baseline portfolio must be $500,000,000.0 ($500.0M)
    assert abs(data["portfolio_value_before"] - 500_000_000.0) < 1.0
    assert data["portfolio_value_after"] < data["portfolio_value_before"]
    assert data["absolute_loss"] > 0
    assert data["percentage_loss"] > 0

    # Corporate Loans must be shocked and included in loss attribution
    assert "Corporate Loan" in data["loss_by_asset_class"]
    assert data["loss_by_asset_class"]["Corporate Loan"] > 0

    # Sector loss sum must strictly reconcile with absolute_loss (within $0.01 tolerance)
    sector_sum = sum(data["loss_by_sector"].values())
    reconciliation_delta = abs(sector_sum - data["absolute_loss"])
    assert reconciliation_delta < 0.01, f"Sector loss sum {sector_sum} does not reconcile with absolute_loss {data['absolute_loss']}"

    # Asset class loss sum must also reconcile with absolute_loss
    asset_sum = sum(data["loss_by_asset_class"].values())
    assert abs(asset_sum - data["absolute_loss"]) < 0.01

def test_event_to_scenario_mapping():
    assert EVENT_TO_SCENARIO_MAP.get("Geopolitical Event") == "geopolitical_escalation"
    assert EVENT_TO_SCENARIO_MAP.get("Interest Rate Change") == "interest_rate_shock"
    assert EVENT_TO_SCENARIO_MAP.get("Inflation") == "inflation_shock"
    assert EVENT_TO_SCENARIO_MAP.get("Credit Event") == "credit_crisis"
    assert EVENT_TO_SCENARIO_MAP.get("Market Volatility") == "market_crash"
    assert EVENT_TO_SCENARIO_MAP.get("Supply Chain Disruption") == "supply_chain_shock"

def test_portfolio_explorer_holdings_and_summary():
    # 1. Summary
    resp = client.get("/api/portfolio")
    assert resp.status_code == 200
    data = resp.json()
    assert abs(data["total_value"] - 500_000_000.0) < 1.0
    assert data["total_holdings_count"] == 22
    assert "Technology" in data["sector_concentration"]
    assert "Corporate Loan" in data["asset_allocation"]

    # 2. Holdings list
    resp_h = client.get("/api/portfolio/holdings")
    assert resp_h.status_code == 200
    holdings = resp_h.json()
    assert len(holdings) == 22
    assert holdings[0]["is_synthetic"] is True
