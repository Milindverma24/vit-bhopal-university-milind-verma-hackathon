import React from 'react';

export const AppFooter: React.FC<{ onNavigate: (tabId: string) => void }> = ({ onNavigate }) => {
  return (
    <footer className="bg-black text-white mt-auto border-t border-black">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10 pb-10 border-b border-[#282828]">
          {/* Col 1: Wordmark & Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg tracking-tight text-white">RiskPulse</span>
              <span className="text-xs font-mono font-semibold px-1.5 py-0.2 rounded bg-white text-black">
                AI
              </span>
            </div>
            <p className="text-xs text-[#d9d9d9] leading-relaxed">
              Institutional AI-powered financial risk intelligence platform converting unstructured financial media into structured, explainable decision signals.
            </p>
            <div className="text-[11px] font-mono text-[#767676]">
              Version 1.0 • Institutional Prototype
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono mb-2">
              Intelligence
            </h4>
            <ul className="space-y-1.5 text-[#d9d9d9]">
              <li>
                <button onClick={() => onNavigate('overview')} className="hover:text-white transition-colors">
                  Executive Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('feed')} className="hover:text-white transition-colors">
                  News & Social Feed
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('nlp')} className="hover:text-white transition-colors">
                  NLP Risk Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('companies')} className="hover:text-white transition-colors">
                  Company Risk Profiles
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Portfolio & Stress Testing */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono mb-2">
              Portfolio Systems
            </h4>
            <ul className="space-y-1.5 text-[#d9d9d9]">
              <li>
                <button onClick={() => onNavigate('rebalancing')} className="hover:text-white transition-colors">
                  Tactical Index Rebalancing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('portfolio')} className="hover:text-white transition-colors">
                  Portfolio Explorer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('stress')} className="hover:text-white transition-colors">
                  Strategic Stress Testing
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-white transition-colors">
                  Historical Alpha Analysis
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Governance & Provenance */}
          <div className="space-y-2 text-xs">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px] font-mono mb-2">
              Governance & Audit
            </h4>
            <ul className="space-y-1.5 text-[#d9d9d9]">
              <li>
                <button onClick={() => onNavigate('methodology')} className="hover:text-white transition-colors">
                  Methodology & Audit Trail
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('sources')} className="hover:text-white transition-colors">
                  Data Sources & Provenance
                </button>
              </li>
              <li>
                <span className="text-[#767676]">Synthetic Data Isolation: Active</span>
              </li>
              <li>
                <span className="text-[#767676]">Zero Confidential Records Stored</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mandatory Regulatory & Prototype Disclaimer (Section 28) */}
        <div className="space-y-4 text-xs text-[#767676]">
          <p className="leading-relaxed text-[11px] border-l-2 border-[#4b4b4b] pl-3 py-1">
            <strong className="text-white">Institutional Disclaimer:</strong> RiskPulse AI is an educational financial risk analysis prototype. Its model outputs and portfolio scenarios are estimates based on the available data and documented assumptions. Simulated results do not represent actual trading performance or guaranteed outcomes. This platform does not provide financial advice.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-4 border-t border-[#282828] text-[11px]">
            <span>&copy; {new Date().getFullYear()} RiskPulse AI. Academic & Engineering Hackathon Prototype.</span>
            <div className="flex items-center gap-4 text-[#767676]">
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
