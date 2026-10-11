import React from 'react';
import { ArrowRight, CheckCircle2, TrendingDown, BarChart2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Button } from '../ui/Button';

interface StressTestingSectionProps {
  onNavigateStress: () => void;
}

const SECTOR_LOSS_DATA = [
  { sector: 'Technology', loss: 7.9 },
  { sector: 'Energy', loss: 7.5 },
  { sector: 'Financials', loss: 6.8 },
  { sector: 'Healthcare', loss: 3.6 },
  { sector: 'Sovereign', loss: 3.5 }
];

const STRESS_FEATURES = [
  'Institutional Scenario Engine (Geopolitical, Rates, Inflation, Credit, Meltdown)',
  'Multi-Asset Modeling: Loans, Sovereign & Corporate Bonds, Equities, FX, Cash',
  'Duration Sensitivity & Spread Widening Valuation for Fixed Income',
  'Basel III & IFRS 9 Multi-Period Expected Credit Loss (ECL) Calculation',
  'Strict Sector Loss Reconciliation Reconciliation (\\Delta = \\$0.00 exact)',
  'One-Click Simulation Triggered Directly by High-Impact Risk Signals'
];

export const StressTestingSection: React.FC<StressTestingSectionProps> = ({
  onNavigateStress
}) => {
  return (
    <section className="py-20 lg:py-28 border-b border-[#d9d9d9] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
            MODULE B — STRATEGIC DISASTER IMPACT MODELING
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-3">
            Measure how events could affect a portfolio.
          </h2>
          <p className="text-base text-[#5e5e5e] mt-2 leading-relaxed">
            Translate major financial and geopolitical scenarios into simulated valuation changes and explainable loss attribution.
          </p>
        </div>

        {/* 2-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Feature List & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-black">
              Event-Driven Balance Sheet Vulnerability Analysis
            </h3>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              When an extraordinary market shock strikes, evaluate the bank's wholesale book resilience before headline contagion cascades across credit and asset markets.
            </p>

            <div className="space-y-3 pt-2">
              {STRESS_FEATURES.map((feat) => (
                <div key={feat} className="flex items-start gap-2.5 text-xs text-black">
                  <CheckCircle2 className="w-4 h-4 text-black shrink-0 mt-0.5" />
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
            <div className="rounded-2xl border border-[#d9d9d9] bg-[#fafafa] p-6 sm:p-8 space-y-6 shadow-sm">
              
              <div className="flex items-center justify-between pb-4 border-b border-[#d9d9d9]">
                <div>
                  <span className="text-xs font-mono font-bold uppercase text-black">
                    Crisis Scenario Fallout Engine
                  </span>
                  <div className="text-xs text-[#5e5e5e] mt-0.5">
                    Scenario: <strong className="text-black">Geopolitical Escalation & Supply Conflict</strong>
                  </div>
                </div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-black text-white font-semibold">
                  Synthetic Scenario
                </span>
              </div>

              {/* Before vs After Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-white border border-[#d9d9d9]">
                  <span className="text-[10px] font-mono text-[#767676] uppercase block">Baseline Book</span>
                  <span className="text-lg font-bold font-mono text-black mt-1 block tabular-nums">$500.00M</span>
                  <span className="text-[10px] text-[#767676]">22 Wholesale Assets</span>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-[#d9d9d9]">
                  <span className="text-[10px] font-mono text-[#767676] uppercase block">Post-Shock Book</span>
                  <span className="text-lg font-bold font-mono text-black mt-1 block tabular-nums">$466.44M</span>
                  <span className="text-[10px] text-[#767676]">After All Shocks</span>
                </div>
                <div className="col-span-2 sm:col-span-1 p-3.5 rounded-xl bg-white border border-black">
                  <span className="text-[10px] font-mono text-[#767676] uppercase block">Absolute Loss</span>
                  <span className="text-lg font-bold font-mono text-black mt-1 block tabular-nums">-$33.56M</span>
                  <span className="text-[10px] font-semibold text-black">-6.71% Total Impact</span>
                </div>
              </div>

              {/* Horizontal Sector Loss Attribution Chart */}
              <div className="p-4 rounded-xl bg-white border border-[#d9d9d9] space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-black uppercase">Loss Attribution by Sector ($M)</span>
                  <span className="text-[#767676]">Exact Reconciliation: Δ = $0.00</span>
                </div>
                <div className="h-44 w-full pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      layout="vertical"
                      data={SECTOR_LOSS_DATA}
                      margin={{ top: 4, right: 24, left: 24, bottom: 4 }}
                    >
                      <XAxis type="number" unit="M" tick={{ fontSize: 10, fill: '#767676' }} axisLine={false} tickLine={false} />
                      <YAxis type="category" dataKey="sector" tick={{ fontSize: 11, fill: '#111111' }} axisLine={false} tickLine={false} width={80} />
                      <Bar dataKey="loss" fill="#111111" radius={[0, 4, 4, 0]} isAnimationActive={false} />
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
