import React, { useState, useEffect } from 'react';
import { 
  Database, 
  RefreshCw, 
  Server, 
  ShieldCheck, 
  Radio, 
  Download,
  AlertTriangle,
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
      {/* 17.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              System / Ingestion Infrastructure
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Data sources</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Monitor public data providers, ingestion activity, and synthetic demonstration datasets.
          </p>
        </div>

        <div className="flex items-center gap-2">
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
        <div className="p-4 bg-white rounded-2xl border border-black text-xs font-medium text-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-black shrink-0" />
            <span>{actionMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setActionMessage(null)}
            className="text-xs underline text-[#767676] hover:text-black"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 17.2 Source Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sources.map((src) => {
          const isConnected = src.status === 'Active' || src.status === 'Online' || src.status === 'Connected';
          const isSynthetic = src.mode.toLowerCase().includes('synthetic') || src.mode.toLowerCase().includes('demo');

          return (
            <div
              key={src.source_id}
              className="bg-white rounded-2xl p-6 border border-[#d9d9d9] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-mono uppercase text-[#767676]">
                    {src.source_type.replace('_', ' ')}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                    isConnected ? 'bg-black text-white border-black' : 'bg-[#efefef] text-[#767676] border-[#d9d9d9]'
                  }`}>
                    {src.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-black tracking-tight">{src.source_name}</h3>
                <p className="text-xs text-[#5e5e5e] mt-1">
                  Access Method: <strong>{src.mode}</strong>
                </p>
              </div>

              <div className="p-3 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9] text-xs space-y-1 font-mono">
                <div className="flex justify-between">
                  <span className="text-[#767676]">Records Ingested:</span>
                  <strong className="text-black tabular-nums">{src.records_processed}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767676]">Last Ingestion:</span>
                  <span className="text-black tabular-nums">{formatTimestamp(src.last_ingestion_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#767676]">Classification:</span>
                  <span className="text-black">{isSynthetic ? 'Synthetic' : 'Public Feed'}</span>
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
                    variant="subtle"
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

      {/* 17.5 API Key Privacy & Governance Note */}
      <div className="bg-[#efefef] rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="w-4 h-4 text-black" />
          <h3 className="text-base font-bold text-black">API key privacy & governance disclosure</h3>
        </div>
        <p className="text-xs text-[#5e5e5e] leading-relaxed">
          The RiskPulse AI engine enforces strict cryptographic privacy: zero external commercial API keys are required for operation.
          The pipeline utilizes authenticated open endpoints (SEC EDGAR public RSS, open market tickers, financial news syndication) with automated fallback to the pre-seeded deterministic synthetic dataset.
          No confidential institutional records or private customer credentials are ever requested or stored.
        </p>
      </div>
    </div>
  );
};
