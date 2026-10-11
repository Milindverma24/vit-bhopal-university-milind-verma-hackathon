import React from 'react';
import { Database, ShieldCheck, Sliders, BarChart3 } from 'lucide-react';

const CAPABILITIES = [
  {
    icon: Database,
    title: 'Public & Synthetic Data',
    description: 'Compliant financial news wires & zero-PII synthetic banking exposures.'
  },
  {
    icon: ShieldCheck,
    title: 'Explainable Risk Signals',
    description: 'Deterministic sentiment scoring & rule-based event evidence extraction.'
  },
  {
    icon: Sliders,
    title: 'Constraint-Aware Rebalancing',
    description: 'Box-constrained portfolio optimization ($w \\in [2\\%, 20\\%]$) with turnover limits.'
  },
  {
    icon: BarChart3,
    title: 'Event-Driven Stress Testing',
    description: 'IFRS 9 Expected Credit Loss & multi-scenario sector loss attribution.'
  }
];

export const CapabilityStrip: React.FC = () => {
  return (
    <section className="py-12 border-b border-[#d9d9d9] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#d9d9d9]">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div 
                key={cap.title} 
                className={`pt-6 sm:pt-0 ${idx !== 0 ? 'sm:pl-8' : ''} flex flex-col justify-start`}
              >
                <div className="w-9 h-9 rounded-lg bg-[#f3f3f3] border border-[#d9d9d9] flex items-center justify-center text-black mb-3.5">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-black tracking-tight">
                  {cap.title}
                </h4>
                <p className="text-xs text-[#5e5e5e] mt-1.5 leading-relaxed">
                  {cap.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
