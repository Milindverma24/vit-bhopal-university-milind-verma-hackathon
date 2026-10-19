import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  Download,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { api } from '../services/api';
import { IngestionStatusItem } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatTimestamp } from '../utils/formatters';

export const DataSourcesPage: React.FC = () => {
  const [sources, setSources] = useState<IngestionStatusItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const fetchStatus = async () => {
    setLoading(true);
    try {
      const data = await api.getIngestionStatus();
      setSources(data);
    } catch (err) {
      console.error('Failed to load data sources status:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const handleRefreshNews = async () => {
    setLoading(true);
    try {
      const res = await api.refreshNews(10);
      setActionMessage(`News ingestion: ${res.inserted_count} new articles inserted, ${res.duplicate_count} skipped as duplicates.`);
      await fetchStatus();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshSocial = async () => {
    setLoading(true);
    try {
      const res = await api.refreshSocial(15);
      setActionMessage(`Social ingestion: ${res.inserted_count} new posts inserted, ${res.duplicate_count} skipped as duplicates.`);
      await fetchStatus();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadFullSample = async () => {
    setLoading(true);
    try {
      const res = await api.loadSampleData();
      setActionMessage(`Loaded synthetic benchmark dataset! Created ${res.news_signals} news & ${res.social_signals} social signals.`);
      await fetchStatus();
    } catch (err: any) {
      setActionMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333]">
              System / Ingestion Infrastructure
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Data sources</h1>
          <p className="text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Monitor public data providers, ingestion activity, and synthetic demonstration datasets.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchStatus}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Status
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleLoadFullSample}
            loading={loading}
            icon={<Download className="w-3.5 h-3.5" />}
          >
            Load Benchmark Dataset
          </Button>
        </div>
      </div>

      {/* Action Notification Banner */}
      {actionMessage && (
        <div className="p-4 bg-[#181818] text-white rounded-[8px] border border-[#282828] text-xs font-medium flex items-center justify-between animate-in fade-in shadow-[0_4px_16px_rgba(0,0,0,0.5)]">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#1ed760] shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-xs text-[#7c7c7c] hover:text-white transition-colors ml-4 shrink-0 cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((src) => {
          const isConnected = src.status === 'Active' || src.status === 'Online' || src.status === 'Connected';
          const isSynthetic = src.mode.toLowerCase().includes('synthetic') || src.mode.toLowerCase().includes('demo');

          return (
            <div
              key={src.source_id}
              className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] flex flex-col justify-between space-y-4 hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-[1.4px] text-[#7c7c7c]">
                    {src.source_type.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                    isConnected ? 'bg-[#1ed760]/15 text-[#1ed760] border-[#1ed760]/30' : 'bg-[#1f1f1f] text-[#7c7c7c] border-[#282828]'
                  }`}>
                    {src.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-white tracking-tight">{src.source_name}</h3>
                <p className="text-xs text-[#b3b3b3] mt-1">
                  Access Method: <strong className="text-white font-medium">{src.mode}</strong>
                </p>
              </div>

              <div className="p-3.5 bg-[#1f1f1f] rounded-[6px] border border-[#282828] text-xs space-y-1.5 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#7c7c7c]">Records Ingested:</span>
                  <strong className="text-[#1ed760] tabular-nums">{src.records_processed}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7c7c7c]">Last Ingestion:</span>
                  <span className="text-white tabular-nums">{formatTimestamp(src.last_ingestion_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#7c7c7c]">Classification:</span>
                  <span className="text-white font-medium">{isSynthetic ? 'Synthetic' : 'Public Feed'}</span>
                </div>
              </div>

              <div className="pt-2">
                {src.source_id === 'financial_news' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={handleRefreshNews}
                    disabled={loading}
                  >
                    Refresh News Feed
                  </Button>
                ) : src.source_id === 'social_media' ? (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={handleRefreshSocial}
                    disabled={loading}
                  >
                    Refresh Social Stream
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={handleLoadFullSample}
                    disabled={loading}
                  >
                    Reload Sample
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* API Key Privacy & Governance Note */}
      <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 shadow-[0_8px_24px_rgba(0,0,0,0.5)]">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-[#1ed760]" />
          <h3 className="text-base font-bold text-white">API key privacy & governance disclosure</h3>
        </div>
        <p className="text-xs text-[#b3b3b3] leading-relaxed">
          The RiskPulse engine enforces strict cryptographic privacy: zero external commercial API keys are required for operation.
          The pipeline utilizes authenticated open endpoints (SEC EDGAR public RSS, open market tickers, financial news syndication) with automated fallback to the pre-seeded deterministic synthetic dataset.
          No confidential institutional records or private customer credentials are ever requested or stored.
        </p>
      </div>
    </div>
  );
};
