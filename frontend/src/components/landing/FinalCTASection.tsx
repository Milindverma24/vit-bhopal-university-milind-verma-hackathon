import React from 'react';
import { ArrowRight } from 'lucide-react';

interface FinalCTASectionProps {
  onOpenDashboard: () => void;
  onNavigateMethodology: () => void;
}

export const FinalCTASection: React.FC<FinalCTASectionProps> = ({
  onOpenDashboard,
  onNavigateMethodology
}) => {
  return (
    <section className="py-20 lg:py-28 bg-[#121212]">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Spotify Deep Card Panel with Ambient Green Glow */}
        <div className="rounded-[8px] bg-[#181818] border border-[#282828] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.7)]">
          
          {/* Subtle Spotify Green ambient gradient in corner */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle_at_top_right,rgba(30,215,96,0.12),transparent_70%)] pointer-events-none" />

          <div className="max-w-3xl space-y-6 relative z-10">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] px-3.5 py-1.5 rounded-full border border-[#333333] bg-[#1f1f1f] inline-block">
              Get Started
            </span>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Institutional risk intelligence, ready to explore.
            </h2>

            <p className="text-base sm:text-lg text-[#b3b3b3] leading-relaxed max-w-2xl">
              Launch the platform to explore real-time market sentiment, test tactical index adjustments, and simulate portfolio crisis shocks.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
              <button
                onClick={onOpenDashboard}
                className="h-12 px-8 rounded-full bg-[#1ed760] text-black font-bold text-xs uppercase tracking-[1.4px] hover:bg-[#1fdf64] hover:scale-[1.02] active:scale-[0.98] transition-all inline-flex items-center justify-center gap-2 group focus:outline-none cursor-pointer shadow-[0_4px_16px_rgba(30,215,96,0.4)]"
              >
                <span>Launch Platform</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={onNavigateMethodology}
                className="h-12 px-8 rounded-full bg-transparent text-white border border-[#7c7c7c] hover:border-white font-bold text-xs uppercase tracking-[1.4px] transition-colors inline-flex items-center justify-center gap-2 focus:outline-none cursor-pointer"
              >
                <span>View Methodology</span>
              </button>
            </div>
          </div>

          {/* Spotify Waveform Bars Graphic on the right */}
          <div className="hidden lg:block absolute right-12 bottom-10 opacity-30 pointer-events-none">
            <div className="flex items-end gap-2.5 h-44">
              <div className="w-3.5 h-16 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3.5 h-32 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }}></div>
              <div className="w-3.5 h-20 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-3.5 h-40 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              <div className="w-3.5 h-24 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: '0.15s' }}></div>
              <div className="w-3.5 h-12 bg-[#1ed760] rounded-full animate-pulse" style={{ animationDelay: '0.5s' }}></div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
