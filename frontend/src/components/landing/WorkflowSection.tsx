import React from 'react';
import { Rss, Brain, Sliders, BarChart4 } from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: Rss,
    title: 'Ingest financial information',
    description: 'Collect permitted public news, market feeds, and clearly labeled synthetic records with rate-limit protection.'
  },
  {
    num: '02',
    icon: Brain,
    title: 'Extract risk signals',
    description: 'Analyze sentiment (-1.0 to +1.0), classify into 20 event taxonomies, and score severity on an explainable 1-10 scale.'
  },
  {
    num: '03',
    icon: Sliders,
    title: 'Evaluate portfolio implications',
    description: 'Translate relevant signals into constrained tactical allocation proposals and event-specific stress assumptions.'
  },
  {
    num: '04',
    icon: BarChart4,
    title: 'Inspect the results',
    description: 'Review portfolio valuation changes, granular sector loss attribution, and the audit trail behind each result.'
  }
];

export const WorkflowSection: React.FC = () => {
  return (
    <section id="how-it-works" className="py-20 lg:py-28 border-b border-[#d9d9d9] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-black bg-[#efefef] px-2.5 py-0.5 rounded-full border border-[#d9d9d9]">
            END-TO-END DATA ARCHITECTURE
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-black mt-3">
            From unstructured data to structured decisions.
          </h2>
          <p className="text-base text-[#5e5e5e] mt-2 leading-relaxed">
            RiskPulse AI connects text analysis with portfolio-level scenario evaluation through a transparent analytical workflow.
          </p>
        </div>

        {/* 4-Step Grid with Connectors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.num}
                className="relative flex flex-col p-6 rounded-2xl border border-[#d9d9d9] bg-[#fafafa] hover:border-black transition-colors"
              >
                {/* Step Number & Icon */}
                <div className="flex items-center justify-between mb-6">
                  <span className="text-3xl font-bold font-mono text-black">
                    {step.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-white border border-[#d9d9d9] flex items-center justify-center text-black shadow-sm">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="text-base font-bold text-black tracking-tight mb-2">
                  {step.title}
                </h3>
                <p className="text-xs text-[#5e5e5e] leading-relaxed flex-1">
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
