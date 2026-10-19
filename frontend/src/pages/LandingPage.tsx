import React from 'react';
import { LandingHeader } from '../components/landing/LandingHeader';
import { HeroSection } from '../components/landing/HeroSection';
import { ProductPreviewSection } from '../components/landing/ProductPreviewSection';
import { CapabilityStrip } from '../components/landing/CapabilityStrip';
import { WorkflowSection } from '../components/landing/WorkflowSection';
import { RiskEngineSection } from '../components/landing/RiskEngineSection';
import { RebalancingSection } from '../components/landing/RebalancingSection';
import { StressTestingSection } from '../components/landing/StressTestingSection';
import { RiskSignalDemo } from '../components/landing/RiskSignalDemo';
import { MethodologySection } from '../components/landing/MethodologySection';
import { FinalCTASection } from '../components/landing/FinalCTASection';
import { LandingFooter } from '../components/landing/LandingFooter';

interface LandingPageProps {
  onNavigate: (routeId: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans selection:bg-[#1ed760] selection:text-black">
      {/* 1. Sticky Navigation Header */}
      <LandingHeader 
        onOpenDashboard={() => onNavigate('overview')}
        onNavigateRoute={(routeId) => onNavigate(routeId)}
      />

      <main className="flex-1 w-full">
        {/* 2. Hero Section */}
        <HeroSection
          onOpenDashboard={() => onNavigate('overview')}
          onExploreMethodology={() => {
            const el = document.getElementById('methodology');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* 3. Product Intelligence Preview */}
        <ProductPreviewSection />

        {/* 4. Trust and Capability Strip */}
        <CapabilityStrip />

        {/* 5. How It Works Section */}
        <WorkflowSection />

        {/* 6. AI/NLP Risk Engine Feature Section */}
        <RiskEngineSection 
          onNavigateSignals={() => onNavigate('signals')}
        />

        {/* 7. Tactical Index Rebalancing Feature Section */}
        <RebalancingSection 
          onNavigateRebalancing={() => onNavigate('rebalancing')}
        />

        {/* 8. Portfolio Stress Testing Feature Section */}
        <StressTestingSection 
          onNavigateStress={() => onNavigate('stress')}
        />

        {/* 9. Interactive Risk Intelligence Demonstration */}
        <RiskSignalDemo />

        {/* 10. Methodology and Explainability Section */}
        <MethodologySection 
          onNavigateMethodology={() => onNavigate('methodology')}
        />

        {/* 11. Final Call-to-Action Section */}
        <FinalCTASection 
          onOpenDashboard={() => onNavigate('overview')}
          onNavigateMethodology={() => onNavigate('methodology')}
        />
      </main>

      {/* 12. Minimal Institutional Footer */}
      <LandingFooter 
        onNavigateRoute={(routeId) => onNavigate(routeId)}
      />
    </div>
  );
};
