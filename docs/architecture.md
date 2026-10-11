# RiskPulse AI — System Architecture & Data Flow

## 1. Executive Architecture Summary

RiskPulse AI is an enterprise-grade financial risk intelligence platform engineered for the **S&P Global & CRISIL Campus Hackathon 2026**. The platform bridges unstructured financial narratives (news articles, 8-K disclosures, and FinTwit social streams) to structured, explainable financial risk signals that drive two critical quantitative downstream modules:

1. **Module A: Tactical Stock Index Rebalancing** (Quantitative constituent optimization under turnover & box constraints).
2. **Module B: Strategic Portfolio Stress Testing** (Basel III Expected Credit Loss & duration modeling for a $500M wholesale banking book).

The platform is designed with a **Zero-Key Resilient Architecture**, functioning 100% offline with high-fidelity deterministic synthetic datasets, while providing plug-and-play adapters for live news and deep learning NLP models.

---

## 2. High-Resolution Architecture Diagram

![System Architecture](file:///Users/milindverma/Desktop/S&P%20Group/docs/architecture.png)

---

## 3. Component Breakdown

### 3.1 Data Ingestion Layer (`backend/app/services/ingestion/`)
- **News Ingestion Adapter (`news_adapter.py`)**: Interacts with NewsAPI when an optional API key is configured. Automatically falls back to local high-fidelity synthetic news records upon network timeouts, rate limits, or missing credentials.
- **Social Media Ingestion Adapter (`social_adapter.py`)**: Ingests financial social discourse and retail sentiment posts, normalizing cashtags (`$AAPL`, `$NVDA`, etc.) and engagement counters without unauthorized scraping.
- **Synthetic Data Generator (`synthetic_generator.py`)**: Generates deterministic, reproducible synthetic datasets with fixed random seeds (42 and 84), producing over 240 structured financial records across corporate earnings, regulatory investigations, cyber breaches, and monetary policy decisions.

### 3.2 Preprocessing & Entity Extraction (`backend/app/services/preprocessing/` & `entity_extraction/`)
- **Text Cleaner (`text_cleaner.py`)**: Normalizes whitespace, cleans HTML artifacts, strips redundant URLs, and critically preserves directional and negation tokens (`not`, `never`, `decline`, `failed`).
- **Deduplicator (`deduplicator.py`)**: Employs normalized token fingerprint hashing to prevent duplicate articles from syndicated news wires from skewing risk aggregations.
- **Entity Extractor (`extractor.py`)**: Resolves explicit cashtags and company aliases across a 15-constituent US large-cap universe, tagging primary entities, secondary entities, affected sectors, and geographic jurisdictions.

### 3.3 Core AI / NLP Risk Engine (`backend/app/services/nlp/`)
- **Sentiment Analyzer (`sentiment.py`)**: Produces a continuous score between `-1.0` (critical adverse) and `+1.0` (strongly bullish). Employs FinBERT when enabled, with a fallback analyzing Loughran-McDonald domain financial dictionaries, syntactic multi-word negation windows (`failed to beat`, `did not decline`), and modifier intensifiers.
- **Event Classifier (`event_classification/classifier.py`)**: Multi-class categorization across 20 formal taxonomies with heuristic confidence and explicit evidence phrase extraction.
- **Impact Scorer (`impact_scoring/scorer.py`)**: Multi-factor severity evaluation (1-10) synthesizing intrinsic event baseline, market-wide vs single-name breadth, sentiment intensity, and systemic tail-risk keywords.

### 3.4 Storage & Persistence (`backend/app/models/` & `database.py`)
- Built on SQLAlchemy ORM supporting zero-configuration **SQLite** for development and local hackathon demonstrations, with standard **PostgreSQL** compatibility for cloud deployments.
- Enforces relational foreign keys, indexed query columns, and an immutable **Audit Trail** table tracking all operational actions.

### 3.5 Downstream Applications
- **Module A (`index_rebalancing/rebalancer.py`)**: Exponential weighting algorithm:
  $$w_i = w_{base} \cdot \exp(\alpha \cdot S_i - \beta \cdot \text{Risk}_i)$$
  Subject to budget normalization ($\sum w_i = 100\%$), box constraints ($2\% \le w_i \le 18\%$), turnover limit ($\le 25\%$), and 50 bps no-trade deadbands.
- **Module B (`stress_testing/stress_engine.py`)**: Stress tests a $500M wholesale banking portfolio using Basel III Expected Credit Loss ($ECL = PD \times LGD \times EAD$) and modified duration sensitivity ($\Delta P \approx - Duration \times \Delta Yield \times P$).

### 3.6 API & Presentation Layer
- **FastAPI REST API (`backend/app/api/routes.py`)**: Fast, asynchronous endpoints with Pydantic schema validation, pagination, and automated OpenAPI Swagger documentation.
- **React Frontend (`frontend/src/`)**: Institutional-grade financial dashboard built with TypeScript, Vite, Tailwind CSS, Lucide icons, and Recharts.
