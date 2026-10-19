import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  RefreshCw,
  Building2,
  TrendingUp,
  TrendingDown,
  Info
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine, 
  BarChart, 
  Bar,
  AreaChart,
  Area
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
        <div className="bg-[#181818] p-3.5 rounded-[8px] border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)] text-xs space-y-1.5 max-w-xs select-none">
          <div className="flex items-center justify-between gap-2 border-b border-[#282828] pb-1">
            <span className="font-mono font-bold text-[#1ed760]">{d.ticker}</span>
            <span className="font-mono text-[10px] text-[#7c7c7c]">{d.fullDate}</span>
          </div>
          <p className="font-medium text-white line-clamp-2 leading-snug">{d.headline}</p>
          <div className="flex items-center justify-between pt-1">
            <span className="text-[#b3b3b3] font-medium">{d.event_type}</span>
            <span className={`font-mono font-bold ${d.sentiment >= 0 ? 'text-[#1ed760]' : 'text-[#f3727f]'}`}>
              Score: {d.sentiment > 0 ? `+${d.sentiment}` : d.sentiment}
            </span>
          </div>
          <div className="text-[10px] text-[#7c7c7c]">
            Severity: <strong className="text-white">{d.impact}/10</strong> • Stance: <strong className="text-white">{d.sentiment_label}</strong>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760]">
              Intelligence / Risk Surveillance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Company risk profiles</h1>
          <p className="text-xs sm:text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
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
          <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#1ed760] text-black flex items-center justify-center font-bold text-lg font-mono shadow-[0_2px_8px_rgba(30,215,96,0.4)]">
                {companyRisk.ticker.slice(0, 2)}
              </div>
              <div>
                <div className="flex items-center gap-2.5 flex-wrap">
                  <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">{companyRisk.name}</h2>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#1f1f1f] text-[#1ed760] border border-[#282828]">
                    {companyRisk.ticker}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#b3b3b3] mt-1 flex-wrap">
                  <span>Sector: <strong className="text-white font-semibold">{companyRisk.sector}</strong></span>
                  <span>•</span>
                  <span>Index Weight: <strong className="text-white font-mono font-semibold">{formatPercentage(companyRisk.current_weight)}</strong></span>
                  <span>•</span>
                  <span>Provenance: <strong className="text-white font-semibold">Public Market Feeds</strong></span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 shrink-0">
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
              description="Verified intelligence items"
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
            <Card hoverEffect>
              <CardHeader
                title="Sentiment trend history"
                description="Historical sentiment score trajectory for this constituent (zero-line indicates neutral threshold)."
              />
              <div className="h-64 w-full">
                {sentimentHistoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={sentimentHistoryData}
                      margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="companySentimentGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#1ed760" stopOpacity={0.25} />
                          <stop offset="95%" stopColor="#1ed760" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="timeKey" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                      <YAxis stroke="#7c7c7c" fontSize={11} domain={[-1, 1]} tickLine={false} />
                      <ReferenceLine y={0} stroke="#383838" strokeDasharray="3 3" />
                      <Tooltip content={<CustomSentimentTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="sentiment"
                        stroke="#1ed760"
                        strokeWidth={2}
                        fill="url(#companySentimentGrad)"
                        dot={{ r: 3, fill: '#1ed760' }}
                        activeDot={{ r: 5, fill: '#ffffff' }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#7c7c7c]">
                    No historical sentiment records available for this company.
                  </div>
                )}
              </div>
            </Card>

            {/* Impact Distribution */}
            <Card hoverEffect>
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
                        name: s.event_type.length > 18 ? s.event_type.slice(0, 16) + '...' : s.event_type,
                        impact: s.impact_score
                      }))}
                      margin={{ top: 10, right: 20, left: -20, bottom: 0 }}
                    >
                      <XAxis dataKey="name" stroke="#7c7c7c" fontSize={10} tickLine={false} />
                      <YAxis stroke="#7c7c7c" fontSize={11} domain={[0, 10]} tickLine={false} />
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
                      <Bar dataKey="impact" fill="#1ed760" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-xs text-[#7c7c7c]">
                    No impact records found.
                  </div>
                )}
              </div>
            </Card>
          </div>

          {/* Explainable Intelligence & Audit Limitations */}
          <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <h3 className="text-sm font-bold uppercase tracking-[1.4px] text-[#1ed760] mb-2">Company Risk Methodology & Interpretation</h3>
            <p className="text-xs text-[#b3b3b3] leading-relaxed mb-3">
              This entity's risk stance is determined from {companyRisk.signals_count} distinct observations across financial news wires and authenticated feeds. 
              {companyRisk.average_sentiment < -0.1
                ? ' Elevated negative narrative velocity is detected, indicating downside headline volatility.'
                : companyRisk.average_sentiment > 0.1
                ? ' Favorable corporate narrative sentiment prevails based on positive operational milestones.'
                : ' Narrative flow remains neutral with balanced positive and negative event streams.'}
            </p>
            <div className="p-3 bg-[#1f1f1f] rounded-[6px] border border-[#282828] text-[11px] text-[#b3b3b3]">
              <strong className="text-white">Methodological Disclosure:</strong> Signals reflect NLP model estimates based on available media and documented lexicon models. Individual sentiment observations do not establish future stock valuation or guaranteed cashflow performance.
            </div>
          </div>

          {/* Recent Signals Table */}
          <Card hoverEffect>
            <CardHeader
              title="Recent verified risk signals"
              description="Ingested signals referencing this ticker with full NLP classification."
            />
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1f1f1f] border-y border-[#282828] text-white font-bold uppercase tracking-[1.4px]">
                    <th className="py-3 px-4">Headline</th>
                    <th className="py-3 px-3">Event Type</th>
                    <th className="py-3 px-3 text-center">Sentiment</th>
                    <th className="py-3 px-3 text-center">Impact</th>
                    <th className="py-3 px-3">Timestamp</th>
                    <th className="py-3 px-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282828]">
                  {companyRisk.recent_signals.length > 0 ? (
                    companyRisk.recent_signals.map((sig) => (
                      <tr key={sig.signal_id} className="hover:bg-[#202020] transition-colors">
                        <td className="py-3.5 px-4 font-semibold text-white max-w-md">
                          <p className="line-clamp-2 leading-snug">{sig.headline}</p>
                        </td>
                        <td className="py-3.5 px-3 whitespace-nowrap">
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-[#1f1f1f] text-[#cbcbcb] border border-[#282828]">
                            {sig.event_type}
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <SentimentBadge score={sig.sentiment_score} />
                        </td>
                        <td className="py-3.5 px-3 text-center whitespace-nowrap">
                          <ImpactBadge score={sig.impact_score} />
                        </td>
                        <td className="py-3.5 px-3 text-[#7c7c7c] font-mono tabular-nums text-[11px] whitespace-nowrap">
                          {formatTimestamp(sig.processed_at)}
                        </td>
                        <td className="py-3.5 px-3 text-right whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => onSelectSignal(sig)}
                            className="px-3.5 py-1 text-xs rounded-full font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] hover:text-[#1ed760] border border-[#282828] transition-colors cursor-pointer"
                          >
                            Inspect
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-[#7c7c7c]">
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

            <div className="flex flex-wrap items-center gap-1.5 overflow-x-auto pb-1 max-w-full no-scrollbar">
              {sectors.map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => setSectorFilter(sec)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all select-none cursor-pointer ${
                    sectorFilter === sec
                      ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]'
                      : 'bg-[#1f1f1f] text-[#b3b3b3] hover:border-[#4d4d4d] hover:text-white border border-[#282828]'
                  }`}
                >
                  {sec}
                </button>
              ))}
            </div>
          </div>

          {/* Companies Table */}
          <Card hoverEffect>
            <CardHeader
              title="Constituent companies universe"
              description={`Displaying ${filteredCompanies.length} constituents monitored by the RiskPulse NLP engine.`}
            />
            <div className="overflow-x-auto -mx-6 px-6">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#1f1f1f] border-y border-[#282828] text-white font-bold uppercase tracking-[1.4px]">
                    <th className="py-3 px-4">Ticker</th>
                    <th className="py-3 px-4">Company Name</th>
                    <th className="py-3 px-4">Sector</th>
                    <th className="py-3 px-4 text-center">Data Mode</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#282828]">
                  {loadingList ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#b3b3b3]">
                        <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1ed760]" />
                        Loading company universe...
                      </td>
                    </tr>
                  ) : filteredCompanies.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-12 text-center text-[#7c7c7c]">
                        No companies match the specified search or sector filter.
                      </td>
                    </tr>
                  ) : (
                    filteredCompanies.map((c) => (
                      <tr key={c.ticker} className="hover:bg-[#202020] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#1ed760]">
                          {c.ticker}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {c.name}
                        </td>
                        <td className="py-3.5 px-4 text-[#b3b3b3]">
                          {c.sector}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-medium bg-[#1f1f1f] text-[#cbcbcb] border border-[#282828]">
                            Public / Synthetic
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            type="button"
                            onClick={() => setSelectedTicker(c.ticker)}
                            className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] hover:text-[#1ed760] border border-[#282828] transition-colors cursor-pointer"
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
