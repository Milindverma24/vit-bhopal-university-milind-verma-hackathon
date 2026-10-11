import React from 'react';
import { ArrowRight, Sliders, CheckCircle2 } from 'lucide-react';
import { Button } from '../ui/Button';

interface RebalancingSectionProps {
  onNavigateRebalancing: () => void;
}

const REBALANCE_CONSTITUENTS = [
  { ticker: 'AAPL', name: 'Apple Inc.', current: 7.4, proposed: 4.0, delta: -3.4, sentiment: -0.46, impact: 8, reason: 'Cybersecurity & Supply Risk' },
  { ticker: 'MSFT', name: 'Microsoft Corp.', current: 6.8, proposed: 8.0, delta: +1.2, sentiment: +0.42, impact: 3, reason: 'Bullish Enterprise Earnings' },
  { ticker: 'JPM', name: 'JPMorgan Chase', current: 6.2, proposed: 6.1, delta: -0.1, sentiment: -0.05, impact: 6, reason: 'Neutral Margin Environment' },
  { ticker: 'XOM', name: 'Exxon Mobil', current: 5.5, proposed: 3.8, delta: -1.7, sentiment: -0.52, impact: 8, reason: 'Refining Margin Contraction' }
];

const REBALANCE_FEATURES = [
  'Continuous Sentiment Signal Integration from AI/NLP Pipeline',
  'Severity Penalties for Critical Events (Monetary, Regulatory, Credit)',
  'Strict Feasibility Bounds ($w_{\\min} = 2\\%$, $w_{\\max} = 20\\%$, $\\sum w = 100\\%$)',
  'Quantitative One-Way Turnover Budget Enforcement',
  'Two-Stage Non-Mutating Preview & Execution Workflow',
  'Immutable Historical Audit Trails with Execution Timestamps'
];

export const RebalancingSection: React.FC<RebalancingSectionProps> = ({
  onNavigateRebalancing
}) => {
  return (
    <section className="py-20 lg:py-28 border-b border-[#d9d9d9] bg-[#fafafa]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
            MODULE A — QUANTITATIVE ALLOCATION ENGINE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-3">
            Translate sentiment into allocation decisions.
          </h2>
          <p className="text-base text-[#5e5e5e] mt-2 leading-relaxed">
            Evaluate how sentiment and event-risk signals can influence a simulated index allocation under explicit portfolio constraints.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Rebalance Comparison Table */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-[#d9d9d9] bg-white p-6 sm:p-8 space-y-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 border-b border-[#d9d9d9]">
                <div>
                  <h4 className="text-sm font-bold text-black uppercase font-mono tracking-wider">
                    Index Allocation Shift Preview
                  </h4>
                  <span className="text-xs text-[#767676]">Tactical Mock S&P Basket Rebalance</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-[#767676] uppercase block">Modeled Turnover</span>
                  <span className="text-sm font-mono font-bold text-black tabular-nums">1.48% (One-Way)</span>
                </div>
              </div>

              {/* Allocation Comparison Table */}
              <div className="space-y-4">
                {REBALANCE_CONSTITUENTS.map((item) => {
                  const isNegative = item.delta < 0;
                  return (
                    <div key={item.ticker} className="p-3.5 rounded-xl border border-[#d9d9d9] bg-[#fafafa] space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-black">{item.ticker}</span>
                          <span className="text-[#767676]">{item.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[#5e5e5e]">{item.current.toFixed(1)}%</span>
                          <span className="text-[#767676]">→</span>
                          <span className="font-bold text-black">{item.proposed.toFixed(1)}%</span>
                          <span className={`px-1.5 py-0.2 rounded font-semibold ${
                            isNegative ? 'bg-[#efefef] text-black border border-[#d9d9d9]' : 'bg-black text-white'
                          }`}>
                            {item.delta > 0 ? `+${item.delta.toFixed(1)}%` : `${item.delta.toFixed(1)}%`}
                          </span>
                        </div>
                      </div>

                      {/* Visual Bar Comparison */}
                      <div className="w-full bg-[#e5e5e5] h-2 rounded-full overflow-hidden flex">
                        <div 
                          className="bg-black h-full rounded-full transition-all duration-500" 
                          style={{ width: `${item.proposed * 10}%` }} 
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-[#767676] pt-0.5">
                        <span>Sentiment: <strong className="text-black">{item.sentiment > 0 ? `+${item.sentiment}` : item.sentiment}</strong></span>
                        <span className="font-medium text-black">{item.reason}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 text-[11px] font-mono text-[#767676] flex items-center justify-between">
                <span>Sum of Allocations: 100.0%</span>
                <span>Box Bounds: 2.0% – 20.0%</span>
              </div>
            </div>
          </div>

          {/* Right Column: Features & CTA */}
          <div className="lg:col-span-5 space-y-6">
            <h3 className="text-2xl font-bold tracking-tight text-black">
              Algorithmic Discipline With Complete Explainability
            </h3>
            <p className="text-sm text-[#5e5e5e] leading-relaxed">
              Every allocation change is mathematically bounded, respects configured risk limits, and produces an auditable record of why a constituent weight expanded or contracted.
            </p>

            <div className="space-y-3 pt-2">
              {REBALANCE_FEATURES.map((feat) => (
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
                onClick={onNavigateRebalancing}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Index Rebalancing
              </Button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
