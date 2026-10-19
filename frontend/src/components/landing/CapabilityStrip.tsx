import React from 'react';
import { Database, ShieldCheck, Sliders, BarChart3 } from 'lucide-react';

const CAPABILITIES = [
  {
    icon: Database,
    title: 'Auditable Data Feeds',
    description: 'Curated financial news streams paired with verified synthetic credit portfolios.'
  },
  {
    icon: ShieldCheck,
    title: 'Explainable Signals',
    description: 'Calibrated sentiment scoring and taxonomy classification with direct text evidence.'
  },
  {
    icon: Sliders,
    title: 'Constrained Rebalancing',
    description: 'Portfolio optimization with bounded constituent weights (2% to 20%) and turnover control.'
  },
  {
    icon: BarChart3,
    title: 'Macro Stress Testing',
    description: 'Multi-scenario shock modeling with expected credit loss and sector loss attribution.'
  }
];

export const CapabilityStrip: React.FC = () => {
  return (
    <section className="py-12 border-b border-[#282828] bg-[#181818]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 divide-y sm:divide-y-0 sm:divide-x divide-[#282828]">
          {CAPABILITIES.map((cap, idx) => {
            const Icon = cap.icon;
            return (
              <div 
                key={cap.title} 
                className={`pt-6 sm:pt-0 ${idx !== 0 ? 'sm:pl-8' : ''} flex flex-col justify-start`}
              >
                <div className="w-9 h-9 rounded-full bg-[#1f1f1f] border border-[#333333] flex items-center justify-center text-[#1ed760] mb-3.5">
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className="text-sm font-bold text-white tracking-tight">
                  {cap.title}
                </h4>
                <p className="text-xs text-[#b3b3b3] mt-1.5 leading-relaxed">
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
