export interface EntityInfo {
  name: string;
  ticker?: string;
  entity_type: string;
  is_primary: boolean;
  sector?: string;
}

export interface RiskSignal {
  signal_id: string;
  source_type: string;
  source_name: string;
  source_reference?: string;
  headline: string;
  text: string;
  published_at?: string;
  processed_at: string;
  entities: EntityInfo[];
  primary_ticker?: string;
  primary_company?: string;
  sentiment_score: number;
  sentiment_label: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  sentiment_method: string;
  sentiment_confidence: number;
  event_type: string;
  event_confidence: number;
  event_evidence: string[];
  impact_score: number;
  impact_level: 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Critical';
  impact_rationale: string;
  impact_method: string;
  risk_direction: 'Positive' | 'Negative' | 'Neutral' | 'Mixed';
  is_synthetic: boolean;
  data_source_label: string;
}

export interface IngestionStatusItem {
  source_id: string;
  source_name: string;
  source_type: string;
  status: string;
  mode: string;
  records_processed: number;
  records_rejected: number;
  last_ingestion_at?: string;
  error_message?: string;
}

export interface NewsIngestionResult {
  status: 'success' | 'partial_success' | 'rate_limited' | 'error';
  source: string;
  fetched_count: number;
  inserted_count: number;
  duplicate_count: number;
  failed_count: number;
  rate_limited: boolean;
  last_fetch_at: string;
  message: string;
}

export interface Constituent {
  ticker: string;
  name: string;
  sector: string;
  base_weight: number;
  current_weight: number;
  target_weight: number;
  previous_weight: number;
  weight_change?: number;
  latest_sentiment: number;
  latest_impact: number;
  latest_event: string;
  updated_at?: string;
}

export interface RebalanceAllocation {
  ticker: string;
  name: string;
  sector: string;
  prev_weight: number;
  proposed_weight: number;
  executed_weight: number;
  weight_change: number;
  sentiment: number;
  impact: number;
  event: string;
  reason: string;
}

export interface RebalanceRun {
  run_id: string;
  timestamp: string;
  turnover: number;
  num_constituents: number;
  trigger_reason: string;
  allocations: RebalanceAllocation[];
  parameters: {
    alpha: number;
    beta: number;
    min_weight: number;
    max_weight: number;
    max_turnover: number;
    confidence_threshold: number;
  };
  risk_alerts: string[];
}

export interface StressScenarioDefinition {
  scenario_id: string;
  name: string;
  description: string;
  category: string;
  equity_shock: number;
  credit_spread_widening_bps: number;
  rate_shock_bps: number;
  pd_multiplier: number;
  lgd_shock: number;
  vulnerable_sectors: string[];
  vulnerable_countries: string[];
}

export interface StressTestResult {
  run_id: string;
  scenario_id: string;
  scenario_name: string;
  timestamp: string;
  triggered_by_signal_id?: string;
  trigger_event?: string;
  trigger_impact?: number;
  portfolio_value_before: number;
  portfolio_value_after: number;
  absolute_loss: number;
  percentage_loss: number;
  ecl_before: number;
  ecl_after: number;
  loss_by_asset_class: Record<string, number>;
  loss_by_sector: Record<string, number>;
  loss_by_country: Record<string, number>;
  major_drivers: string[];
  parameters: Record<string, any>;
}

export interface PortfolioSummary {
  total_value: number;
  total_holdings_count: number;
  asset_allocation: Record<string, number>;
  sector_concentration: Record<string, number>;
  country_concentration: Record<string, number>;
  total_expected_credit_loss: number;
  weighted_duration: number;
  weighted_probability_of_default: number;
  is_synthetic: boolean;
}

export interface Holding {
  asset_id: string;
  transaction_id: string;
  synthetic_customer_id: string;
  asset_name: string;
  asset_type: string;
  sector: string;
  notional_amount: number;
  market_value: number;
  interest_rate: number;
  duration: number;
  credit_rating: string;
  probability_of_default: number;
  loss_given_default: number;
  country: string;
  currency: string;
  is_synthetic: boolean;
}

export interface DashboardSummary {
  total_signals: number;
  negative_signals_count: number;
  high_impact_events_count: number;
  average_market_sentiment: number;
  elevated_risk_companies: {
    ticker: string;
    name: string;
    sector: string;
    sentiment: number;
    impact: number;
    event: string;
    weight: number;
  }[];
  latest_significant_events: {
    signal_id: string;
    headline: string;
    primary_ticker?: string;
    event_type: string;
    impact_score: number;
    sentiment_score: number;
    published_at?: string;
  }[];
  data_source_health: IngestionStatusItem[];
  sentiment_distribution: Record<string, number>;
  event_distribution: Record<string, number>;
  impact_distribution: Record<string, number>;
  current_index_allocation: {
    ticker: string;
    name: string;
    sector: string;
    weight: number;
    base_weight: number;
    sentiment: number;
    impact: number;
  }[];
  latest_stress_test?: StressTestResult;
}

export interface AuditEvent {
  audit_id: string;
  timestamp: string;
  action_type: string;
  actor: string;
  details: Record<string, any>;
  status: string;
}

export interface MarketPerformance {
  series: {
    date: string;
    tactical_index: number;
    benchmark_equal_weight: number;
    alpha_spread: number;
  }[];
  metrics: {
    tactical: {
      cumulative_return_pct: number;
      annualized_return_pct: number;
      annualized_volatility_pct: number;
      sharpe_ratio: number;
      max_drawdown_pct: number;
      turnover_annualized_pct: number;
      rebalances_count: number;
    };
    benchmark: {
      cumulative_return_pct: number;
      annualized_return_pct: number;
      annualized_volatility_pct: number;
      sharpe_ratio: number;
      max_drawdown_pct: number;
      turnover_annualized_pct: number;
      rebalances_count: number;
    };
  };
  is_simulated: boolean;
  disclaimer: string;
}

export interface CompanyBasketItem {
  ticker: string;
  name: string;
  sector: string;
}

export interface CompanyRiskDetail {
  ticker: string;
  name: string;
  sector: string;
  current_weight: number;
  average_sentiment: number;
  max_impact: number;
  signals_count: number;
  recent_signals: RiskSignal[];
}

export interface CompaniesResponse {
  basket: CompanyBasketItem[];
  event_categories: string[];
}
