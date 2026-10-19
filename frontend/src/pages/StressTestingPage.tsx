import React, { useState, useEffect } from 'react';
import { 
  Play, 
  RefreshCw 
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { api } from '../services/api';
import { StressScenarioDefinition, StressTestResult, PortfolioSummary, RiskSignal } from '../types';
import { Card, CardHeader, MetricCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { TextInput } from '../components/ui/Inputs';
import { ImpactBadge } from '../components/ui/Badges';
import { formatCurrency, formatTimestamp } from '../utils/formatters';

const EVENT_TO_SCENARIO_MAP: Record<string, string> = {
  'Geopolitical Event': 'geopolitical_escalation',
  'Interest Rate Change': 'interest_rate_shock',
  'Monetary Policy': 'interest_rate_shock',
  'Inflation': 'inflation_shock',
  'Macroeconomic Event': 'inflation_shock',
  'Credit Event': 'credit_crisis',
  'Default or Bankruptcy': 'credit_crisis',
  'Liquidity Risk': 'credit_crisis',
  'Market Volatility': 'market_crash',
  'Fraud or Investigation': 'market_crash',
  'Corporate Earnings': 'market_crash',
  'Supply Chain Disruption': 'supply_chain_shock',
  'Cybersecurity Incident': 'supply_chain_shock',
  'Natural Disaster': 'geopolitical_escalation',
  'Regulatory Action': 'credit_crisis',
};

export const StressTestingPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<StressScenarioDefinition[]>([]);
  const [selectedScenarioId, setSelectedScenarioId] = useState('geopolitical_escalation');
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [latestResult, setLatestResult] = useState<StressTestResult | null>(null);
  const [history, setHistory] = useState<StressTestResult[]>([]);
  const [recentSignals, setRecentSignals] = useState<RiskSignal[]>([]);
  const [activeTriggerSignal, setActiveTriggerSignal] = useState<RiskSignal | null>(null);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [runError, setRunError] = useState<string | null>(null);

  // Custom scenario parameters
  const [customEquityShock, setCustomEquityShock] = useState(-15);
  const [customRateBps, setCustomRateBps] = useState(150);
  const [customSpreadBps, setCustomSpreadBps] = useState(120);
  const [customPdMult, setCustomPdMult] = useState(1.4);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [scList, pSummary, hist, sigRes] = await Promise.all([
        api.getStressScenarios(),
        api.getPortfolio(),
        api.getStressHistory(),
        api.getSignals({ minImpact: 7, pageSize: 5 })
      ]);
      setScenarios(scList);
      setPortfolio(pSummary);
      setHistory(hist);
      setRecentSignals(sigRes.items);
      if (hist.length > 0 && !latestResult) {
        setLatestResult(hist[0]);
      }
    } catch (err) {
      console.error('Failed to load stress testing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSimulateFromSignal = async (sig: RiskSignal) => {
    setActiveTriggerSignal(sig);
    const mappedScenario = EVENT_TO_SCENARIO_MAP[sig.event_type] || 'geopolitical_escalation';
    setSelectedScenarioId(mappedScenario);
    await handleRunStress(sig.signal_id, mappedScenario);
  };

  const handleRunStress = async (triggeringSignalId?: string, overrideScenarioId?: string) => {
    setRunning(true);
    setRunError(null);
    try {
      const scenarioToRun = overrideScenarioId || selectedScenarioId;
      let payload: any = { 
        scenario_id: scenarioToRun,
        triggering_signal_id: triggeringSignalId
      };

      if (scenarioToRun === 'custom') {
        payload = {
          triggering_signal_id: triggeringSignalId,
          custom_scenario: {
            scenario_id: 'custom_simulation',
            name: 'Custom Parameter Stress Simulation',
            description: 'User-configured scenario with custom equity, rate, and credit shocks.',
            category: 'User Custom',
            equity_shock: customEquityShock / 100.0,
            credit_spread_widening_bps: customSpreadBps,
            rate_shock_bps: customRateBps,
            pd_multiplier: customPdMult,
            lgd_shock: 0.05,
            vulnerable_sectors: ['Technology', 'Financial Services'],
            vulnerable_countries: ['USA', 'Eurozone']
          }
        };
      }

      const res = await api.runStressTest(payload);
      setLatestResult(res);
      const updatedHist = await api.getStressHistory();
      setHistory(updatedHist);
    } catch (err: any) {
      console.error('Failed to run stress test:', err);
      setRunError(err.message || 'Failed to complete stress test calculation.');
    } finally {
      setRunning(false);
    }
  };

  const selectedScenario = scenarios.find((s) => s.scenario_id === selectedScenarioId);

  // Before & After Comparison chart data
  const beforeAfterData = latestResult ? [
    {
      name: 'Baseline Value',
      value: Number((latestResult.portfolio_value_before / 1e6).toFixed(1))
    },
    {
      name: 'Stressed Value',
      value: Number((latestResult.portfolio_value_after / 1e6).toFixed(1))
    }
  ] : [];

  // Loss by Sector chart data
  const lossSectorData = latestResult && latestResult.loss_by_sector ?
    Object.entries(latestResult.loss_by_sector).map(([name, loss]) => ({
      name,
      loss: Number((loss / 1e6).toFixed(1))
    })).sort((a, b) => b.loss - a.loss) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333]">
              Synthetic Portfolio
            </span>
            <span className="text-xs text-[#7c7c7c] font-mono">Wholesale Banking Book</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Portfolio stress testing</h1>
          <p className="text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Simulate the potential financial impact of high-impact events and macroeconomic shocks on the wholesale banking portfolio.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchData}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => handleRunStress()}
            loading={running}
            icon={<Play className="w-3.5 h-3.5 fill-current" />}
          >
            {running ? 'Running simulation...' : 'Run Stress Test'}
          </Button>
        </div>
      </div>

      {/* Portfolio Summary Baseline KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Baseline portfolio value"
          value={portfolio ? formatCurrency(portfolio.total_value) : '$2.48B'}
          subValue="Mkt Value"
          description="Unstressed wholesale asset book"
        />
        <MetricCard
          title="Number of holdings"
          value={portfolio ? portfolio.total_holdings_count : 22}
          subValue="assets"
          description="Loans, Bonds, Derivatives, Equities"
        />
        <MetricCard
          title="Expected credit loss (ECL)"
          value={portfolio ? formatCurrency(portfolio.total_expected_credit_loss) : '$38.2M'}
          description="Baseline IFRS 9 ECL provisions"
        />
        <MetricCard
          title="Weighted portfolio duration"
          value={portfolio ? `${portfolio.weighted_duration.toFixed(1)}y` : '3.8y'}
          description="Interest rate sensitivity tenor"
        />
      </div>

      {/* Event Trigger Panel */}
      <Card>
        <CardHeader
          title="High-impact event triggers (NLP Engine)"
          description="Recent critical signals detected by the NLP Risk Engine eligible to trigger simulated stress tests."
        />
        <div className="space-y-3">
          {recentSignals.map((sig) => (
            <div
              key={sig.signal_id}
              className="p-4 bg-[#1f1f1f] hover:bg-[#252525] rounded-[8px] border border-[#282828] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs transition-colors"
            >
              <div className="space-y-1.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-mono font-bold text-black bg-[#1ed760] px-2 py-0.5 rounded-full">
                    {sig.primary_ticker || 'MACRO'}
                  </span>
                  <span className="text-[#4d4d4d]">•</span>
                  <span className="font-semibold text-white">{sig.event_type}</span>
                  <ImpactBadge score={sig.impact_score} />
                </div>
                <p className="text-white font-medium text-sm leading-snug">{sig.headline}</p>
                <div className="text-[11px] text-[#7c7c7c]">
                  Trigger Status: <strong className="text-[#1ed760]">Eligible for stress scenario simulation</strong>
                </div>
              </div>

              <div className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSimulateFromSignal(sig)}
                  loading={running}
                  icon={<Play className="w-3 h-3 fill-current" />}
                >
                  Simulate from this Event
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Scenario Selector & Configuration */}
      <Card>
        <CardHeader
          title="Select stress scenario"
          description="Choose a standardized macroeconomic stress scenario or configure custom parameter shocks."
        />

        {/* Pill-shaped Scenario Selector */}
        <div className="flex flex-wrap gap-2 pt-1">
          {scenarios.map((sc) => (
            <button
              key={sc.scenario_id}
              type="button"
              onClick={() => setSelectedScenarioId(sc.scenario_id)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all select-none cursor-pointer ${
                selectedScenarioId === sc.scenario_id
                  ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]'
                  : 'bg-[#1f1f1f] text-[#b3b3b3] hover:border-[#4d4d4d] hover:text-white border border-[#282828]'
              }`}
            >
              {sc.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedScenarioId('custom')}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-[1.4px] transition-all select-none cursor-pointer ${
              selectedScenarioId === 'custom'
                ? 'bg-[#1ed760] text-black shadow-[0_2px_8px_rgba(30,215,96,0.4)]'
                : 'bg-[#1f1f1f] text-[#b3b3b3] hover:border-[#4d4d4d] hover:text-white border border-[#282828]'
            }`}
          >
            Custom Scenario
          </button>
        </div>

        {/* Scenario Description & Parameter Summary */}
        {selectedScenario && selectedScenarioId !== 'custom' && (
          <div className="p-4 bg-[#1f1f1f] rounded-[8px] border border-[#282828] text-xs space-y-2.5 mt-4">
            <div className="font-bold text-white text-sm">{selectedScenario.name}</div>
            <p className="text-[#b3b3b3] leading-relaxed">{selectedScenario.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] font-mono text-[#b3b3b3] border-t border-[#282828]">
              <div>Equity Shock: <strong className="text-[#f3727f] font-semibold">{(selectedScenario.equity_shock * 100).toFixed(0)}%</strong></div>
              <div>Rate Shock: <strong className="text-white font-semibold">+{selectedScenario.rate_shock_bps} bps</strong></div>
              <div>Credit Spread: <strong className="text-white font-semibold">+{selectedScenario.credit_spread_widening_bps} bps</strong></div>
              <div>PD Multiplier: <strong className="text-[#1ed760] font-semibold">{selectedScenario.pd_multiplier}x</strong></div>
            </div>
          </div>
        )}

        {/* Custom Scenario Parameter Controls */}
        {selectedScenarioId === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-[#282828] mt-4">
            <TextInput
              label="Equity shock (%)"
              type="number"
              value={customEquityShock}
              onChange={(e) => setCustomEquityShock(Number(e.target.value))}
              suffix="%"
              helperText="Market drawdown"
            />
            <TextInput
              label="Rate shock (bps)"
              type="number"
              value={customRateBps}
              onChange={(e) => setCustomRateBps(Number(e.target.value))}
              suffix="bps"
              helperText="Yield curve shift"
            />
            <TextInput
              label="Spread widening (bps)"
              type="number"
              value={customSpreadBps}
              onChange={(e) => setCustomSpreadBps(Number(e.target.value))}
              suffix="bps"
              helperText="Credit spread widening"
            />
            <TextInput
              label="PD multiplier"
              type="number"
              step="0.1"
              value={customPdMult}
              onChange={(e) => setCustomPdMult(Number(e.target.value))}
              suffix="x"
              helperText="Default multiplier"
            />
          </div>
        )}
      </Card>

      {/* Error Banner */}
      {runError && (
        <div className="p-4 bg-[#f3727f]/10 border border-[#f3727f]/30 rounded-[8px] text-xs text-[#f3727f] animate-in fade-in flex items-center justify-between">
          <div>
            <strong>Error running stress test:</strong> {runError}
          </div>
        </div>
      )}

      {/* Triggering Event Banner */}
      {latestResult && (latestResult.triggered_by_signal_id || latestResult.trigger_event) && (
        <div className="p-5 bg-[#181818] text-white rounded-[8px] border border-[#282828] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs animate-in fade-in shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full bg-[#f3727f]/20 text-[#f3727f] font-mono font-bold text-[10px] uppercase tracking-[1.4px] border border-[#f3727f]/30">
                Event Simulation Active
              </span>
              <strong className="text-white font-semibold text-sm">
                Simulated Balance Sheet Impact: {latestResult.trigger_event || 'High-Impact Event'}
              </strong>
            </div>
            <p className="text-[#b3b3b3] text-xs">
              NLP engine mapped this crisis to <strong className="text-white">{latestResult.scenario_name}</strong> with severity <strong className="text-[#1ed760]">{latestResult.trigger_impact || 8}/10</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Results Summary (Displayed if result exists) */}
      {latestResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-[1.4px] px-2.5 py-0.5 rounded-full bg-[#1ed760] text-black">
                Simulated Scenario
              </span>
              <span className="text-xs text-[#b3b3b3] font-medium">
                Simulation run: {latestResult.scenario_name}
              </span>
            </div>
            <span className="text-xs font-mono text-[#7c7c7c]">
              {formatTimestamp(latestResult.timestamp)}
            </span>
          </div>

          {/* Large Financial Impact Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Portfolio value before"
              value={formatCurrency(latestResult.portfolio_value_before)}
              description="Pre-shock baseline balance"
            />
            <MetricCard
              title="Portfolio value after"
              value={formatCurrency(latestResult.portfolio_value_after)}
              description="Post-shock simulated valuation"
            />
            <MetricCard
              title="Absolute loss"
              value={`-${formatCurrency(latestResult.absolute_loss)}`}
              description="Net capital write-down"
              badge={<span className="text-xs font-mono font-bold text-[#f3727f] bg-[#f3727f]/15 border border-[#f3727f]/30 px-2.5 py-0.5 rounded-full">Loss</span>}
            />
            <MetricCard
              title="Percentage loss"
              value={`-${latestResult.percentage_loss.toFixed(2)}%`}
              description="Drawdown on risk-weighted assets"
              badge={<span className="text-xs font-mono font-bold text-[#f3727f] bg-[#f3727f]/15 border border-[#f3727f]/30 px-2.5 py-0.5 rounded-full">Drawdown</span>}
            />
          </div>

          {/* Before-and-After Comparison & Loss Attribution */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Before vs After Chart (5 cols) */}
            <div className="lg:col-span-5">
              <Card>
                <CardHeader
                  title="Valuation comparison"
                  description="Baseline vs stressed portfolio valuation in millions USD."
                />
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={beforeAfterData} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                      <XAxis dataKey="name" stroke="#7c7c7c" fontSize={11} tickLine={false} />
                      <YAxis stroke="#7c7c7c" fontSize={11} unit="M" tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#181818',
                          borderColor: '#282828',
                          borderRadius: '8px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                          fontSize: '12px',
                          color: '#ffffff'
                        }}
                        formatter={(val: any) => [`$${val}M`, 'Portfolio Value']}
                      />
                      <Bar dataKey="value" fill="#1ed760" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Loss by Sector Chart (7 cols) */}
            <div className="lg:col-span-7">
              <Card>
                <CardHeader
                  title="Loss attribution by sector"
                  description="Breakdown of dollar write-down contribution per industry sector."
                />
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={lossSectorData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                    >
                      <XAxis type="number" stroke="#7c7c7c" fontSize={11} unit="M" tickLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#ffffff" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#181818',
                          borderColor: '#282828',
                          borderRadius: '8px',
                          boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                          fontSize: '12px',
                          color: '#ffffff'
                        }}
                        formatter={(val: any) => [`$${val}M`, 'Attributed Loss']}
                      />
                      <Bar dataKey="loss" fill="#f3727f" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {/* Stress-Test Explanation Panel */}
          <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
            <h3 className="text-base font-bold text-white">
              Stress-test analytical explanation & loss attribution
            </h3>
            <p className="text-xs text-[#b3b3b3] leading-relaxed">
              Under the simulated <strong className="text-white">{latestResult.scenario_name}</strong> scenario, the synthetic banking portfolio experiences a total loss of <strong className="text-[#f3727f]">{formatCurrency(latestResult.absolute_loss)}</strong> (<strong className="text-[#f3727f]">{latestResult.percentage_loss.toFixed(2)}%</strong>).
              Credit spread widening of {latestResult.parameters?.credit_spread_widening_bps || 120} bps and default rate escalation drive substantial markdown in high-yield and subordinated corporate notes.
            </p>
            {latestResult.major_drivers && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-white block mb-1">Major Loss Drivers:</span>
                <ul className="list-disc list-inside text-xs text-[#b3b3b3] space-y-1">
                  {latestResult.major_drivers.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-3 bg-[#1f1f1f] rounded-[6px] border border-[#282828] text-[11px] text-[#7c7c7c] mt-2">
              <strong className="text-white">Simulated Scenario Disclosure:</strong> Calculations follow deterministic discounted cash-flow sensitivity and IFRS 9 staging multiplier formulas. All values reflect model simulations and do not constitute actual banking statements.
            </div>
          </div>
        </div>
      )}

      {/* Stress-Test History Table */}
      <Card>
        <CardHeader
          title="Stress-test run history"
          description="Historical scenario evaluations persisted in the database."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1f1f1f] border-b border-[#282828] text-white font-bold uppercase tracking-[1.4px] text-[11px]">
                <th className="py-3 px-3 font-mono">Timestamp</th>
                <th className="py-3 px-3">Scenario</th>
                <th className="py-3 px-3 text-right">Value Before</th>
                <th className="py-3 px-3 text-right">Value After</th>
                <th className="py-3 px-3 text-right">Absolute Loss</th>
                <th className="py-3 px-2 text-right">Loss (%)</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {history.map((h) => (
                <tr key={h.run_id} className="hover:bg-[#202020] transition-colors">
                  <td className="py-3 px-3 font-mono text-[#7c7c7c] tabular-nums">
                    {formatTimestamp(h.timestamp)}
                  </td>
                  <td className="py-3 px-3 font-medium text-white">
                    {h.scenario_name}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-white tabular-nums">
                    {formatCurrency(h.portfolio_value_before)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-white tabular-nums">
                    {formatCurrency(h.portfolio_value_after)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-[#f3727f] tabular-nums">
                    -{formatCurrency(h.absolute_loss)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-[#f3727f] font-bold tabular-nums">
                    -{h.percentage_loss.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setLatestResult(h);
                        setSelectedScenarioId(h.scenario_id);
                      }}
                      className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-[1.4px] bg-[#1f1f1f] text-white hover:border-[#1ed760] hover:text-[#1ed760] border border-[#282828] transition-colors"
                    >
                      Reopen
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
