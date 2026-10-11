import {
  DashboardSummary,
  RiskSignal,
  Constituent,
  RebalanceRun,
  StressScenarioDefinition,
  StressTestResult,
  PortfolioSummary,
  Holding,
  IngestionStatusItem,
  AuditEvent,
  MarketPerformance,
  CompaniesResponse,
  CompanyRiskDetail,
  NewsIngestionResult
} from '../types';

const API_BASE = '/api';

export const api = {
  // System Health
  async getHealth() {
    const res = await fetch(`${API_BASE}/health`);
    if (!res.ok) throw new Error('Failed to fetch system health');
    return res.json();
  },

  // Dashboard Overview
  async getDashboardSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE}/dashboard/summary`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    return res.json();
  },

  // Signals Feed
  async getSignals(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    ticker?: string;
    sourceType?: string;
    eventType?: string;
    sentimentLabel?: string;
    minImpact?: number;
  } = {}): Promise<{ total: number; page: number; pageSize: number; totalPages: number; items: RiskSignal[] }> {
    const q = new URLSearchParams();
    if (params.page) q.set('page', params.page.toString());
    if (params.pageSize) q.set('page_size', params.pageSize.toString());
    if (params.search) q.set('search', params.search);
    if (params.ticker) q.set('ticker', params.ticker);
    if (params.sourceType) q.set('source_type', params.sourceType);
    if (params.eventType) q.set('event_type', params.eventType);
    if (params.sentimentLabel) q.set('sentiment_label', params.sentimentLabel);
    if (params.minImpact) q.set('min_impact', params.minImpact.toString());

    const res = await fetch(`${API_BASE}/signals?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch signals');
    return res.json();
  },

  async getSignalById(signalId: string): Promise<RiskSignal> {
    const res = await fetch(`${API_BASE}/signals/${signalId}`);
    if (!res.ok) throw new Error('Failed to fetch signal details');
    return res.json();
  },

  // Interactive Analysis
  async analyzeText(payload: {
    text: string;
    headline?: string;
    source_type?: string;
    source_name?: string;
    ticker?: string;
  }): Promise<RiskSignal> {
    const res = await fetch(`${API_BASE}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to analyze text');
    return res.json();
  },

  // Ingestion Operations
  async refreshNews(count = 10): Promise<NewsIngestionResult> {
    const res = await fetch(`${API_BASE}/ingestion/news/refresh?count=${count}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to refresh news feed');
    return res.json();
  },

  async refreshSocial(count = 15): Promise<NewsIngestionResult> {
    const res = await fetch(`${API_BASE}/ingestion/social/refresh?count=${count}`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to refresh social feed');
    return res.json();
  },

  async loadSampleData() {
    const res = await fetch(`${API_BASE}/ingestion/sample/load`, { method: 'POST' });
    if (!res.ok) throw new Error('Failed to load sample dataset');
    return res.json();
  },

  async getIngestionStatus(): Promise<IngestionStatusItem[]> {
    const res = await fetch(`${API_BASE}/ingestion/status`);
    if (!res.ok) throw new Error('Failed to fetch ingestion status');
    return res.json();
  },

  // Module A: Tactical Index Rebalancing
  async getIndex(): Promise<{ constituents: Constituent[]; total_weight: number; latest_rebalance_run?: RebalanceRun }> {
    const res = await fetch(`${API_BASE}/index`);
    if (!res.ok) throw new Error('Failed to fetch index overview');
    return res.json();
  },

  async executeRebalance(params?: {
    alpha?: number;
    beta?: number;
    min_weight?: number;
    max_weight?: number;
    max_turnover?: number;
    preview_only?: boolean;
  }): Promise<RebalanceRun> {
    const res = await fetch(`${API_BASE}/index/rebalance`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params || {})
    });
    if (!res.ok) throw new Error('Failed to execute rebalance');
    return res.json();
  },

  async getPerformance(days = 90): Promise<MarketPerformance> {
    const res = await fetch(`${API_BASE}/index/performance?days=${days}`);
    if (!res.ok) throw new Error('Failed to fetch performance simulation');
    return res.json();
  },

  // Module B: Portfolio Stress Testing
  async getPortfolio(): Promise<PortfolioSummary> {
    const res = await fetch(`${API_BASE}/portfolio`);
    if (!res.ok) throw new Error('Failed to fetch portfolio summary');
    return res.json();
  },

  async getHoldings(params?: { asset_type?: string; sector?: string; country?: string }): Promise<Holding[]> {
    const q = new URLSearchParams();
    if (params?.asset_type) q.set('asset_type', params.asset_type);
    if (params?.sector) q.set('sector', params.sector);
    if (params?.country) q.set('country', params.country);

    const res = await fetch(`${API_BASE}/portfolio/holdings?${q.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch holdings');
    return res.json();
  },

  async getStressScenarios(): Promise<StressScenarioDefinition[]> {
    const res = await fetch(`${API_BASE}/stress/scenarios`);
    if (!res.ok) throw new Error('Failed to fetch stress scenarios');
    return res.json();
  },

  async runStressTest(payload: {
    scenario_id?: string;
    custom_scenario?: StressScenarioDefinition;
    triggering_signal_id?: string;
  }): Promise<StressTestResult> {
    const res = await fetch(`${API_BASE}/stress/run`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Failed to run stress test');
    return res.json();
  },

  async getStressHistory(): Promise<StressTestResult[]> {
    const res = await fetch(`${API_BASE}/stress/history`);
    if (!res.ok) throw new Error('Failed to fetch stress test history');
    return res.json();
  },

  // Audit
  async getAuditTrail(): Promise<AuditEvent[]> {
    const res = await fetch(`${API_BASE}/audit`);
    if (!res.ok) throw new Error('Failed to fetch audit trail');
    return res.json();
  },

  // Company Risk Profiles
  async getCompanies(): Promise<CompaniesResponse> {
    const res = await fetch(`${API_BASE}/companies`);
    if (!res.ok) throw new Error('Failed to fetch companies');
    return res.json();
  },

  async getCompanyRisk(ticker: string): Promise<CompanyRiskDetail> {
    const res = await fetch(`${API_BASE}/companies/${ticker}/risk`);
    if (!res.ok) throw new Error(`Failed to fetch company risk for ${ticker}`);
    return res.json();
  }
};
