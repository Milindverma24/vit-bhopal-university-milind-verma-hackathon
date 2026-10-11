import React, { useState, useEffect, useCallback } from 'react';
import { 
  Rss, 
  Search, 
  RefreshCw, 
  ExternalLink, 
  MessageSquare, 
  Newspaper, 
  Database,
  Building2,
  Copy,
  Check,
  X
} from 'lucide-react';
import { RiskSignal } from '../types';
import { api } from '../services/api';
import { Button } from '../components/ui/Button';
import { SentimentBadge, ImpactBadge, SourceBadge } from '../components/ui/Badges';
import { SearchInput } from '../components/ui/Inputs';
import { Card } from '../components/ui/Card';
import { formatTimestamp } from '../utils/formatters';

interface FeedPageProps {
  signals: RiskSignal[];
  loading: boolean;
  onRefreshNews: () => void;
  onRefreshSocial: () => void;
  onSelectSignal: (sig: RiskSignal) => void;
}

export const FeedPage: React.FC<FeedPageProps> = ({
  signals: initialSignals,
  loading: parentLoading,
  onRefreshNews,
  onRefreshSocial,
  onSelectSignal
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'financial_news' | 'social_media'>('all');
  const [selectedTicker, setSelectedTicker] = useState('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState('ALL');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [feedSignals, setFeedSignals] = useState<RiskSignal[]>(initialSignals || []);
  const [feedLoading, setFeedLoading] = useState(false);
  const [refreshingSocial, setRefreshingSocial] = useState(false);
  const [refreshingNews, setRefreshingNews] = useState(false);
  const [totalCount, setTotalCount] = useState(initialSignals?.length || 0);

  const tickers = ['ALL', 'AAPL', 'MSFT', 'NVDA', 'JPM', 'BAC', 'XOM', 'CVX', 'JNJ', 'PFE', 'AMZN', 'WMT', 'CAT', 'LMT', 'NEE'];
  const sentiments = ['ALL', 'Negative', 'Positive', 'Neutral', 'Mixed'];

  const fetchFeed = useCallback(async () => {
    setFeedLoading(true);
    try {
      const res = await api.getSignals({
        page: 1,
        pageSize: 50,
        sourceType: sourceFilter !== 'all' ? sourceFilter : undefined,
        ticker: selectedTicker !== 'ALL' ? selectedTicker : undefined,
        sentimentLabel: selectedSentiment !== 'ALL' ? selectedSentiment : undefined,
        search: searchTerm.trim() || undefined
      });
      setFeedSignals(res.items);
      setTotalCount(res.total);
    } catch (err) {
      console.error('Failed to fetch feed:', err);
      // Fallback to client filtering of initial signals if offline
      setFeedSignals(
        initialSignals.filter((s) => {
          if (sourceFilter !== 'all' && s.source_type !== sourceFilter) return false;
          if (selectedTicker !== 'ALL' && s.primary_ticker !== selectedTicker) return false;
          if (selectedSentiment !== 'ALL' && s.sentiment_label !== selectedSentiment) return false;
          return true;
        })
      );
    } finally {
      setFeedLoading(false);
    }
  }, [sourceFilter, selectedTicker, selectedSentiment, searchTerm, initialSignals]);

  useEffect(() => {
    fetchFeed();
  }, [fetchFeed]);

  const [ingestionNotice, setIngestionNotice] = useState<{
    type: 'success' | 'warning' | 'error' | 'rate_limited';
    title: string;
    message: string;
    details?: {
      source: string;
      fetched: number;
      inserted: number;
      duplicates: number;
      timestamp: string;
    };
  } | null>(null);

  const handleFetchSocialClick = async () => {
    setRefreshingSocial(true);
    setIngestionNotice(null);
    try {
      const res = await api.refreshSocial(15);
      if (res.status === 'rate_limited') {
        setIngestionNotice({
          type: 'rate_limited',
          title: 'Provider Rate Limit Active',
          message: res.message || 'Social feed provider rate limit active.'
        });
      } else if (res.inserted_count > 0) {
        setIngestionNotice({
          type: 'success',
          title: 'Social Discourse Ingested',
          message: `${res.inserted_count} new simulated posts ingested and processed into risk signals.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: res.inserted_count,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      } else {
        setIngestionNotice({
          type: 'warning',
          title: 'No New Social Records Inserted',
          message: `All ${res.fetched_count} retrieved posts were skipped as existing duplicates.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: 0,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      }
      onRefreshSocial();
      await fetchFeed();
    } catch (err: any) {
      setIngestionNotice({
        type: 'error',
        title: 'Social Ingestion Failed',
        message: err.message || 'An error occurred during social ingestion.'
      });
    } finally {
      setRefreshingSocial(false);
    }
  };

  const handleFetchNewsClick = async () => {
    setRefreshingNews(true);
    setIngestionNotice(null);
    try {
      const res = await api.refreshNews(10);
      if (res.status === 'rate_limited') {
        setIngestionNotice({
          type: 'rate_limited',
          title: 'News Provider Rate Limit Active',
          message: res.message || 'Provider rate limit active. Please retry in a few moments.'
        });
      } else if (res.inserted_count > 0) {
        setIngestionNotice({
          type: 'success',
          title: 'News Ingestion Completed',
          message: `${res.inserted_count} new articles ingested and converted into structured risk signals.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: res.inserted_count,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      } else {
        setIngestionNotice({
          type: 'warning',
          title: 'Duplicate Wire Batch',
          message: `Fetched ${res.fetched_count} articles; ${res.duplicate_count} were already present in database.`,
          details: {
            source: res.source,
            fetched: res.fetched_count,
            inserted: 0,
            duplicates: res.duplicate_count,
            timestamp: formatTimestamp(res.last_fetch_at)
          }
        });
      }
      onRefreshNews();
      await fetchFeed();
    } catch (err: any) {
      setIngestionNotice({
        type: 'error',
        title: 'News Ingestion Failed',
        message: err.message || 'An error occurred during financial news ingestion.'
      });
    } finally {
      setRefreshingNews(false);
    }
  };

  const handleCopyProvenance = (sig: RiskSignal) => {
    const prov = `${sig.source_name} [${sig.source_type}] - Ref: ${sig.source_reference || sig.signal_id} (${sig.published_at || sig.processed_at})`;
    navigator.clipboard.writeText(prov);
    setCopiedId(sig.signal_id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 10.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              Intelligence / Raw Feeds
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">News and social intelligence</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
            Explore financial narratives entering the risk engine from verified news wires and synthesized FinTwit & StockTwits market discourse.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleFetchNewsClick}
            disabled={parentLoading || refreshingNews}
            icon={<Newspaper className={`w-3.5 h-3.5 ${refreshingNews ? 'animate-spin' : ''}`} />}
          >
            {refreshingNews ? 'Fetching News...' : 'Fetch News'}
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={handleFetchSocialClick}
            disabled={parentLoading || refreshingSocial}
            icon={<MessageSquare className={`w-3.5 h-3.5 ${refreshingSocial ? 'animate-spin' : ''}`} />}
          >
            {refreshingSocial ? 'Ingesting Social...' : 'Fetch Social'}
          </Button>
        </div>
      </div>

      {/* Ingestion Feedback Alert Banner */}
      {ingestionNotice && (
        <div
          className={`p-4 rounded-xl border flex items-start justify-between gap-3 text-xs animate-in fade-in select-none ${
            ingestionNotice.type === 'success'
              ? 'bg-[#f7f7f7] border-black text-black'
              : ingestionNotice.type === 'rate_limited' || ingestionNotice.type === 'warning'
              ? 'bg-[#efefef] border-[#767676] text-black'
              : 'bg-[#efefef] border-black text-black'
          }`}
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-black text-white text-[10px]">
                {ingestionNotice.type.toUpperCase()}
              </span>
              <strong className="text-black font-semibold">{ingestionNotice.title}</strong>
            </div>
            <p className="text-[#5e5e5e]">{ingestionNotice.message}</p>
            {ingestionNotice.details && (
              <div className="flex flex-wrap items-center gap-3 text-[11px] text-[#767676] font-mono pt-1">
                <span>Source: <strong className="text-black">{ingestionNotice.details.source}</strong></span>
                <span>•</span>
                <span>Fetched: <strong className="text-black">{ingestionNotice.details.fetched}</strong></span>
                <span>•</span>
                <span>Inserted: <strong className="text-black">{ingestionNotice.details.inserted}</strong></span>
                <span>•</span>
                <span>Duplicates: <strong className="text-black">{ingestionNotice.details.duplicates}</strong></span>
                <span>•</span>
                <span>Time: <strong>{ingestionNotice.details.timestamp}</strong></span>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={() => setIngestionNotice(null)}
            className="p-1 hover:bg-[#e2e2e2] rounded-full transition-colors text-[#767676] hover:text-black"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 10.2 Filter Bar with Pill Shapes */}
      <div className="bg-white rounded-2xl p-5 border border-[#d9d9d9] space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <SearchInput
              value={searchTerm}
              onChange={setSearchTerm}
              placeholder="Search headline, company text, or ticker..."
            />
          </div>

          {/* Source Filter Pills */}
          <div className="inline-flex items-center p-1 bg-[#efefef] rounded-full border border-[#d9d9d9] shrink-0">
            <button
              type="button"
              onClick={() => setSourceFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                sourceFilter === 'all' ? 'bg-black text-white shadow-xs' : 'text-[#5e5e5e] hover:text-black'
              }`}
            >
              All Sources
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('financial_news')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                sourceFilter === 'financial_news' ? 'bg-black text-white shadow-xs' : 'text-[#5e5e5e] hover:text-black'
              }`}
            >
              Financial News
            </button>
            <button
              type="button"
              onClick={() => setSourceFilter('social_media')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium transition-all ${
                sourceFilter === 'social_media' ? 'bg-black text-white shadow-xs' : 'text-[#5e5e5e] hover:text-black'
              }`}
            >
              Social Media
            </button>
          </div>
        </div>

        {/* Tickers Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-[#767676] font-medium shrink-0">Ticker:</span>
          <div className="flex items-center gap-1.5">
            {tickers.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTicker(t)}
                className={`px-3 py-1 rounded-full text-xs font-mono font-medium transition-all shrink-0 ${
                  selectedTicker === t
                    ? 'bg-black text-white'
                    : 'bg-[#efefef] text-[#5e5e5e] hover:bg-[#e2e2e2] hover:text-black border border-[#d9d9d9]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Sentiment Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto text-xs">
          <span className="text-[#767676] font-medium shrink-0">Sentiment:</span>
          <div className="flex items-center gap-1.5">
            {sentiments.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSelectedSentiment(s)}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-all shrink-0 ${
                  selectedSentiment === s
                    ? 'bg-black text-white'
                    : 'bg-[#efefef] text-[#5e5e5e] hover:bg-[#e2e2e2] hover:text-black border border-[#d9d9d9]'
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 10.3 Signal Feed Cards List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-[#767676] px-1">
          <span>Displaying <strong>{feedSignals.length}</strong> {sourceFilter === 'social_media' ? 'social discourse' : sourceFilter === 'financial_news' ? 'news wire' : 'narrative intelligence'} records (Total available: {totalCount})</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-black inline-block animate-pulse"></span>
            Real-time feed sync active
          </span>
        </div>

        {feedLoading && feedSignals.length === 0 ? (
          <div className="p-16 text-center text-[#767676] bg-white rounded-2xl border border-[#d9d9d9]">
            <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-black" />
            <p className="text-xs">Ingesting financial intelligence feed...</p>
          </div>
        ) : feedSignals.length === 0 ? (
          <div className="p-16 text-center text-[#767676] bg-white rounded-2xl border border-[#d9d9d9]">
            <h3 className="text-base font-bold text-black mb-1">No risk signals found</h3>
            <p className="text-xs mb-4">Try clearing your filters or click "Fetch Social" / "Fetch News" to ingest fresh signals.</p>
            <div className="flex items-center justify-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTicker('ALL');
                  setSelectedSentiment('ALL');
                  setSourceFilter('all');
                }}
              >
                Clear filters
              </Button>
              {sourceFilter === 'social_media' && (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleFetchSocialClick}
                  icon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Fetch Social Posts
                </Button>
              )}
            </div>
          </div>
        ) : (
          feedSignals.map((signal) => (
            <div
              key={signal.signal_id}
              className="bg-white rounded-2xl p-6 border border-[#d9d9d9] hover:border-black transition-all duration-150 space-y-4"
            >
              {/* Top Meta Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f3f3f3] text-xs">
                <div className="flex items-center gap-2 flex-wrap">
                  <SourceBadge sourceType={signal.source_type} isSynthetic={signal.is_synthetic} />
                  <span className="font-semibold text-black">{signal.source_name}</span>
                  <span className="text-[#767676]">•</span>
                  <span className="text-[#767676] tabular-nums">
                    {formatTimestamp(signal.published_at || signal.processed_at)}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <SentimentBadge score={signal.sentiment_score} label={signal.sentiment_label} />
                  <ImpactBadge score={signal.impact_score} level={signal.impact_level} />
                </div>
              </div>

              {/* Headline & Body Context */}
              <div>
                <h3 className="text-base font-bold tracking-tight text-black leading-snug">
                  {signal.headline}
                </h3>
                <p className="text-xs text-[#5e5e5e] leading-relaxed mt-2 p-3 bg-[#f3f3f3] rounded-xl border border-[#d9d9d9]">
                  {signal.text}
                </p>
              </div>

              {/* Bottom Entity & Action Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-xs bg-[#efefef] px-2.5 py-1 rounded-full text-black border border-[#d9d9d9]">
                    {signal.primary_ticker || 'MACRO'}
                  </span>
                  <span className="text-[#5e5e5e] font-medium truncate max-w-xs">
                    {signal.primary_company || 'Cross-Market Stance'}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#efefef] text-[#767676] border border-[#d9d9d9]">
                    {signal.event_type}
                  </span>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleCopyProvenance(signal)}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs text-[#5e5e5e] hover:text-black bg-[#efefef] hover:bg-[#e2e2e2] transition-colors"
                    title="Copy Source Provenance"
                  >
                    {copiedId === signal.signal_id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedId === signal.signal_id ? 'Copied' : 'Provenance'}</span>
                  </button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onSelectSignal(signal)}
                  >
                    View analysis
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
