import React from 'react';

export const AppFooter: React.FC<{ onNavigate: (tabId: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-[#121212] text-white mt-auto border-t border-[#282828] transition-colors">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-[#282828]">
          {/* Col 1: Wordmark & Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">RiskPulse</span>
            </div>
            <p className="text-xs text-[#b3b3b3] leading-relaxed">
              Institutional AI-powered financial risk intelligence platform converting unstructured financial media into structured, explainable decision signals.
            </p>
            <div className="text-[11px] font-mono text-[#7c7c7c]">
              Version 1.0 • Institutional Prototype
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-[1.4px] text-[11px] font-mono mb-2">
              Intelligence
            </h4>
            <ul className="space-y-2 text-[#b3b3b3]">
              <li>
                <button onClick={() => onNavigate('overview')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Executive Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('feed')} className="hover:text-white transition-colors cursor-pointer text-left">
                  News & Social Feed
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nlp')} className="hover:text-white transition-colors cursor-pointer text-left">
                  NLP Risk Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('companies')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Company Risk Profiles
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portfolio & Stress Testing */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-[1.4px] text-[11px] font-mono mb-2">
              Portfolio Systems
            </h4>
            <ul className="space-y-2 text-[#b3b3b3]">
              <li>
                <button onClick={() => onNavigate('rebalancing')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Tactical Index Rebalancing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Portfolio Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stress')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Strategic Stress Testing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Historical Alpha Analysis
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Governance & Provenance */}
          <div className="space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase tracking-[1.4px] text-[11px] font-mono mb-2">
              Governance & Audit
            </h4>
            <ul className="space-y-2 text-[#b3b3b3]">
              <li>
                <button onClick={() => onNavigate('methodology')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Methodology & Audit Trail
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sources')} className="hover:text-white transition-colors cursor-pointer text-left">
                  Data Sources & Provenance
                </button>
              </li>
              <li>
                <span className="text-[#7c7c7c]">Synthetic Data Isolation: Active</span>
              </li>
              <li>
                <span className="text-[#7c7c7c]">Zero Confidential Records Stored</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory & Prototype Disclaimer */}
        <div className="space-y-4 text-xs text-[#b3b3b3]">
          <p className="leading-relaxed text-[11px] border-l-2 border-[#1ed760] pl-3 py-1 bg-[#181818] rounded-r-[8px]">
            <strong className="text-white">Institutional Disclaimer:</strong> RiskPulse is an institutional risk analysis system. Its model outputs and portfolio scenarios are estimates based on the available data and documented assumptions. Simulated results do not represent actual trading performance or guaranteed outcomes. This platform does not provide financial advice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-[#282828] text-[11px] text-[#7c7c7c]">
            <span>&copy; {new Date().getFullYear()} RiskPulse. Institutional Financial Risk Intelligence Platform.</span>
            <div className="flex items-center gap-4 text-[#7c7c7c]">
              <span>MIT License</span>
              <span>•</span>
              <span>Open Source Architecture</span>
              <span>•</span>
              <span>Deterministic Auditing</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
