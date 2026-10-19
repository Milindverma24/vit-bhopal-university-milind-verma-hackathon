import random
from typing import List, Dict, Any
from sqlalchemy.orm import Session
from app.models.models import SyntheticPortfolioHolding
from app.schemas.schemas import PortfolioSummaryResponse

class PortfolioManager:
    """
    Manages the synthetic institutional wholesale banking portfolio.
    Provides portfolio metrics, credit risk analytics (ECL), and duration profiles.
    """

    @staticmethod
    def initialize_portfolio(db: Session, force_reset: bool = False):
        count = db.query(SyntheticPortfolioHolding).count()
        if count > 0 and not force_reset:
            return

        if force_reset:
            db.query(SyntheticPortfolioHolding).delete()
            db.commit()

        # Seed deterministic pseudo-random generator
        rng = random.Random(42)

        # Diverse Synthetic Portfolio Architecture ($500M Total Assets)
        # 1. Corporate Loans ($180M)
        # 2. Sovereign Bonds ($120M)
        # 3. Corporate Bonds ($90M)
        # 4. Equity Holdings ($60M)
        # 5. Derivatives / Hedging ($25M)
        # 6. Cash & Liquid Reserves ($25M)

        holdings_specs = [
            # Corporate Loans
            {"name": "Term Loan B - Tech Logistics Corp", "type": "Corporate Loan", "sec": "Technology", "country": "USA", "rating": "BB+", "pd": 0.018, "lgd": 0.45, "notional": 25_000_000, "dur": 2.1, "rate": 0.075},
            {"name": "Revolving Credit Facility - Apex Industrial", "type": "Corporate Loan", "sec": "Industrials", "country": "USA", "rating": "BBB-", "pd": 0.012, "lgd": 0.40, "notional": 35_000_000, "dur": 1.8, "rate": 0.068},
            {"name": "Syndicated Loan - Global Energy Trans", "type": "Corporate Loan", "sec": "Energy", "country": "USA", "rating": "BBB", "pd": 0.009, "lgd": 0.42, "notional": 30_000_000, "dur": 3.0, "rate": 0.065},
            {"name": "Commercial Real Estate Loan - Metro Hub", "type": "Corporate Loan", "sec": "Financial Services", "country": "USA", "rating": "BBB+", "pd": 0.007, "lgd": 0.35, "notional": 40_000_000, "dur": 4.5, "rate": 0.062},
            {"name": "Healthcare Facilities Capex Loan", "type": "Corporate Loan", "sec": "Healthcare", "country": "USA", "rating": "A-", "pd": 0.004, "lgd": 0.38, "notional": 28_000_000, "dur": 3.2, "rate": 0.059},
            {"name": "Working Capital Loan - Pacific Retailers", "type": "Corporate Loan", "sec": "Consumer Discretionary", "country": "Japan", "rating": "BB", "pd": 0.024, "lgd": 0.48, "notional": 22_000_000, "dur": 1.5, "rate": 0.078},
            
            # Sovereign / Government Bonds
            {"name": "US Treasury Note 5Y 4.125%", "type": "Sovereign Bond", "sec": "Sovereign", "country": "USA", "rating": "AAA", "pd": 0.0001, "lgd": 0.05, "notional": 50_000_000, "dur": 4.6, "rate": 0.041},
            {"name": "US Treasury Bond 10Y 4.250%", "type": "Sovereign Bond", "sec": "Sovereign", "country": "USA", "rating": "AAA", "pd": 0.0001, "lgd": 0.05, "notional": 40_000_000, "dur": 8.2, "rate": 0.042},
            {"name": "German Federal Bund 5Y 2.450%", "type": "Sovereign Bond", "sec": "Sovereign", "country": "Eurozone", "rating": "AAA", "pd": 0.0001, "lgd": 0.05, "notional": 15_000_000, "dur": 4.8, "rate": 0.024},
            {"name": "UK Gilt 5Y 3.850%", "type": "Sovereign Bond", "sec": "Sovereign", "country": "UK", "rating": "AA", "pd": 0.0003, "lgd": 0.10, "notional": 15_000_000, "dur": 4.4, "rate": 0.038},

            # Corporate Bonds
            {"name": "Enterprise Senior Notes 2029 5.5%", "type": "Corporate Bond", "sec": "Technology", "country": "USA", "rating": "A", "pd": 0.003, "lgd": 0.40, "notional": 25_000_000, "dur": 4.1, "rate": 0.055},
            {"name": "Global Energy Infrastructure Bond 6.0%", "type": "Corporate Bond", "sec": "Energy", "country": "USA", "rating": "BBB+", "pd": 0.006, "lgd": 0.45, "notional": 25_000_000, "dur": 5.4, "rate": 0.060},
            {"name": "National Banking Capital Bond 5.8%", "type": "Corporate Bond", "sec": "Financial Services", "country": "USA", "rating": "A-", "pd": 0.004, "lgd": 0.42, "notional": 20_000_000, "dur": 4.8, "rate": 0.058},
            {"name": "Pharma Global Senior Note 4.9%", "type": "Corporate Bond", "sec": "Healthcare", "country": "Eurozone", "rating": "AA-", "pd": 0.002, "lgd": 0.35, "notional": 20_000_000, "dur": 5.1, "rate": 0.049},

            # Public Equity Holdings
            {"name": "Core Large-Cap Tech Equity Basket", "type": "Equity Holding", "sec": "Technology", "country": "USA", "rating": "N/A", "pd": 0.0, "lgd": 0.0, "notional": 25_000_000, "dur": 0.0, "rate": 0.015},
            {"name": "Diversified Energy Equity Fund", "type": "Equity Holding", "sec": "Energy", "country": "USA", "rating": "N/A", "pd": 0.0, "lgd": 0.0, "notional": 15_000_000, "dur": 0.0, "rate": 0.032},
            {"name": "Global Industrials Equity Exposure", "type": "Equity Holding", "sec": "Industrials", "country": "USA", "rating": "N/A", "pd": 0.0, "lgd": 0.0, "notional": 10_000_000, "dur": 0.0, "rate": 0.021},
            {"name": "Global Financials ETF Allocation", "type": "Equity Holding", "sec": "Financial Services", "country": "Global", "rating": "N/A", "pd": 0.0, "lgd": 0.0, "notional": 10_000_000, "dur": 0.0, "rate": 0.028},

            # Derivatives / FX Hedging (Simplified MtM Exposure)
            {"name": "USD/EUR Macro FX Hedge Swap", "type": "FX / Derivative", "sec": "Financial Services", "country": "Eurozone", "rating": "AA", "pd": 0.0005, "lgd": 0.20, "notional": 15_000_000, "dur": 1.2, "rate": 0.035},
            {"name": "Interest Rate Swap 5Y Fixed-Float", "type": "FX / Derivative", "sec": "Financial Services", "country": "USA", "rating": "AA", "pd": 0.0005, "lgd": 0.20, "notional": 10_000_000, "dur": 2.5, "rate": 0.040},

            # Cash and Central Bank Reserves
            {"name": "Federal Reserve Overnight Repo", "type": "Liquid Cash", "sec": "Financial Services", "country": "USA", "rating": "AAA", "pd": 0.0, "lgd": 0.0, "notional": 15_000_000, "dur": 0.05, "rate": 0.0525},
            {"name": "Institutional Treasury Money Market", "type": "Liquid Cash", "sec": "Financial Services", "country": "USA", "rating": "AAA", "pd": 0.0, "lgd": 0.0, "notional": 10_000_000, "dur": 0.1, "rate": 0.0515},
        ]

        for i, item in enumerate(holdings_specs):
            cust_id = f"SYNTH-CORP-{1000 + i}"
            tx_id = f"TX-SYNTH-{rng.randint(100000, 999999)}"
            holding = SyntheticPortfolioHolding(
                asset_id=f"AST-{100 + i}",
                transaction_id=tx_id,
                synthetic_customer_id=cust_id,
                asset_name=item["name"],
                asset_type=item["type"],
                sector=item["sec"],
                notional_amount=float(item["notional"]),
                market_value=float(item["notional"]),  # At par initially
                interest_rate=item["rate"],
                duration=item["dur"],
                credit_rating=item["rating"],
                probability_of_default=item["pd"],
                loss_given_default=item["lgd"],
                maturity_date="2029-12-31",
                country=item["country"],
                currency="USD",
                risk_weight=1.0 if item["type"] in ["Corporate Loan", "Corporate Bond"] else (0.2 if item["type"] == "Sovereign Bond" else 0.0),
                is_synthetic=True
            )
            db.add(holding)

        db.commit()

    @staticmethod
    def get_summary(db: Session) -> PortfolioSummaryResponse:
        PortfolioManager.initialize_portfolio(db)
        holdings = db.query(SyntheticPortfolioHolding).all()

        total_val = sum(h.market_value for h in holdings)
        by_asset: Dict[str, float] = {}
        by_sector: Dict[str, float] = {}
        by_country: Dict[str, float] = {}

        total_ecl = 0.0
        weighted_dur = 0.0
        weighted_pd = 0.0

        for h in holdings:
            val = h.market_value
            by_asset[h.asset_type] = by_asset.get(h.asset_type, 0.0) + val
            by_sector[h.sector] = by_sector.get(h.sector, 0.0) + val
            by_country[h.country] = by_country.get(h.country, 0.0) + val

            # ECL = PD * LGD * Notional
            ecl = h.probability_of_default * h.loss_given_default * h.notional_amount
            total_ecl += ecl

            weighted_dur += h.duration * val
            weighted_pd += h.probability_of_default * val

        avg_dur = round(weighted_dur / total_val, 2) if total_val > 0 else 0.0
        avg_pd = round(weighted_pd / total_val, 4) if total_val > 0 else 0.0

        return PortfolioSummaryResponse(
            total_value=round(total_val, 2),
            total_holdings_count=len(holdings),
            asset_allocation={k: round(v, 2) for k, v in by_asset.items()},
            sector_concentration={k: round(v, 2) for k, v in by_sector.items()},
            country_concentration={k: round(v, 2) for k, v in by_country.items()},
            total_expected_credit_loss=round(total_ecl, 2),
            weighted_duration=avg_dur,
            weighted_probability_of_default=avg_pd,
            is_synthetic=True
        )
