import React from 'react';
import { ArrowRight, BookOpen } from 'lucide-react';
import { Button } from '../ui/Button';

interface FinalCTASectionProps {
  onOpenDashboard: () => void;
  onNavigateMethodology: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onOpenDashboard,
  onNavigateMethodology
}) => {
  return (
    <section className="py-20 lg:py-28 bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Full-Width Black Panel */}
        <div className="rounded-2xl bg-black text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          
          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#9E9EA0] px-2.5 py-0.5 rounded-full border border-[#39393B] bg-[#282828] inline-block">
              GET STARTED WITH RISKPULSE AI
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Make financial risk easier to understand.
            </h2>

            <p className="text-base sm:text-lg text-[#9E9EA0] leading-relaxed max-w-2xl">
              Explore how text-based intelligence connects to allocation analysis and portfolio stress scenarios in an integrated, transparent platform.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <button
                onClick={onOpenDashboard}
                className="h-12 px-8 rounded-full bg-white text-black font-semibold text-sm hover:bg-[#efefef] transition-colors inline-flex items-center justify-center gap-2 group focus:outline-none"
              >
                <span>Open Risk Dashboard</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onNavigateMethodology}
                className="h-12 px-8 rounded-full bg-transparent text-white border border-[#4B4B4D] hover:border-white font-medium text-sm transition-colors inline-flex items-center justify-center gap-2 focus:outline-none"
              >
                <span>Review Methodology</span>
              </button>
            </div>
          </div>

          {/* Minimalist Monochrome Accent Waves on the right */}
          <div className="hidden lg:block absolute right-12 bottom-8 opacity-20 pointer-events-none">
            <div className="flex items-end gap-3 h-44">
              <div className="w-4 h-20 bg-white rounded-t-lg"></div>
              <div className="w-4 h-32 bg-white rounded-t-lg"></div>
              <div className="w-4 h-24 bg-white rounded-t-lg"></div>
              <div className="w-4 h-40 bg-white rounded-t-lg"></div>
              <div className="w-4 h-16 bg-white rounded-t-lg"></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
