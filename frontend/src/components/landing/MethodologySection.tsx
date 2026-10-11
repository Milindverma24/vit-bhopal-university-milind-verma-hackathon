import React from 'react';
import { ArrowRight, BookOpen, Layers, Sliders, BarChart3, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface MethodologySectionProps {
  onNavigateMethodology: () => void;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({
  onNavigateMethodology
}) => {
  return (
    <section id="methodology" className="py-20 lg:py-28 border-b border-[#d9d9d9] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
            GOVERNANCE & TRANSPARENCY
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-3">
            Built to explain the reasoning.
          </h2>
          <p className="text-base text-[#5e5e5e] mt-2 leading-relaxed">
            Every output should be traceable to an input, a method, and a set of documented assumptions.
          </p>
        </div>

        {/* 3 Methodology Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Block 1: NLP Methodology */}
          <div className="p-6 rounded-2xl border border-[#d9d9d9] bg-[#fafafa] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#d9d9d9] flex items-center justify-center text-black shadow-sm">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-black tracking-tight">
                NLP Risk Engine Architecture
              </h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Sentiment scoring (-1.0 to +1.0), event taxonomy classification (20 categories), entity extraction, and impact severity (1-10) operate as distinct, decoupled pipelines with rule-based fallbacks to eliminate hallucination.
              </p>
            </div>
            <div className="pt-4 border-t border-[#d9d9d9] text-[11px] font-mono text-[#767676]">
              Deterministic FinBERT & Syntactic Rules
            </div>
          </div>

          {/* Block 2: Tactical Rebalancing */}
          <div className="p-6 rounded-2xl border border-[#d9d9d9] bg-[#fafafa] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#d9d9d9] flex items-center justify-center text-black shadow-sm">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Constrained Rebalancing Optimization
              </h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Candidate weight adjustments are constrained within strict bounds ($2.0\% \le w_i \le 20.0\%$), normalized to $\sum w_i = 100\%$, and throttled by one-way turnover limits ($0.5 \sum |\Delta w|$) to prevent erratic turnover.
              </p>
            </div>
            <div className="pt-4 border-t border-[#d9d9d9] text-[11px] font-mono text-[#767676]">
              Box-Constrained Iterative Solver
            </div>
          </div>

          {/* Block 3: Stress Testing */}
          <div className="p-6 rounded-2xl border border-[#d9d9d9] bg-[#fafafa] flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white border border-[#d9d9d9] flex items-center justify-center text-black shadow-sm">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-black tracking-tight">
                Event-Driven Stress Valuation
              </h3>
              <p className="text-xs text-[#5e5e5e] leading-relaxed">
                Shocks apply strictly to eligible asset classes (duration haircuts on bonds, equity return corrections, incremental IFRS 9 ECL on loans) with zero-delta sector loss reconciliation (&Sigma; Sector Loss = Absolute Loss).
              </p>
            </div>
            <div className="pt-4 border-t border-[#d9d9d9] text-[11px] font-mono text-[#767676]">
              Multi-Asset Basel III & IFRS 9 Shocks
            </div>
          </div>

        </div>

        {/* Transparency Banner & CTA */}
        <div className="mt-12 p-6 rounded-2xl border border-[#d9d9d9] bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-black shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-black uppercase font-mono tracking-wider">
                Prototype Transparency Notice
              </h4>
              <p className="text-xs text-[#5e5e5e] mt-0.5">
                RiskPulse AI is an analytical prototype. Model outputs depend on the available data, selected methods, and documented assumptions.
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigateMethodology}
            className="shrink-0 text-xs font-medium"
            icon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Read the Methodology
          </Button>
        </div>

      </div>
    </section>
  );
};
