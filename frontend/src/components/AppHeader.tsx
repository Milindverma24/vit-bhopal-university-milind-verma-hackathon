import React from 'react';
import { Menu, RefreshCw, BookOpen, Globe } from 'lucide-react';
import { Button } from './ui/Button';

interface AppHeaderProps {
  onRefresh: () => void;
  refreshing: boolean;
  onToggleMobileMenu: () => void;
  onOpenMethodology: () => void;
  onOpenLanding?: () => void;
  activeTabTitle: string;
  activeTabSection?: string;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  onRefresh,
  refreshing,
  onToggleMobileMenu,
  onOpenMethodology,
  onOpenLanding,
  activeTabTitle,
  activeTabSection
}) => {
  return (
    <header className="sticky top-0 z-30 bg-[#121212]/95 backdrop-blur-md border-b border-[#282828] h-16 px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4 transition-colors">
      {/* Left: Mobile Toggle & Full Page Name Breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleMobileMenu}
          className="lg:hidden p-2 rounded-full hover:bg-[#282828] text-white transition-colors cursor-pointer shrink-0"
          title="Open Navigation Menu"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 whitespace-nowrap min-w-0">
          <span className="text-xs font-mono font-semibold text-[#7c7c7c] select-none shrink-0 hidden sm:inline">
            RiskPulse
          </span>
          <span className="text-[#383838] text-xs font-mono select-none shrink-0 hidden sm:inline">/</span>
          {activeTabSection && (
            <>
              <span className="text-xs font-mono text-[#a3a3a3] uppercase tracking-wider select-none shrink-0 hidden md:inline">
                {activeTabSection}
              </span>
              <span className="text-[#383838] text-xs font-mono select-none shrink-0 hidden md:inline">/</span>
            </>
          )}
          <h1 className="text-sm sm:text-base font-bold text-white tracking-tight whitespace-nowrap">
            {activeTabTitle}
          </h1>
        </div>
      </div>

      {/* Right: Controls & Utilities with Single-Line Text Boxes */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Button
          variant="secondary"
          size="sm"
          onClick={onRefresh}
          loading={refreshing}
          icon={<RefreshCw className={`w-3.5 h-3.5 shrink-0 ${refreshing ? 'animate-spin' : ''}`} />}
          title="Refresh All Risk Signals & Telemetry"
          className="whitespace-nowrap px-3.5 py-1.5 min-h-[36px] text-xs"
        >
          <span>Refresh Data</span>
        </Button>

        {onOpenLanding && (
          <Button
            variant="subtle"
            size="sm"
            onClick={onOpenLanding}
            icon={<Globe className="w-3.5 h-3.5 shrink-0" />}
            title="Return to Product Landing Page"
            className="whitespace-nowrap px-3.5 py-1.5 min-h-[36px] text-xs"
          >
            <span>Landing Page</span>
          </Button>
        )}

        <Button
          variant="subtle"
          size="sm"
          onClick={onOpenMethodology}
          icon={<BookOpen className="w-3.5 h-3.5 shrink-0" />}
          title="View Explainable Methodology & Audit"
          className="whitespace-nowrap px-3.5 py-1.5 min-h-[36px] text-xs"
        >
          <span>Methodology</span>
        </Button>
      </div>
    </header>
  );
};
