import uuid
from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, func

from app.database import get_db
from app.config import settings, STOCK_BASKET, EVENT_CATEGORIES
from app.models.models import (
    IngestedRecord, RiskSignal, IndexConstituent, RebalanceRun,
    SyntheticPortfolioHolding, StressTestRun, IngestionSourceStatus, AuditEvent
)
from app.schemas.schemas import (
    RiskSignalResponse, AnalyzeRequest, IngestionRefreshRequest,
    IngestionStatusItem, RebalanceRequest, RebalanceRunResponse,
    StressRunRequest, StressTestResultResponse, DashboardSummaryResponse,
    PortfolioSummaryResponse, StressScenarioDefinition, NewsIngestionResponse
)
from app.services.nlp.pipeline import risk_engine
from app.services.index_rebalancing.rebalancer import rebalancer
from app.services.portfolio.portfolio_manager import PortfolioManager
from app.services.stress_testing.stress_engine import PortfolioStressEngine
from app.services.market_data.market_service import market_service
from app.services.ingestion.news_adapter import news_adapter
from app.services.ingestion.social_adapter import social_adapter
from app.services.ingestion.synthetic_generator import SyntheticDataGenerator

router = APIRouter(prefix="/api")

@router.get("/health")
def get_health():
    return {
        "status": "healthy",
        "service": "RiskPulse AI Risk Engine",
        "version": settings.APP_VERSION,
        "database": "sqlite" if settings.DATABASE_URL.startswith("sqlite") else "postgresql",
        "nlp_mode": "FinBERT (HuggingFace)" if risk_engine.sentiment_analyzer.finbert_pipeline else "Financial Lexicon-Syntactic Engine (Zero-Key)",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/dashboard/summary", response_model=DashboardSummaryResponse)
def get_dashboard_summary(db: Session = Depends(get_db)):
    total_signals = db.query(RiskSignal).count()
    neg_count = db.query(RiskSignal).filter(RiskSignal.sentiment_score < -0.15).count()
    high_impact_count = db.query(RiskSignal).filter(RiskSignal.impact_score >= 7).count()

    # Average sentiment
    signals = db.query(RiskSignal).all()
    avg_sentiment = float(round(sum(s.sentiment_score for s in signals) / len(signals), 3)) if signals else 0.0

    # Elevated risk companies (constituents with sentiment < -0.10 or impact >= 6)
    constituents = db.query(IndexConstituent).all()
    if not constituents:
        rebalancer.initialize_constituents(db)
        constituents = db.query(IndexConstituent).all()

    elevated = []
    for c in constituents:
        if c.latest_sentiment < -0.10 or c.latest_impact >= 6:
            elevated.append({
                "ticker": c.ticker,
                "name": c.name,
                "sector": c.sector,
                "sentiment": c.latest_sentiment,
                "impact": c.latest_impact,
                "event": c.latest_event,
                "weight": c.current_weight
            })

    # Latest significant events (impact >= 6)
    recent_sig = db.query(RiskSignal).filter(RiskSignal.impact_score >= 6).order_by(desc(RiskSignal.processed_at)).limit(5).all()
    latest_events = [{
        "signal_id": s.signal_id,
        "headline": s.headline,
        "primary_ticker": s.primary_ticker,
        "event_type": s.event_type,
        "impact_score": s.impact_score,
        "sentiment_score": s.sentiment_score,
        "published_at": s.published_at.isoformat() if s.published_at else None
    } for s in recent_sig]

    # Data source health
    statuses = db.query(IngestionSourceStatus).all()
    if not statuses:
        _init_source_statuses(db)
        statuses = db.query(IngestionSourceStatus).all()

    # Distributions
    sent_dist = {"Positive": 0, "Negative": 0, "Neutral": 0, "Mixed": 0}
    event_dist: Dict[str, int] = {}
    impact_dist = {"Minimal (1-2)": 0, "Low (3-4)": 0, "Moderate (5-6)": 0, "High (7-8)": 0, "Critical (9-10)": 0}

    for s in signals:
        sent_dist[s.sentiment_label] = sent_dist.get(s.sentiment_label, 0) + 1
        event_dist[s.event_type] = event_dist.get(s.event_type, 0) + 1
        if s.impact_score <= 2:
            impact_dist["Minimal (1-2)"] += 1
        elif s.impact_score <= 4:
            impact_dist["Low (3-4)"] += 1
        elif s.impact_score <= 6:
            impact_dist["Moderate (5-6)"] += 1
        elif s.impact_score <= 8:
            impact_dist["High (7-8)"] += 1
        else:
            impact_dist["Critical (9-10)"] += 1

    # Current index allocation
    curr_alloc = [{
        "ticker": c.ticker,
        "name": c.name,
        "sector": c.sector,
        "weight": c.current_weight,
        "base_weight": c.base_weight,
        "sentiment": c.latest_sentiment,
        "impact": c.latest_impact
    } for c in constituents]

    # Latest stress test
    latest_st = db.query(StressTestRun).order_by(desc(StressTestRun.timestamp)).first()
    st_resp = None
    if latest_st:
        st_resp = StressTestResultResponse.model_validate(latest_st)

    return DashboardSummaryResponse(
        total_signals=total_signals,
        negative_signals_count=neg_count,
        high_impact_events_count=high_impact_count,
        average_market_sentiment=avg_sentiment,
        elevated_risk_companies=elevated,
        latest_significant_events=latest_events,
        data_source_health=[IngestionStatusItem.model_validate(s) for s in statuses],
        sentiment_distribution=sent_dist,
        event_distribution=event_dist,
        impact_distribution=impact_dist,
        current_index_allocation=curr_alloc,
        latest_stress_test=st_resp
    )

@router.get("/signals", response_model=Dict[str, Any])
def get_signals(
    search: Optional[str] = None,
    ticker: Optional[str] = None,
    source_type: Optional[str] = None,
    event_type: Optional[str] = None,
    sentiment_label: Optional[str] = None,
    min_impact: Optional[int] = Query(None, ge=1, le=10),
    page: int = Query(1, ge=1),
    page_size: int = Query(15, ge=1, le=100),
    db: Session = Depends(get_db)
):
    query = db.query(RiskSignal)

    if search:
        s_term = f"%{search}%"
        query = query.filter((RiskSignal.headline.ilike(s_term)) | (RiskSignal.text.ilike(s_term)))
    if ticker:
        query = query.filter(RiskSignal.primary_ticker == ticker.upper())
    if source_type:
        if source_type in ["financial_news", "news"]:
            query = query.filter(RiskSignal.source_type.in_(["financial_news", "news"]))
        else:
            query = query.filter(RiskSignal.source_type == source_type)
    if event_type:
        query = query.filter(RiskSignal.event_type == event_type)
    if sentiment_label:
        query = query.filter(RiskSignal.sentiment_label == sentiment_label)
    if min_impact:
        query = query.filter(RiskSignal.impact_score >= min_impact)

    total_records = query.count()
    offset = (page - 1) * page_size
    signals = query.order_by(desc(RiskSignal.processed_at)).offset(offset).limit(page_size).all()

    return {
        "total": total_records,
        "page": page,
        "page_size": page_size,
        "total_pages": (total_records + page_size - 1) // page_size if total_records > 0 else 1,
        "items": [RiskSignalResponse.model_validate(s) for s in signals]
    }

@router.get("/signals/{signal_id}", response_model=RiskSignalResponse)
def get_signal_by_id(signal_id: str, db: Session = Depends(get_db)):
    sig = db.query(RiskSignal).filter(RiskSignal.signal_id == signal_id).first()
    if not sig:
        raise HTTPException(status_code=404, detail="Risk signal not found")
    return RiskSignalResponse.model_validate(sig)

@router.post("/analyze", response_model=RiskSignalResponse)
def analyze_custom_text(payload: AnalyzeRequest, db: Session = Depends(get_db)):
    signal = risk_engine.process_text(
        text=payload.text,
        headline=payload.headline,
        source_type=payload.source_type,
        source_name=payload.source_name or "Interactive Dashboard Input",
        is_synthetic=payload.is_synthetic,
        override_ticker=payload.ticker
    )

    # Check for existing duplicate signal with identical headline and text
    norm_text = payload.text.strip().lower()
    norm_hl = (payload.headline or "").strip().lower()
    if norm_hl:
        existing_signal = db.query(RiskSignal).filter(
            func.lower(RiskSignal.headline) == norm_hl,
            func.lower(RiskSignal.text) == norm_text
        ).first()
    else:
        existing_signal = db.query(RiskSignal).filter(
            func.lower(RiskSignal.text) == norm_text
        ).first()

    if existing_signal:
        db_signal = existing_signal
        db_signal.headline = signal.headline
        db_signal.text = signal.text
        db_signal.source_type = signal.source_type
        db_signal.source_name = signal.source_name
        db_signal.primary_ticker = signal.primary_ticker
        db_signal.primary_company = signal.primary_company
        db_signal.entities = [e.model_dump() for e in signal.entities]
        db_signal.sentiment_score = signal.sentiment_score
        db_signal.sentiment_label = signal.sentiment_label
        db_signal.sentiment_method = signal.sentiment_method
        db_signal.sentiment_confidence = signal.sentiment_confidence
        db_signal.event_type = signal.event_type
        db_signal.event_confidence = signal.event_confidence
        db_signal.event_evidence = signal.event_evidence
        db_signal.impact_score = signal.impact_score
        db_signal.impact_level = signal.impact_level
        db_signal.impact_rationale = signal.impact_rationale
        db_signal.impact_method = signal.impact_method
        db_signal.risk_direction = signal.risk_direction
        db_signal.processed_at = datetime.utcnow()
    else:
        db_signal = RiskSignal(
            signal_id=signal.signal_id,
            source_type=signal.source_type,
            source_name=signal.source_name,
            source_reference=signal.source_reference,
            headline=signal.headline,
            text=signal.text,
            published_at=signal.published_at,
            processed_at=signal.processed_at,
            entities=[e.model_dump() for e in signal.entities],
            primary_ticker=signal.primary_ticker,
            primary_company=signal.primary_company,
            sentiment_score=signal.sentiment_score,
            sentiment_label=signal.sentiment_label,
            sentiment_method=signal.sentiment_method,
            sentiment_confidence=signal.sentiment_confidence,
            event_type=signal.event_type,
            event_confidence=signal.event_confidence,
            event_evidence=signal.event_evidence,
            impact_score=signal.impact_score,
            impact_level=signal.impact_level,
            impact_rationale=signal.impact_rationale,
            impact_method=signal.impact_method,
            risk_direction=signal.risk_direction,
            is_synthetic=signal.is_synthetic,
            data_source_label=signal.data_source_label
        )
        db.add(db_signal)

    # If associated with a constituent, update their latest status
    if signal.primary_ticker:
        c = db.query(IndexConstituent).filter(IndexConstituent.ticker == signal.primary_ticker).first()
        if c:
            c.latest_sentiment = signal.sentiment_score
            c.latest_impact = signal.impact_score
            c.latest_event = signal.event_type
            c.latest_signal_id = signal.signal_id
            c.updated_at = datetime.utcnow()

    # Audit log
    audit = AuditEvent(
        audit_id=f"aud-{uuid.uuid4().hex[:8]}",
        timestamp=datetime.utcnow(),
        action_type="ANALYSIS",
        actor="UserInterface",
        details={"signal_id": signal.signal_id, "primary_ticker": signal.primary_ticker, "impact": signal.impact_score},
        status="SUCCESS"
    )
    db.add(audit)
    db.commit()

    return RiskSignalResponse.model_validate(db_signal)

@router.post("/ingestion/news/refresh", response_model=NewsIngestionResponse)
def refresh_news(count: int = Query(10, ge=1, le=10), db: Session = Depends(get_db)):
    existing_ids = set(r[0] for r in db.query(IngestedRecord.article_id).filter(IngestedRecord.source_type.in_(["financial_news", "news"])).all())
    meta = news_adapter.fetch_with_metadata(count=count, db_existing_ids=existing_ids)

    # Handle Rate Limiting
    if meta.get("rate_limited"):
        st = db.query(IngestionSourceStatus).filter(IngestionSourceStatus.source_id == "news_feed").first()
        if st:
            st.status = "ERROR"
            st.error_message = meta.get("error")
            db.commit()
        return NewsIngestionResponse(
            status="rate_limited",
            source=meta.get("provider", "financial_news"),
            fetched_count=0,
            inserted_count=0,
            duplicate_count=0,
            failed_count=0,
            rate_limited=True,
            last_fetch_at=datetime.utcnow().isoformat(),
            message=meta.get("error") or "News provider rate limit cooldown active."
        )

    articles = meta.get("articles", [])
    created_count = 0
    duplicate_count = 0

    for a in articles:
        # Check if already ingested by article_id or exact headline
        norm_hl = a["headline"].strip().lower()
        existing = db.query(IngestedRecord).filter(
            (IngestedRecord.article_id == a["article_id"]) |
            (func.lower(IngestedRecord.headline) == norm_hl)
        ).first()

        if existing:
            duplicate_count += 1
            continue

        rec = IngestedRecord(
            article_id=a["article_id"],
            source_type=a["source_type"],
            source_name=a["source_name"],
            headline=a["headline"],
            description=a.get("description", ""),
            content=a["content"],
            url=a.get("url"),
            published_at=datetime.fromisoformat(a["published_at"]) if isinstance(a["published_at"], str) else a["published_at"],
            ingested_at=datetime.utcnow(),
            company_entities=a.get("company_entities", []),
            ticker_symbols=a.get("ticker_symbols", []),
            country_entities=a.get("country_entities", []),
            sector_entities=a.get("sector_entities", []),
            is_synthetic=a.get("is_synthetic", True),
            data_source_label=a.get("data_source_label", "Financial News"),
            processed=True
        )
        db.add(rec)

        # Process through NLP engine
        sig = risk_engine.process_text(
            text=a["content"],
            headline=a["headline"],
            source_type="financial_news",
            source_name=a["source_name"],
            source_reference=a.get("url"),
            published_at=rec.published_at,
            is_synthetic=rec.is_synthetic
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
        created_count += 1

    # Update Source Status
    st = db.query(IngestionSourceStatus).filter(IngestionSourceStatus.source_id == "news_feed").first()
    if st:
        total_news = db.query(IngestedRecord).filter(IngestedRecord.source_type.in_(["financial_news", "news"])).count()
        st.records_processed = total_news
        st.last_ingestion_at = datetime.utcnow()
        st.status = "ACTIVE"
        st.error_message = None

    db.commit()

    return NewsIngestionResponse(
        status="success" if created_count > 0 or not articles else "partial_success",
        source=meta.get("provider", "financial_news"),
        fetched_count=len(articles),
        inserted_count=created_count,
        duplicate_count=duplicate_count,
        failed_count=0,
        rate_limited=False,
        last_fetch_at=datetime.utcnow().isoformat(),
        message=f"Ingestion completed: {created_count} new articles inserted, {duplicate_count} skipped as duplicates."
    )

@router.post("/ingestion/social/refresh")
def refresh_social(count: int = Query(15, ge=5, le=50), db: Session = Depends(get_db)):
    existing_ids = set(r[0] for r in db.query(IngestedRecord.article_id).filter(IngestedRecord.source_type == "social_media").all())
    posts = social_adapter.fetch_posts(count=count, db_existing_ids=existing_ids)
    created_count = 0
    duplicate_count = 0

    for p in posts:
        norm_hl = p["headline"].strip().lower()
        existing = db.query(IngestedRecord).filter(
            (IngestedRecord.article_id == p["article_id"]) |
            (func.lower(IngestedRecord.headline) == norm_hl)
        ).first()

        if existing:
            duplicate_count += 1
            continue

        rec = IngestedRecord(
            article_id=p["article_id"],
            source_type=p["source_type"],
            source_name=p["source_name"],
            headline=p["headline"],
            description=p.get("description", ""),
            content=p["content"],
            url=p.get("url"),
            published_at=datetime.fromisoformat(p["published_at"]) if isinstance(p["published_at"], str) else p["published_at"],
            ingested_at=datetime.utcnow(),
            company_entities=p.get("company_entities", []),
            ticker_symbols=p.get("ticker_symbols", []),
            country_entities=p.get("country_entities", []),
            sector_entities=p.get("sector_entities", []),
            is_synthetic=p.get("is_synthetic", True),
            data_source_label=p.get("data_source_label", "Social Feed"),
            processed=True
        )
        db.add(rec)

        sig = risk_engine.process_text(
            text=p["content"],
            headline=p["headline"],
            source_type="social_media",
            source_name=p["source_name"],
            published_at=rec.published_at,
            is_synthetic=rec.is_synthetic
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
        created_count += 1

    # Update Source Status
    st = db.query(IngestionSourceStatus).filter(IngestionSourceStatus.source_id == "social_feed").first()
    if st:
        total_social = db.query(IngestedRecord).filter(IngestedRecord.source_type == "social_media").count()
        st.records_processed = total_social
        st.last_ingestion_at = datetime.utcnow()
        st.status = "ACTIVE"
        st.error_message = None

    db.commit()

    return {
        "status": "success",
        "source": "FinTwit / StockTwits Stream",
        "fetched_count": len(posts),
        "inserted_count": created_count,
        "duplicate_count": duplicate_count,
        "failed_count": 0,
        "rate_limited": False,
        "last_fetch_at": datetime.utcnow().isoformat(),
        "message": f"Social ingestion completed: {created_count} new posts inserted, {duplicate_count} skipped as duplicates."
    }

@router.post("/ingestion/sample/load")
def load_sample_dataset(db: Session = Depends(get_db)):
    SyntheticDataGenerator.save_synthetic_files()
    res_news = refresh_news(count=40, db=db)
    res_social = refresh_social(count=40, db=db)
    PortfolioManager.initialize_portfolio(db, force_reset=False)
    rebalancer.initialize_constituents(db)
    
    return {
        "status": "success",
        "message": "Full synthetic demonstration dataset loaded into persistent database.",
        "news_signals": res_news["new_signals_created"],
        "social_signals": res_social["new_signals_created"]
    }

@router.get("/ingestion/status", response_model=List[IngestionStatusItem])
def get_ingestion_status(db: Session = Depends(get_db)):
    statuses = db.query(IngestionSourceStatus).all()
    if not statuses:
        _init_source_statuses(db)
        statuses = db.query(IngestionSourceStatus).all()
    return [IngestionStatusItem.model_validate(s) for s in statuses]

@router.get("/companies")
def get_companies():
    return {
        "basket": STOCK_BASKET,
        "event_categories": EVENT_CATEGORIES
    }

@router.get("/companies/{ticker}/risk")
def get_company_risk(ticker: str, db: Session = Depends(get_db)):
    t = ticker.upper()
    c = db.query(IndexConstituent).filter(IndexConstituent.ticker == t).first()
    signals = db.query(RiskSignal).filter(RiskSignal.primary_ticker == t).order_by(desc(RiskSignal.processed_at)).limit(10).all()

    if not c:
        info = next((item for item in STOCK_BASKET if item["ticker"] == t), None)
        if not info:
            raise HTTPException(status_code=404, detail="Company ticker not found in basket universe")
        name = info["name"]
        sec = info["sector"]
        weight = 0.0667
    else:
        name = c.name
        sec = c.sector
        weight = c.current_weight

    avg_sent = round(sum(s.sentiment_score for s in signals) / len(signals), 2) if signals else 0.0
    max_imp = max((s.impact_score for s in signals), default=1)

    return {
        "ticker": t,
        "name": name,
        "sector": sec,
        "current_weight": weight,
        "average_sentiment": avg_sent,
        "max_impact": max_imp,
        "signals_count": len(signals),
        "recent_signals": [RiskSignalResponse.model_validate(s) for s in signals]
    }

@router.get("/index")
def get_index_overview(db: Session = Depends(get_db)):
    rebalancer.initialize_constituents(db)
    constituents = db.query(IndexConstituent).all()
    latest_run = db.query(RebalanceRun).order_by(desc(RebalanceRun.timestamp)).first()

    items = []
    for c in constituents:
        items.append({
            "ticker": c.ticker,
            "name": c.name,
            "sector": c.sector,
            "base_weight": c.base_weight,
            "current_weight": c.current_weight,
            "target_weight": c.target_weight,
            "previous_weight": c.previous_weight,
            "weight_change": round(c.current_weight - c.previous_weight, 4),
            "latest_sentiment": c.latest_sentiment,
            "latest_impact": c.latest_impact,
            "latest_event": c.latest_event,
            "updated_at": c.updated_at.isoformat()
        })

    return {
        "constituents": items,
        "total_weight": round(sum(c.current_weight for c in constituents), 4),
        "latest_rebalance_run": RebalanceRunResponse.model_validate(latest_run) if latest_run else None
    }

@router.get("/index/weights")
def get_index_weights(db: Session = Depends(get_db)):
    rebalancer.initialize_constituents(db)
    constituents = db.query(IndexConstituent).all()
    return [{
        "ticker": c.ticker,
        "name": c.name,
        "sector": c.sector,
        "current_weight": c.current_weight,
        "base_weight": c.base_weight
    } for c in constituents]

@router.post("/index/rebalance", response_model=RebalanceRunResponse)
def execute_rebalance(payload: Optional[RebalanceRequest] = None, db: Session = Depends(get_db)):
    p = payload or RebalanceRequest()
    run = rebalancer.rebalance(
        db=db,
        alpha=p.alpha,
        beta=p.beta,
        min_weight=p.min_weight,
        max_weight=p.max_weight,
        max_turnover=p.max_turnover,
        preview_only=p.preview_only
    )
    return RebalanceRunResponse.model_validate(run)

@router.get("/index/performance")
def get_index_performance(days: int = Query(90, ge=30, le=365)):
    return market_service.get_simulated_performance(days=days)

@router.get("/portfolio", response_model=PortfolioSummaryResponse)
def get_portfolio_summary(db: Session = Depends(get_db)):
    return PortfolioManager.get_summary(db)

@router.get("/portfolio/holdings")
def get_portfolio_holdings(
    asset_type: Optional[str] = None,
    sector: Optional[str] = None,
    country: Optional[str] = None,
    db: Session = Depends(get_db)
):
    PortfolioManager.initialize_portfolio(db)
    q = db.query(SyntheticPortfolioHolding)
    if asset_type:
        q = q.filter(SyntheticPortfolioHolding.asset_type == asset_type)
    if sector:
        q = q.filter(SyntheticPortfolioHolding.sector == sector)
    if country:
        q = q.filter(SyntheticPortfolioHolding.country == country)
    holdings = q.all()
    return [{
        "asset_id": h.asset_id,
        "transaction_id": h.transaction_id,
        "synthetic_customer_id": h.synthetic_customer_id,
        "asset_name": h.asset_name,
        "asset_type": h.asset_type,
        "sector": h.sector,
        "notional_amount": h.notional_amount,
        "market_value": h.market_value,
        "interest_rate": h.interest_rate,
        "duration": h.duration,
        "credit_rating": h.credit_rating,
        "probability_of_default": h.probability_of_default,
        "loss_given_default": h.loss_given_default,
        "country": h.country,
        "currency": h.currency,
        "is_synthetic": h.is_synthetic
    } for h in holdings]

@router.get("/stress/scenarios", response_model=List[StressScenarioDefinition])
def get_stress_scenarios():
    return PortfolioStressEngine.get_available_scenarios()

@router.post("/stress/run", response_model=StressTestResultResponse)
def run_stress_test(payload: StressRunRequest, db: Session = Depends(get_db)):
    run = PortfolioStressEngine.run_stress_test(
        db=db,
        scenario_id=payload.scenario_id,
        custom_scenario=payload.custom_scenario,
        triggering_signal_id=payload.triggering_signal_id
    )
    return StressTestResultResponse.model_validate(run)

@router.get("/stress/history", response_model=List[StressTestResultResponse])
def get_stress_test_history(db: Session = Depends(get_db)):
    runs = db.query(StressTestRun).order_by(desc(StressTestRun.timestamp)).limit(20).all()
    return [StressTestResultResponse.model_validate(r) for r in runs]

@router.get("/audit")
def get_audit_trail(db: Session = Depends(get_db)):
    events = db.query(AuditEvent).order_by(desc(AuditEvent.timestamp)).limit(50).all()
    return [{
        "audit_id": e.audit_id,
        "timestamp": e.timestamp.isoformat(),
        "action_type": e.action_type,
        "actor": e.actor,
        "details": e.details,
        "status": e.status
    } for e in events]


def _init_source_statuses(db: Session):
    sources = [
        {"id": "news_feed", "name": "Financial News Wire", "type": "financial_news", "mode": "Live / Synthetic Stream"},
        {"id": "social_feed", "name": "FinTwit Sentiment Feed", "type": "social_media", "mode": "Simulated Discourse"},
        {"id": "sample_dataset", "name": "Verified Benchmark Dataset", "type": "financial_news", "mode": "Local Offline"}
    ]
    for s in sources:
        existing = db.query(IngestionSourceStatus).filter(IngestionSourceStatus.source_id == s["id"]).first()
        if not existing:
            st = IngestionSourceStatus(
                source_id=s["id"],
                source_name=s["name"],
                source_type=s["type"],
                status="ACTIVE",
                mode=s["mode"],
                records_processed=0,
                records_rejected=0,
                last_ingestion_at=datetime.utcnow()
            )
            db.add(st)
    db.commit()
