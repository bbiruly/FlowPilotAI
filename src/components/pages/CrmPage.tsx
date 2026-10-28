import React, { useState } from 'react';
import {
  Users,
  Plus,
  Search,
  Filter,
  Download,
  Kanban,
  Table as TableIcon,
  ChevronRight,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  TrendingUp,
  Tag,
  Clock,
  X,
  Check,
  Building,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Lead, LeadStage } from '../../types';

export const CrmPage: React.FC = () => {
  const {
    leads,
    selectedLeadId,
    setSelectedLeadId,
    updateLeadStage,
    createLead,
    updateLead,
    deleteLead,
    showToast
  } = useApp();

  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [searchQuery, setSearchQuery] = useState('');
  const [sourceFilter, setSourceFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Form state for creating a new lead
  const [newLeadForm, setNewLeadForm] = useState({
    customerName: '',
    companyName: '',
    email: '',
    phone: '',
    leadSource: 'WhatsApp Inbound' as const,
    estimatedValue: 50000,
    leadScore: 80,
    stage: 'new' as LeadStage,
    assignedOwner: 'Aryan Patel',
    tags: 'Wholesale, Trial',
    notes: ''
  });

  const stages: { id: LeadStage; label: string; color: string }[] = [
    { id: 'new', label: 'New', color: 'border-blue-400 bg-blue-50/50' },
    { id: 'contacted', label: 'Contacted', color: 'border-indigo-400 bg-indigo-50/50' },
    { id: 'qualified', label: 'Qualified', color: 'border-emerald-400 bg-emerald-50/50' },
    { id: 'proposal', label: 'Proposal', color: 'border-purple-400 bg-purple-50/50' },
    { id: 'converted', label: 'Converted', color: 'border-teal-400 bg-teal-50/50' },
    { id: 'lost', label: 'Lost', color: 'border-slate-300 bg-slate-50/50' }
  ];

  const selectedLead = leads.find(l => l.id === selectedLeadId);

  // Filter leads
  const filteredLeads = leads.filter(l => {
    const matchesSearch =
      l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      l.companyName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSource = sourceFilter === 'all' || l.leadSource === sourceFilter;
    return matchesSearch && matchesSource;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createLead({
      customerName: newLeadForm.customerName,
      companyName: newLeadForm.companyName,
      email: newLeadForm.email,
      phone: newLeadForm.phone,
      leadSource: newLeadForm.leadSource,
      estimatedValue: Number(newLeadForm.estimatedValue),
      leadScore: Number(newLeadForm.leadScore),
      stage: newLeadForm.stage,
      lastInteraction: 'Just now',
      assignedOwner: newLeadForm.assignedOwner,
      tags: newLeadForm.tags.split(',').map(s => s.trim()),
      notes: newLeadForm.notes
    });
    setIsCreateModalOpen(false);
    setNewLeadForm({
      customerName: '',
      companyName: '',
      email: '',
      phone: '',
      leadSource: 'WhatsApp Inbound',
      estimatedValue: 50000,
      leadScore: 80,
      stage: 'new',
      assignedOwner: 'Aryan Patel',
      tags: 'Wholesale, Trial',
      notes: ''
    });
  };

  const handleExportCsv = () => {
    const headers = 'ID,Name,Company,Email,Phone,Source,Stage,Value (INR),Score\n';
    const rows = leads
      .map(
        l =>
          `"${l.id}","${l.customerName}","${l.companyName}","${l.email}","${l.phone}","${l.leadSource}","${l.stage}",${l.estimatedValue},${l.leadScore}`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `flowpilot_leads_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    showToast('CSV Exported', 'Leads pipeline downloaded to your device', 'success');
  };

  const totalPipelineValue = filteredLeads.reduce((acc, l) => acc + l.estimatedValue, 0);

  return (
    <div className="space-y-5 pb-12">
      {/* Top Bar Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">CRM & Lead Pipeline</h1>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded font-mono tabular-nums">
              Total Value: ₹{totalPipelineValue.toLocaleString('en-IN')}
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Omnichannel inbound B2B deals, auto-scored and qualified by AI agents.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'kanban' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <Kanban className="w-3.5 h-3.5" />
              <span>Kanban</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md font-semibold transition-colors ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Table</span>
            </button>
          </div>

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Lead</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-[#E2E8F0] rounded-xl shadow-2xs">
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Filter by customer or company..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-400">Lead Source:</span>
          <select
            value={sourceFilter}
            onChange={e => setSourceFilter(e.target.value)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700"
          >
            <option value="all">All Sources</option>
            <option value="WhatsApp Inbound">WhatsApp Inbound</option>
            <option value="Instagram DM">Instagram DM</option>
            <option value="Website Chat">Website Chat</option>
            <option value="Email Referral">Email Referral</option>
            <option value="Organic Search">Organic Search</option>
          </select>
        </div>
      </div>

      {/* KANBAN BOARD VIEW */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3.5 overflow-x-auto pb-4">
          {stages.map(stage => {
            const stageLeads = filteredLeads.filter(l => l.stage === stage.id);
            const stageValue = stageLeads.reduce((acc, l) => acc + l.estimatedValue, 0);

            return (
              <div
                key={stage.id}
                className="bg-slate-50/70 border border-slate-200 rounded-xl p-3 flex flex-col min-w-[240px] max-h-[750px]"
              >
                {/* Stage Header */}
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-slate-900">{stage.label}</span>
                    <span className="text-[10px] text-slate-500 font-mono">({stageLeads.length})</span>
                  </div>
                  <span className="text-[11px] font-semibold text-slate-600 font-mono tabular-nums">
                    ₹{(stageValue / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Cards Container */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-0.5">
                  {stageLeads.length === 0 ? (
                    <div className="p-4 text-center text-[11px] text-slate-400 border border-dashed border-slate-200 rounded-lg">
                      No leads in {stage.label}
                    </div>
                  ) : (
                    stageLeads.map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLeadId(lead.id)}
                        className={`p-3 bg-white border rounded-xl shadow-2xs hover:shadow-sm cursor-pointer transition-all space-y-2 ${
                          selectedLead?.id === lead.id
                            ? 'border-[#635BFF] ring-2 ring-[#635BFF]/20'
                            : 'border-slate-200'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h3 className="text-xs font-bold text-slate-900 leading-tight">
                              {lead.customerName}
                            </h3>
                            <div className="text-[11px] text-slate-500 truncate">{lead.companyName}</div>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-mono tabular-nums">
                            {lead.leadScore}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-100">
                          <span className="font-bold text-slate-900 font-mono tabular-nums">
                            ₹{lead.estimatedValue.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] text-slate-400 truncate max-w-[100px]">
                            {lead.leadSource}
                          </span>
                        </div>

                        {/* Quick stage transition button */}
                        <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                          <span>Owner: {lead.assignedOwner.split(' ')[0]}</span>
                          <div className="flex items-center gap-1">
                            {stage.id !== 'converted' && stage.id !== 'lost' && (
                              <button
                                onClick={e => {
                                  e.stopPropagation();
                                  const stageOrder: LeadStage[] = [
                                    'new',
                                    'contacted',
                                    'qualified',
                                    'proposal',
                                    'converted'
                                  ];
                                  const nextIdx = stageOrder.indexOf(stage.id) + 1;
                                  if (nextIdx < stageOrder.length) {
                                    updateLeadStage(lead.id, stageOrder[nextIdx]);
                                  }
                                }}
                                className="px-1.5 py-0.5 rounded bg-slate-100 hover:bg-[#635BFF] hover:text-white transition-colors"
                                title="Advance Stage"
                              >
                                Advance →
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3.5">Customer & Company</th>
                <th className="p-3.5">Source</th>
                <th className="p-3.5">Stage</th>
                <th className="p-3.5 text-right">Estimated Value</th>
                <th className="p-3.5 text-center">Score</th>
                <th className="p-3.5">Owner</th>
                <th className="p-3.5">Last Interaction</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeads.map(lead => (
                <tr
                  key={lead.id}
                  onClick={() => setSelectedLeadId(lead.id)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="p-3.5">
                    <div className="font-bold text-slate-900">{lead.customerName}</div>
                    <div className="text-[11px] text-slate-500">{lead.companyName}</div>
                  </td>
                  <td className="p-3.5 text-slate-600">{lead.leadSource}</td>
                  <td className="p-3.5">
                    <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {lead.stage}
                    </span>
                  </td>
                  <td className="p-3.5 text-right font-mono font-bold text-slate-900 tabular-nums">
                    ₹{lead.estimatedValue.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 text-center font-mono font-semibold text-emerald-600 tabular-nums">
                    {lead.leadScore}
                  </td>
                  <td className="p-3.5 text-slate-700">{lead.assignedOwner}</td>
                  <td className="p-3.5 text-slate-500">{lead.lastInteraction}</td>
                  <td className="p-3.5 text-right">
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedLeadId(lead.id);
                      }}
                      className="text-[#635BFF] hover:underline font-semibold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* LEAD DETAIL DRAWER (When lead selected) */}
      {selectedLead && (
        <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-slate-200 flex flex-col animate-in slide-in-from-right duration-200">
          <div className="p-4 border-b border-slate-200 flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Lead Dossier
            </span>
            <button
              onClick={() => setSelectedLeadId(null)}
              className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
            <div>
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900">{selectedLead.customerName}</h2>
                <span className="text-xs font-bold font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Score: {selectedLead.leadScore}/100
                </span>
              </div>
              <div className="text-xs text-slate-600 flex items-center gap-1.5 mt-1 font-medium">
                <Building className="w-3.5 h-3.5 text-slate-400" />
                <span>{selectedLead.companyName}</span>
              </div>
            </div>

            {/* Quick Stage Selector */}
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <label className="text-[11px] font-bold text-slate-700 uppercase">Deal Stage</label>
              <div className="grid grid-cols-3 gap-1.5">
                {stages.map(s => (
                  <button
                    key={s.id}
                    onClick={() => updateLeadStage(selectedLead.id, s.id)}
                    className={`py-1 px-2 text-[11px] font-semibold rounded capitalize transition-colors ${
                      selectedLead.stage === s.id
                        ? 'bg-slate-900 text-white'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Value & Contact */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg">
                <span className="text-slate-500">Estimated Deal Value:</span>
                <span className="font-bold text-slate-900 font-mono text-sm tabular-nums">
                  ₹{selectedLead.estimatedValue.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" />
                <span className="font-mono">{selectedLead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Mail className="w-4 h-4 text-slate-400" />
                <span>{selectedLead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <Clock className="w-4 h-4 text-slate-400" />
                <span>Last Contact: {selectedLead.lastInteraction}</span>
              </div>
            </div>

            {/* Follow-up Scheduler */}
            <div className="p-3.5 bg-indigo-50/50 border border-[#635BFF]/20 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-[#635BFF] text-xs">
                <Calendar className="w-4 h-4" /> Next Follow-up
              </div>
              <p className="text-[11px] text-slate-600">
                {selectedLead.nextFollowUp || 'No follow-up currently scheduled.'}
              </p>
              <button
                onClick={() => {
                  updateLead({
                    ...selectedLead,
                    nextFollowUp: 'Tomorrow, 11:30 AM (Discovery Call)'
                  });
                }}
                className="w-full py-1.5 text-[11px] font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg transition-colors cursor-pointer"
              >
                Schedule Follow-up for Tomorrow
              </button>
            </div>

            {/* Notes */}
            <div>
              <div className="font-bold text-slate-900 mb-1">Lead Notes & History</div>
              <p className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 leading-relaxed italic">
                "{selectedLead.notes}"
              </p>
            </div>

            {/* Delete Lead */}
            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => deleteLead(selectedLead.id)}
                className="text-xs text-rose-600 hover:text-rose-700 font-semibold flex items-center gap-1"
              >
                Delete Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE LEAD MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-md overflow-hidden">
            <div className="p-4 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-900">Create New CRM Lead</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-800 mb-1">Customer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Radhika Sen"
                  value={newLeadForm.customerName}
                  onChange={e => setNewLeadForm({ ...newLeadForm, customerName: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Company / Store Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Roots Lifestyle"
                  value={newLeadForm.companyName}
                  onChange={e => setNewLeadForm({ ...newLeadForm, companyName: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Email</label>
                  <input
                    type="email"
                    required
                    placeholder="contact@brand.in"
                    value={newLeadForm.email}
                    onChange={e => setNewLeadForm({ ...newLeadForm, email: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Phone</label>
                  <input
                    type="text"
                    required
                    placeholder="+91 98..."
                    value={newLeadForm.phone}
                    onChange={e => setNewLeadForm({ ...newLeadForm, phone: e.target.value })}
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Estimated Value (₹)</label>
                  <input
                    type="number"
                    value={newLeadForm.estimatedValue}
                    onChange={e =>
                      setNewLeadForm({ ...newLeadForm, estimatedValue: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-800 mb-1">Lead Score (1-100)</label>
                  <input
                    type="number"
                    value={newLeadForm.leadScore}
                    onChange={e =>
                      setNewLeadForm({ ...newLeadForm, leadScore: Number(e.target.value) })
                    }
                    className="w-full p-2 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-800 mb-1">Notes</label>
                <textarea
                  rows={2}
                  placeholder="Inquiry requirements or initial message..."
                  value={newLeadForm.notes}
                  onChange={e => setNewLeadForm({ ...newLeadForm, notes: e.target.value })}
                  className="w-full p-2 border border-slate-200 rounded-lg text-slate-900 resize-none"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-xs"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
