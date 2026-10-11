import sys
from pathlib import Path
from datetime import datetime

# Add backend to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "backend"))

from app.database import engine, Base, SessionLocal
from app.models.models import IngestedRecord, RiskSignal, AuditEvent
from app.services.index_rebalancing.rebalancer import rebalancer
from app.services.portfolio.portfolio_manager import PortfolioManager
from app.services.stress_testing.stress_engine import PortfolioStressEngine
from app.services.ingestion.synthetic_generator import SyntheticDataGenerator
from app.services.nlp.pipeline import risk_engine
from app.api.routes import _init_source_statuses

def initialize():
    print("Initializing RiskPulse AI Database schema...")
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        print("Generating synthetic datasets...")
        SyntheticDataGenerator.save_synthetic_files()
        
        print("Initializing data sources status...")
        _init_source_statuses(db)

        print("Initializing stock index constituents...")
        rebalancer.initialize_constituents(db)

        print("Initializing synthetic wholesale banking portfolio ($500M)...")
        PortfolioManager.initialize_portfolio(db, force_reset=True)

        # Ingest and analyze initial batch of synthetic news and social posts
        news_records = SyntheticDataGenerator.generate_news_records(count=50, seed=42)
        social_records = SyntheticDataGenerator.generate_social_records(count=50, seed=84)
        
        print(f"Ingesting and processing {len(news_records)} news records through NLP Risk Engine...")
        for r in news_records:
            if not db.query(IngestedRecord).filter(IngestedRecord.article_id == r["article_id"]).first():
                rec = IngestedRecord(
                    article_id=r["article_id"],
                    source_type=r["source_type"],
                    source_name=r["source_name"],
                    headline=r["headline"],
                    description=r["description"],
                    content=r["content"],
                    url=r["url"],
                    published_at=datetime.fromisoformat(r["published_at"]),
                    ingested_at=datetime.utcnow(),
                    company_entities=r["company_entities"],
                    ticker_symbols=r["ticker_symbols"],
                    country_entities=r["country_entities"],
                    sector_entities=r["sector_entities"],
                    is_synthetic=True,
                    data_source_label=r["data_source_label"],
                    processed=True
                )
                db.add(rec)
                
                sig = risk_engine.process_text(
                    text=r["content"],
                    headline=r["headline"],
                    source_type="financial_news",
                    source_name=r["source_name"],
                    published_at=rec.published_at,
                    is_synthetic=True
                )
                db_sig = RiskSignal(
                    signal_id=sig.signal_id,
                    article_id=rec.article_id,
                    source_type=sig.source_type,
                    source_name=sig.source_name,
                    source_reference=sig.source_reference,
                    headline=sig.headline,
                    text=sig.text,
                    published_at=sig.published_at,
                    processed_at=sig.processed_at,
                    entities=[e.model_dump() for e in sig.entities],
                    primary_ticker=sig.primary_ticker,
                    primary_company=sig.primary_company,
                    sentiment_score=sig.sentiment_score,
                    sentiment_label=sig.sentiment_label,
                    sentiment_method=sig.sentiment_method,
                    sentiment_confidence=sig.sentiment_confidence,
                    event_type=sig.event_type,
                    event_confidence=sig.event_confidence,
                    event_evidence=sig.event_evidence,
                    impact_score=sig.impact_score,
                    impact_level=sig.impact_level,
                    impact_rationale=sig.impact_rationale,
                    impact_method=sig.impact_method,
                    risk_direction=sig.risk_direction,
                    is_synthetic=sig.is_synthetic,
                    data_source_label=sig.data_source_label
                )
                db.add(db_sig)

        print(f"Ingesting and processing {len(social_records)} social posts through NLP Risk Engine...")
        for r in social_records:
            if not db.query(IngestedRecord).filter(IngestedRecord.article_id == r["article_id"]).first():
                rec = IngestedRecord(
                    article_id=r["article_id"],
                    source_type=r["source_type"],
                    source_name=r["source_name"],
                    headline=r["headline"],
                    description=r["description"],
                    content=r["content"],
                    url=r["url"],
                    published_at=datetime.fromisoformat(r["published_at"]),
                    ingested_at=datetime.utcnow(),
                    company_entities=r["company_entities"],
                    ticker_symbols=r["ticker_symbols"],
                    country_entities=r["country_entities"],
                    sector_entities=r["sector_entities"],
                    is_synthetic=True,
                    data_source_label=r["data_source_label"],
                    processed=True
                )
                db.add(rec)
                
                sig = risk_engine.process_text(
                    text=r["content"],
                    headline=r["headline"],
                    source_type="social_media",
                    source_name=r["source_name"],
                    published_at=rec.published_at,
                    is_synthetic=True
                )
                db_sig = RiskSignal(
                    signal_id=sig.signal_id,
                    article_id=rec.article_id,
                    source_type=sig.source_type,
                    source_name=sig.source_name,
                    source_reference=sig.source_reference,
                    headline=sig.headline,
                    text=sig.text,
                    published_at=sig.published_at,
                    processed_at=sig.processed_at,
                    entities=[e.model_dump() for e in sig.entities],
                    primary_ticker=sig.primary_ticker,
                    primary_company=sig.primary_company,
                    sentiment_score=sig.sentiment_score,
                    sentiment_label=sig.sentiment_label,
                    sentiment_method=sig.sentiment_method,
                    sentiment_confidence=sig.sentiment_confidence,
                    event_type=sig.event_type,
                    event_confidence=sig.event_confidence,
                    event_evidence=sig.event_evidence,
                    impact_score=sig.impact_score,
                    impact_level=sig.impact_level,
                    impact_rationale=sig.impact_rationale,
                    impact_method=sig.impact_method,
                    risk_direction=sig.risk_direction,
                    is_synthetic=sig.is_synthetic,
                    data_source_label=sig.data_source_label
                )
                db.add(db_sig)

        db.commit()

        print("Executing initial Tactical Index Rebalancing run...")
        reb_run = rebalancer.rebalance(db)
        print(f"Index Rebalanced! Run ID: {reb_run.run_id}, Turnover: {reb_run.turnover:.2%}")

        print("Executing initial Strategic Stress Test run (Geopolitical Escalation)...")
        st_run = PortfolioStressEngine.run_stress_test(db, scenario_id="geopolitical_escalation")
        print(f"Stress test complete! Run ID: {st_run.run_id}, Loss: ${st_run.absolute_loss/1e6:.2f}M ({st_run.percentage_loss:.2f}%)")

        print("Database initialization successfully finished!")
    finally:
        db.close()

if __name__ == "__main__":
    initialize()
