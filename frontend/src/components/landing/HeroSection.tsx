import React from 'react';
import { ArrowRight, ShieldCheck, Cpu, Sliders } from 'lucide-react';
import { Button } from '../ui/Button';
import { HeroAnalyticsPreview } from './HeroAnalyticsPreview';

interface HeroSectionProps {
  onOpenDashboard: () => void;
  onExploreMethodology: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDashboard,
  onExploreMethodology
}) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 border-b border-[#d9d9d9] bg-white">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-6 space-y-6">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#efefef] border border-[#d9d9d9] text-xs font-mono text-black font-medium">
              <span className="w-2 h-2 rounded-full bg-black animate-pulse" />
              <span>AI-POWERED FINANCIAL RISK INTELLIGENCE</span>
            </div>

            {/* Main Bold Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-black tracking-tight leading-[1.08] max-w-[620px]">
              Turn market noise into financial intelligence.
            </h1>

            {/* Supporting Copy */}
            <p className="text-base sm:text-lg text-[#5e5e5e] leading-relaxed max-w-[540px]">
              Transform financial news and social signals into explainable risk insights, sentiment-driven index allocations, and event-based portfolio stress simulations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenDashboard}
                className="justify-center group font-medium text-sm h-12 px-6"
                icon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
              >
                Open Risk Dashboard
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreMethodology}
                className="justify-center font-medium text-sm h-12 px-6"
              >
                Explore Methodology
              </Button>
            </div>

            {/* Supporting Metadata */}
            <div className="pt-4 border-t border-[#d9d9d9] flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-mono text-[#767676]">
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Explainable NLP
              </span>
              <span className="text-[#d9d9d9]">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Tactical Allocation
              </span>
              <span className="text-[#d9d9d9]">•</span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
                Scenario Analysis
              </span>
            </div>
          </div>

          {/* Right Column: Sophisticated Application Preview */}
          <div className="lg:col-span-6 w-full">
            <HeroAnalyticsPreview />
          </div>

        </div>
      </div>
    </section>
  );
};
