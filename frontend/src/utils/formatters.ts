/**
 * RiskPulse AI - Centralized Financial Data Formatters
 * Strict conformance to Section 32 of DESIGN.md
 */

export const formatCurrency = (value: number | undefined | null, currency = 'USD'): string => {
  if (value === undefined || value === null || isNaN(value)) return '—';
  
  if (Math.abs(value) >= 1_000_000_000) {
    return `$${(value / 1_000_000_000).toFixed(2)}B`;
  }
  if (Math.abs(value) >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`;
  }
  if (Math.abs(value) >= 1_000) {
    return `$${(value / 1_000).toFixed(1)}k`;
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(value);
};

export const formatPercentage = (value: number | undefined | null, includeSign = false, decimals = 1): string => {
  if (value === undefined || value === null || isNaN(value)) return '—';
  const prefix = includeSign && value > 0 ? '+' : '';
  return `${prefix}${(value * (Math.abs(value) <= 1 ? 100 : 1)).toFixed(decimals)}%`;
};

export const formatSentiment = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0.00';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}`;
};

export const formatImpactScore = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '—';
  return `${Math.round(value)}/10`;
};

export const formatWeightChange = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0.00%';
  const prefix = value > 0 ? '+' : value < 0 ? '-' : '';
  const absVal = Math.abs(value * 100).toFixed(2);
  return `${prefix}${absVal}%`;
};

export const formatCompactNumber = (value: number | undefined | null): string => {
  if (value === undefined || value === null || isNaN(value)) return '0';
  return new Intl.NumberFormat('en-US', { notation: 'compact', compactDisplay: 'short' }).format(value);
};

export const formatTimestamp = (dateStr?: string | null): string => {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  } catch {
    return dateStr;
  }
};
