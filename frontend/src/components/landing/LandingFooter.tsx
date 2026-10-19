import React from 'react';

interface LandingFooterProps {
  onNavigateRoute: (routeId: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateRoute
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#282828] bg-[#121212] text-white py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left Brand Identity (6 cols) */}
          <div className="md:col-span-6 space-y-4 max-w-sm">
            <div className="flex items-center gap-2.5">
              <span className="text-xl font-bold tracking-tight text-white">
                RiskPulse
              </span>
            </div>
            
            <p className="text-sm text-[#b3b3b3] leading-relaxed">
              Autonomous institutional financial risk intelligence platform combining domain NLP, Bayesian probability, and multi-scenario portfolio stress testing.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#7c7c7c]">
              <span>S&P Global & CRISIL Campus Hackathon 2026</span>
            </div>
          </div>

          {/* Right Product Columns (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-white">
              Product Systems
            </h4>
            <ul className="space-y-2.5 text-sm text-[#b3b3b3]">
              <li>
                <button 
                  onClick={() => onNavigateRoute('overview')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Executive Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('nlp')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  NLP Risk Engine
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('signals')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Risk Signal Explorer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('rebalancing')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Tactical Index Rebalancing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('stress')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Portfolio Stress Testing
                </button>
              </li>
            </ul>
          </div>

          {/* Right Resources Columns (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-[1.4px] text-white">
              Governance & Data
            </h4>
            <ul className="space-y-2.5 text-sm text-[#b3b3b3]">
              <li>
                <button 
                  onClick={() => onNavigateRoute('methodology')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Methodology & Formulations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('sources')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Data Ingestion & Provenance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('history')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Historical Audit Trail
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('portfolio')} 
                  className="hover:text-white transition-colors focus:outline-none cursor-pointer"
                >
                  Wholesale Portfolio Explorer
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Institutional Financial Disclaimer */}
        <div className="pt-8 border-t border-[#282828] space-y-4">
          <p className="text-xs text-[#7c7c7c] leading-relaxed max-w-4xl">
            <strong className="text-white">Regulatory Disclaimer:</strong> RiskPulse is an institutional risk analysis system. Model outputs, Bayesian scores, and portfolio scenario simulations are estimates synthesized from available public and synthetic financial disclosures. Simulated results do not constitute financial advice, credit rating certification, or guarantee of future asset performance.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#282828] text-xs text-[#7c7c7c]">
            <span>&copy; {currentYear} RiskPulse. Institutional Financial Analytics Platform.</span>
            <div className="flex items-center gap-4 font-mono text-[11px] text-[#7c7c7c]">
              <span>Zero-PII Compliance</span>
              <span>•</span>
              <span>OpenAPI Specification</span>
              <span>•</span>
              <span>MIT License</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};
