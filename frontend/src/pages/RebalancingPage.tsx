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
  ReferenceLine 
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
      {/* 14.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              Portfolio / Quantitative Reallocation
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Tactical index rebalancing</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Evaluate how NLP-derived sentiment and event risk influence simulated index allocations across the RiskPulse 15 Large-Cap universe.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchIndexData}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Allocations
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handlePreviewRebalance}
            loading={previewing}
            icon={<Sliders className="w-3.5 h-3.5" />}
          >
            {previewing ? 'Previewing...' : 'Preview Proposed Weights'}
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setConfirmModalOpen(true)}
            loading={rebalancing}
            icon={<Play className="w-3.5 h-3.5" />}
          >
            Execute Simulated Rebalance
          </Button>
        </div>
      </div>

      {/* Preview Notification Banner */}
      {previewRun && (
        <div className="p-4 bg-[#f7f7f7] rounded-xl border border-black flex items-center justify-between text-xs animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-black text-white font-mono font-bold text-[10px]">PREVIEW READY</span>
              <strong className="text-black font-semibold">Simulated Rebalance Preview Calculated</strong>
            </div>
            <p className="text-[#5e5e5e]">
              Projected one-way turnover: <strong className="text-black font-mono">{formatPercentage(previewRun.turnover)}</strong> • Constituent weights recalculated without altering current portfolio.
            </p>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setConfirmModalOpen(true)}
            icon={<Play className="w-3 h-3" />}
          >
            Confirm & Execute
          </Button>
        </div>
      )}

      {/* 14.2 KPI Cards Row */}
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
          badge={<span className="text-xs font-mono font-semibold text-black">Target 1.0</span>}
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
          badge={<span className="text-xs font-mono text-[#767676]">{previewRun && !latestRun ? 'Preview' : 'Turnover'}</span>}
        />
        <MetricCard
          title="Last rebalance"
          value={latestRun ? formatTimestamp(latestRun.timestamp) : 'No execution recorded'}
          description="Quantitative algorithm run timestamp"
        />
      </div>

      {/* 14.6 Parameter Configuration Panel */}
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

      {/* 14.4 & 14.5 Visualizations: Allocation Comparison & Weight Changes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Allocation Comparison (Monochrome Grayscale Bars) */}
        <Card>
          <CardHeader
            title="Weight comparison: Current vs Proposed"
            description="Black bars represent proposed rebalanced weights; gray bars represent current weights."
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={allocationComparisonData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="ticker" stroke="#767676" fontSize={11} tickLine={false} />
                <YAxis stroke="#767676" fontSize={11} unit="%" tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderColor: '#d9d9d9',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#000000'
                  }}
                  formatter={(val: any, name: any) => [`${val}%`, name === 'current' ? 'Current Weight' : 'Proposed Weight']}
                />
                <Bar dataKey="current" fill="#767676" radius={[4, 4, 0, 0]} name="Current Weight" />
                <Bar dataKey="proposed" fill="#000000" radius={[4, 4, 0, 0]} name="Proposed Weight" />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="flex items-center justify-center gap-6 text-xs text-[#5e5e5e] pt-3 border-t border-[#f3f3f3]">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-[#767676] rounded-xs" />
              <span>Current Allocation</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-black rounded-xs" />
              <span>Proposed Allocation</span>
            </div>
          </div>
        </Card>

        {/* Weight Change Chart (+/- with Zero Reference Line) */}
        <Card>
          <CardHeader
            title="Weight delta trajectory (Δ%)"
            description="Simulated weight reallocation per constituent. Values above zero indicate weight expansions."
          />
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weightDeltaData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                <XAxis dataKey="ticker" stroke="#767676" fontSize={11} tickLine={false} />
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
                  formatter={(val: any) => [`${val > 0 ? '+' : ''}${val}%`, 'Allocation Delta']}
                />
                <Bar dataKey="delta" fill="#000000" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center text-xs text-[#767676] pt-3 border-t border-[#f3f3f3]">
            Dashed baseline represents zero reallocation threshold
          </div>
        </Card>
      </div>

      {/* 14.3 Constituent Table */}
      <Card>
        <CardHeader
          title="Constituent allocation breakdown"
          description="Detailed constituent weights, NLP sentiment scores, and risk-adjusted target allocations."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
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
            <tbody className="divide-y divide-[#d9d9d9]">
              {constituents.map((c) => {
                const delta = c.current_weight - c.previous_weight;
                const isPositive = delta > 0.0001;
                const isNegative = delta < -0.0001;

                return (
                  <tr key={c.ticker} className="hover:bg-[#f3f3f3] transition-colors">
                    <td className="py-3 px-3 font-mono font-bold text-black">{c.ticker}</td>
                    <td className="py-3 px-3 font-medium text-black">{c.name}</td>
                    <td className="py-3 px-3 text-[#5e5e5e]">{c.sector}</td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-black font-medium">
                      {formatPercentage(c.current_weight)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums text-black font-bold">
                      {formatPercentage(c.target_weight)}
                    </td>
                    <td className="py-3 px-2 text-right font-mono tabular-nums font-semibold">
                      <span className={`px-2 py-0.5 rounded-full text-xs ${
                        isPositive ? 'bg-[#efefef] text-black border border-[#d9d9d9]' :
                        isNegative ? 'bg-black text-white' : 'text-[#767676]'
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
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        c.latest_impact >= 7 ? 'bg-black text-white border-black' :
                        c.latest_sentiment < -0.1 ? 'bg-[#efefef] text-black border-black' :
                        'bg-white text-[#767676] border-[#d9d9d9]'
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

      {/* 14.8 Rebalance Explanation Panel */}
      <div className="bg-[#efefef] rounded-2xl p-6 border border-[#d9d9d9]">
        <h3 className="text-base font-bold text-black mb-2">Rebalance mathematical methodology & algorithm</h3>
        <p className="text-xs text-[#5e5e5e] leading-relaxed mb-3">
          Tactical weights are computed by maximizing risk-adjusted utility subject to allocation bounds and turnover friction.
          Constituents undergoing severe headline risk or credit investigations are penalized by the penalty scalar β, while high-sentiment outperformers receive allocation expansions governed by sensitivity α.
        </p>
        <div className="p-3 bg-white rounded-lg border border-[#d9d9d9] text-[11px] text-[#767676]">
          <strong>Institutional Governance Note:</strong> Simulated results represent historical model backtesting. All allocations strictly respect the 2.0% minimum and 18.0% maximum concentration caps to maintain diversification.
        </div>
      </div>

      {/* Confirmation Modal (Section 22.1) */}
      {confirmModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-[#d9d9d9] shadow-[0_8px_32px_rgba(0,0,0,0.16)] space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#d9d9d9]">
              <h3 className="text-lg font-bold text-black">Confirm simulated rebalance</h3>
              <button
                type="button"
                onClick={() => setConfirmModalOpen(false)}
                className="text-[#767676] hover:text-black p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#5e5e5e] leading-relaxed">
              You are about to execute a simulated index rebalance with <strong>alpha = {alpha}</strong> and <strong>beta = {beta}</strong>. This will reallocate capital across 15 constituents and persist the new target weights in the database.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#d9d9d9]">
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
