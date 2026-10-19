import React, { useState, useEffect } from 'react';
import { 
  BookOpen, 
  History, 
  ShieldCheck, 
  FileText, 
  Calculator, 
  RefreshCw,
  CheckCircle2,
  Lock
} from 'lucide-react';
import { api } from '../services/api';
import { AuditEvent } from '../types';
import { Card, CardHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { formatTimestamp } from '../utils/formatters';

export const MethodologyPage: React.FC = () => {
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchAudit = async () => {
    setLoading(true);
    try {
      const logs = await api.getAuditTrail();
      setAuditEvents(logs);
    } catch (err) {
      console.error('Failed to load audit trail:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudit();
  }, []);

  const filteredLogs = auditEvents.filter((log) => {
    if (statusFilter && log.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#282828]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="text-[11px] font-mono font-bold uppercase tracking-[1.4px] text-[#1ed760] bg-[#1f1f1f] px-3.5 py-1.5 rounded-full border border-[#333333]">
              System / Governance & Compliance
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">Methodology and audit</h1>
          <p className="text-sm text-[#b3b3b3] mt-1 max-w-2xl leading-relaxed">
            Mathematical formulations, model interpretability, architectural limitations, and real-time execution audit trail.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={fetchAudit}
            loading={loading}
            icon={<RefreshCw className="w-3.5 h-3.5" />}
          >
            Refresh Logs
          </Button>
        </div>
      </div>

      {/* Methodology Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Section 1: Sentiment Analysis */}
        <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-[#1ed760]" />
            <h3 className="text-sm font-bold text-white">1. Sentiment analysis pipeline</h3>
          </div>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Evaluates financial text on a continuous scale from <strong className="text-[#f3727f]">-1.0 (extremely adverse)</strong> to <strong className="text-[#1ed760]">+1.0 (extremely bullish)</strong>.
          </p>
          <ul className="text-xs text-[#b3b3b3] space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong className="text-white">FinBERT Neural Model:</strong> Fine-tuned transformer on financial earnings calls and corporate disclosures.
            </li>
            <li>
              <strong className="text-white">Loughran-McDonald Fallback:</strong> Deterministic zero-key lexicon with syntactic negation windows ("failed to beat", "did not decline") and modifier intensifiers.
            </li>
          </ul>
        </div>

        {/* Section 2: Event Classification */}
        <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1ed760]" />
            <h3 className="text-sm font-bold text-white">2. Event classification taxonomy</h3>
          </div>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Categorizes signals across 20 standardized financial taxonomies (Regulatory Action, Credit Event, Cybersecurity, Monetary Policy, Default, etc.).
          </p>
          <ul className="text-xs text-[#b3b3b3] space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong className="text-white">Keyword Attribution:</strong> Extracts explicit syntactic tokens for full audit explainability.
            </li>
            <li>
              <strong className="text-white">Confidence Estimation:</strong> Reports match confidence based on token density and syntactic context.
            </li>
          </ul>
        </div>

        {/* Section 3: Impact Scoring */}
        <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#1ed760]" />
            <h3 className="text-sm font-bold text-white">3. Market impact calibration</h3>
          </div>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Calibrates severity on a bounded integer scale from 1 to 10:
          </p>
          <div className="p-3.5 bg-[#121212] text-white rounded-[6px] border border-[#282828] text-xs space-y-1 font-mono">
            <div>Minimal: 1-2 | Low: 3-4</div>
            <div>Moderate: 5-6 | High: 7-8</div>
            <div className="text-[#f3727f] font-bold">Critical: 9-10 (Severe Risk)</div>
          </div>
          <p className="text-[11px] text-[#7c7c7c]">
            Factor inputs include event severity weights, source credibility multipliers, and entity systemic importance.
          </p>
        </div>

        {/* Section 4: Index Rebalancing */}
        <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-[#1ed760]" />
            <h3 className="text-sm font-bold text-white">4. Tactical index rebalancing</h3>
          </div>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Quadratic programming optimization reallocates weights based on sentiment alpha (α) and downside risk penalty (β):
          </p>
          <div className="p-3.5 bg-[#121212] text-[#1ed760] rounded-[6px] border border-[#282828] text-xs font-mono font-bold">
            w_i = normalize(base_i + α·S_i - β·R_i)
          </div>
          <ul className="text-[11px] text-[#b3b3b3] space-y-1 list-disc pl-4">
            <li>Fully invested: Σ w_i = 100%</li>
            <li>Concentration bounds: 2.0% ≤ w_i ≤ 18.0%</li>
            <li>Turnover cap: max 25% per period</li>
          </ul>
        </div>

        {/* Section 5: Portfolio Stress Testing */}
        <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1ed760]" />
            <h3 className="text-sm font-bold text-white">5. Strategic stress testing</h3>
          </div>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Multi-asset balance sheet shock engine under Basel III & IFRS 9:
          </p>
          <ul className="text-xs text-[#b3b3b3] space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong className="text-white">Bond & Loan Pricing:</strong> Modified duration discounting: ΔP/P ≈ -D_mod·Δy + 0.5·C·(Δy)².
            </li>
            <li>
              <strong className="text-white">Credit ECL:</strong> Expected Credit Loss = Exposure · PD · LGD with migration staging multipliers.
            </li>
          </ul>
        </div>

        {/* Section 6: Governance & Limitations */}
        <div className="bg-[#181818] rounded-[8px] p-6 border border-[#282828] space-y-3 hover:bg-[#202020] hover:border-[#383838] transition-all shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#1ed760]" />
            <h3 className="text-sm font-bold text-white">6. Governance & auditability</h3>
          </div>
          <p className="text-xs text-[#b3b3b3] leading-relaxed">
            Every analytical operation triggers an immutable database audit log with user, parameters, and cryptographic timestamp.
          </p>
          <div className="p-3 bg-[#1f1f1f] border border-[#282828] rounded-[6px] text-[11px] text-[#b3b3b3]">
            <strong className="text-white">Zero Confidential Data:</strong> Built strictly with synthetic demonstration portfolios and authorized public financial RSS wires.
          </div>
        </div>
      </div>

      {/* Audit History Table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#282828]">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Compliance audit trail ledger</h3>
            <p className="text-xs text-[#7c7c7c] mt-0.5">
              Deterministic log of system events, rebalance executions, and stress simulations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#7c7c7c] font-bold uppercase tracking-[1.4px]">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#1f1f1f] text-white rounded-[8px] px-3 py-1.5 text-xs border border-[#282828] font-medium cursor-pointer hover:border-[#4d4d4d]"
            >
              <option value="">All Statuses</option>
              <option value="SUCCESS">Success</option>
              <option value="WARNING">Warning</option>
              <option value="ERROR">Error</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#1f1f1f] border-b border-[#282828] text-white font-bold uppercase tracking-[1.4px] text-[11px]">
                <th className="py-3 px-3 font-mono">Timestamp</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Actor</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#282828]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#b3b3b3]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-[#1ed760]" />
                    Loading audit records...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#7c7c7c]">
                    No audit records matching the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.audit_id} className="hover:bg-[#202020] transition-colors">
                    <td className="py-3 px-3 font-mono text-[#7c7c7c] tabular-nums whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {log.action_type}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#b3b3b3]">
                      {log.actor}
                    </td>
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                        log.status === 'SUCCESS' ? 'bg-[#1ed760]/15 text-[#1ed760] border-[#1ed760]/30' :
                        log.status === 'WARNING' ? 'bg-[#ffa42b]/15 text-[#ffa42b] border-[#ffa42b]/30' :
                        'bg-[#f3727f]/15 text-[#f3727f] border-[#f3727f]/30'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#7c7c7c] max-w-md truncate">
                      {JSON.stringify(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
