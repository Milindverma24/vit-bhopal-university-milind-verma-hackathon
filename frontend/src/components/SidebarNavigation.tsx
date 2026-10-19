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
  X,
  ShieldCheck
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
      { id: 'rebalancing', path: '/portfolio/rebalancing', label: 'Tactical Rebalancing', icon: Sliders },
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
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 lg:hidden transition-opacity"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#121212] border-r border-[#282828] flex flex-col transition-transform duration-200 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-[#282828] shrink-0">
          <div
            className="flex items-center cursor-pointer select-none group"
            onClick={() => onNavigate('landing')}
            title="Return to Product Landing Page"
          >
            <div>
              <span className="font-bold text-lg tracking-tight text-white block">
                RiskPulse
              </span>
              <p className="text-[10px] text-[#b3b3b3] font-medium leading-none mt-1">Financial Risk Intelligence</p>
            </div>
          </div>

          <button
            type="button"
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-full hover:bg-[#282828] text-[#b3b3b3] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Sections */}
        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-5">
          {NAV_SECTIONS.map((section) => (
            <div key={section.title}>
              <div className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-[1.4px] text-[#7c7c7c]">
                {section.title}
              </div>
              <nav className="space-y-1">
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
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs transition-all group select-none text-left cursor-pointer ${
                        isActive
                          ? 'bg-[#282828] text-white font-bold'
                          : 'text-[#b3b3b3] hover:text-white hover:bg-[#1a1a1a] font-medium'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-[#1ed760]' : 'text-[#b3b3b3] group-hover:text-white'}`} />
                        <span className="whitespace-nowrap text-xs">{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-mono ml-2 shrink-0 ${
                          isActive ? 'bg-[#1ed760] text-black font-bold' : 'bg-[#1f1f1f] text-[#b3b3b3]'
                        }`}>
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

        {/* Compliance Footer Card */}
        <div className="p-3.5 border-t border-[#282828] bg-[#121212] shrink-0">
          <div className="p-3 rounded-[8px] bg-[#181818] border border-[#282828]">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[11px] font-bold text-white flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1ed760]" />
                <span>Compliance</span>
              </span>
              <span className="font-mono text-[9px] font-bold text-[#1ed760] bg-[#1ed760]/10 border border-[#1ed760]/30 px-1.5 py-0.2 rounded-full">
                BASEL III / SEC
              </span>
            </div>
            <p className="leading-snug text-[#b3b3b3] text-[10px]">
              Deterministic FinBERT & Quantitative Hybrid Architecture.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
