import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RefreshCw
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  BarChart, 
  Bar
} from 'recharts';
import { api } from '../services/api';
import { CompanyBasketItem, CompanyRiskDetail, RiskSignal } from '../types';
import { Card, CardHeader, MetricCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SentimentBadge, ImpactBadge } from '../components/ui/Badges';
import { SearchInput } from '../components/ui/Inputs';
import { formatPercentage, formatSentiment, formatTimestamp } from '../utils/formatters';

interface CompanyRiskPageProps {
  initialTicker?: string;
  onSelectSignal: (signal: RiskSignal) => void;
}

export const CompanyRiskPage: React.FC<CompanyRiskPageProps> = ({
  initialTicker,
  onSelectSignal
}) => {
  const [basket, setBasket] = useState<CompanyBasketItem[]>([]);
  const [selectedTicker, setSelectedTicker] = useState<string | null>(initialTicker || null);
  const [companyRisk, setCompanyRisk] = useState<CompanyRiskDetail | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sectorFilter, setSectorFilter] = useState('All');

  // Load constituent companies universe
  useEffect(() => {
    const fetchBasket = async () => {
      setLoadingList(true);
      try {
        const res = await api.getCompanies();
        setBasket(res.basket || []);
      } catch (err) {
        console.error('Failed to load company basket:', err);
      } finally {
        setLoadingList(false);
      }
    };
    fetchBasket();
  }, []);

  // Load company risk details when ticker changes
  useEffect(() => {
    if (!selectedTicker) {
      setCompanyRisk(null);
      return;
    }

    const fetchDetail = async () => {
      setLoadingDetail(true);
      try {
        const detail = await api.getCompanyRisk(selectedTicker);
        setCompanyRisk(detail);
      } catch (err) {
        console.error(`Failed to load company risk for ${selectedTicker}:`, err);
      } finally {
        setLoadingDetail(false);
      }
    };
    fetchDetail();
  }, [selectedTicker]);

  const sectors = ['All', ...Array.from(new Set(basket.map((c) => c.sector)))];

  const filteredCompanies = basket.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.ticker.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSector = sectorFilter === 'All' || c.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const sentimentHistoryData = React.useMemo(() => {
    if (!companyRisk?.recent_signals?.length) return [];
    // Sort chronologically (oldest to newest)
    const sorted = [...companyRisk.recent_signals].sort((a, b) => {
      const ta = new Date(a.processed_at || a.published_at || 0).getTime();
      const tb = new Date(b.processed_at || b.published_at || 0).getTime();
      return ta - tb;
    });

    return sorted.map((s, idx) => {
      const dt = new Date(s.processed_at || s.published_at || Date.now());
      const dateStr = dt.toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' });
      const timeStr = dt.toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
      return {
        pointIndex: idx + 1,
        timeKey: `${dateStr} #${idx + 1}`,
        dateStr,
        fullDate: `${dateStr} ${timeStr}`,
        sentiment: Number(s.sentiment_score.toFixed(2)),
        sentiment_label: s.sentiment_label,
        impact: s.impact_score,
        event_type: s.event_type,
        headline: s.headline,
        ticker: s.primary_ticker || companyRisk.ticker
      };
    });
  }, [companyRisk]);

  const CustomSentimentTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const d = payload[0].payload;
      return (
        <div className="bg-white p-3 rounded-xl border border-[#d9d9d9] shadow-lg text-xs space-y-1.5 max-w-xs select-none">
          <div className="flex items-center justify-between gap-2 border-b border-[#efefef] pb-1">
            <span className="font-mono font-bold text-black">{d.ticker}</span>
            <span className="font-mono text-[10px] text-[#767676]">{d.fullDate}</span>
          </div>
          <p className="font-medium text-black line-clamp-2">{d.headline}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#5e5e5e] font-medium">{d.event_type}</span>
            <span className="font-mono font-bold text-black">
              Score: {d.sentiment > 0 ? `+${d.sentiment}` : d.sentiment}
            </span>
          </div>
          <div className="text-[10px] text-[#767676]">
            Impact severity: <strong className="text-black">{d.impact}/10</strong> • Stance: <strong className="text-black">{d.sentiment_label}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              Intelligence / Risk Surveillance
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Company risk profiles</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Institutional risk surveillance across constituent companies derived from continuous NLP parsing and verified event extraction.
          </p>
        </div>

        {selectedTicker && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setSelectedTicker(null)}
            icon={<ArrowLeft className="w-3.5 h-3.5" />}
          >
            All companies
          </Button>
        )}
      </div>

      {/* Main View: Company Detail OR Company Grid */}
      {selectedTicker && companyRisk ? (
        <div className="space-y-6">
          {/* Company Title Banner */}
          <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg font-mono">
                {companyRisk.ticker.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-2xl font-bold tracking-tight text-black">{companyRisk.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-[#efefef] text-black border border-[#d9d9d9]">
                    {companyRisk.ticker}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#5e5e5e] mt-1">
                  <span>Sector: <strong>{companyRisk.sector}</strong></span>
                  <span>•</span>
                  <span>Index Weight: <strong>{formatPercentage(companyRisk.current_weight)}</strong></span>
                  <span>•</span>
                  <span>Provenance: <strong>Public Market Data</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <SentimentBadge score={companyRisk.average_sentiment} />
              <ImpactBadge score={companyRisk.max_impact} />
            </div>
          </div>

          {/* KPI Summary Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Average sentiment"
              value={formatSentiment(companyRisk.average_sentiment)}
              description="NLP score range: -1.00 to +1.00"
              badge={<SentimentBadge score={companyRisk.average_sentiment} showScore={false} />}
            />
            <MetricCard
              title="Max observed impact"
              value={`${companyRisk.max_impact}/10`}
              description="Severity index benchmark"
              badge={<ImpactBadge score={companyRisk.max_impact} />}
            />
            <MetricCard
              title="Signals captured"
              value={companyRisk.signals_count}
              description="Recent verified intelligence items"
            />
            <MetricCard
              title="Simulated weight"
              value={formatPercentage(companyRisk.current_weight)}
              description="Tactical basket constituent"
            />
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment History */}
            <Card>
              <CardHeader
                title="Sentiment trend history"
                description="Historical sentiment score trajectory for this constituent (zero-line indicates neutral threshold)."
              />
              <div className="h-64 w-full">
                {sentimentHistoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={sentimentHistoryData}
                      margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="timeKey" stroke="#767676" fontSize={11} tickLine={false} />
                      <YAxis stroke="#767676" fontSize={11} domain={[-1, 1]} tickLine={false} />
                      <ReferenceLine y={0} stroke="#d9d9d9" strokeDasharray="3 3" />
                      <Tooltip content={<CustomSentimentTooltip />} />
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
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#767676]">
                    No historical sentiment records available for this company.
                  </div>
                )}
              </div>
            </Card>

            {/* Impact Distribution */}
            <Card>
              <CardHeader
                title="Event impact severity"
                description="Severity score (1-10) for each ingested signal impacting this organization."
              />
              <div className="h-64 w-full">
                {companyRisk.recent_signals.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[...companyRisk.recent_signals].reverse().map((s, idx) => ({
                        idx: idx + 1,
                        name: s.event_type,
                        impact: s.impact_score
                      }))}
                      margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="name" stroke="#767676" fontSize={10} tickLine={false} />
                      <YAxis stroke="#767676" fontSize={11} domain={[0, 10]} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#d9d9d9',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#000000'
                        }}
                      />
                      <Bar dataKey="impact" fill="#000000" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#767676]">
                    No impact records found.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Explainable Intelligence & Audit Limitations */}
          <div className="bg-[#efefef] rounded-2xl p-6 border border-[#d9d9d9]">
            <h3 className="text-base font-bold text-black mb-2">Company risk methodology & interpretation</h3>
            <p className="text-xs text-[#5e5e5e] leading-relaxed mb-3">
              This entity's risk stance is determined from {companyRisk.signals_count} distinct observations across financial news wires and authenticated feeds. 
              {companyRisk.average_sentiment < -0.1
                ? ' Elevated negative narrative velocity is detected, indicating downside headline volatility.'
                : companyRisk.average_sentiment > 0.1
                ? ' Favorable corporate narrative sentiment prevails based on positive operational milestones.'
                : ' Narrative flow remains neutral with balanced positive and negative event streams.'}
            </p>
            <div className="p-3 bg-white rounded-lg border border-[#d9d9d9] text-[11px] text-[#767676]">
              <strong>Methodological Disclosure:</strong> Signals reflect NLP model estimates based on available media and documented lexicon models. Individual sentiment observations do not establish future stock valuation or guaranteed cashflow performance.
            </div>
          </div>

          {/* Recent Signals Table */}
          <Card>
            <CardHeader
              title="Recent verified risk signals"
              description="Ingested signals referencing this ticker with full NLP classification."
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                    <th className="py-3 px-4">Headline</th>
                    <th className="py-3 px-3">Event Type</th>
                    <th className="py-3 px-3 text-center">Sentiment</th>
                    <th className="py-3 px-3 text-center">Impact</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9d9d9]">
                  {companyRisk.recent_signals.length > 0 ? (
                    companyRisk.recent_signals.map((sig) => (
                      <tr key={sig.signal_id} className="hover:bg-[#f3f3f3] transition-colors">
                        <td className="py-3.5 px-4 font-medium text-black max-w-md">
                          <p className="line-clamp-2">{sig.headline}</p>
                        </td>
                        <td className="py-3.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[11px] bg-[#efefef] text-[#5e5e5e] border border-[#d9d9d9]">
                            {sig.event_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <SentimentBadge score={sig.sentiment_score} />
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <ImpactBadge score={sig.impact_score} />
                        </td>
                        <td className="py-3.5 px-3 text-[#767676] tabular-nums">
                          {formatTimestamp(sig.processed_at)}
                        </td>
                        <td className="py-3.5 px-3 text-right">
                          <button
                            type="button"
                            onClick={() => onSelectSignal(sig)}
                            className="px-3 py-1 text-xs rounded-full bg-black text-white hover:bg-[#282828] transition-colors"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#767676]">
                        No signals currently recorded for {companyRisk.name}.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      ) : (
        /* Company List View */
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="w-full sm:w-80">
              <SearchInput
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search company or ticker..."
              />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSectorFilter(sec)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all select-none ${
                    sectorFilter === sec
                      ? 'bg-black text-white'
                      : 'bg-[#efefef] text-[#5e5e5e] hover:bg-[#e2e2e2] hover:text-black border border-[#d9d9d9]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Companies Table */}
          <Card>
            <CardHeader
              title="Constituent companies universe"
              description={`Displaying ${filteredCompanies.length} constituents monitored by the RiskPulse NLP engine.`}
            />
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                    <th className="py-3 px-4">Ticker</th>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4 text-center">Data Mode</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#d9d9d9]">
                  {loadingList ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#767676]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-black" />
                        Loading company universe...
                      </td>
                    </tr>
                  ) : filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#767676]">
                        No companies match the specified search or sector filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((c) => (
                      <tr key={c.ticker} className="hover:bg-[#f3f3f3] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-black">
                          {c.ticker}
                        </td>
                        <td className="py-3.5 px-4 font-medium text-black">
                          {c.name}
                        </td>
                        <td className="py-3.5 px-4 text-[#5e5e5e]">
                          {c.sector}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#efefef] text-[#5e5e5e] border border-[#d9d9d9]">
                            Public / Synthetic
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedTicker(c.ticker)}
                            className="px-4 py-1.5 rounded-full text-xs font-medium bg-black text-white hover:bg-[#282828] transition-colors"
                          >
                            View risk profile
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};
