import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeroSectionProps {
  onOpenDashboard: () => void;
  onExploreMethodology: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onOpenDashboard,
  onExploreMethodology
}) => {
  return (
    <section className="relative overflow-hidden pt-20 pb-24 lg:pt-28 lg:pb-32 border-b border-[#282828] bg-[#121212]">
      {/* Ambient Spotify Green Glow in center */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-[#1ed760]/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-7">
          
          {/* Eyebrow Label */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#181818] border border-[#282828] text-xs font-mono text-white font-bold">
            <span>INSTITUTIONAL RISK PLATFORM</span>
          </div>

          {/* Main Bold Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-[62px] font-bold text-white tracking-tight leading-[1.08]">
            Grounded risk intelligence for modern portfolios.
          </h1>

          {/* Supporting Copy */}
          <p className="text-lg sm:text-xl text-[#b3b3b3] leading-relaxed max-w-2xl mx-auto font-normal">
            Monitor news sentiment, evaluate tactical index adjustments, and simulate portfolio stress scenarios—all backed by transparent, reproducible evidence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <Button
              variant="primary"
              size="lg"
              onClick={onOpenDashboard}
              className="justify-center group font-bold h-12 px-8 min-w-[200px]"
              icon={<ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
            >
              Launch Platform
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={onExploreMethodology}
              className="justify-center font-bold h-12 px-8 min-w-[200px]"
            >
              Explore Methodology
            </Button>
          </div>

          {/* Supporting Metadata */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-y-2 gap-x-5 text-xs font-mono text-[#7c7c7c]">
            <span className="text-[#b3b3b3]">NLP Signal Extraction</span>
            <span className="text-[#383838]">•</span>
            <span className="text-[#b3b3b3]">Tactical Allocation</span>
            <span className="text-[#383838]">•</span>
            <span className="text-[#b3b3b3]">Portfolio Stress Testing</span>
          </div>

        </div>
      </div>
    </section>
  );
};
