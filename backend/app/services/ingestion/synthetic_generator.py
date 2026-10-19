import json
import random
import time
import uuid
from datetime import datetime, timedelta
from pathlib import Path
from typing import List, Dict, Any
from app.config import STOCK_BASKET, DATA_DIR

# Rich templates across multiple sectors and event types
NEWS_SCENARIOS = [
    # Positive Scenarios
    {
        "category": "Corporate Earnings",
        "headline": "{company} Surpasses Q3 Revenue Forecasts on Surging Enterprise Demand",
        "content": "{company} ({ticker}) delivered robust quarterly results this morning, outpacing consensus Wall Street expectations. Diluted EPS reached record highs as revenue expanded 18% year-over-year. Management cited durable enterprise adoption, disciplined cost controls, and raised full-year forward revenue guidance by $1.5 billion.",
        "sentiment_hint": "positive"
    },
    {
        "category": "Product Launch",
        "headline": "{company} Unveils Next-Gen AI Infrastructure Platform in Commercial Breakthrough",
        "content": "At its annual flagship developer keynote, {company} ({ticker}) unveiled an innovative high-performance platform engineered for enterprise scalability. Early benchmark testing indicates 40% performance gains over incumbent solutions, attracting multi-year adoption commitments from global Fortune 500 corporations.",
        "sentiment_hint": "positive"
    },
    {
        "category": "Positive Business Development",
        "headline": "{company} Secures Landmark $3.8 Billion Defense and Industrial Cloud Contract",
        "content": "{company} ({ticker}) announced a definitive multi-year strategic procurement award valued at $3.8 billion. The agreement substantially bolsters backlog visibility through 2029, prompting credit rating agencies to reaffirm an investment-grade A+ rating outlook.",
        "sentiment_hint": "positive"
    },
    {
        "category": "Credit Event",
        "headline": "Rating Agencies Upgrade {company} to AA- Following Deleveraging and Record Cash Flows",
        "content": "Major credit rating agencies announced an upgrade of {company} ({ticker}) senior unsecured debt from A+ to AA-. Analysts highlighted significant balance sheet deleveraging, resilient operating margins, and consistent free cash flow generation exceeding $12 billion annually.",
        "sentiment_hint": "positive"
    },
    # Negative Scenarios
    {
        "category": "Regulatory Action",
        "headline": "Antitrust Regulators File Formal Injunction Against {company} Over Market Dominance",
        "content": "Federal antitrust authorities initiated formal litigation against {company} ({ticker}), alleging anti-competitive practices and exclusive distribution agreements. The legal action seeks civil fines of up to $2.2 billion and potential structural operational remedies, sending shares lower in pre-market trading.",
        "sentiment_hint": "negative"
    },
    {
        "category": "Cybersecurity Incident",
        "headline": "{company} Discloses Critical Data Breach and Unauthorized System Access",
        "content": "{company} ({ticker}) filed an 8-K disclosure acknowledging a sophisticated ransomware and data breach incident that compromised encrypted customer records and disrupted internal IT workflows. Management halted affected customer portals and retained forensic cybersecurity investigators.",
        "sentiment_hint": "negative"
    },
    {
        "category": "Supply Chain Disruption",
        "headline": "Factory Shutdowns and Chip Bottlenecks Force {company} to Slash Annual Guidance",
        "content": "Persistent logistical bottlenecks and overseas manufacturing disruptions have forced {company} ({ticker}) to curtail output for the upcoming fiscal quarter. Management revised operating margin targets downward by 250 basis points, warning of elevated freight and raw component costs.",
        "sentiment_hint": "negative"
    },
    {
        "category": "Fraud or Investigation",
        "headline": "SEC and Justice Department Launch Joint Probe into {company} Accounting Practices",
        "content": "Federal prosecutors and the Securities and Exchange Commission issued formal subpoenas to {company} ({ticker}) regarding revenue recognition accounting in its subscription division. The audit committee confirmed an independent special inquiry, sparking widespread market volatility.",
        "sentiment_hint": "negative"
    },
    {
        "category": "Corporate Earnings",
        "headline": "{company} Misses Quarterly Profit Targets Amid Severe Margin Compression",
        "content": "{company} ({ticker}) reported fiscal results falling short of Wall Street estimates. Net income plunged 22% as operating overhead soared and consumer demand softened. Management declined to provide forward guidance, citing macroeconomic headwinds.",
        "sentiment_hint": "negative"
    },
    # Neutral & Macro Scenarios
    {
        "category": "Monetary Policy",
        "headline": "Central Bank Maintains Benchmark Interest Rate in Balanced Policy Statement",
        "content": "The Federal Open Market Committee concluded its policy meeting by voting unanimously to hold benchmark overnight borrowing rates steady. Policymakers noted balanced labor market indicators and reiterated a data-dependent stance regarding upcoming inflation prints.",
        "sentiment_hint": "neutral"
    },
    {
        "category": "Interest Rate Change",
        "headline": "Central Bank Unexpectedly Hikes Policy Rate by 50 Basis Points to Curb Sticky Inflation",
        "content": "In an emergency inter-meeting adjustment, monetary authorities raised the policy interest rate by 50 bps. Yield curves steepened sharply as commercial banks recalibrated prime lending rates, increasing corporate borrowing costs across the economy.",
        "sentiment_hint": "negative"
    },
    {
        "category": "Geopolitical Event",
        "headline": "Maritime Shipping Tensions and Export Sanctions Escalate Global Energy and Freight Risks",
        "content": "Geopolitical escalations in vital shipping straits have triggered retaliatory maritime restrictions and elevated insurance surcharges. Energy refiners and industrial manufacturers are preparing contingency logistics routing to mitigate potential delivery bottlenecks.",
        "sentiment_hint": "negative"
    },
    {
        "category": "Inflation",
        "headline": "Core Consumer Price Index Prints at 3.4% Annualized, Matching Consensus Expectations",
        "content": "The latest monthly CPI report showed core consumer price gains moderating in line with economist expectations. Energy components saw slight seasonal increases while services inflation leveled off, sustaining baseline macroeconomic stability.",
        "sentiment_hint": "neutral"
    },
    {
        "category": "Liquidity Risk",
        "headline": "Wholesale Interbank Liquidity Tightens as Short-Term Commercial Paper Spreads Widen",
        "content": "Treasury bill issuance and quarterly corporate tax outflows contributed to temporary liquidity strains in overnight money markets. The central bank opened temporary repo liquidity facilities to stabilize interbank funding conditions.",
        "sentiment_hint": "negative"
    }
]

SOCIAL_POST_TEMPLATES = [
    # Positive
    {"text": "${ticker} just reported huge numbers! Revenue beat by 8% and operating margins are expanding rapidly. Long-term bull case intact. 🚀📈 #investing", "sentiment": "positive"},
    {"text": "The new enterprise rollout from {company} (${ticker}) is a game changer for efficiency. Cloud adoption numbers look stellar this quarter.", "sentiment": "positive"},
    {"text": "Strong balance sheet and free cash flow generation make ${ticker} an absolute defensive pillar in this market.", "sentiment": "positive"},
    {"text": "Big institutional block buys detected in ${ticker}. Rating agency upgrade provides strong credit validation.", "sentiment": "positive"},
    {"text": "Impressive product execution from {company} (${ticker}). Margins expanding faster than consensus anticipated. Accumulating on any dip.", "sentiment": "positive"},
    {"text": "Fed pivot hints and cooling inflation data provide massive macro tailwinds for ${ticker} heading into next fiscal year.", "sentiment": "positive"},

    # Negative
    {"text": "${ticker} is tumbling after the SEC subpoena news. Serious questions on revenue recognition. Cutting exposure immediately. ⚠️ #risk", "sentiment": "negative"},
    {"text": "Disastrous earnings miss from ${ticker}. Operating expenses surged 30% and forward guidance was completely pulled. Bearish.", "sentiment": "negative"},
    {"text": "Major cyber incident confirmed at {company} (${ticker}). Expecting significant regulatory penalties and reputational hit.", "sentiment": "negative"},
    {"text": "Supply chain bottlenecks are going to crush margins for ${ticker} next quarter. De-risking my portfolio allocation.", "sentiment": "negative"},
    {"text": "Credit default swap spreads widening on ${ticker}. Rising debt rollover costs create refinancing headwinds.", "sentiment": "negative"},
    {"text": "DOJ antitrust scrutiny into {company} (${ticker}) expanding. Expecting legal overhang to depress multiples.", "sentiment": "negative"},

    # Neutral / Macro
    {"text": "Fed rate decision today is the main driver for ${ticker} and the broader index. Watching Treasury yields closely.", "sentiment": "neutral"},
    {"text": "Trading volume in ${ticker} is unusually quiet ahead of the CPI inflation print tomorrow. Waiting on macro clarity.", "sentiment": "neutral"},
    {"text": "Market looks range-bound. Mixed signals on ${ticker} with solid domestic sales offset by weaker European demand.", "sentiment": "neutral"},
    {"text": "Institutional rebalancing flows in ${ticker} ahead of quad-witching expiry. Volatility likely elevated into the close.", "sentiment": "neutral"}
]

class SyntheticDataGenerator:
    """
    Generates deterministic, high-quality synthetic financial news and social media feeds
    for zero-config, reproducible hackathon demonstrations.
    """

    @staticmethod
    def generate_news_records(count: int = 120, seed: Any = 42) -> List[Dict[str, Any]]:
        rng = random.Random(seed) if seed is not None else random.Random(int(time.time() // 60))  # live mode: stable within a minute, new items each minute
        records = []
        now = datetime.utcnow()

        sources = [
            "Reuters Synthetic Wire", "Bloomberg MarketPulse", "Wall Street Journal Synthetic",
            "Financial Times Macrofeed", "CNBC Market Alert", "Dow Jones Newswire Synthetic"
        ]

        for i in range(count):
            company_data = rng.choice(STOCK_BASKET)
            scenario = rng.choice(NEWS_SCENARIOS)

            # Substitute templates
            headline = scenario["headline"].format(company=company_data["name"], ticker=company_data["ticker"])
            content = scenario["content"].format(company=company_data["name"], ticker=company_data["ticker"])
            
            # Pub date between 14 days ago and now, or recent if live
            delta_mins = rng.randint(1, 45) if seed is None else rng.randint(5, 14 * 24 * 60)
            pub_date = now - timedelta(minutes=delta_mins)

            art_id = f"news-synth-{1000 + i}" if seed is not None else f"news-live-{rng.getrandbits(32):08x}"
            rec = {
                "article_id": art_id,
                "source_type": "financial_news",
                "source_name": rng.choice(sources),
                "headline": headline,
                "description": content[:140] + "...",
                "content": content,
                "url": f"https://synthetic-financial-wire.internal/articles/{art_id}",
                "published_at": pub_date.isoformat(),
                "ingested_at": now.isoformat(),
                "company_entities": [company_data["name"]],
                "ticker_symbols": [company_data["ticker"]],
                "country_entities": [company_data["country"]],
                "sector_entities": [company_data["sector"]],
                "is_synthetic": True,
                "data_source_label": "Synthetic Financial News Wire"
            }
            records.append(rec)

        return records

    @staticmethod
    def generate_social_records(count: int = 120, seed: Any = 84) -> List[Dict[str, Any]]:
        rng = random.Random(seed) if seed is not None else random.Random(int(time.time() // 60))  # live mode: stable within a minute, new items each minute
        records = []
        now = datetime.utcnow()

        social_sources = [
            "FinTwit Verified Feed", "StockTwits Stream", "MacroAlpha Social", "TraderDesk Social Sentiment"
        ]

        for i in range(count):
            company_data = rng.choice(STOCK_BASKET)
            template = rng.choice(SOCIAL_POST_TEMPLATES)

            text = template["text"].format(company=company_data["name"], ticker=company_data["ticker"])
            delta_mins = rng.randint(1, 45) if seed is None else rng.randint(2, 7 * 24 * 60)
            pub_date = now - timedelta(minutes=delta_mins)

            post_id = f"social-synth-{2000 + i}" if seed is not None else f"soc-live-{rng.getrandbits(32):08x}"
            rec = {
                "article_id": post_id,
                "source_type": "social_media",
                "source_name": rng.choice(social_sources),
                "headline": f"Social Sentiment Alert: ${company_data['ticker']}",
                "description": text,
                "content": text,
                "url": f"https://synthetic-social-wire.internal/posts/{post_id}",
                "published_at": pub_date.isoformat(),
                "ingested_at": now.isoformat(),
                "company_entities": [company_data["name"]],
                "ticker_symbols": [company_data["ticker"]],
                "country_entities": [company_data["country"]],
                "sector_entities": [company_data["sector"]],
                "is_synthetic": True,
                "data_source_label": "Simulated Financial Social Media Feed"
            }
            records.append(rec)

        return records

    @classmethod
    def save_synthetic_files(cls):
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        synthetic_dir = DATA_DIR / "synthetic"
        synthetic_dir.mkdir(parents=True, exist_ok=True)

        news = cls.generate_news_records(120, seed=42)
        social = cls.generate_social_records(120, seed=84)

        with open(synthetic_dir / "synthetic_news.json", "w", encoding="utf-8") as f:
            json.dump(news, f, indent=2)

        with open(synthetic_dir / "synthetic_social.json", "w", encoding="utf-8") as f:
            json.dump(social, f, indent=2)

        with open(synthetic_dir / "index_constituents.json", "w", encoding="utf-8") as f:
            json.dump(STOCK_BASKET, f, indent=2)

        print(f"Generated {len(news)} synthetic news records and {len(social)} synthetic social posts.")
