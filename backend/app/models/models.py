import datetime
from sqlalchemy import Column, String, Integer, Float, Boolean, DateTime, Text, JSON, ForeignKey
from app.database import Base

class IngestedRecord(Base):
    __tablename__ = "ingested_records"

    article_id = Column(String(64), primary_key=True, index=True)
    source_type = Column(String(32), index=True)  # 'financial_news' or 'social_media'
    source_name = Column(String(128))             # e.g., 'Reuters Synthetic Wire'
    headline = Column(String(512))
    description = Column(Text, nullable=True)
    content = Column(Text)
    url = Column(String(512), nullable=True)
    published_at = Column(DateTime, nullable=True)
    ingested_at = Column(DateTime, default=datetime.datetime.utcnow)
    company_entities = Column(JSON, default=list)
    ticker_symbols = Column(JSON, default=list)
    country_entities = Column(JSON, default=list)
    sector_entities = Column(JSON, default=list)
    is_synthetic = Column(Boolean, default=True)
    data_source_label = Column(String(128))
    processed = Column(Boolean, default=False)


class RiskSignal(Base):
    __tablename__ = "risk_signals"

    signal_id = Column(String(64), primary_key=True, index=True)
    article_id = Column(String(64), ForeignKey("ingested_records.article_id"), nullable=True)
    source_type = Column(String(32), index=True)
    source_name = Column(String(128))
    source_reference = Column(String(512), nullable=True)
    headline = Column(String(512))
    text = Column(Text)
    published_at = Column(DateTime, nullable=True)
    processed_at = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    
    # Entity Information
    entities = Column(JSON, default=list)
    primary_ticker = Column(String(16), index=True, nullable=True)
    primary_company = Column(String(128), nullable=True)
    
    # NLP Sentiment
    sentiment_score = Column(Float)              # -1.0 to +1.0
    sentiment_label = Column(String(16))          # Positive, Negative, Neutral, Mixed
    sentiment_method = Column(String(64))         # FinBERT or Lexicon-Syntax Fallback
    sentiment_confidence = Column(Float)         # 0.0 to 1.0
    
    # Event Classification
    event_type = Column(String(64), index=True)   # From 20 taxonomies
    event_confidence = Column(Float)
    event_evidence = Column(JSON, default=list)
    
    # Impact Scoring
    impact_score = Column(Integer)                # 1 to 10
    impact_level = Column(String(16))             # Minimal, Low, Moderate, High, Critical
    impact_rationale = Column(Text)
    impact_method = Column(String(64))
    
    # Risk Direction
    risk_direction = Column(String(16))           # Positive, Negative, Neutral, Mixed
    is_synthetic = Column(Boolean, default=True)
    data_source_label = Column(String(128))


class CompanyEntity(Base):
    __tablename__ = "company_entities"

    ticker = Column(String(16), primary_key=True)
    name = Column(String(128), nullable=False)
    sector = Column(String(64), nullable=False)
    country = Column(String(64), default="USA")
    aliases = Column(JSON, default=list)
    baseline_risk_rating = Column(String(16), default="A")
    market_cap_category = Column(String(32), default="Large Cap")


class IndexConstituent(Base):
    __tablename__ = "index_constituents"

    ticker = Column(String(16), primary_key=True)
    name = Column(String(128), nullable=False)
    sector = Column(String(64), nullable=False)
    base_weight = Column(Float, default=0.0667)
    current_weight = Column(Float, default=0.0667)
    target_weight = Column(Float, default=0.0667)
    previous_weight = Column(Float, default=0.0667)
    latest_sentiment = Column(Float, default=0.0)
    latest_impact = Column(Integer, default=1)
    latest_event = Column(String(64), default="Routine Operations")
    latest_signal_id = Column(String(64), nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)


class RebalanceRun(Base):
    __tablename__ = "rebalance_runs"

    run_id = Column(String(64), primary_key=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    turnover = Column(Float, default=0.0)
    num_constituents = Column(Integer, default=15)
    trigger_reason = Column(String(256))
    allocations = Column(JSON, default=list)
    parameters = Column(JSON, default=dict)
    risk_alerts = Column(JSON, default=list)


class SyntheticPortfolioHolding(Base):
    __tablename__ = "synthetic_portfolio_holdings"

    asset_id = Column(String(64), primary_key=True)
    transaction_id = Column(String(64), index=True)
    synthetic_customer_id = Column(String(64), index=True)
    asset_name = Column(String(128))
    asset_type = Column(String(64), index=True)  # Corporate Loan, Sovereign Bond, Corporate Bond, Equity Holding, FX / Derivative, Cash
    sector = Column(String(64), index=True)
    notional_amount = Column(Float)
    market_value = Column(Float)
    interest_rate = Column(Float)
    duration = Column(Float)
    credit_rating = Column(String(16))
    probability_of_default = Column(Float)       # PD
    loss_given_default = Column(Float)           # LGD
    maturity_date = Column(String(32))
    country = Column(String(64))
    currency = Column(String(8), default="USD")
    risk_weight = Column(Float, default=1.0)
    is_synthetic = Column(Boolean, default=True)


class StressTestRun(Base):
    __tablename__ = "stress_test_runs"

    run_id = Column(String(64), primary_key=True)
    scenario_id = Column(String(64), index=True)
    scenario_name = Column(String(128))
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    triggered_by_signal_id = Column(String(64), nullable=True)
    trigger_event = Column(String(64), nullable=True)
    trigger_impact = Column(Integer, nullable=True)
    portfolio_value_before = Column(Float)
    portfolio_value_after = Column(Float)
    absolute_loss = Column(Float)
    percentage_loss = Column(Float)
    ecl_before = Column(Float)
    ecl_after = Column(Float)
    loss_by_asset_class = Column(JSON, default=dict)
    loss_by_sector = Column(JSON, default=dict)
    loss_by_country = Column(JSON, default=dict)
    major_drivers = Column(JSON, default=list)
    parameters = Column(JSON, default=dict)


class IngestionSourceStatus(Base):
    __tablename__ = "ingestion_source_statuses"

    source_id = Column(String(64), primary_key=True)
    source_name = Column(String(128))
    source_type = Column(String(32))
    status = Column(String(32))                  # 'ACTIVE', 'SIMULATED', 'IDLE', 'ERROR'
    mode = Column(String(32))                    # 'Live API', 'Synthetic Feed', 'Local Dataset'
    records_processed = Column(Integer, default=0)
    records_rejected = Column(Integer, default=0)
    last_ingestion_at = Column(DateTime, nullable=True)
    error_message = Column(String(512), nullable=True)


class AuditEvent(Base):
    __tablename__ = "audit_events"

    audit_id = Column(String(64), primary_key=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow, index=True)
    action_type = Column(String(32))             # INGESTION, ANALYSIS, REBALANCE, STRESS_TEST, SYSTEM
    actor = Column(String(64), default="system")
    details = Column(JSON, default=dict)
    status = Column(String(32), default="SUCCESS")
