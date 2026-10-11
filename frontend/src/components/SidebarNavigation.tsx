import React from 'react';
import { 
  Activity, 
  Rss, 
  ShieldAlert, 
  Layers, 
  Building2, 
  Sliders, 
  Briefcase, 
  BarChart3, 
  Database, 
  TrendingUp, 
  BookOpen,
  Globe,
  X
} from 'lucide-react';

export interface NavItemDef {
  id: string;
  path: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
}

export interface NavSectionDef {
  title: string;
  items: NavItemDef[];
}

export const NAV_SECTIONS: NavSectionDef[] = [
  {
    title: 'Platform',
    items: [
      { id: 'landing', path: '/', label: 'Product Landing', icon: Globe },
      { id: 'overview', path: '/dashboard', label: 'Executive Overview', icon: Activity }
    ]
  },
  {
    title: 'Intelligence',
    items: [
      { id: 'feed', path: '/intelligence/feed', label: 'News & Social Feed', icon: Rss },
      { id: 'nlp', path: '/intelligence/analyze', label: 'NLP Risk Engine', icon: ShieldAlert },
      { id: 'signals', path: '/intelligence/signals', label: 'Risk Signal Explorer', icon: Layers },
      { id: 'companies', path: '/intelligence/companies', label: 'Company Risk Profiles', icon: Building2 }
    ]
  },
  {
    title: 'Portfolio',
    items: [
      { id: 'rebalancing', path: '/portfolio/rebalancing', label: 'Tactical Index Rebalancing', icon: Sliders },
      { id: 'portfolio', path: '/portfolio/explorer', label: 'Portfolio Explorer', icon: Briefcase },
      { id: 'stress', path: '/portfolio/stress-testing', label: 'Stress Testing', icon: BarChart3 }
    ]
  },
  {
    title: 'System',
    items: [
      { id: 'sources', path: '/system/data-sources', label: 'Data Sources', icon: Database },
      { id: 'history', path: '/analytics/history', label: 'Historical Analysis', icon: TrendingUp },
      { id: 'methodology', path: '/system/methodology', label: 'Methodology & Audit', icon: BookOpen }
    ]
  }
];

interface SidebarNavigationProps {
  activeTab: string;
  onNavigate: (tabId: string) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onNavigate,
  mobileOpen,
  onCloseMobile
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-64 bg-white border-r border-[#d9d9d9] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Wordmark Top (Section 5.2) */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[#d9d9d9] shrink-0">
          <div
            className="flex items-center gap-2.5 cursor-pointer select-none"
            onClick={() => onNavigate('landing')}
            title="Return to Product Landing Page"
          >
            {/* Minimalist Monochrome Geometric Signal Logo */}
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold font-mono tracking-tighter">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 12h3l3-8 4 16 3-8h5" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-black">RiskPulse</span>
                <span className="text-[11px] font-mono font-semibold px-1.5 py-0.2 rounded bg-black text-white">
                  AI
                </span>
              </div>
              <p className="text-[10px] text-[#767676] leading-none mt-0.5">Financial Risk Intelligence</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-full hover:bg-[#efefef] text-[#767676]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-5 px-3 space-y-6">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1.5 text-[11px] font-mono uppercase tracking-wider text-[#767676] font-semibold">
                {section.title}
              </div>
              <nav className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;

                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        onNavigate(item.id);
                        onCloseMobile();
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-full text-xs font-medium transition-all group select-none text-left ${
                        isActive
                          ? 'bg-[#efefef] text-black font-semibold border-l-4 border-l-black pl-2.5'
                          : 'text-[#5e5e5e] hover:text-black hover:bg-[#f3f3f3]'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-black' : 'text-[#767676] group-hover:text-black'}`} />
                        <span className="truncate">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-black text-white font-mono">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* System Architecture Metadata Footer */}
        <div className="p-4 border-t border-[#d9d9d9] bg-[#f3f3f3] text-[11px] text-[#767676] shrink-0">
          <div className="flex items-center justify-between mb-1">
            <span className="font-medium text-black">Compliance Stance</span>
            <span className="font-mono text-[10px] text-black bg-[#e2e2e2] px-1.5 py-0.5 rounded">
              BASEL III / SEC
            </span>
          </div>
          <p className="leading-snug text-[#5e5e5e] text-[10px]">
            Explainable Zero-Key Lexicon + FinBERT Hybrid Architecture.
          </p>
        </div>
      </aside>
    </>
  );
};
