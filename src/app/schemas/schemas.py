from typing import List, Optional, Dict, Any
from datetime import datetime
from pydantic import BaseModel, Field

class EntityInfo(BaseModel):
    name: str
    ticker: Optional[str] = None
    entity_type: str = "company"  # company, country, sector, market
    is_primary: bool = False
    sector: Optional[str] = None

class RiskSignalBase(BaseModel):
    signal_id: str
    source_type: str
    source_name: str
    source_reference: Optional[str] = None
    headline: str
    text: str
    published_at: Optional[datetime] = None
    processed_at: datetime
    entities: List[EntityInfo] = []
    primary_ticker: Optional[str] = None
    primary_company: Optional[str] = None
    sentiment_score: float = Field(..., ge=-1.0, le=1.0)
    sentiment_label: str
    sentiment_method: str
    sentiment_confidence: float = Field(..., ge=0.0, le=1.0)
    event_type: str
    event_confidence: float = Field(..., ge=0.0, le=1.0)
    event_evidence: List[str] = []
    impact_score: int = Field(..., ge=1, le=10)
    impact_level: str
    impact_rationale: str
    impact_method: str
    risk_direction: str
    is_synthetic: bool = True
    data_source_label: str

class RiskSignalResponse(RiskSignalBase):
    class Config:
        from_attributes = True

class AnalyzeRequest(BaseModel):
    text: str = Field(..., min_length=3, max_length=10000)
    headline: Optional[str] = None
    source_type: str = "financial_news"  # financial_news or social_media
    source_name: Optional[str] = "Interactive User Input"
    ticker: Optional[str] = None
    is_synthetic: bool = True

class IngestionRefreshRequest(BaseModel):
    source_type: str  # news, social, sample
    count: Optional[int] = 10

class IngestionStatusItem(BaseModel):
    source_id: str
    source_name: str
    source_type: str
    status: str
    mode: str
    records_processed: int
    records_rejected: int
    last_ingestion_at: Optional[datetime] = None
    error_message: Optional[str] = None

    class Config:
        from_attributes = True

class ConstituentWeight(BaseModel):
    ticker: str
    name: str
    sector: str
    base_weight: float
    current_weight: float
    target_weight: float
    previous_weight: float
    latest_sentiment: float
    latest_impact: int
    latest_event: str
    weight_change: float = 0.0

class RebalanceRequest(BaseModel):
    alpha: Optional[float] = None
    beta: Optional[float] = None
    min_weight: Optional[float] = None
    max_weight: Optional[float] = None
    max_turnover: Optional[float] = None
    confidence_threshold: Optional[float] = None
    preview_only: bool = False

class NewsIngestionResponse(BaseModel):
    status: str
    source: str
    fetched_count: int
    inserted_count: int
    duplicate_count: int
    failed_count: int = 0
    rate_limited: bool = False
    last_fetch_at: str
    message: str


class RebalanceRunResponse(BaseModel):
    run_id: str
    timestamp: datetime
    turnover: float
    num_constituents: int
    trigger_reason: str
    allocations: List[Dict[str, Any]]
    parameters: Dict[str, Any]
    risk_alerts: List[str]

    class Config:
        from_attributes = True

class StressScenarioDefinition(BaseModel):
    scenario_id: str
    name: str
    description: str
    category: str
    equity_shock: float = 0.0           # e.g., -0.15 for -15%
    credit_spread_widening_bps: float = 0.0 # e.g. 150 bps
    rate_shock_bps: float = 0.0         # e.g. 100 bps
    pd_multiplier: float = 1.0          # e.g. 1.5x
    lgd_shock: float = 0.0              # e.g. +0.10
    vulnerable_sectors: List[str] = []
    vulnerable_countries: List[str] = []

class StressRunRequest(BaseModel):
    scenario_id: Optional[str] = None
    custom_scenario: Optional[StressScenarioDefinition] = None
    triggering_signal_id: Optional[str] = None

class StressTestResultResponse(BaseModel):
    run_id: str
    scenario_id: str
    scenario_name: str
    timestamp: datetime
    triggered_by_signal_id: Optional[str] = None
    trigger_event: Optional[str] = None
    trigger_impact: Optional[int] = None
    portfolio_value_before: float
    portfolio_value_after: float
    absolute_loss: float
    percentage_loss: float
    ecl_before: float
    ecl_after: float
    loss_by_asset_class: Dict[str, float]
    loss_by_sector: Dict[str, float]
    loss_by_country: Dict[str, float]
    major_drivers: List[str]
    parameters: Dict[str, Any]

    class Config:
        from_attributes = True

class DashboardSummaryResponse(BaseModel):
    total_signals: int
    negative_signals_count: int
    high_impact_events_count: int
    average_market_sentiment: float
    elevated_risk_companies: List[Dict[str, Any]]
    latest_significant_events: List[Dict[str, Any]]
    data_source_health: List[IngestionStatusItem]
    sentiment_distribution: Dict[str, int]
    event_distribution: Dict[str, int]
    impact_distribution: Dict[str, int]
    current_index_allocation: List[Dict[str, Any]]
    latest_stress_test: Optional[StressTestResultResponse] = None

class PortfolioSummaryResponse(BaseModel):
    total_value: float
    total_holdings_count: int
    asset_allocation: Dict[str, float]
    sector_concentration: Dict[str, float]
    country_concentration: Dict[str, float]
    total_expected_credit_loss: float
    weighted_duration: float
    weighted_probability_of_default: float
    is_synthetic: bool = True
