import React from 'react';
import { 
  ShieldAlert, 
  Activity, 
  Layers, 
  BarChart3, 
  Sliders, 
  TrendingUp, 
  Briefcase, 
  Database, 
  BookOpen, 
  Rss
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  systemStatus: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, systemStatus }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'feed', label: 'News & Social Feed', icon: Rss },
    { id: 'nlp', label: 'NLP Risk Engine', icon: ShieldAlert },
    { id: 'signals', label: 'Signal Explorer', icon: Layers },
    { id: 'rebalancing', label: 'Tactical Rebalancing', icon: Sliders },
    { id: 'stress', label: 'Stress Testing', icon: BarChart3 },
    { id: 'portfolio', label: 'Portfolio Explorer', icon: Briefcase },
    { id: 'history', label: 'Historical Alpha', icon: TrendingUp },
    { id: 'sources', label: 'Data Sources', icon: Database },
    { id: 'methodology', label: 'Methodology & Audit', icon: BookOpen },
  ];

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-md">
      {/* Top Header Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('overview')}>
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-indigo-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ShieldAlert className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-white">RiskPulse</span>
                <span className="text-[10px] uppercase font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded">
                  S&P Global & CRISIL 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 hidden sm:block">Tactical Rebalancing & Strategic Stress Testing Engine</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-[11px] font-mono text-slate-400 hidden md:block bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
              SEC / BASEL III COMPLIANT ARCHITECTURE
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div className="bg-slate-950/80 border-t border-slate-800/80 backdrop-blur-sm overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 py-1.5 min-w-max">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/30 font-semibold'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
};
