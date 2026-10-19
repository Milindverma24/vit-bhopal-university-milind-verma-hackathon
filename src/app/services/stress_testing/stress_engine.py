import uuid
from datetime import datetime
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from app.models.models import SyntheticPortfolioHolding, StressTestRun, RiskSignal, AuditEvent
from app.schemas.schemas import StressScenarioDefinition, StressTestResultResponse
from app.services.portfolio.portfolio_manager import PortfolioManager

STANDARD_SCENARIOS: Dict[str, StressScenarioDefinition] = {
    "geopolitical_escalation": StressScenarioDefinition(
        scenario_id="geopolitical_escalation",
        name="Geopolitical Escalation & Supply Conflict",
        description="Escalating global tensions trigger trade sanctions, equity corrections, and commodity volatility.",
        category="Geopolitical",
        equity_shock=-0.14,
        credit_spread_widening_bps=120.0,
        rate_shock_bps=50.0,
        pd_multiplier=1.35,
        lgd_shock=0.05,
        vulnerable_sectors=["Energy", "Industrials", "Technology"],
        vulnerable_countries=["Eurozone", "Japan", "Global"]
    ),
    "interest_rate_shock": StressScenarioDefinition(
        scenario_id="interest_rate_shock",
        name="Aggressive Central Bank Rate Hike (+200 bps)",
        description="Sudden monetary tightening to curb persistent inflation. Bond valuations compress under duration exposure.",
        category="Monetary Policy",
        equity_shock=-0.07,
        credit_spread_widening_bps=60.0,
        rate_shock_bps=200.0,
        pd_multiplier=1.20,
        lgd_shock=0.02,
        vulnerable_sectors=["Financial Services", "Technology", "Utilities"],
        vulnerable_countries=["USA", "Eurozone", "UK"]
    ),
    "inflation_shock": StressScenarioDefinition(
        scenario_id="inflation_shock",
        name="Stagflationary Supply & Commodity Surge",
        description="Severe cost-push inflation drives up interest rates while compressing corporate operating margins.",
        category="Macroeconomic",
        equity_shock=-0.10,
        credit_spread_widening_bps=95.0,
        rate_shock_bps=150.0,
        pd_multiplier=1.30,
        lgd_shock=0.06,
        vulnerable_sectors=["Consumer Discretionary", "Industrials"],
        vulnerable_countries=["USA", "Eurozone"]
    ),
    "credit_crisis": StressScenarioDefinition(
        scenario_id="credit_crisis",
        name="Systemic Wholesale Credit Crunch",
        description="Corporate default waves surge, spreads widen +250 bps, and syndicated loan recovery expectations collapse.",
        category="Credit Risk",
        equity_shock=-0.18,
        credit_spread_widening_bps=250.0,
        rate_shock_bps=-50.0,
        pd_multiplier=1.85,
        lgd_shock=0.12,
        vulnerable_sectors=["Financial Services", "Energy", "Consumer Discretionary"],
        vulnerable_countries=["USA", "Eurozone", "Global"]
    ),
    "market_crash": StressScenarioDefinition(
        scenario_id="market_crash",
        name="Global Equity & Liquidity Flash Crash",
        description="Mass market liquidation triggers equity plummet (-25%) with flight to safety in sovereign debt.",
        category="Market Volatility",
        equity_shock=-0.25,
        credit_spread_widening_bps=180.0,
        rate_shock_bps=-75.0,
        pd_multiplier=1.40,
        lgd_shock=0.04,
        vulnerable_sectors=["Technology", "Financial Services", "Consumer Discretionary"],
        vulnerable_countries=["USA", "Global"]
    ),
    "supply_chain_shock": StressScenarioDefinition(
        scenario_id="supply_chain_shock",
        name="Critical Semiconductor & Logistics Choke",
        description="Bottlenecks in maritime shipping and chip manufacturing cripple production output and revenues.",
        category="Supply Chain",
        equity_shock=-0.12,
        credit_spread_widening_bps=110.0,
        rate_shock_bps=25.0,
        pd_multiplier=1.45,
        lgd_shock=0.07,
        vulnerable_sectors=["Technology", "Industrials"],
        vulnerable_countries=["Japan", "USA", "Global"]
    )
}

EVENT_TO_SCENARIO_MAP: Dict[str, str] = {
    "Geopolitical Event": "geopolitical_escalation",
    "Interest Rate Change": "interest_rate_shock",
    "Monetary Policy": "interest_rate_shock",
    "Inflation": "inflation_shock",
    "Macroeconomic Event": "inflation_shock",
    "Credit Event": "credit_crisis",
    "Default or Bankruptcy": "credit_crisis",
    "Liquidity Risk": "credit_crisis",
    "Market Volatility": "market_crash",
    "Fraud or Investigation": "market_crash",
    "Corporate Earnings": "market_crash",
    "Supply Chain Disruption": "supply_chain_shock",
    "Cybersecurity Incident": "supply_chain_shock",
    "Natural Disaster": "geopolitical_escalation",
    "Regulatory Action": "credit_crisis",
}

class PortfolioStressEngine:
    """
    Strategic Portfolio Stress Testing Engine for Synthetic Wholesale Banking Portfolios.
    Evaluates scenario impacts on Expected Credit Loss (ECL), duration-based rate sensitivities,
    and asset-specific valuation shocks.
    """

    @staticmethod
    def get_available_scenarios() -> List[StressScenarioDefinition]:
        return list(STANDARD_SCENARIOS.values())

    @staticmethod
    def map_event_to_scenario(event_type: str) -> str:
        return EVENT_TO_SCENARIO_MAP.get(event_type, "geopolitical_escalation")

    @staticmethod
    def run_stress_test(
        db: Session,
        scenario_id: Optional[str] = None,
        custom_scenario: Optional[StressScenarioDefinition] = None,
        triggering_signal_id: Optional[str] = None
    ) -> StressTestRun:
        PortfolioManager.initialize_portfolio(db)

        # 1. Check for Triggering Signal context
        trigger_event = None
        trigger_impact = None
        if triggering_signal_id:
            sig = db.query(RiskSignal).filter(RiskSignal.signal_id == triggering_signal_id).first()
            if sig:
                trigger_event = sig.event_type
                trigger_impact = sig.impact_score
                # Auto-map scenario if not explicitly specified
                if not scenario_id or scenario_id == "auto":
                    scenario_id = EVENT_TO_SCENARIO_MAP.get(sig.event_type, "geopolitical_escalation")

        # 2. Resolve Scenario Parameters
        scenario: StressScenarioDefinition
        if custom_scenario:
            scenario = custom_scenario
        elif scenario_id and scenario_id in STANDARD_SCENARIOS:
            scenario = STANDARD_SCENARIOS[scenario_id]
        else:
            scenario = STANDARD_SCENARIOS["geopolitical_escalation"]

        holdings = db.query(SyntheticPortfolioHolding).all()

        val_before = 0.0
        val_after = 0.0
        ecl_before = 0.0
        ecl_after = 0.0

        loss_by_asset: Dict[str, float] = {}
        loss_by_sector: Dict[str, float] = {}
        loss_by_country: Dict[str, float] = {}
        major_drivers: List[str] = []

        total_rate_shock = scenario.rate_shock_bps / 10000.0  # in decimal, e.g. 0.02
        spread_shock = scenario.credit_spread_widening_bps / 10000.0

        for h in holdings:
            v_orig = h.market_value
            val_before += v_orig

            # Baseline ECL = PD * LGD * Notional
            base_ecl = h.probability_of_default * h.loss_given_default * h.notional_amount
            ecl_before += base_ecl

            # Asset-Specific Valuation Transformation Logic
            v_shocked = v_orig

            is_sector_vulnerable = h.sector in scenario.vulnerable_sectors
            is_country_vulnerable = h.country in scenario.vulnerable_countries
            vulnerability_factor = 1.30 if (is_sector_vulnerable or is_country_vulnerable) else 1.0

            if h.asset_type == "Equity Holding":
                # Equity shock with vulnerability factor
                effective_shock = scenario.equity_shock * vulnerability_factor
                v_shocked = max(0.0, v_orig * (1.0 + effective_shock))

            elif h.asset_type == "Sovereign Bond":
                # Safe-haven flight check in market crash
                if scenario.scenario_id == "market_crash":
                    v_shocked = v_orig * 1.025  # Flight to quality appreciation
                else:
                    # Duration-based rate sensitivity: dP = -Duration * dRate * P
                    rate_pct_change = -h.duration * total_rate_shock
                    v_shocked = max(0.0, v_orig * (1.0 + rate_pct_change))

            elif h.asset_type == "Corporate Bond":
                # Combined rate + spread shock: dRate_eff = total_rate_shock + spread_shock
                effective_yield_change = (total_rate_shock + spread_shock * vulnerability_factor)
                price_pct_change = -h.duration * effective_yield_change
                v_shocked = max(0.0, v_orig * (1.0 + price_pct_change))

            elif h.asset_type == "Corporate Loan":
                # Stressed ECL
                stressed_pd = min(1.0, h.probability_of_default * scenario.pd_multiplier * vulnerability_factor)
                stressed_lgd = min(1.0, h.loss_given_default + scenario.lgd_shock)
                stressed_ecl = stressed_pd * stressed_lgd * h.notional_amount
                ecl_delta = stressed_ecl - base_ecl
                ecl_after += stressed_ecl

                # Fair value adjustment reflects duration rate/spread sensitivity plus credit impairment
                effective_yield_change = (total_rate_shock + spread_shock * vulnerability_factor)
                loan_price_pct = -h.duration * effective_yield_change
                v_shocked = max(0.0, v_orig * (1.0 + loan_price_pct) - ecl_delta)

            elif h.asset_type == "FX / Derivative":
                # Derivative MtM sensitivity
                deriv_shock = -h.duration * total_rate_shock * 1.2
                v_shocked = max(0.0, v_orig * (1.0 + deriv_shock))

            elif h.asset_type == "Liquid Cash":
                # Cash retains par value
                v_shocked = v_orig

            # Add default stressed ECL if not corporate loan
            if h.asset_type != "Corporate Loan":
                stressed_pd = min(1.0, h.probability_of_default * scenario.pd_multiplier)
                stressed_lgd = min(1.0, h.loss_given_default + scenario.lgd_shock)
                ecl_after += (stressed_pd * stressed_lgd * h.notional_amount)

            val_after += v_shocked
            loss = v_orig - v_shocked

            loss_by_asset[h.asset_type] = loss_by_asset.get(h.asset_type, 0.0) + loss
            loss_by_sector[h.sector] = loss_by_sector.get(h.sector, 0.0) + loss
            loss_by_country[h.country] = loss_by_country.get(h.country, 0.0) + loss

            if loss > 2_000_000:
                major_drivers.append(f"{h.asset_name} ({h.asset_type}, {h.sector}): Loss of ${loss/1e6:.2f}M")

        abs_loss = val_before - val_after
        pct_loss = (abs_loss / val_before) * 100.0 if val_before > 0 else 0.0

        run_id = f"st-{uuid.uuid4().hex[:8]}"

        stress_record = StressTestRun(
            run_id=run_id,
            scenario_id=scenario.scenario_id,
            scenario_name=scenario.name,
            timestamp=datetime.utcnow(),
            triggered_by_signal_id=triggering_signal_id,
            trigger_event=trigger_event,
            trigger_impact=trigger_impact,
            portfolio_value_before=round(val_before, 2),
            portfolio_value_after=round(val_after, 2),
            absolute_loss=round(abs_loss, 2),
            percentage_loss=round(pct_loss, 2),
            ecl_before=round(ecl_before, 2),
            ecl_after=round(ecl_after, 2),
            loss_by_asset_class={k: round(v, 2) for k, v in loss_by_asset.items()},
            loss_by_sector={k: round(v, 2) for k, v in loss_by_sector.items()},
            loss_by_country={k: round(v, 2) for k, v in loss_by_country.items()},
            major_drivers=major_drivers[:6],
            parameters=scenario.model_dump()
        )
        db.add(stress_record)

        audit = AuditEvent(
            audit_id=f"aud-{uuid.uuid4().hex[:8]}",
            timestamp=datetime.utcnow(),
            action_type="STRESS_TEST",
            actor="StressEngine",
            details={"run_id": run_id, "scenario": scenario.name, "abs_loss": abs_loss, "pct_loss": pct_loss},
            status="SUCCESS"
        )
        db.add(audit)
        db.commit()

        return stress_record
