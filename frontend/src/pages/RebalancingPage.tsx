import React, { useState, useEffect } from 'react';
import { 
  Sliders, 
  RefreshCw, 
  Play, 
  X
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceLine,
  Cell as RechartsCell
} from 'recharts';
import { api } from '../services/api';
import { Constituent, RebalanceRun } from '../types';
import { Card, CardHeader, MetricCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { SentimentBadge, ImpactBadge } from '../components/ui/Badges';
import { TextInput } from '../components/ui/Inputs';
import { formatPercentage, formatWeightChange, formatTimestamp } from '../utils/formatters';

export const RebalancingPage: React.FC = () => {
  const [constituents, setConstituents] = useState<Constituent[]>([]);
  const [latestRun, setLatestRun] = useState<RebalanceRun | null>(null);
  const [previewRun, setPreviewRun] = useState<RebalanceRun | null>(null);
  const [loading, setLoading] = useState(false);
  const [rebalancing, setRebalancing] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Quantitative Parameters
  const [alpha, setAlpha] = useState(0.45);
  const [beta, setBeta] = useState(0.65);
  const [minWeight, setMinWeight] = useState(0.02);
  const [maxWeight, setMaxWeight] = useState(0.18);
  const [maxTurnover, setMaxTurnover] = useState(0.25);

  const fetchIndexData = async () => {
    setLoading(true);
    try {
      const data = await api.getIndex();
      setConstituents(data.constituents);
      if (data.latest_rebalance_run) {
        setLatestRun(data.latest_rebalance_run);
      }
    } catch (err) {
      console.error('Failed to load index data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIndexData();
  }, []);

  const handlePreviewRebalance = async () => {
    setPreviewing(true);
    try {
      const run = await api.executeRebalance({
        alpha,
        beta,
        min_weight: minWeight,
        max_weight: maxWeight,
        max_turnover: maxTurnover,
        preview_only: true
      });
      setPreviewRun(run);
    } catch (err) {
      console.error('Failed to preview rebalance:', err);
    } finally {
      setPreviewing(false);
    }
  };

  const handleExecuteRebalance = async () => {
    setRebalancing(true);
    setConfirmModalOpen(false);
    try {
      const run = await api.executeRebalance({
        alpha,
        beta,
        min_weight: minWeight,
        max_weight: maxWeight,
        max_turnover: maxTurnover,
        preview_only: false
      });
      setLatestRun(run);
      setPreviewRun(null);
      await fetchIndexData();
    } catch (err) {
      console.error('Failed to execute rebalance:', err);
    } finally {
      setRebalancing(false);
    }
  };

  // Preparation for Allocation Charts
  const allocationComparisonData = constituents.map((c) => {
    const proposed = previewRun
      ? (previewRun.allocations.find((a) => a.ticker === c.ticker)?.proposed_weight || c.target_weight)
      : c.target_weight;
    return {
      ticker: c.ticker,
      current: Number((c.current_weight * 100).toFixed(2)),
      proposed: Number((proposed * 100).toFixed(2))
    };
  });

  const weightDeltaData = constituents.map((c) => {
    const executedDelta = Number(((c.current_weight - c.previous_weight) * 100).toFixed(2));
    const previewItem = previewRun?.allocations.find((a) => a.ticker === c.ticker);
    const delta = previewItem
      ? Number(((previewItem.executed_weight - c.current_weight) * 100).toFixed(2))
      : executedDelta;
    return {
      ticker: c.ticker,
      delta
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#1ed760] animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760]">
              Portfolio / Quantitative Reallocation
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Tactical index rebalancing</h1>
          <p className="text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Evaluate how NLP-derived sentiment and event risk influence simulated index allocations across the RiskPulse 15 Large-Cap universe.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchIndexData}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreviewRebalance}
            loading={previewing}
            icon={<Sliders className="w-3.5 h-3.5" />}
          >
            {previewing ? 'Previewing...' : 'Preview Proposed'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setConfirmModalOpen(true)}
            loading={rebalancing}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            Execute Rebalance
          </Button>
        </div>
      </div>

      {/* Preview Notification Banner */}
      {previewRun && (
        <div className="p-4 bg-[#181818] text-white rounded-[8px] border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#1ed760]/20 text-[#1ed760] font-mono font-bold text-[10px] uppercase tracking-[1.4px] border border-[#1ed760]/30">
                Preview Ready
              </span>
              <strong className="text-white font-semibold text-sm">Simulated Rebalance Model Calculated</strong>
            </div>
            <p className="text-xs text-[#b3b3b3]">
              Projected one-way turnover: <strong className="text-[#1ed760] font-mono">{formatPercentage(previewRun.turnover)}</strong> • Constituent weights recalculated without altering live portfolio state.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setConfirmModalOpen(true)}
            icon={<Play className="w-3 h-3 fill-current" />}
            className="shrink-0"
          >
            Confirm & Execute
          </Button>
        </div>
      )}

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Constituents"
          value={constituents.length}
          subValue="assets"
          description="S&P universe tactical equity basket"
        />
        <MetricCard
          title="Current allocation"
          value="100.0%"
          description="Fully invested portfolio constraint"
          badge={<span className="text-xs font-mono font-bold text-[#1ed760] bg-[#1ed760]/15 px-2 py-0.5 rounded-full border border-[#1ed760]/30">Target 1.0</span>}
        />
        <MetricCard
          title="Latest turnover"
          value={
            latestRun
              ? formatPercentage(latestRun.turnover)
              : previewRun
              ? formatPercentage(previewRun.turnover)
              : '0.0%'
          }
          description="One-way turnover constraint cap: 25%"
          badge={<span className="text-xs font-mono text-[#b3b3b3]">{previewRun && !latestRun ? 'Preview' : 'Turnover'}</span>}
        />
        <MetricCard
          title="Last rebalance"
          value={latestRun ? formatTimestamp(latestRun.timestamp) : 'No execution recorded'}
          description="Quantitative algorithm run timestamp"
        />
      </div>

      {/* Parameter Configuration Panel */}
      <Card>
        <CardHeader
          title="Rebalance optimization parameters"
          description="Adjust sensitivity scalars and risk penalties for quadratic programming allocation engine."
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <TextInput
            label="Sentiment sensitivity (α)"
            type="number"
            step="0.05"
            min="0"
            max="1"
            value={alpha}
            onChange={(e) => setAlpha(parseFloat(e.target.value) || 0)}
            helperText="Overweight boost scalar"
          />

          <TextInput
            label="Risk penalty (β)"
            type="number"
            step="0.05"
            min="0"
            max="1.5"
            value={beta}
            onChange={(e) => setBeta(parseFloat(e.target.value) || 0)}
            helperText="Downside dampening scalar"
          />

          <TextInput
            label="Min weight limit"
            type="number"
            step="0.01"
            min="0.01"
            max="0.05"
            value={minWeight}
            onChange={(e) => setMinWeight(parseFloat(e.target.value) || 0)}
            helperText="Constituent lower bound (2%)"
          />

          <TextInput
            label="Max weight limit"
            type="number"
            step="0.01"
            min="0.10"
            max="0.30"
            value={maxWeight}
            onChange={(e) => setMaxWeight(parseFloat(e.target.value) || 0)}
            helperText="Constituent upper bound (18%)"
          />

          <TextInput
            label="Max turnover cap"
            type="number"
            step="0.05"
            min="0.05"
            max="0.50"
            value={maxTurnover}
            onChange={(e) => setMaxTurnover(parseFloat(e.target.value) || 0)}
            helperText="Max portfolio rebalance delta"
          />
        </div>
      </Card>

      {/* Visualizations: Allocation Comparison & Weight Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Comparison */}
        <Card>
          <CardHeader
            title="Weight comparison: Current vs Proposed"
            description="Green bars indicate proposed rebalanced weights; gray bars indicate current weights."
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="ticker" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                <YAxis stroke="#7c7c7c" fontSize={11} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#181818',
                    borderColor: '#282828',
                    borderRadius: '8px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                    fontSize: '12px',
                    color: '#ffffff'
                  }}
                  formatter={(val: any, name: any) => [`${val}%`, name === 'current' ? 'Current Weight' : 'Proposed Weight']}
                />
                <Bar dataKey="current" fill="#4d4d4d" radius={[4, 4, 0, 0]} name="Current Weight" />
                <Bar dataKey="proposed" fill="#1ed760" radius={[4, 4, 0, 0]} name="Proposed Weight" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-[#7c7c7c] pt-3 border-t border-[#282828]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#4d4d4d] rounded-sm" />
              <span>Current Allocation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#1ed760] rounded-sm" />
              <span className="font-bold text-white">Proposed Allocation</span>
            </div>
          </div>
        </Card>

        {/* Weight Change Chart (+/- with Zero Reference Line) */}
        <Card>
          <CardHeader
            title="Weight delta trajectory (Δ%)"
            description="Constituent weight adjustment. Positive indicates capital expansion; negative indicates risk contraction."
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightDeltaData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="ticker" stroke="#7c7c7c" fontSize={11} tickLine={false} />
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
                  formatter={(val: any) => [`${val > 0 ? '+' : ''}${val}%`, 'Allocation Delta']}
                />
                <Bar dataKey="delta" radius={[3, 3, 0, 0]}>
                  {weightDeltaData.map((entry, index) => (
                    <RechartsCell key={`cell-${index}`} fill={entry.delta >= 0 ? '#1ed760' : '#f3727f'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-[#7c7c7c] pt-3 border-t border-[#282828]">
            Baseline represents zero reallocation threshold
          </div>
        </Card>
      </div>

      {/* Constituent Table */}
      <Card>
        <CardHeader
          title="Constituent allocation breakdown"
          description="Detailed constituent weights, NLP sentiment scores, and risk-adjusted target allocations."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1f1f1f] border-b border-[#282828] text-white font-bold uppercase tracking-[1.4px] text-[11px]">
                <th className="py-3 px-3">Ticker</th>
                <th className="py-3 px-3">Company</th>
                <th className="py-3 px-3">Sector</th>
                <th className="py-3 px-2 text-right">Current Wt</th>
                <th className="py-3 px-2 text-right">Target Wt</th>
                <th className="py-3 px-2 text-right">Change (Δ)</th>
                <th className="py-3 px-2 text-center">Sentiment</th>
                <th className="py-3 px-2 text-center">Impact</th>
                <th className="py-3 px-3 text-center">Risk Stance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {constituents.map((c) => {
                const delta = c.current_weight - c.previous_weight;
                const isPositive = delta > 0.0001;
                const isNegative = delta < -0.0001;

                return (
                  <tr key={c.ticker} className="hover:bg-[#202020] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-[#1ed760]">{c.ticker}</td>
                    <td className="py-3 px-3 font-medium text-white">{c.name}</td>
                    <td className="py-3 px-3 text-[#b3b3b3]">{c.sector}</td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-white font-medium">
                      {formatPercentage(c.current_weight)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-white font-bold">
                      {formatPercentage(c.target_weight)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums font-semibold">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs inline-block font-mono ${
                        isPositive ? 'bg-[#1ed760]/15 text-[#1ed760] border border-[#1ed760]/30' :
                        isNegative ? 'bg-[#f3727f]/15 text-[#f3727f] border border-[#f3727f]/30' : 
                        'text-[#b3b3b3] bg-[#1f1f1f] border border-[#282828]'
                      }`}>
                        {formatWeightChange(delta)}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <SentimentBadge score={c.latest_sentiment} />
                    </td>
                    <td className="py-3 px-2 text-center">
                      <ImpactBadge score={c.latest_impact} />
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        c.latest_impact >= 7 ? 'bg-[#f3727f]/15 text-[#f3727f] border-[#f3727f]/30' :
                        c.latest_sentiment < -0.1 ? 'bg-[#ffa42b]/15 text-[#ffa42b] border-[#ffa42b]/30' :
                        'bg-[#1f1f1f] text-[#b3b3b3] border border-[#282828]'
                      }`}>
                        {c.latest_impact >= 7 ? 'High Risk' : c.latest_sentiment < -0.1 ? 'Underweight' : 'Neutral'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Rebalance Explanation Panel */}
      <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <h3 className="text-base font-bold text-white mb-2">Rebalance mathematical methodology & algorithm</h3>
        <p className="text-xs text-[#b3b3b3] leading-relaxed mb-3">
          Tactical weights are computed by maximizing risk-adjusted utility subject to allocation bounds and turnover friction.
          Constituents undergoing severe headline risk or credit investigations are penalized by the penalty scalar beta, while high-sentiment outperformers receive allocation expansions governed by sensitivity alpha.
        </p>
        <div className="p-3 bg-[#1f1f1f] rounded-[6px] border border-[#282828] text-[11px] text-[#b3b3b3]">
          <strong className="text-white">Institutional Governance Note:</strong> Simulated results represent quantitative model backtesting. All allocations strictly respect the 2.0% minimum and 18.0% maximum concentration caps to maintain portfolio diversification.
        </div>
      </div>

      {/* Confirmation Modal */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-[#242424] rounded-[8px] p-6 max-w-md w-full border border-[#282828] shadow-[0_8px_24px_rgba(0,0,0,0.5)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#282828]">
              <h3 className="text-lg font-bold text-white">Confirm simulated rebalance</h3>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="text-[#7c7c7c] hover:text-white p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#b3b3b3] leading-relaxed">
              You are about to execute a simulated index rebalance with <strong className="text-[#1ed760]">alpha = {alpha}</strong> and <strong className="text-[#1ed760]">beta = {beta}</strong>. This will reallocate capital across 15 constituents and persist the new target weights in the database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#282828]">
              <Button variant="secondary" size="sm" onClick={() => setConfirmModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" size="sm" onClick={handleExecuteRebalance}>
                Confirm & Execute
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
