import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  ShieldCheck 
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine 
} from 'recharts';
import { api } from '../services/api';
import { MarketPerformance } from '../types';
import { Card, CardHeader, MetricCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const HistoricalAnalysisPage: React.FC = () => {
  const [data, setData] = useState<MarketPerformance | null>(null);
  const [days, setDays] = useState(90);
  const [loading, setLoading] = useState(false);

  const fetchPerformance = async () => {
    setLoading(true);
    try {
      const res = await api.getPerformance(days);
      setData(res);
    } catch (err) {
      console.error('Failed to load performance simulation:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPerformance();
  }, [days]);

  const timeOptions = [
    { label: '30 Days', value: 30 },
    { label: '60 Days', value: 60 },
    { label: '90 Days', value: 90 },
    { label: '180 Days', value: 180 }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333]">
              Quantitative Analytics / Alpha Backtest
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Historical risk analysis</h1>
          <p className="text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Explore changes in financial sentiment, event severity, and simulated portfolio performance under tactical de-weighting rules.
          </p>
        </div>

        {/* Time Horizon Pill Selector */}
        <div className="inline-flex items-center p-1 bg-[#121212] rounded-full border border-[#282828]">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDays(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all cursor-pointer ${
                days === opt.value
                  ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]'
                  : 'text-[#b3b3b3] hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Comparison Grid */}
      {data && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard
            title="Cumulative return (Tactical)"
            value={`+${data.metrics.tactical.cumulative_return_pct}%`}
            subValue={`vs +${data.metrics.benchmark.cumulative_return_pct}%`}
            description={`Alpha spread: +${(data.metrics.tactical.cumulative_return_pct - data.metrics.benchmark.cumulative_return_pct).toFixed(2)}%`}
            badge={<span className="text-xs font-mono font-bold text-[#1ed760] bg-[#1ed760]/15 border border-[#1ed760]/30 px-2.5 py-0.5 rounded-full">Outperform</span>}
          />

          <MetricCard
            title="Sharpe ratio"
            value={data.metrics.tactical.sharpe_ratio.toFixed(2)}
            subValue={`vs ${data.metrics.benchmark.sharpe_ratio.toFixed(2)}`}
            description="Risk-adjusted return efficiency"
            badge={<span className="text-xs font-mono font-bold text-white bg-[#1f1f1f] border border-[#282828] px-2.5 py-0.5 rounded-full">Sharpe</span>}
          />

          <MetricCard
            title="Max drawdown"
            value={`-${data.metrics.tactical.max_drawdown_pct}%`}
            subValue={`vs -${data.metrics.benchmark.max_drawdown_pct}%`}
            description="Peak-to-trough defensive cushion"
            badge={<span className="text-xs font-mono font-bold text-[#f3727f] bg-[#f3727f]/15 border border-[#f3727f]/30 px-2.5 py-0.5 rounded-full">Drawdown</span>}
          />

          <MetricCard
            title="Annualized volatility"
            value={`${data.metrics.tactical.annualized_volatility_pct}%`}
            subValue={`vs ${data.metrics.benchmark.annualized_volatility_pct}%`}
            description="Standard deviation of returns"
          />
        </div>
      )}

      {/* Historical Simulation Chart */}
      <Card>
        <CardHeader
          title="Simulated index value: Tactical vs Equal-Weight Benchmark"
          description="Solid green line represents sentiment-rebalanced tactical index (Base 100); dashed gray line represents benchmark."
        />
        <div className="h-80 w-full">
          {data && data.series.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                <YAxis stroke="#7c7c7c" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#282828',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    fontSize: '12px',
                    color: '#ffffff'
                  }}
                  formatter={(val: any, name: any) => [
                    typeof val === 'number' ? val.toFixed(2) : val,
                    name === 'tactical_index' ? 'Tactical Index (Base 100)' : 'Benchmark Equal-Weight'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="tactical_index"
                  stroke="#1ed760"
                  strokeWidth={2.5}
                  dot={false}
                  name="tactical_index"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark_equal_weight"
                  stroke="#7c7c7c"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="benchmark_equal_weight"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#7c7c7c]">
              Loading historical simulation data...
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-[#7c7c7c] pt-3 border-t border-[#282828]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#1ed760]" />
            <strong className="text-white">Tactical Index</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#7c7c7c] border-b border-dashed" />
            <span>Equal-Weight Benchmark</span>
          </div>
        </div>
      </Card>

      {/* Alpha Spread Trajectory Chart */}
      <Card>
        <CardHeader
          title="Cumulative alpha spread trajectory"
          description="Excess percentage points achieved by automated tactical reallocation over benchmark."
        />
        <div className="h-64 w-full">
          {data && data.series.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                <YAxis stroke="#7c7c7c" fontSize={11} unit="%" tickLine={false} />
                <ReferenceLine y={0} stroke="#383838" strokeWidth={1} strokeDasharray="3 3" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#282828',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    fontSize: '12px',
                    color: '#ffffff'
                  }}
                  formatter={(val: any) => [`+${val}%`, 'Alpha Spread']}
                />
                <Line
                  type="monotone"
                  dataKey="alpha_spread"
                  stroke="#1ed760"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#7c7c7c]">
              No series available.
            </div>
          )}
        </div>
      </Card>

      {/* Data Quality & Observations Disclosure */}
      <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-2 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <h3 className="text-base font-bold text-white">Simulation parameters & data quality statement</h3>
        <p className="text-xs text-[#b3b3b3] leading-relaxed">
          The backtest runs on {days} historical daily observations across the 15 basket constituents with transaction friction factored at 15 basis points per unit turnover.
          Simulated returns illustrate theoretical quantitative performance and do not guarantee future market returns or execution liquidity.
        </p>
      </div>
    </div>
  );
};
