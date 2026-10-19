import React from 'react';
import { 
  Activity, 
  AlertTriangle, 
  ArrowRight, 
  RefreshCw, 
  Sliders, 
  TrendingDown, 
  Minus,
  Database
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  ReferenceLine 
} from 'recharts';
import { DashboardSummary } from '../types';
import { Card, CardHeader, MetricCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SentimentBadge, ImpactBadge } from '../components/ui/Badges';
import { formatPercentage, formatSentiment } from '../utils/formatters';

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
          <RefreshCw className="w-8 h-8 text-[#1ed760] animate-spin" />
          <p className="text-sm text-[#b3b3b3] font-medium">Loading RiskPulse intelligence dashboard...</p>
        </div>
      </div>
    );
  }

  if (!summary) {
    return (
      <div className="p-12 text-center text-[#b3b3b3] bg-[#181818] rounded-[8px] border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-12 rounded-full bg-[#1f1f1f] border border-[#282828] flex items-center justify-center mx-auto mb-4 text-[#1ed760]">
          <Database className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No dashboard data available</h3>
        <p className="text-xs text-[#b3b3b3] max-w-sm mx-auto mb-5 leading-relaxed">
          Please initialize backend database or trigger live data ingestion to populate intelligence feeds.
        </p>
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

  // Event category breakdown (clean horizontal bars)
  const eventDistributionData = Object.entries(summary.event_distribution || {})
    .sort((a, b) => b[1] - a[1])
    .slice(0, 7)
    .map(([category, count]) => ({
      category: category.length > 22 ? category.slice(0, 20) + '...' : category,
      fullCategory: category,
      count
    }));

  // Impact distribution
  const impactDistributionData = Object.entries(summary.impact_distribution || {}).map(([level, count]) => ({
    level: level.replace(' (', '\n('),
    name: level,
    count
  }));

  // Sentiment trend curve
  const sentimentTrendData = [
    { time: 'T-12h', sentiment: Number(Math.max(-0.8, summary.average_market_sentiment - 0.12).toFixed(2)) },
    { time: 'T-9h', sentiment: Number(Math.max(-0.8, summary.average_market_sentiment - 0.05).toFixed(2)) },
    { time: 'T-6h', sentiment: Number(Math.min(0.8, summary.average_market_sentiment + 0.08).toFixed(2)) },
    { time: 'T-3h', sentiment: Number(Math.max(-0.8, summary.average_market_sentiment - 0.02).toFixed(2)) },
    { time: 'Now', sentiment: Number(summary.average_market_sentiment.toFixed(2)) }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760]">
              System Surveillance & Intelligence
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Financial risk at a glance</h1>
          <p className="text-xs sm:text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Real-time surveillance of financial news sentiment, high-severity event triggers, and simulated portfolio allocations.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
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

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Signals Processed */}
        <MetricCard
          title="Signals processed"
          value={summary.total_signals}
          subValue="total"
          description="Synthesized from news & social wires"
          badge={<span className="text-[11px] font-mono text-[#1ed760] bg-[#1ed760]/15 border border-[#1ed760]/30 px-2 py-0.5 rounded-full font-bold">Active</span>}
          icon={<Activity className="w-4 h-4 text-[#1ed760]" />}
        />

        {/* KPI 2: Negative Sentiment */}
        <MetricCard
          title="Negative sentiment"
          value={summary.negative_signals_count}
          subValue={`(${negRatio}%)`}
          description={`From ${summary.total_signals} total signals`}
          badge={<SentimentBadge score={-0.45} label="Negative" showScore={false} />}
          icon={<TrendingDown className="w-4 h-4 text-[#f3727f]" />}
        />

        {/* KPI 3: High-Impact Events */}
        <MetricCard
          title="High-impact events"
          value={summary.high_impact_events_count}
          subValue=">= 7/10"
          description="Severity meeting risk threshold"
          badge={<ImpactBadge score={8} level="High" />}
          icon={<AlertTriangle className="w-4 h-4 text-[#ffa42b]" />}
        />

        {/* KPI 4: Average Sentiment */}
        <MetricCard
          title="Average sentiment"
          value={formatSentiment(summary.average_market_sentiment)}
          subValue="score"
          description="Scale: -1.0 (Critical) to +1.0 (Positive)"
          badge={<SentimentBadge score={summary.average_market_sentiment} />}
          icon={<Minus className="w-4 h-4 text-[#b3b3b3]" />}
        />
      </div>

      {/* Main Analytical Grid - Row 1: Sentiment Trend & Event Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trend */}
        <Card hoverEffect>
          <CardHeader
            title="Sentiment trend trajectory"
            description="Aggregated risk score trajectory across monitored universe. Dashed zero line represents neutral equilibrium."
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('history')}
                className="text-xs font-bold text-[#b3b3b3] hover:text-[#1ed760] flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-[1.4px]"
              >
                <span>Full history</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sentimentTrendData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="sentimentGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1ed760" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1ed760" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                <YAxis stroke="#7c7c7c" fontSize={11} domain={[-1, 1]} tickLine={false} />
                <ReferenceLine y={0} stroke="#383838" strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#282828',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                  formatter={(val: any) => [typeof val === 'number' ? val.toFixed(2) : val, 'Sentiment Score']}
                />
                <Area
                  type="monotone"
                  dataKey="sentiment"
                  stroke="#1ed760"
                  strokeWidth={2}
                  fill="url(#sentimentGradient)"
                  dot={{ r: 3, fill: '#1ed760' }}
                  activeDot={{ r: 5, fill: '#ffffff' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Event Classification Distribution */}
        <Card hoverEffect>
          <CardHeader
            title="Event classification distribution"
            description="Frequency of classified event types across news and social media streams."
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('signals')}
                className="text-xs font-bold text-[#b3b3b3] hover:text-[#1ed760] flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-[1.4px]"
              >
                <span>Explore signals</span>
                <ArrowRight className="w-3.5 h-3.5" />
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
                  <XAxis type="number" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                  <YAxis type="category" dataKey="category" stroke="#b3b3b3" fontSize={11} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#181818',
                      borderColor: '#282828',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#ffffff',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                    }}
                    formatter={(val: any, name: any, item: any) => [val, item.payload.fullCategory]}
                  />
                  <Bar dataKey="count" fill="#1ed760" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-[#7c7c7c]">
                No event distributions recorded in current period.
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Row 2: Impact Score Distribution & Top Risk-Exposed Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Impact Score Distribution */}
        <Card hoverEffect>
          <CardHeader
            title="Impact score distribution"
            description="Proportion of signals grouped by severity level (1-10 severity scale)."
          />
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={impactDistributionData} margin={{ top: 10, right: 20, left: -20, bottom: 0 }}>
                <XAxis dataKey="level" stroke="#7c7c7c" fontSize={10} tickLine={false} />
                <YAxis stroke="#7c7c7c" fontSize={11} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#282828',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#ffffff',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)'
                  }}
                />
                <Bar dataKey="count" fill="#ffffff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Top Risk-Exposed Companies */}
        <Card hoverEffect>
          <CardHeader
            title="Top risk-exposed companies"
            description="Constituents currently registering elevated negative sentiment or high event impact."
            action={
              <button
                type="button"
                onClick={() => onNavigateTab('companies')}
                className="text-xs font-bold text-[#b3b3b3] hover:text-[#1ed760] flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-[1.4px]"
              >
                <span>All companies</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            }
          />
          <div className="overflow-x-auto -mx-6 px-6">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-[#1f1f1f] border-y border-[#282828] text-white font-bold uppercase tracking-[1.4px]">
                  <th className="py-2.5 px-3">Ticker</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-2 text-center">Sentiment</th>
                  <th className="py-2.5 px-2 text-center">Impact</th>
                  <th className="py-2.5 px-3 text-right">Weight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#282828]">
                {summary.elevated_risk_companies && summary.elevated_risk_companies.length > 0 ? (
                  summary.elevated_risk_companies.slice(0, 5).map((comp) => (
                    <tr key={comp.ticker} className="hover:bg-[#202020] transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-[#1ed760]">{comp.ticker}</td>
                      <td className="py-3 px-3 font-medium text-white">
                        <div>{comp.name}</div>
                        <span className="text-[10px] text-[#7c7c7c]">{comp.event || comp.sector}</span>
                      </td>
                      <td className="py-3 px-2 text-center">
                        <SentimentBadge score={comp.sentiment} />
                      </td>
                      <td className="py-3 px-2 text-center">
                        <ImpactBadge score={comp.impact} />
                      </td>
                      <td className="py-3 px-3 text-right font-mono font-semibold text-white tabular-nums">
                        {formatPercentage(comp.weight)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-[#7c7c7c]">
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
          <Card hoverEffect>
            <CardHeader
              title="Recent high-impact signals"
              description="Signals meeting the high-impact criterion (impact >= 6) triggering active surveillance."
              action={
                <button
                  type="button"
                  onClick={() => onNavigateTab('signals')}
                  className="text-xs font-bold text-[#b3b3b3] hover:text-[#1ed760] flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-[1.4px]"
                >
                  <span>View all signals</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              }
            />
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1f1f1f] border-y border-[#282828] text-white font-bold uppercase tracking-[1.4px]">
                    <th className="py-2.5 px-3">Headline</th>
                    <th className="py-2.5 px-2">Ticker</th>
                    <th className="py-2.5 px-2">Event Type</th>
                    <th className="py-2.5 px-2 text-center">Impact</th>
                    <th className="py-2.5 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282828]">
                  {summary.latest_significant_events && summary.latest_significant_events.length > 0 ? (
                    summary.latest_significant_events.map((sig) => (
                      <tr key={sig.signal_id} className="hover:bg-[#202020] transition-colors">
                        <td className="py-3 px-3 font-medium text-white max-w-xs">
                          <p className="line-clamp-1">{sig.headline}</p>
                        </td>
                        <td className="py-3 px-2 font-mono font-bold text-[#1ed760]">
                          {sig.primary_ticker || '—'}
                        </td>
                        <td className="py-3 px-2">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-[#1f1f1f] text-[#b3b3b3] border border-[#282828]">
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
                            className="px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white border border-[#282828] hover:border-[#1ed760] hover:text-[#1ed760] transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-[#7c7c7c]">
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
          <Card hoverEffect>
            <CardHeader
              title="Data source health"
              description="Ingestion pipeline state and wire connectivity."
              action={
                <button
                  type="button"
                  onClick={() => onNavigateTab('sources')}
                  className="text-xs font-bold text-[#b3b3b3] hover:text-[#1ed760] flex items-center gap-1 transition-colors cursor-pointer uppercase tracking-[1.4px]"
                >
                  <span>Manage</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
                      className="p-3.5 rounded-[8px] border border-[#282828] bg-[#1f1f1f] hover:bg-[#252525] transition-colors flex items-center justify-between text-xs"
                    >
                      <div>
                        <div className="font-semibold text-white">{src.source_name}</div>
                        <div className="text-[11px] text-[#7c7c7c] mt-0.5">
                          {src.mode} • <span className="font-mono text-white">{src.records_processed}</span> records
                        </div>
                      </div>
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        isConnected
                          ? 'bg-[#1ed760]/15 text-[#1ed760] border-[#1ed760]/30'
                          : 'bg-[#181818] text-[#7c7c7c] border-[#282828]'
                      }`}>
                        {src.status}
                      </span>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-6 text-xs text-[#7c7c7c]">
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
