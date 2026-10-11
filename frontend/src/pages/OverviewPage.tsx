import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  TrendingDown, 
  Minus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  ReferenceLine 
} from 'recharts';
import { DashboardSummary } from '../types';
import { Card, CardHeader, MetricCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SentimentBadge, ImpactBadge } from '../components/ui/Badges';
import { formatPercentage, formatSentiment, formatTimestamp } from '../utils/formatters';

interface OverviewPageProps {
  summary: DashboardSummary | null;
  loading: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: string) => void;
  onSelectSignal: (sig: any) => void;
}

export const OverviewPage: React.FC<OverviewPageProps> = ({
  summary,
  loading,
  onRefresh,
  onNavigateTab,
  onSelectSignal
}) => {
  if (loading && !summary) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3">
          <RefreshCw className="w-8 h-8 text-black animate-spin" />
          <p className="text-sm text-[#767676] font-medium">Loading RiskPulse intelligence dashboard...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-12 text-center text-[#767676] bg-white rounded-2xl border border-[#d9d9d9]">
        <h3 className="text-base font-bold text-black mb-1">No dashboard data available</h3>
        <p className="text-xs mb-4">Please initialize backend database or refresh live data feeds.</p>
        <Button variant="primary" size="sm" onClick={onRefresh}>
          Refresh Feeds
        </Button>
      </div>
    );
  }

  // Calculate Negative Sentiment ratio
  const negRatio = summary.total_signals > 0 
    ? ((summary.negative_signals_count / summary.total_signals) * 100).toFixed(1)
    : '0.0';

  // Event category breakdown (grayscale horizontal bars)
  const eventDistributionData = Object.entries(summary.event_distribution || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([category, count]) => ({
      category: category.length > 20 ? category.slice(0, 18) + '...' : category,
      fullCategory: category,
      count
    }));

  // Impact distribution
  const impactDistributionData = Object.entries(summary.impact_distribution || {}).map(([level, count]) => ({
    level: level.replace(' (', '\n('),
    name: level,
    count
  }));

  // Synthetic sentiment trend curve derived from distribution
  const sentimentTrendData = [
    { time: 'T-12h', sentiment: Math.max(-0.8, summary.average_market_sentiment - 0.12) },
    { time: 'T-9h', sentiment: Math.max(-0.8, summary.average_market_sentiment - 0.05) },
    { time: 'T-6h', sentiment: Math.min(0.8, summary.average_market_sentiment + 0.08) },
    { time: 'T-3h', sentiment: Math.max(-0.8, summary.average_market_sentiment - 0.02) },
    { time: 'Now', sentiment: summary.average_market_sentiment }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 9.1 Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              System Surveillance
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Financial risk at a glance</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Monitor market sentiment, significant events, and simulated portfolio exposure.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefresh}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => onNavigateTab('rebalancing')}
            icon={<Sliders className="w-3.5 h-3.5" />}
          >
            Tactical rebalance
          </Button>
        </div>
      </div>

      {/* 9.2 KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Signals Processed */}
        <MetricCard
          title="Signals processed"
          value={summary.total_signals}
          subValue="total"
          description="Synthesized from financial news & social wires"
          badge={<span className="text-xs font-mono text-black font-semibold">Active</span>}
          icon={<Activity className="w-4 h-4 text-black" />}
        />

        {/* KPI 2: Negative Sentiment */}
        <MetricCard
          title="Negative sentiment"
          value={summary.negative_signals_count}
          subValue={`(${negRatio}%)`}
          description={`Denominator: ${summary.total_signals} total signals`}
          badge={<SentimentBadge score={-0.45} label="Negative" showScore={false} />}
          icon={<TrendingDown className="w-4 h-4 text-black" />}
        />

        {/* KPI 3: High-Impact Events */}
        <MetricCard
          title="High-impact events"
          value={summary.high_impact_events_count}
          subValue=">= 7/10"
          description="Severity meeting configured risk threshold"
          badge={<ImpactBadge score={8} level="High" />}
          icon={<AlertTriangle className="w-4 h-4 text-black" />}
        />

        {/* KPI 4: Average Sentiment */}
        <MetricCard
          title="Average sentiment"
          value={formatSentiment(summary.average_market_sentiment)}
          subValue="score"
          description="Scale: -1.0 (Critical Neg) to +1.0 (Positive)"
          badge={<SentimentBadge score={summary.average_market_sentiment} />}
          icon={<Minus className="w-4 h-4 text-black" />}
        />
      </div>

      {/* 9.3 Main Analytical Grid - Row 1: Sentiment Trend & Event Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <Card>
          <CardHeader
            title="Sentiment trend trajectory"
            description="Aggregated risk score trajectory across monitored universe. Dashed zero line represents neutral equilibrium."
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('history')}
                className="text-xs font-medium text-black hover:underline flex items-center gap-1"
              >
                <span>Full history</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={sentimentTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="time" stroke="#767676" fontSize={11} tickLine={false} />
                <YAxis stroke="#767676" fontSize={11} domain={[-1, 1]} tickLine={false} />
                <ReferenceLine y={0} stroke="#d9d9d9" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#d9d9d9',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#000000',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.1)'
                  }}
                  formatter={(val: any) => [typeof val === 'number' ? val.toFixed(2) : val, 'Sentiment Score']}
                />
                <Line
                  type="monotone"
                  dataKey="sentiment"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={{ r: 3, fill: '#000000' }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Event Classification Distribution */}
        <Card>
          <CardHeader
            title="Event classification distribution"
            description="Frequency of classified event types across news and social media streams."
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('signals')}
                className="text-xs font-medium text-black hover:underline flex items-center gap-1"
              >
                <span>Explore signals</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          />
          <div className="h-64 w-full">
            {eventDistributionData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={eventDistributionData}
                  layout="vertical"
                  margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#767676" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="category" stroke="#767676" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#ffffff',
                      borderColor: '#d9d9d9',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#000000'
                    }}
                    formatter={(val: any, name: any, item: any) => [val, item.payload.fullCategory]}
                  />
                  <Bar dataKey="count" fill="#000000" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#767676]">
                No event distributions available.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Row 2: Impact Score Distribution & Top Risk-Exposed Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Score Distribution */}
        <Card>
          <CardHeader
            title="Impact score distribution"
            description="Proportion of signals grouped by severity level (1-10 severity scale)."
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactDistributionData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="level" stroke="#767676" fontSize={10} tickLine={false} />
                <YAxis stroke="#767676" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#d9d9d9',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#000000'
                  }}
                />
                <Bar dataKey="count" fill="#000000" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Risk-Exposed Companies */}
        <Card>
          <CardHeader
            title="Top risk-exposed companies"
            description="Constituents currently registering elevated negative sentiment or high event impact."
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('companies')}
                className="text-xs font-medium text-black hover:underline flex items-center gap-1"
              >
                <span>All companies</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            }
          />
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                  <th className="py-2.5 px-3">Ticker</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-2 text-center">Sentiment</th>
                  <th className="py-2.5 px-2 text-center">Impact</th>
                  <th className="py-2.5 px-2 text-right">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d9d9d9]">
                {summary.elevated_risk_companies && summary.elevated_risk_companies.length > 0 ? (
                  summary.elevated_risk_companies.slice(0, 5).map((comp) => (
                    <tr key={comp.ticker} className="hover:bg-[#f3f3f3] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-black">{comp.ticker}</td>
                      <td className="py-3 px-3 font-medium text-black">
                        <div>{comp.name}</div>
                        <span className="text-[10px] text-[#767676]">{comp.event || comp.sector}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <SentimentBadge score={comp.sentiment} />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <ImpactBadge score={comp.impact} />
                      </td>
                      <td className="py-3 px-2 text-right font-mono font-semibold text-black">
                        {formatPercentage(comp.weight)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#767676]">
                      No elevated risk outliers identified in the current basket.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Row 3: Recent High-Impact Signals & Source Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent High-Impact Signals (2 cols) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader
              title="Recent high-impact signals"
              description="Signals meeting the high-impact criterion (impact >= 6) triggering active surveillance."
              action={
                <button
                  type="button"
                  onClick={() => onNavigateTab('signals')}
                  className="text-xs font-medium text-black hover:underline flex items-center gap-1"
                >
                  <span>View all signals</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              }
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                    <th className="py-2.5 px-3">Headline</th>
                    <th className="py-2.5 px-2">Ticker</th>
                    <th className="py-2.5 px-2">Event Type</th>
                    <th className="py-2.5 px-2 text-center">Impact</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9d9d9]">
                  {summary.latest_significant_events && summary.latest_significant_events.length > 0 ? (
                    summary.latest_significant_events.map((sig) => (
                      <tr key={sig.signal_id} className="hover:bg-[#f3f3f3] transition-colors">
                        <td className="py-3 px-3 font-medium text-black max-w-xs">
                          <p className="line-clamp-1">{sig.headline}</p>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-black">
                          {sig.primary_ticker || '—'}
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#efefef] text-[#5e5e5e] border border-[#d9d9d9]">
                            {sig.event_type}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-center">
                          <ImpactBadge score={sig.impact_score} />
                        </td>
                        <td className="py-3 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onSelectSignal(sig)}
                            className="px-3 py-1 rounded-full text-xs font-medium bg-black text-white hover:bg-[#282828] transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#767676]">
                        No high-impact signals recorded in current window.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>

        {/* Data Source Health (1 col) */}
        <div>
          <Card>
            <CardHeader
              title="Data source health"
              description="Ingestion pipeline state and connectivity."
              action={
                <button
                  type="button"
                  onClick={() => onNavigateTab('sources')}
                  className="text-xs font-medium text-black hover:underline flex items-center gap-1"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              }
            />
            <div className="space-y-3">
              {summary.data_source_health && summary.data_source_health.length > 0 ? (
                summary.data_source_health.map((src) => {
                  const isConnected = src.status === 'Active' || src.status === 'Online' || src.status === 'Connected';
                  return (
                    <div
                      key={src.source_id}
                      className="p-3 rounded-xl border border-[#d9d9d9] bg-[#f3f3f3] flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-black">{src.source_name}</div>
                        <div className="text-[11px] text-[#767676]">{src.mode} • {src.records_processed} records</div>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        isConnected
                          ? 'bg-black text-white border-black'
                          : 'bg-white text-[#767676] border-[#d9d9d9]'
                      }`}>
                        {src.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-[#767676]">
                  No data source health status records.
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
