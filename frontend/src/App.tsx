import React, { useState, useEffect } from 'react';
import { SidebarNavigation, NAV_SECTIONS } from './components/SidebarNavigation';
import { AppHeader } from './components/AppHeader';
import { AppFooter } from './components/AppFooter';
import { SignalDetailModal } from './components/SignalDetailModal';
import { ToastProvider } from './components/ui/Toast';

import { OverviewPage } from './pages/OverviewPage';
import { FeedPage } from './pages/FeedPage';
import { NLPEnginePage } from './pages/NLPEnginePage';
import { SignalExplorerPage } from './pages/SignalExplorerPage';
import { CompanyRiskPage } from './pages/CompanyRiskPage';
import { RebalancingPage } from './pages/RebalancingPage';
import { StressTestingPage } from './pages/StressTestingPage';
import { PortfolioExplorerPage } from './pages/PortfolioExplorerPage';
import { HistoricalAnalysisPage } from './pages/HistoricalAnalysisPage';
import { DataSourcesPage } from './pages/DataSourcesPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { LandingPage } from './pages/LandingPage';

import { api } from './services/api';
import { DashboardSummary, RiskSignal } from './types';

// Tab to URL mapping adhering to Section 30 of DESIGN.md
const TAB_PATH_MAP: Record<string, string> = {
  landing: '/',
  overview: '/dashboard',
  feed: '/intelligence/feed',
  nlp: '/intelligence/analyze',
  signals: '/intelligence/signals',
  companies: '/intelligence/companies',
  rebalancing: '/portfolio/rebalancing',
  portfolio: '/portfolio/explorer',
  stress: '/portfolio/stress-testing',
  history: '/analytics/history',
  sources: '/system/data-sources',
  methodology: '/system/methodology'
};

const PATH_TAB_MAP: Record<string, string> = Object.entries(TAB_PATH_MAP).reduce(
  (acc, [tab, path]) => {
    acc[path] = tab;
    return acc;
  },
  {} as Record<string, string>
);
// Explicit root route maps to landing page
PATH_TAB_MAP['/'] = 'landing';

export const App: React.FC = () => {
  const getInitialTab = (): string => {
    const currentPath = window.location.pathname;
    if (currentPath === '/' || currentPath === '') return 'landing';
    if (PATH_TAB_MAP[currentPath]) return PATH_TAB_MAP[currentPath];
    if (currentPath.startsWith('/intelligence/companies/')) return 'companies';
    return 'landing';
  };

  const [activeTab, setActiveTab] = useState<string>(getInitialTab);
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [feedSignals, setFeedSignals] = useState<RiskSignal[]>([]);
  const [systemStatus, setSystemStatus] = useState('Connecting...');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<RiskSignal | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Initialize Route from window.location.pathname
  useEffect(() => {
    const currentPath = window.location.pathname;
    if (PATH_TAB_MAP[currentPath]) {
      setActiveTab(PATH_TAB_MAP[currentPath]);
    } else if (currentPath.startsWith('/intelligence/companies/')) {
      setActiveTab('companies');
    } else if (currentPath === '/' || currentPath === '') {
      setActiveTab('landing');
    }

    const handlePopState = () => {
      const path = window.location.pathname;
      if (PATH_TAB_MAP[path]) {
        setActiveTab(PATH_TAB_MAP[path]);
      } else if (path === '/' || path === '') {
        setActiveTab('landing');
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleNavigate = (tabId: string) => {
    setActiveTab(tabId);
    const path = TAB_PATH_MAP[tabId] || (tabId === 'landing' ? '/' : '/dashboard');
    if (window.location.pathname !== path) {
      window.history.pushState(null, '', path);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const loadInitialData = async () => {
    setLoading(true);
    try {
      const [health, dash, sigs] = await Promise.all([
        api.getHealth(),
        api.getDashboardSummary(),
        api.getSignals({ page: 1, pageSize: 60 })
      ]);
      setSystemStatus(health.nlp_mode || 'Active');
      setSummary(dash);
      setFeedSignals(sigs.items);
    } catch (err) {
      console.error('Failed to load initial data:', err);
      setSystemStatus('Offline / Fallback');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();
  }, []);

  const handleRefreshAll = async () => {
    setRefreshing(true);
    try {
      await loadInitialData();
    } finally {
      setRefreshing(false);
    }
  };

  const handleRefreshNews = async () => {
    try {
      await api.refreshNews(10);
      loadInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefreshSocial = async () => {
    try {
      await api.refreshSocial(20);
      loadInitialData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSignalCreated = (sig: RiskSignal) => {
    setSelectedSignal(sig);
    loadInitialData();
  };

  // Find active tab title and section for header
  let activeTabTitle = 'Executive Overview';
  let activeTabSection = 'Platform';
  for (const sec of NAV_SECTIONS) {
    const item = sec.items.find((i) => i.id === activeTab);
    if (item) {
      activeTabTitle = item.label;
      activeTabSection = sec.title;
      break;
    }
  }

  // If activeTab is landing, render full-bleed Landing Page with its own dedicated institutional header & footer
  if (activeTab === 'landing') {
    return (
      <ToastProvider>
        <LandingPage onNavigate={handleNavigate} />
        {/* Persistent Global Signal Detail Modal / Drawer if opened */}
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
        />
      </ToastProvider>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#121212] text-white flex flex-col font-sans selection:bg-[#1ed760] selection:text-black">
        {/* Left Sidebar Navigation (Desktop Fixed, Mobile Drawer) */}
        <SidebarNavigation
          activeTab={activeTab}
          onNavigate={handleNavigate}
          mobileOpen={mobileMenuOpen}
          onCloseMobile={() => setMobileMenuOpen(false)}
        />

        {/* Main Content Layout Container (Offset by lg:pl-72) */}
        <div className="lg:pl-72 flex flex-col flex-1 min-h-screen">
          {/* Top Sticky Institutional Header */}
          <AppHeader
            onRefresh={handleRefreshAll}
            refreshing={refreshing}
            onToggleMobileMenu={() => setMobileMenuOpen(true)}
            onOpenMethodology={() => handleNavigate('methodology')}
            onOpenLanding={() => handleNavigate('landing')}
            activeTabTitle={activeTabTitle}
            activeTabSection={activeTabSection}
          />

          {/* Analytical Page Content */}
          <main className="flex-1 w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'overview' && (
              <OverviewPage
                summary={summary}
                loading={loading}
                onRefresh={handleRefreshAll}
                onNavigateTab={handleNavigate}
                onSelectSignal={setSelectedSignal}
              />
            )}

            {activeTab === 'feed' && (
              <FeedPage
                signals={feedSignals}
                loading={loading}
                onRefreshNews={handleRefreshNews}
                onRefreshSocial={handleRefreshSocial}
                onSelectSignal={setSelectedSignal}
              />
            )}

            {activeTab === 'nlp' && (
              <NLPEnginePage onSignalCreated={handleSignalCreated} />
            )}

            {activeTab === 'signals' && (
              <SignalExplorerPage onSelectSignal={setSelectedSignal} />
            )}

            {activeTab === 'companies' && (
              <CompanyRiskPage onSelectSignal={setSelectedSignal} />
            )}

            {activeTab === 'rebalancing' && (
              <RebalancingPage />
            )}

            {activeTab === 'portfolio' && (
              <PortfolioExplorerPage />
            )}

            {activeTab === 'stress' && (
              <StressTestingPage />
            )}

            {activeTab === 'history' && (
              <HistoricalAnalysisPage />
            )}

            {activeTab === 'sources' && (
              <DataSourcesPage />
            )}

            {activeTab === 'methodology' && (
              <MethodologyPage />
            )}
          </main>

          {/* Black Institutional Footer (Section 28) */}
          <AppFooter onNavigate={handleNavigate} />
        </div>

        {/* Persistent Global Signal Detail Modal / Drawer */}
        <SignalDetailModal
          signal={selectedSignal}
          onClose={() => setSelectedSignal(null)}
        />
      </div>
    </ToastProvider>
  );
};

export default App;
