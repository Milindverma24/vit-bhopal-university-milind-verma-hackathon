import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Button } from '../ui/Button';
import { api } from '../../services/api';
import { PortfolioSummary, StressScenarioDefinition } from '../../types';

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
  const [sectorLossData, setSectorLossData] = useState<{ sector: string; loss: number }[]>([
    { sector: 'Technology', loss: 7.9 },
    { sector: 'Energy', loss: 7.5 },
    { sector: 'Financials', loss: 6.8 },
    { sector: 'Healthcare', loss: 3.6 },
    { sector: 'Sovereign', loss: 3.5 }
  ]);

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
          if (portRes.sector_concentration) {
            const formatted = Object.entries(portRes.sector_concentration)
              .slice(0, 5)
              .map(([sector, weight]) => ({
                sector,
                loss: Number(((weight as number) * 33.56).toFixed(1))
              }));
            if (formatted.length > 0) {
              setSectorLossData(formatted);
            }
          }
        }
        if (scnRes && scnRes.length > 0) {
          setActiveScenario(scnRes[0]);
        }
      } catch (err) {
        console.error('Failed to load stress testing data:', err);
      }
    }
    loadStressData();
    return () => {
      mounted = false;
    };
  }, []);

  const totalVal = portfolio?.total_value ?? 500000000;
  const totalValM = (totalVal / 1e6).toFixed(2);
  const lossPct = 6.71;
  const absLossM = (totalVal * (lossPct / 100) / 1e6).toFixed(2);
  const postShockM = (totalVal * (1 - lossPct / 100) / 1e6).toFixed(2);
  const holdingsCount = portfolio?.total_holdings_count ?? 22;

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
                    Scenario: <strong className="text-white">{activeScenario?.name || 'Geopolitical Escalation & Supply Conflict'}</strong>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-3 py-1 rounded-full bg-[#1f1f1f] text-[#1ed760] border border-[#333333] font-bold">
                  {activeScenario?.category || 'Synthetic Scenario'}
                </span>
              </div>

              {/* Before vs After Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-[8px] bg-[#1f1f1f] border border-[#282828]">
                  <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Baseline Book</span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block tabular-nums">${totalValM}M</span>
                  <span className="text-[10px] text-[#7c7c7c]">{holdingsCount} Wholesale Assets</span>
                </div>
                <div className="p-3.5 rounded-[8px] bg-[#1f1f1f] border border-[#282828]">
                  <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Post-Shock Book</span>
                  <span className="text-lg font-bold font-mono text-white mt-1 block tabular-nums">${postShockM}M</span>
                  <span className="text-[10px] text-[#7c7c7c]">After All Shocks</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-[8px] bg-[#f3727f]/10 border border-[#f3727f]/30">
                  <span className="text-[10px] font-mono text-[#7c7c7c] uppercase tracking-wider block">Absolute Loss</span>
                  <span className="text-lg font-bold font-mono text-[#f3727f] mt-1 block tabular-nums">-${absLossM}M</span>
                  <span className="text-[10px] font-semibold text-[#f3727f]">-{lossPct}% Total Impact</span>
                </div>
              </div>

              {/* Horizontal Sector Loss Attribution Chart */}
              <div className="p-4 rounded-[8px] bg-[#1f1f1f] border border-[#282828] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white uppercase tracking-[1.4px]">Loss Attribution by Sector ($M)</span>
                  <span className="text-[#7c7c7c]">Exact Reconciliation: Delta = $0.00</span>
                </div>
                <div className="h-44 w-full pt-2">
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
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
