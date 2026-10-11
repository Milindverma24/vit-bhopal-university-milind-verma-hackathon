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

  // Loss by Asset Class chart data
  const lossAssetData = latestResult && latestResult.loss_by_asset_class ? 
    Object.entries(latestResult.loss_by_asset_class).map(([name, loss]) => ({
      name,
      loss: Number((loss / 1e6).toFixed(1))
    })).sort((a, b) => b.loss - a.loss) : [];

  // Loss by Sector chart data
  const lossSectorData = latestResult && latestResult.loss_by_sector ?
    Object.entries(latestResult.loss_by_sector).map(([name, loss]) => ({
      name,
      loss: Number((loss / 1e6).toFixed(1))
    })).sort((a, b) => b.loss - a.loss) : [];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 16.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
              SYNTHETIC PORTFOLIO
            </span>
            <span className="text-xs text-[#767676] font-mono">Wholesale Banking Book</span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Portfolio stress testing</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Simulate the potential financial impact of high-impact events and macroeconomic shocks on the wholesale banking portfolio.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
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
            icon={<Play className="w-3.5 h-3.5" />}
          >
            {running ? 'Running stress test...' : 'Run Stress Test'}
          </Button>
        </div>
      </div>

      {/* 16.2 Portfolio Summary Baseline KPIs */}
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

      {/* 16.3 Event Trigger Panel */}
      <Card>
        <CardHeader
          title="High-impact event triggers (NLP Engine)"
          description="Recent critical signals detected by the NLP Risk Engine eligible to trigger simulated stress tests."
        />
        <div className="space-y-3">
          {recentSignals.map((sig) => (
            <div
              key={sig.signal_id}
              className="p-4 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9] flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-black">{sig.primary_ticker || 'MACRO'}</span>
                  <span className="text-[#767676]">•</span>
                  <span className="font-semibold text-black">{sig.event_type}</span>
                  <ImpactBadge score={sig.impact_score} />
                </div>
                <p className="text-black font-medium">{sig.headline}</p>
                <div className="text-[11px] text-[#767676]">
                  Trigger Status: <strong className="text-black">Eligible for stress scenario simulation</strong>
                </div>
              </div>

              <div className="shrink-0">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSimulateFromSignal(sig)}
                  loading={running}
                  icon={<Play className="w-3 h-3" />}
                >
                  Simulate from this Event
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* 16.4 Scenario Selector & Configuration */}
      <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] space-y-6">
        <div>
          <h3 className="text-base font-bold text-black mb-1">Select stress scenario</h3>
          <p className="text-xs text-[#5e5e5e]">
            Choose a standardized macroeconomic stress scenario or configure custom parameter shocks.
          </p>
        </div>

        {/* Pill-shaped Scenario Selector */}
        <div className="flex flex-wrap gap-2">
          {scenarios.map((sc) => (
            <button
              key={sc.scenario_id}
              type="button"
              onClick={() => setSelectedScenarioId(sc.scenario_id)}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all select-none ${
                selectedScenarioId === sc.scenario_id
                  ? 'bg-black text-white shadow-sm'
                  : 'bg-[#efefef] text-[#5e5e5e] hover:bg-[#e2e2e2] hover:text-black border border-[#d9d9d9]'
              }`}
            >
              {sc.name}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setSelectedScenarioId('custom')}
            className={`px-4 py-2 rounded-full text-xs font-medium transition-all select-none ${
              selectedScenarioId === 'custom'
                ? 'bg-black text-white shadow-sm'
                : 'bg-[#efefef] text-[#5e5e5e] hover:bg-[#e2e2e2] hover:text-black border border-[#d9d9d9]'
            }`}
          >
            Custom Scenario
          </button>
        </div>

        {/* Scenario Description & Parameter Summary */}
        {selectedScenario && selectedScenarioId !== 'custom' && (
          <div className="p-4 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9] text-xs space-y-2">
            <div className="font-semibold text-black">{selectedScenario.name}</div>
            <p className="text-[#5e5e5e] leading-relaxed">{selectedScenario.description}</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-[11px] font-mono text-black">
              <div>Equity Shock: <strong>{(selectedScenario.equity_shock * 100).toFixed(0)}%</strong></div>
              <div>Rate Shock: <strong>+{selectedScenario.rate_shock_bps} bps</strong></div>
              <div>Credit Spread: <strong>+{selectedScenario.credit_spread_widening_bps} bps</strong></div>
              <div>PD Multiplier: <strong>{selectedScenario.pd_multiplier}x</strong></div>
            </div>
          </div>
        )}

        {/* Custom Scenario Parameter Controls */}
        {selectedScenarioId === 'custom' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
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
      </div>

      {/* Error Banner */}
      {runError && (
        <div className="p-4 bg-[#efefef] border border-black rounded-xl text-xs text-black animate-in fade-in">
          <strong>Error running stress test:</strong> {runError}
        </div>
      )}

      {/* Triggering Event Banner */}
      {latestResult && (latestResult.triggered_by_signal_id || latestResult.trigger_event) && (
        <div className="p-4 bg-[#f7f7f7] rounded-xl border border-black flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs animate-in fade-in">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-black text-white font-mono font-bold text-[10px]">
                EVENT SIMULATION ACTIVE
              </span>
              <strong className="text-black font-semibold">
                Simulated Balance Sheet Impact: {latestResult.trigger_event || 'High-Impact Event'}
              </strong>
            </div>
            <p className="text-[#5e5e5e]">
              NLP engine mapped this crisis to <strong>{latestResult.scenario_name}</strong> with severity <strong>{latestResult.trigger_impact || 8}/10</strong>.
            </p>
          </div>
        </div>
      )}

      {/* 16.7 Results Summary (Displayed if result exists) */}
      {latestResult && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-black text-white">
                SIMULATED SCENARIO
              </span>
              <span className="text-xs text-[#767676] font-medium">
                Simulation run: {latestResult.scenario_name}
              </span>
            </div>
            <span className="text-xs font-mono text-[#767676]">
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
              badge={<span className="text-xs font-mono font-bold text-black bg-[#efefef] px-2 py-0.5 rounded-full">Loss</span>}
            />
            <MetricCard
              title="Percentage loss"
              value={`-${latestResult.percentage_loss.toFixed(2)}%`}
              description="Drawdown on risk-weighted assets"
              badge={<span className="text-xs font-mono font-bold text-white bg-black px-2 py-0.5 rounded-full">Drawdown</span>}
            />
          </div>

          {/* 16.8 Before-and-After Comparison & Loss Attribution */}
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
                      <XAxis dataKey="name" stroke="#767676" fontSize={11} tickLine={false} />
                      <YAxis stroke="#767676" fontSize={11} unit="M" tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#d9d9d9',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#000000'
                        }}
                        formatter={(val: any) => [`$${val}M`, 'Portfolio Value']}
                      />
                      <Bar dataKey="value" fill="#000000" radius={[4, 4, 0, 0]} />
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
                  description="Monochrome breakdown of dollar write-down contribution per industry sector."
                />
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={lossSectorData}
                      layout="vertical"
                      margin={{ top: 5, right: 20, left: 30, bottom: 5 }}
                    >
                      <XAxis type="number" stroke="#767676" fontSize={11} unit="M" tickLine={false} />
                      <YAxis type="category" dataKey="name" stroke="#767676" fontSize={11} tickLine={false} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#ffffff',
                          borderColor: '#d9d9d9',
                          borderRadius: '8px',
                          fontSize: '12px',
                          color: '#000000'
                        }}
                        formatter={(val: any) => [`$${val}M`, 'Attributed Loss']}
                      />
                      <Bar dataKey="loss" fill="#000000" radius={[0, 4, 4, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>
          </div>

          {/* 16.10 Stress-Test Explanation Panel */}
          <div className="bg-[#efefef] rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
            <h3 className="text-base font-bold text-black">
              Stress-test analytical explanation & loss attribution
            </h3>
            <p className="text-xs text-[#5e5e5e] leading-relaxed">
              Under the simulated <strong>{latestResult.scenario_name}</strong> scenario, the synthetic banking portfolio experiences a total loss of <strong>{formatCurrency(latestResult.absolute_loss)}</strong> (<strong>{latestResult.percentage_loss.toFixed(2)}%</strong>).
              Credit spread widening of {latestResult.parameters?.credit_spread_widening_bps || 120} bps and default rate escalation drive substantial markdown in high-yield and subordinated corporate notes.
            </p>
            {latestResult.major_drivers && (
              <div className="pt-2">
                <span className="text-xs font-semibold text-black block mb-1">Major Loss Drivers:</span>
                <ul className="list-disc list-inside text-xs text-[#5e5e5e] space-y-1">
                  {latestResult.major_drivers.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="p-3 bg-white rounded-lg border border-[#d9d9d9] text-[11px] text-[#767676] mt-2">
              <strong>Simulated Scenario Disclosure:</strong> Calculations follow deterministic discounted cash-flow sensitivity and IFRS 9 staging multiplier formulas. All values reflect model simulations and do not constitute actual banking statements.
            </div>
          </div>
        </div>
      )}

      {/* 16.11 Stress-Test History Table */}
      <Card>
        <CardHeader
          title="Stress-test run history"
          description="Historical scenario evaluations persisted in the database."
        />
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                <th className="py-3 px-3 font-mono">Timestamp</th>
                <th className="py-3 px-3">Scenario</th>
                <th className="py-3 px-3 text-right">Value Before</th>
                <th className="py-3 px-3 text-right">Value After</th>
                <th className="py-3 px-3 text-right">Absolute Loss</th>
                <th className="py-3 px-2 text-right">Loss (%)</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9d9d9]">
              {history.map((h) => (
                <tr key={h.run_id} className="hover:bg-[#f3f3f3] transition-colors">
                  <td className="py-3 px-3 font-mono text-[#767676] tabular-nums">
                    {formatTimestamp(h.timestamp)}
                  </td>
                  <td className="py-3 px-3 font-medium text-black">
                    {h.scenario_name}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-black tabular-nums">
                    {formatCurrency(h.portfolio_value_before)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono text-black tabular-nums">
                    {formatCurrency(h.portfolio_value_after)}
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-semibold text-black tabular-nums">
                    -{formatCurrency(h.absolute_loss)}
                  </td>
                  <td className="py-3 px-2 text-right font-mono text-black font-bold tabular-nums">
                    -{h.percentage_loss.toFixed(1)}%
                  </td>
                  <td className="py-3 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => {
                        setLatestResult(h);
                        setSelectedScenarioId(h.scenario_id);
                      }}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-[#efefef] text-black hover:bg-black hover:text-white border border-[#d9d9d9] transition-all"
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
