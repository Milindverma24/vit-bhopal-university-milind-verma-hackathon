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
import { SelectInput } from '../components/ui/Inputs';
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
      {/* 19.1 Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#d9d9d9]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#767676]">
              System / Governance & Compliance
            </span>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-black">Methodology and audit</h1>
          <p className="text-sm text-[#5e5e5e] mt-1 max-w-2xl">
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
            Refresh Audit Logs
          </Button>
        </div>
      </div>

      {/* 19.1 Methodology Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Section 1: Sentiment Analysis */}
        <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-black" />
            <h3 className="text-sm font-bold text-black">1. Sentiment analysis pipeline</h3>
          </div>
          <p className="text-xs text-[#5e5e5e] leading-relaxed">
            Evaluates financial text on a continuous scale from <strong>-1.0 (extremely adverse)</strong> to <strong>+1.0 (extremely bullish)</strong>.
          </p>
          <ul className="text-xs text-[#5e5e5e] space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong>FinBERT Neural Model:</strong> Fine-tuned transformer on financial earnings calls and corporate disclosures.
            </li>
            <li>
              <strong>Loughran-McDonald Fallback:</strong> Deterministic zero-key lexicon with syntactic negation windows ("failed to beat", "did not decline") and modifier intensifiers.
            </li>
          </ul>
        </div>

        {/* Section 2: Event Classification */}
        <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-black" />
            <h3 className="text-sm font-bold text-black">2. Event classification taxonomy</h3>
          </div>
          <p className="text-xs text-[#5e5e5e] leading-relaxed">
            Categorizes signals across 20 standardized financial taxonomies (Regulatory Action, Credit Event, Cybersecurity, Monetary Policy, Default, etc.).
          </p>
          <ul className="text-xs text-[#5e5e5e] space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong>Keyword Attribution:</strong> Extracts explicit syntactic tokens for full audit explainability.
            </li>
            <li>
              <strong>Confidence Estimation:</strong> Reports match confidence based on token density and syntactic context.
            </li>
          </ul>
        </div>

        {/* Section 3: Impact Scoring */}
        <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-black" />
            <h3 className="text-sm font-bold text-black">3. Market impact calibration</h3>
          </div>
          <p className="text-xs text-[#5e5e5e] leading-relaxed">
            Calibrates severity on a bounded integer scale from 1 to 10:
          </p>
          <div className="p-3 bg-[#f3f3f3] rounded-xl text-xs space-y-1 font-mono text-black">
            <div>Minimal: 1-2 | Low: 3-4</div>
            <div>Moderate: 5-6 | High: 7-8</div>
            <div>Critical: 9-10 (Severe Market Risk)</div>
          </div>
          <p className="text-[11px] text-[#767676]">
            Factor inputs include event severity weights, source credibility multipliers, and entity systemic importance.
          </p>
        </div>

        {/* Section 4: Index Rebalancing */}
        <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-black" />
            <h3 className="text-sm font-bold text-black">4. Tactical index rebalancing</h3>
          </div>
          <p className="text-xs text-[#5e5e5e] leading-relaxed">
            Quadratic programming optimization reallocates weights based on sentiment alpha (α) and downside risk penalty (β):
          </p>
          <div className="p-3 bg-[#f3f3f3] rounded-xl text-xs font-mono text-black">
            w_i = normalize(base_i + α·S_i - β·R_i)
          </div>
          <ul className="text-[11px] text-[#5e5e5e] space-y-1 list-disc pl-4">
            <li>Fully invested: Σ w_i = 100%</li>
            <li>Concentration bounds: 2.0% ≤ w_i ≤ 18.0%</li>
            <li>Turnover cap: max 25% per period</li>
          </ul>
        </div>

        {/* Section 5: Portfolio Stress Testing */}
        <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-black" />
            <h3 className="text-sm font-bold text-black">5. Strategic stress testing</h3>
          </div>
          <p className="text-xs text-[#5e5e5e] leading-relaxed">
            Multi-asset balance sheet shock engine under Basel III & IFRS 9:
          </p>
          <ul className="text-xs text-[#5e5e5e] space-y-1.5 list-disc pl-4 leading-relaxed">
            <li>
              <strong>Bond & Loan Pricing:</strong> Modified duration discounting: ΔP/P ≈ -D_mod·Δy + 0.5·C·(Δy)².
            </li>
            <li>
              <strong>Credit ECL:</strong> Expected Credit Loss = Exposure · PD · LGD with migration staging multipliers.
            </li>
          </ul>
        </div>

        {/* Section 6: Governance & Limitations */}
        <div className="bg-white rounded-2xl p-6 border border-[#d9d9d9] space-y-3">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-black" />
            <h3 className="text-sm font-bold text-black">6. Governance & auditability</h3>
          </div>
          <p className="text-xs text-[#5e5e5e] leading-relaxed">
            Every analytical operation triggers an immutable database audit log with user, parameters, and cryptographic timestamp.
          </p>
          <div className="p-3 bg-[#f3f3f3] rounded-xl text-[11px] text-[#5e5e5e]">
            <strong>Zero Confidential Data:</strong> Built strictly with synthetic demonstration portfolios and authorized public financial RSS wires.
          </div>
        </div>
      </div>

      {/* 19.2 Audit History Table */}
      <Card>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#d9d9d9]">
          <div>
            <h3 className="text-base font-bold text-black tracking-tight">Compliance audit trail ledger</h3>
            <p className="text-xs text-[#5e5e5e] mt-0.5">
              Deterministic log of system events, rebalance executions, and stress simulations.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-[#767676]">Status Filter:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-[#efefef] rounded-lg px-3 py-1.5 text-xs border border-[#d9d9d9] font-medium"
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
              <tr className="bg-[#efefef] border-b border-[#d9d9d9] text-[#5e5e5e] font-semibold">
                <th className="py-3 px-3 font-mono">Timestamp</th>
                <th className="py-3 px-3">Action Type</th>
                <th className="py-3 px-3">Actor</th>
                <th className="py-3 px-2 text-center">Status</th>
                <th className="py-3 px-4">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d9d9d9]">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#767676]">
                    <RefreshCw className="w-5 h-5 animate-spin mx-auto mb-2 text-black" />
                    Loading audit records...
                  </td>
                </tr>
              ) : filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[#767676]">
                    No audit records matching the specified criteria.
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => (
                  <tr key={log.audit_id} className="hover:bg-[#f3f3f3] transition-colors">
                    <td className="py-3 px-3 font-mono text-[#767676] tabular-nums whitespace-nowrap">
                      {formatTimestamp(log.timestamp)}
                    </td>
                    <td className="py-3 px-3 font-semibold text-black whitespace-nowrap">
                      {log.action_type}
                    </td>
                    <td className="py-3 px-3 font-mono text-[#5e5e5e]">
                      {log.actor}
                    </td>
                    <td className="py-3 px-2 text-center whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold border ${
                        log.status === 'SUCCESS' ? 'bg-black text-white border-black' :
                        log.status === 'WARNING' ? 'bg-[#efefef] text-black border-[#d9d9d9]' :
                        'bg-white text-black border-black'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-[#5e5e5e] max-w-md truncate">
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
