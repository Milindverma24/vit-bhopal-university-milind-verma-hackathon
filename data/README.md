# RiskPulse AI — Synthetic Dataset Documentation

## 1. Overview & Data Integrity Confirmation

All records located in this `data/` directory are **deterministic synthetic financial data** generated specifically for the **S&P Global & CRISIL Campus Hackathon 2026**.

**CONFIRMATION OF SYNTHETIC DATA:**
- No confidential, non-public, or proprietary client data belonging to S&P Global, CRISIL, or any commercial banking institution is included.
- All customer identifiers (e.g. `SYNTH-CORP-1001`), transaction numbers, and borrower company profiles are fictional and algorithmically generated.
- All news articles and social media posts represent realistic but simulated corporate and market events.

---

## 2. Directory Structure

```
data/
|-- synthetic/
|   |-- synthetic_news.json       # 120 deterministic synthetic financial news records
|   |-- synthetic_social.json     # 120 simulated FinTwit social media sentiment posts
|   |-- index_constituents.json   # 15 constituent reference stock universe
|-- sample/
|   |-- sample_headlines.json     # Curated benchmark headlines for interactive validation
|-- README.md
```

---

## 3. Generation Methodology & Seeds

The synthetic datasets are produced by `scripts/generate_synthetic_data.py` (and the `SyntheticDataGenerator` service in `backend/app/services/ingestion/synthetic_generator.py`).

- **Pseudo-Random Seeds:**
  - News Dataset: Seed `42`
  - Social Media Feed: Seed `84`
- **Constituent Universe:**
  - 15 publicly traded US large-cap equities spanning 7 major economic sectors (Technology, Financials, Energy, Healthcare, Consumer, Industrials, Utilities).
- **Template Distribution:**
  - 40% Positive events (Earnings beats, next-gen AI launches, multi-billion procurement contracts, debt upgrades).
  - 40% Adverse risk events (Antitrust litigation, SEC probes, ransomware data breaches, supply bottlenecks, margin misses).
  - 20% Macroeconomic events (Central bank rate decisions, CPI inflation prints, interbank repo liquidity conditions).

---

## 4. Schema Definitions

### 4.1 News Record Schema (`synthetic_news.json`)
```json
{
  "article_id": "news-synth-1001",
  "source_type": "financial_news",
  "source_name": "Reuters Synthetic Wire",
  "headline": "NVIDIA Surpasses Q3 Revenue Forecasts on Surging Enterprise Demand",
  "description": "NVIDIA Corporation delivered robust quarterly results...",
  "content": "Full article body content...",
  "url": "https://synthetic-financial-wire.internal/articles/news-synth-1001",
  "published_at": "2026-10-09T14:30:00Z",
  "ingested_at": "2026-10-10T09:00:00Z",
  "company_entities": ["NVIDIA Corporation"],
  "ticker_symbols": ["NVDA"],
  "country_entities": ["USA"],
  "sector_entities": ["Technology"],
  "is_synthetic": true,
  "data_source_label": "Synthetic Financial News Wire"
}
```

### 4.2 Social Record Schema (`synthetic_social.json`)
```json
{
  "article_id": "social-synth-2001",
  "source_type": "social_media",
  "source_name": "FinTwit Verified Feed",
  "headline": "Social Sentiment Alert: $NVDA",
  "description": "$NVDA just reported huge numbers! Revenue beat by 8%...",
  "content": "$NVDA just reported huge numbers! Revenue beat by 8%...",
  "url": "https://synthetic-social-wire.internal/posts/social-synth-2001",
  "published_at": "2026-10-10T08:15:00Z",
  "ingested_at": "2026-10-10T09:00:00Z",
  "company_entities": ["NVIDIA Corporation"],
  "ticker_symbols": ["NVDA"],
  "country_entities": ["USA"],
  "sector_entities": ["Technology"],
  "is_synthetic": true,
  "data_source_label": "Simulated Financial Social Media Feed"
}
```
