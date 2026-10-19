import React from 'react';
import { ArrowRight, Layers, Sliders, BarChart3, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface MethodologySectionProps {
  onNavigateMethodology: () => void;
}

export const MethodologySection: React.FC<MethodologySectionProps> = ({
  onNavigateMethodology
}) => {
  return (
    <section id="methodology" className="py-20 lg:py-28 border-b border-[#282828] bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333] inline-block mb-3">
            Governance & Audit
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            Built for transparent auditability.
          </h2>
          <p className="text-base text-[#b3b3b3] mt-2 leading-relaxed">
            Every output is traceable to an input event, a documented mathematical formulation, and explicit portfolio parameters.
          </p>
        </div>

        {/* 3 Methodology Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Block 1: NLP Methodology */}
          <div className="p-6 rounded-[8px] border border-[#282828] bg-[#181818] hover:bg-[#202020] hover:border-[#383838] transition-all flex flex-col justify-between space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#282828] flex items-center justify-center text-[#1ed760] group-hover:bg-[#1ed760] group-hover:text-black transition-colors">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                NLP Classification Engine
              </h3>
              <p className="text-xs text-[#b3b3b3] leading-relaxed">
                Deterministic sentiment scoring, taxonomy mapping across 20 event categories, and calibrated severity ratings with rule-based fallback verification.
              </p>
            </div>
            <div className="pt-4 border-t border-[#282828] text-[11px] font-mono text-[#7c7c7c]">
              FinBERT & Lexicon Validation
            </div>
          </div>

          {/* Block 2: Tactical Rebalancing */}
          <div className="p-6 rounded-[8px] border border-[#282828] bg-[#181818] hover:bg-[#202020] hover:border-[#383838] transition-all flex flex-col justify-between space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#282828] flex items-center justify-center text-[#1ed760] group-hover:bg-[#1ed760] group-hover:text-black transition-colors">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Constrained Rebalancing
              </h3>
              <p className="text-xs text-[#b3b3b3] leading-relaxed">
                Candidate allocations respect position bounds (2.0% to 20.0%), normalize to 100%, and enforce one-way turnover budgets to control execution friction.
              </p>
            </div>
            <div className="pt-4 border-t border-[#282828] text-[11px] font-mono text-[#7c7c7c]">
              Box-Constrained Optimization
            </div>
          </div>

          {/* Block 3: Stress Testing */}
          <div className="p-6 rounded-[8px] border border-[#282828] bg-[#181818] hover:bg-[#202020] hover:border-[#383838] transition-all flex flex-col justify-between space-y-4 shadow-[0_4px_12px_rgba(0,0,0,0.3)] group">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#282828] flex items-center justify-center text-[#1ed760] group-hover:bg-[#1ed760] group-hover:text-black transition-colors">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Stress Scenario Valuation
              </h3>
              <p className="text-xs text-[#b3b3b3] leading-relaxed">
                Simulates equity corrections, fixed income duration haircuts, and incremental IFRS 9 credit loss provisions with exact sector loss reconciliation.
              </p>
            </div>
            <div className="pt-4 border-t border-[#282828] text-[11px] font-mono text-[#7c7c7c]">
              Multi-Asset Valuation & ECL
            </div>
          </div>

        </div>

        {/* Transparency Banner & CTA */}
        <div className="mt-12 p-6 rounded-[8px] border border-[#282828] bg-[#181818] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_4px_16px_rgba(0,0,0,0.4)]">
          <div className="flex items-center gap-3">
            <ShieldCheck className="w-6 h-6 text-[#1ed760] shrink-0" />
            <div>
              <h4 className="text-xs font-bold text-white uppercase font-mono tracking-[1.4px]">
                Prototype Transparency Notice
              </h4>
              <p className="text-xs text-[#b3b3b3] mt-0.5">
                RiskPulse is an analytical prototype. Model outputs depend on the available data, selected methods, and documented assumptions.
              </p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={onNavigateMethodology}
            icon={<ArrowRight className="w-4 h-4" />}
            className="shrink-0"
          >
            Inspect Audit Trail
          </Button>
        </div>

      </div>
    </section>
  );
};
