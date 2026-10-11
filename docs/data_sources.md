# RiskPulse AI — Data Sources & Data Provenance

## 1. Overview & Provenance Standards

In strict adherence to the **S&P Global & CRISIL Campus Hackathon 2026 Confidentiality and Data Protection Guidelines**, RiskPulse AI operates entirely on:
1. Publicly documented financial market conventions and indices.
2. Deterministic, high-fidelity synthetic news and social media records.
3. Open-source financial dictionaries and reference models.

**Zero confidential client records, non-public banking data, proprietary S&P Global/CRISIL data, or private user information is accessed, stored, or utilized.**

---

## 2. Data Sources Inventory

| Source Identifier | Source Category | Access Method | Licensing / Usage | Data Mode | Storage Path |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Synthetic Financial News Wire** | Financial News | Local JSON Loader / REST Generator | MIT License (Original Project Code) | Deterministic Synthetic | `data/synthetic/synthetic_news.json` |
| **FinTwit Sentiment Feed** | Social Media | Local JSON Loader / REST Generator | MIT License (Original Project Code) | Simulated Social Posts | `data/synthetic/synthetic_social.json` |
| **US Large-Cap Basket Universe** | Market Reference | Static Config / SQLite Table | Public Market Observation (NYSE / NASDAQ Tickers) | Reference Universe | `data/synthetic/index_constituents.json` |
| **Synthetic Wholesale Bank Book** | Banking Portfolio | SQLAlchemy Model Generator | Fictional Fictitious Counterparties (Basel III Framework) | Synthetic Banking Data | `app/services/portfolio/portfolio_manager.py` |
| **NewsAPI (Optional)** | Financial News | HTTPS REST API (`newsapi.org`) | Free Developer Tier (Personal / Academic Use) | Public Market Data | N/A (Live External) |
| **Loughran-McDonald Financial Lexicon** | NLP Lexicon | Python Embedded Dictionary | Academic Open Access (Loughran & McDonald 2011) | Curated Lexicon | `app/services/nlp/sentiment.py` |
| **FinBERT (Optional)** | NLP Transformer | HuggingFace Hub (`ProsusAI/finbert`) | Apache 2.0 Open Source | Pretrained Open Weight Model | HuggingFace Cache |

---

## 3. Synthetic Data Generation Methodology

To ensure 100% reproducible demonstrations without requiring external API tokens or internet connectivity:
- **Random Seeds:** Deterministic pseudo-random seeds (`42` for news, `84` for social media) are hardcoded in `scripts/generate_synthetic_data.py`.
- **Constituent Coverage:** Records span 15 core publicly traded US companies across Technology, Financial Services, Energy, Healthcare, Consumer, Industrials, and Utilities.
- **Scenario Balance:** Textual templates evenly cover:
  - Positive catalysts: Earnings beats, AI product rollouts, contract awards, debt upgrades.
  - Negative disruptions: Antitrust lawsuits, SEC subpoenas, ransomware cyber incidents, chip shortages, margin compression.
  - Macroeconomic developments: Central bank interest rate decisions, inflation CPI releases, interbank liquidity conditions.
- **Privacy Assurance:** All synthetic transaction identifiers (`TX-SYNTH-XXXXXX`) and customer identifiers (`SYNTH-CORP-XXXX`) are purely fictional and do not correspond to any real individuals or commercial banking entities.
