import React from 'react';

interface LandingFooterProps {
  onNavigateRoute: (routeId: string) => void;
}

export const LandingFooter: React.FC<LandingFooterProps> = ({
  onNavigateRoute
}) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-[#d9d9d9] bg-white text-black py-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          
          {/* Left Brand Identity (6 cols) */}
          <div className="md:col-span-6 space-y-4 max-w-sm">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-black rounded flex items-center justify-center text-white">
                <div className="flex items-center gap-[2px] h-3">
                  <span className="w-[2px] h-1.5 bg-white rounded-full"></span>
                  <span className="w-[2px] h-3 bg-white rounded-full"></span>
                  <span className="w-[2px] h-2 bg-white rounded-full"></span>
                  <span className="w-[2px] h-3 bg-white rounded-full"></span>
                  <span className="w-[2px] h-1.5 bg-white rounded-full"></span>
                </div>
              </div>
              <span className="text-base font-bold tracking-tight text-black flex items-center gap-1">
                RiskPulse <span className="font-mono text-xs px-1.5 py-0.2 bg-[#efefef] rounded text-black border border-[#d9d9d9]">AI</span>
              </span>
            </div>
            
            <p className="text-xs text-[#5e5e5e] leading-relaxed">
              AI-powered financial risk intelligence for explainable analysis and portfolio scenario evaluation.
            </p>

            <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#767676]">
              <span>S&P Global & CRISIL Campus Hackathon 2026</span>
            </div>
          </div>

          {/* Right Product Columns (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              Product Systems
            </h4>
            <ul className="space-y-2 text-xs text-[#5e5e5e]">
              <li>
                <button 
                  onClick={() => onNavigateRoute('overview')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Executive Overview
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('nlp')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  NLP Risk Engine
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('signals')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Risk Signal Explorer
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('rebalancing')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Tactical Index Rebalancing
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('stress')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Portfolio Stress Testing
                </button>
              </li>
            </ul>
          </div>

          {/* Right Resources Columns (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-black">
              Governance & Data
            </h4>
            <ul className="space-y-2 text-xs text-[#5e5e5e]">
              <li>
                <button 
                  onClick={() => onNavigateRoute('methodology')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Methodology & Formulations
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('sources')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Data Ingestion & Provenance
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('history')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Historical Audit Trail
                </button>
              </li>
              <li>
                <button 
                  onClick={() => onNavigateRoute('portfolio')} 
                  className="hover:text-black transition-colors focus:outline-none"
                >
                  Wholesale Portfolio Explorer
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Regulatory & Institutional Financial Disclaimer */}
        <div className="pt-8 border-t border-[#d9d9d9] space-y-4">
          <p className="text-[11px] text-[#767676] leading-relaxed max-w-4xl">
            <strong>Disclaimer:</strong> RiskPulse AI is an educational financial risk analysis prototype. Model outputs and portfolio scenarios are estimates based on available data and documented assumptions. Simulated results do not represent actual trading performance or guaranteed outcomes. This platform does not provide financial advice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#f3f3f3] text-[11px] text-[#767676]">
            <span>&copy; {currentYear} RiskPulse AI. Academic & Engineering Hackathon Prototype.</span>
            <div className="flex items-center gap-4 font-mono text-[10px]">
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
