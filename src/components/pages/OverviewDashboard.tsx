import React from 'react';
import {
  MessageSquare,
  Users,
  CheckCircle2,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Bot,
  Sparkles,
  ChevronRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useApp } from '../../context/AppContext';
import {
  dailyMetrics,
  channelDistribution,
  leadFunnelData,
  recentActivityFeed,
  attentionRequiredItems
} from '../../data/analytics';

export const OverviewDashboard: React.FC = () => {
  const { setCurrentPage, setSelectedConversationId, createAgent, setSelectedAgentId } = useApp();

  const handleCreateAgentClick = () => {
    createAgent({
      name: 'Holiday Flash Sale Assistant',
      role: 'Festive Deals & Order Urgency',
      description: 'Handles spike traffic during festival promotions.'
    });
    setCurrentPage('agents');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E2E8F0] shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-[#0F172A]">
              Good morning, Aryan
            </h1>
            <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Simulated Demo Mode
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">
            Here's how your AI customer operations are performing today across WhatsApp, Instagram, and web.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage('inbox')}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            Open Unified Inbox
          </button>
          <button
            onClick={handleCreateAgentClick}
            className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-sm shadow-[#635BFF]/30 transition-all cursor-pointer whitespace-nowrap"
          >
            <Bot className="w-4 h-4" />
            <span>Create AI Agent</span>
          </button>
        </div>
      </div>

      {/* 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Total Conversations</span>
            <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-[#635BFF]">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums font-mono">
              1,284
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-600 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +14.2%
              </span>
              <span className="text-slate-400">vs previous 7 days</span>
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Qualified Leads</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums font-mono">
              216
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-600 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +28.4%
              </span>
              <span className="text-slate-400">₹4.82L pipeline added</span>
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">AI Resolution Rate</span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums font-mono">
              68%
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-600 font-semibold">
                <ArrowUpRight className="w-3.5 h-3.5" /> +5.1%
              </span>
              <span className="text-slate-400">872 solved autonomously</span>
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B]">Needs Human Attention</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center text-amber-600">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-3xl font-extrabold text-[#0F172A] tabular-nums font-mono">
              42
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs">
              <span className="flex items-center text-emerald-600 font-semibold">
                <ArrowDownRight className="w-3.5 h-3.5" /> -18.3%
              </span>
              <span className="text-slate-400">Escalation down</span>
            </div>
          </div>
        </div>
      </div>

      {/* Attention Required Panel (Section 5 requirements) */}
      <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h2 className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Attention Required ({attentionRequiredItems.length})
            </h2>
          </div>
          <span className="text-xs text-amber-800">Operational items awaiting review</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {attentionRequiredItems.map(item => (
            <div
              key={item.id}
              className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <span
                  className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    item.severity === 'high'
                      ? 'bg-rose-100 text-rose-700'
                      : item.severity === 'medium'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  {item.severity} priority
                </span>
                <h3 className="text-xs font-semibold text-slate-900 mt-2 leading-snug">
                  {item.title}
                </h3>
                <p className="text-[11px] text-slate-500 mt-1">{item.description}</p>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100">
                <button
                  onClick={() => {
                    if (item.actionRoute === 'inbox') {
                      setSelectedConversationId(item.targetId);
                      setCurrentPage('inbox');
                    } else if (item.actionRoute === 'knowledge') {
                      setCurrentPage('knowledge');
                    }
                  }}
                  className="w-full text-xs font-semibold text-[#635BFF] hover:text-[#5145E5] flex items-center justify-between"
                >
                  <span>{item.actionLabel}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Conversations Over Time */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Conversations Over Time</h2>
              <p className="text-xs text-[#64748B]">AI-resolved vs Human-escalated daily volume</p>
            </div>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-[#635BFF]" /> AI Resolved
              </span>
              <span className="flex items-center gap-1.5 text-slate-600">
                <span className="w-3 h-3 rounded-xs bg-[#F59E0B]" /> Human Handled
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Line type="monotone" dataKey="aiResolved" stroke="#635BFF" strokeWidth={2.5} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                <Line type="monotone" dataKey="humanEscalated" stroke="#F59E0B" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Channel Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Conversations by Channel</h2>
            <p className="text-xs text-[#64748B]">Omnichannel volume distribution</p>

            <div className="h-48 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={channelDistribution}
                    innerRadius={45}
                    outerRadius={70}
                    paddingAngle={4}
                    dataKey="count"
                  >
                    {channelDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#fff'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-100">
            {channelDistribution.map(c => (
              <div key={c.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                  <span className="text-slate-700">{c.name}</span>
                </div>
                <div className="font-mono text-slate-500 tabular-nums">
                  {c.count} ({c.percentage}%)
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Charts: Lead Conversion Funnel & AI Cost */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lead Conversion Funnel */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">Lead Conversion Funnel</h2>
              <p className="text-xs text-[#64748B]">From initial inquiry to closed customer</p>
            </div>
            <button
              onClick={() => setCurrentPage('crm')}
              className="text-xs font-semibold text-[#635BFF] hover:underline"
            >
              View CRM →
            </button>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={leadFunnelData}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis dataKey="stage" type="category" tick={{ fontSize: 11, fill: '#0f172a' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                />
                <Bar dataKey="count" fill="#10B981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* AI Usage & Cost Over Time */}
        <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-sm font-bold text-[#0F172A]">AI Usage & Estimated Cost</h2>
              <p className="text-xs text-[#64748B]">Average cost per resolved chat: ₹4.42 (vs ₹45 human)</p>
            </div>
            <div className="font-mono text-xs font-bold text-slate-800 tabular-nums">
              Total: ₹3,860
            </div>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dailyMetrics} margin={{ top: 10, right: 20, left: -15, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} unit="₹" axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '12px',
                    color: '#fff'
                  }}
                  formatter={(val: any) => [`₹${val}`, 'Daily Cost']}
                />
                <Line type="monotone" dataKey="costInr" stroke="#10B981" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white p-5 rounded-xl border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-bold text-[#0F172A]">Recent Operations Activity</h2>
            <p className="text-xs text-[#64748B]">Real-time audit stream of AI decisions and human handovers</p>
          </div>
          <button
            onClick={() => setCurrentPage('rules')}
            className="text-xs font-semibold text-[#635BFF] hover:underline"
          >
            Full Audit Logs →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {recentActivityFeed.map(act => (
            <div key={act.id} className="py-3 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 text-slate-600">
                  {act.type === 'ai_resolved' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  {act.type === 'lead_qualified' && <Users className="w-4 h-4 text-indigo-600" />}
                  {act.type === 'escalated' && <AlertTriangle className="w-4 h-4 text-amber-600" />}
                  {act.type === 'automation' && <Sparkles className="w-4 h-4 text-purple-600" />}
                  {act.type === 'kb_updated' && <Bot className="w-4 h-4 text-slate-600" />}
                </div>

                <div>
                  <div className="text-xs font-semibold text-[#0F172A]">{act.title}</div>
                  <div className="text-xs text-[#64748B] mt-0.5">{act.description}</div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0 text-right">
                <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {act.channel}
                </span>
                <span className="text-xs text-slate-400 font-mono tabular-nums">{act.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
