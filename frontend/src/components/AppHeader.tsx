import React from 'react';
import { Menu, RefreshCw, BookOpen, ShieldCheck, Search, Globe } from 'lucide-react';
import { Button } from './ui/Button';
import { DataModeBadge } from './ui/Badges';

interface AppHeaderProps {
  systemStatus: string;
  onRefresh: () => void;
  refreshing: boolean;
  onToggleMobileMenu: () => void;
  onOpenMethodology: () => void;
  onOpenLanding?: () => void;
  activeTabTitle: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  systemStatus,
  onRefresh,
  refreshing,
  onToggleMobileMenu,
  onOpenMethodology,
  onOpenLanding,
  activeTabTitle
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white border-b border-[#d9d9d9] h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
      {/* Left: Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-full hover:bg-[#efefef] text-black"
          title="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-medium text-[#767676] hidden sm:inline">
            RiskPulse AI /
          </span>
          <h2 className="text-sm sm:text-base font-bold text-black tracking-tight">
            {activeTabTitle}
          </h2>
        </div>
      </div>

      {/* Center: Institutional Status Badge */}
      <div className="hidden md:flex items-center gap-2">
        <DataModeBadge mode={systemStatus.includes('FinBERT') ? 'LIVE AI MODE' : 'DEMO & LEXICON'} />
        <span className="text-xs text-[#767676] font-mono hidden xl:inline">
          {systemStatus}
        </span>
      </div>

      {/* Right: Controls & Utilities */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          loading={refreshing}
          icon={<RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />}
          title="Refresh All Risk Signals & Telemetry"
        >
          <span className="hidden sm:inline">Refresh Data</span>
        </Button>

        {onOpenLanding && (
          <Button
            variant="subtle"
            size="sm"
            onClick={onOpenLanding}
            icon={<Globe className="w-3.5 h-3.5" />}
            title="Return to Product Landing Page"
          >
            <span className="hidden sm:inline">Landing Page</span>
          </Button>
        )}

        <Button
          variant="subtle"
          size="sm"
          onClick={onOpenMethodology}
          icon={<BookOpen className="w-3.5 h-3.5" />}
          title="View Explainable Methodology & Audit"
        >
          <span className="hidden sm:inline">Methodology</span>
        </Button>
      </div>
    </header>
  );
};
