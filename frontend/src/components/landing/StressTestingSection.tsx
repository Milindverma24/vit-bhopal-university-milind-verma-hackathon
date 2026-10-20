import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { PortfolioSummary, StressScenarioDefinition, StressTestResult } from '../../types';

interface StressTestingSectionProps {
  onNavigateStress: () => void;
}

const STRESS_FEATURES = [
  'Pre-calibrated crisis scenarios: rates, credit freeze, geopolitical tensions',
  'Multi-asset valuation across corporate loans, sovereign debt, and equity',
  'Spread widening and duration modeling for fixed-income holdings',
  'IFRS 9 Expected Credit Loss (ECL) staging and provisions',
  'Precise sector-by-sector loss attribution and reconciliation'
];

export const StressTestingSection: React.FC<StressTestingSectionProps> = ({
  onNavigateStress
}) => {
  const [portfolio, setPortfolio] = useState<PortfolioSummary | null>(null);
  const [activeScenario, setActiveScenario] = useState<StressScenarioDefinition | null>(null);
  const [stressResult, setStressResult] = useState<StressTestResult | null>(null);
  const [sectorLossData, setSectorLossData] = useState<{ sector: string; loss: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function loadStressData() {
      try {
        const [portRes, scnRes] = await Promise.all([
          api.getPortfolio().catch(() => null),
          api.getStressScenarios().catch(() => null)
        ]);
        if (!mounted) return;
        if (portRes) {
          setPortfolio(portRes);
        }
        const scenario = (scnRes && scnRes.length > 0) ? scnRes[0] : null;
        if (scenario) {
          setActiveScenario(scenario);
          // Execute live real-time stress calculation against the portfolio
          const runRes = await api.runStressTest({ scenario_id: scenario.scenario_id }).catch(() => null);
          if (!mounted) return;
          if (runRes) {
            setStressResult(runRes);
            if (runRes.loss_by_sector) {
              const formatted = Object.entries(runRes.loss_by_sector)
                .map(([sector, loss]) => ({
                  sector,
                  loss: Number(((loss as number) / 1e6).toFixed(1))
                }))
                .sort((a, b) => b.loss - a.loss)
                .slice(0, 5);
              setSectorLossData(formatted);
            }
          }
        }
      } catch (err) {
        console.error('Failed to load stress testing data:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadStressData();
    return () => {
      mounted = false;
    };
  }, []);

  const totalVal = stressResult?.portfolio_value_before ?? portfolio?.total_value ?? 0;
  const totalValM = totalVal > 0 ? (totalVal / 1e6).toFixed(2) : '0.00';
  const lossPct = stressResult?.percentage_loss != null ? stressResult.percentage_loss.toFixed(2) : '0.00';
  const absLossM = stressResult ? (stressResult.absolute_loss / 1e6).toFixed(2) : '0.00';
  const postShockM = stressResult ? (stressResult.portfolio_value_after / 1e6).toFixed(2) : '0.00';
  const holdingsCount = portfolio?.total_holdings_count ?? 0;

  return (
    <section className="py-20 lg:py-28 border-b border-[#282828] bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333] inline-block mb-3">
            Stress Testing
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Simulate shocks before they reach the market.
          </h2>
          <p className="text-base text-[#b3b3b3] mt-2 leading-relaxed">
            Model how macro and geopolitical scenarios impact wholesale asset valuations, credit spreads, and expected loss.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Feature List & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-white">
              Portfolio Vulnerability Analysis
            </h3>
            <p className="text-sm text-[#b3b3b3] leading-relaxed">
              Evaluate the resilience of loans, bonds, equities, and cash positions under extreme but plausible market dislocations.
            </p>

            <div className="space-y-3 pt-2">
              {STRESS_FEATURES.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-xs text-white">
                  <CheckCircle2 className="w-4 h-4 text-[#1ed760] shrink-0 mt-0.5" />
                  <span className="font-medium leading-relaxed">{feat}</span>
                </div>
              ))}
            </div>

            <div className="pt-4">
              <Button
                variant="primary"
                size="md"
                onClick={onNavigateStress}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Stress Testing
              </Button>
            </div>
          </div>

          {/* Right Column: Valuation & Loss Attribution Preview */}
          <div className="lg:col-span-7">
            <div className="rounded-[8px] border border-[#282828] bg-[#181818] p-6 sm:p-8 space-y-6 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#282828]">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-white tracking-[1.4px]">
                    Crisis Scenario Fallout Engine
                  </span>
                  <div className="text-xs text-[#b3b3b3] mt-0.5">
                    Scenario: <strong className="text-white">{activeScenario?.name || 'Loading active scenario...'}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-[#1f1f1f] text-[#1ed760] border border-[#333333] font-bold">
                  {activeScenario?.category || 'Live Scenario'}
                </span>
              </div>

              {/* Before vs After Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-[8px] bg-[#1f1f1f] border border-[#282828]">
                  <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Baseline Book</span>
                  {loading ? (
                    <div className="h-6 bg-[#282828] rounded w-20 mt-1 animate-pulse" />
                  ) : (
                    <span className="text-lg font-bold font-mono text-white mt-1 block tabular-nums">${totalValM}M</span>
                  )}
                  <span className="text-[10px] text-[#7c7c7c]">{holdingsCount > 0 ? `${holdingsCount} Wholesale Assets` : 'Active Portfolio'}</span>
                </div>
                <div className="p-3.5 rounded-[8px] bg-[#1f1f1f] border border-[#282828]">
                  <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Post-Shock Book</span>
                  {loading ? (
                    <div className="h-6 bg-[#282828] rounded w-20 mt-1 animate-pulse" />
                  ) : (
                    <span className="text-lg font-bold font-mono text-white mt-1 block tabular-nums">${postShockM}M</span>
                  )}
                  <span className="text-[10px] text-[#7c7c7c]">After Live Shock</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-[8px] bg-[#f3727f]/10 border border-[#f3727f]/30">
                  <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Absolute Loss</span>
                  {loading ? (
                    <div className="h-6 bg-[#f3727f]/20 rounded w-20 mt-1 animate-pulse" />
                  ) : (
                    <span className="text-lg font-bold font-mono text-[#f3727f] mt-1 block tabular-nums">-${absLossM}M</span>
                  )}
                  <span className="text-[10px] font-semibold text-[#f3727f]">-{lossPct}% Total Impact</span>
                </div>
              </div>

              {/* Horizontal Sector Loss Attribution Chart */}
              <div className="p-4 rounded-[8px] bg-[#1f1f1f] border border-[#282828] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white uppercase tracking-[1.4px]">Loss Attribution by Sector ($M)</span>
                  <span className="text-[#7c7c7c]">Live Simulation Engine</span>
                </div>
                <div className="h-44 w-full pt-2">
                  {sectorLossData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        layout="vertical"
                        data={sectorLossData}
                        margin={{ top: 4, right: 24, left: 24, bottom: 4 }}
                      >
                        <XAxis type="number" unit="M" tick={{ fontSize: 10, fill: '#7c7c7c' }} axisLine={false} tickLine={false} />
                        <YAxis type="category" dataKey="sector" tick={{ fontSize: 11, fill: '#ffffff' }} axisLine={false} tickLine={false} width={80} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: '#181818', borderColor: '#282828', borderRadius: '8px', color: '#fff' }}
                          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                        />
                        <Bar dataKey="loss" fill="#f3727f" radius={[0, 4, 4, 0]} isAnimationActive={false} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs font-mono text-[#7c7c7c]">
                      {loading ? 'Running real-time portfolio stress simulation...' : 'No stress loss data available.'}
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
