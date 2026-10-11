import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  RefreshCw, 
  ShieldCheck, 
  ArrowUpRight,
  Info
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
import { formatPercentage } from '../utils/formatters';

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
      {/* 18.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              Quantitative Analytics / Alpha Backtest
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Historical risk analysis</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Explore changes in financial sentiment, event severity, and simulated portfolio performance under tactical de-weighting rules.
          </p>
        </div>

        {/* Time Horizon Pill Selector (Section 3.1) */}
        <div className="inline-flex items-center p-1 bg-[#efefef] rounded-full border border-[#d9d9d9]">
          {timeOptions.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => setDays(opt.value)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                days === opt.value
                  ? 'bg-black text-white shadow-sm'
                  : 'text-[#5e5e5e] hover:text-black'
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
            badge={<span className="text-xs font-mono font-bold text-black bg-[#efefef] px-2 py-0.5 rounded-full">Outperform</span>}
          />

          <MetricCard
            title="Sharpe ratio"
            value={data.metrics.tactical.sharpe_ratio.toFixed(2)}
            subValue={`vs ${data.metrics.benchmark.sharpe_ratio.toFixed(2)}`}
            description="Risk-adjusted return efficiency"
            badge={<span className="text-xs font-mono font-bold text-black bg-[#efefef] px-2 py-0.5 rounded-full">Sharpe</span>}
          />

          <MetricCard
            title="Max drawdown"
            value={`-${data.metrics.tactical.max_drawdown_pct}%`}
            subValue={`vs -${data.metrics.benchmark.max_drawdown_pct}%`}
            description="Peak-to-trough defensive cushion"
            badge={<span className="text-xs font-mono font-bold text-white bg-black px-2 py-0.5 rounded-full">Drawdown</span>}
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
          description="Monochrome black line represents the sentiment-rebalanced tactical index (Base 100); gray dashed line represents benchmark."
        />
        <div className="h-80 w-full">
          {data && data.series.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.series} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="date" stroke="#767676" fontSize={11} tickLine={false} />
                <YAxis stroke="#767676" fontSize={11} domain={['auto', 'auto']} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#d9d9d9',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#000000'
                  }}
                  formatter={(val: any, name: any) => [
                    typeof val === 'number' ? val.toFixed(2) : val,
                    name === 'tactical_index' ? 'Tactical Index (Base 100)' : 'Benchmark Equal-Weight'
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="tactical_index"
                  stroke="#000000"
                  strokeWidth={2.5}
                  dot={false}
                  name="tactical_index"
                />
                <Line
                  type="monotone"
                  dataKey="benchmark_equal_weight"
                  stroke="#767676"
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={false}
                  name="benchmark_equal_weight"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#767676]">
              Loading historical simulation data...
            </div>
          )}
        </div>
        <div className="flex items-center justify-center gap-6 text-xs text-[#5e5e5e] pt-3 border-t border-[#f3f3f3]">
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-black" />
            <strong className="text-black">Tactical Index</strong>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-4 h-0.5 bg-[#767676] border-b border-dashed" />
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
                <XAxis dataKey="date" stroke="#767676" fontSize={11} tickLine={false} />
                <YAxis stroke="#767676" fontSize={11} unit="%" tickLine={false} />
                <ReferenceLine y={0} stroke="#4b4b4b" strokeWidth={1} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#d9d9d9',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#000000'
                  }}
                  formatter={(val: any) => [`+${val}%`, 'Alpha Spread']}
                />
                <Line
                  type="monotone"
                  dataKey="alpha_spread"
                  stroke="#000000"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-xs text-[#767676]">
              No series available.
            </div>
          )}
        </div>
      </Card>

      {/* 18.4 Data Quality & Observations Disclosure */}
      <div className="bg-[#efefef] rounded-2xl p-6 border border-[#d9d9d9] space-y-2">
        <h3 className="text-base font-bold text-black">Simulation parameters & data quality statement</h3>
        <p className="text-xs text-[#5e5e5e] leading-relaxed">
          The backtest runs on {days} historical daily observations across the 15 basket constituents with transaction friction factored at 15 basis points per unit turnover.
          Simulated returns illustrate theoretical performance and do not guarantee future market returns or execution liquidity.
        </p>
      </div>
    </div>
  );
};
