import React from 'react';
import { Rss, Brain, Sliders, BarChart4 } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Rss,
    title: 'Ingest',
    description: 'Collect financial headlines and regulatory disclosures with continuous deduplication.'
  },
  {
    num: '02',
    icon: Brain,
    title: 'Classify',
    description: 'Extract sentiment scores, pinpoint affected entities, and assign calibrated 1–10 impact ratings.'
  },
  {
    num: '03',
    icon: Sliders,
    title: 'Rebalance',
    description: 'Formulate tactical allocation proposals bounded by position limits and turnover budgets.'
  },
  {
    num: '04',
    icon: BarChart4,
    title: 'Stress Test',
    description: 'Simulate macroeconomic stress events and attribute projected losses across sectors.'
  }
];

export const WorkflowSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-b border-[#282828] bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333] inline-block mb-3">
            How It Works
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-white mt-1">
            A direct path from news to portfolio decisions.
          </h2>
          <p className="text-base text-[#b3b3b3] mt-2 leading-relaxed">
            Four transparent steps connect unstructured market text with tactical rebalancing and risk simulation.
          </p>
        </div>

        {/* 4-Step Grid with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="relative flex flex-col p-6 rounded-[8px] border border-[#282828] bg-[#181818] hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)] group"
              >
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold font-mono text-[#1ed760] group-hover:scale-105 transition-transform">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-full bg-[#1f1f1f] border border-[#282828] flex items-center justify-center text-[#1ed760] group-hover:bg-[#1ed760] group-hover:text-black transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-white tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#b3b3b3] leading-relaxed flex-1">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};
