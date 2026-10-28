import React, { useState } from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Lock,
  Clock,
  DollarSign,
  UserCheck,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Save,
  RotateCcw,
  Sliders,
  Filter
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RuleConfig } from '../../types';

export const RulesPage: React.FC = () => {
  const { rules, updateRules, auditEvents, showToast } = useApp();
  const [formRules, setFormRules] = useState<RuleConfig>(rules);
  const [auditFilter, setAuditFilter] = useState<'all' | 'approved' | 'rejected' | 'pending'>('all');

  const handleSave = () => {
    updateRules(formRules);
  };

  const filteredAudits = auditEvents.filter(a => {
    if (auditFilter === 'all') return true;
    if (auditFilter === 'approved') return a.approvalStatus === 'approved' || a.approvalStatus === 'auto_approved';
    if (auditFilter === 'rejected') return a.approvalStatus === 'rejected';
    if (auditFilter === 'pending') return a.approvalStatus === 'pending';
    return true;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">
              Rules, Governance & Guardrails
            </h1>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-semibold">
              Policy Enforcement: Active
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Strict operational boundaries preventing hallucinated discounts, unauthorized refunds, and off-hour customer spam.
          </p>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap self-start"
        >
          <Save className="w-3.5 h-3.5" />
          <span>Save Governance Policies</span>
        </button>
      </div>

      {/* Governance Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Financial & Discount Guardrails */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-[#635BFF]" />
            <h2 className="text-sm font-bold text-slate-900">Financial & Refund Limits</h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Monthly AI Cloud Spending Budget Cap (₹)
              </label>
              <input
                type="number"
                value={formRules.maxMonthlySpending}
                onChange={e =>
                  setFormRules({ ...formRules, maxMonthlySpending: Number(e.target.value) })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Agents automatically pause when aggregate inference cost reaches this cap.
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Require Human Approval for Refunds &gt;
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-slate-400 font-mono">₹</span>
                  <input
                    type="number"
                    value={formRules.requireRefundApprovalAbove}
                    onChange={e =>
                      setFormRules({
                        ...formRules,
                        requireRefundApprovalAbove: Number(e.target.value)
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">
                  Require Human Approval for Discounts &gt;
                </label>
                <div className="flex items-center gap-1.5">
                  <input
                    type="number"
                    value={formRules.requireDiscountApprovalAbove}
                    onChange={e =>
                      setFormRules({
                        ...formRules,
                        requireDiscountApprovalAbove: Number(e.target.value)
                      })
                    }
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
                  />
                  <span className="text-slate-400 font-mono">%</span>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Confidence Escalation Threshold
              </label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="50"
                  max="95"
                  step="5"
                  value={formRules.confidenceEscalationThreshold}
                  onChange={e =>
                    setFormRules({
                      ...formRules,
                      confidenceEscalationThreshold: Number(e.target.value)
                    })
                  }
                  className="flex-1 accent-[#635BFF] cursor-pointer"
                />
                <span className="font-mono font-bold text-slate-900 text-xs w-10">
                  {formRules.confidenceEscalationThreshold}%
                </span>
              </div>
              <span className="text-[11px] text-slate-500 mt-1 block">
                Conversations where agent confidence drops below this are immediately routed to human triage.
              </span>
            </div>
          </div>
        </div>

        {/* Messaging Hours & Data Access Guardrails */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Clock className="w-4 h-4 text-[#635BFF]" />
            <h2 className="text-sm font-bold text-slate-900">Working Hours & Compliance</h2>
          </div>

          <div className="space-y-3.5 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <div>
                <div className="font-bold text-slate-900">Enforce Indian Messaging Hours</div>
                <div className="text-[11px] text-slate-500">
                  Blocks automated promotional and follow-up WhatsApp/SMS outside window
                </div>
              </div>
              <input
                type="checkbox"
                checked={formRules.workingHoursEnabled}
                onChange={e =>
                  setFormRules({ ...formRules, workingHoursEnabled: e.target.checked })
                }
                className="w-4 h-4 accent-[#635BFF] cursor-pointer"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Start Time (IST)</label>
                <input
                  type="time"
                  value={formRules.workingHoursStart}
                  onChange={e =>
                    setFormRules({ ...formRules, workingHoursStart: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-800 mb-1">End Time (IST)</label>
                <input
                  type="time"
                  value={formRules.workingHoursEnd}
                  onChange={e =>
                    setFormRules({ ...formRules, workingHoursEnd: e.target.value })
                  }
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Customer Data Access Permission Level
              </label>
              <select
                value={formRules.customerDataAccessLevel}
                onChange={e =>
                  setFormRules({
                    ...formRules,
                    customerDataAccessLevel: e.target.value as 'restricted' | 'standard' | 'full'
                  })
                }
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
              >
                <option value="restricted">Restricted (Mask phone numbers & billing addresses)</option>
                <option value="standard">Standard (Full name, order history, masked phone)</option>
                <option value="full">Full Access (Storefront admin data access)</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-slate-800 mb-1">
                Max Autonomous Follow-up Attempts
              </label>
              <input
                type="number"
                min="1"
                max="4"
                value={formRules.followUpMaxAttempts}
                onChange={e =>
                  setFormRules({ ...formRules, followUpMaxAttempts: Number(e.target.value) })
                }
                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 font-mono"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Prevents re-engagement agent from exceeding 2 messages per user without reply.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Activity Audit Log */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Governance Audit Trail</h3>
            <p className="text-xs text-slate-500">
              Immutable ledger of agent actions, approvals, and rule interventions
            </p>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {(['all', 'approved', 'rejected', 'pending'] as const).map(f => (
              <button
                key={f}
                onClick={() => setAuditFilter(f)}
                className={`px-3 py-1 rounded-md capitalize font-semibold transition-colors ${
                  auditFilter === f ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Agent</th>
                <th className="p-3">Action Attempted</th>
                <th className="p-3">Customer Target</th>
                <th className="p-3 text-center">Approval Status</th>
                <th className="p-3">Result / Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
              {filteredAudits.map(event => (
                <tr key={event.id} className="hover:bg-slate-50">
                  <td className="p-3 text-slate-500 whitespace-nowrap">{event.timestamp}</td>
                  <td className="p-3 font-bold text-slate-800">{event.agentName}</td>
                  <td className="p-3 text-slate-700">{event.actionAttempted}</td>
                  <td className="p-3 text-slate-600 truncate max-w-[150px]">{event.customerTarget}</td>
                  <td className="p-3 text-center">
                    <span
                      className={`px-2 py-0.5 rounded font-semibold uppercase text-[10px] ${
                        event.approvalStatus === 'auto_approved' || event.approvalStatus === 'approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : event.approvalStatus === 'rejected'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {event.approvalStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3 text-slate-600 truncate max-w-xs">{event.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
