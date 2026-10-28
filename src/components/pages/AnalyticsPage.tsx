import React, { useState } from 'react';
import {
  BarChart3,
  Calendar,
  Filter,
  Download,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Smile,
  DollarSign,
  ArrowUpRight,
  Bot
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area
} from 'recharts';
import { dailyMetrics, channelDistribution, agentPerformanceComparison } from '../../data/analytics';
import { useApp } from '../../context/AppContext';

export const AnalyticsPage: React.FC = () => {
  const { dateRange, setDateRange, showToast } = useApp();
  const [channelFilter, setChannelFilter] = useState('all');
  const [sortField, setSortField] = useState<'totalHandled' | 'resolutionRate'>('totalHandled');

  const sortedAgents = [...agentPerformanceComparison].sort((a, b) => b[sortField] - a[sortField]);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">Operations Analytics</h1>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              Illustrative Attribution Metrics
            </span>
          </div>
          <p className="text-xs text-[#64748B] mt-0.5">
            Real-time telemetry measuring agent resolution speed, unit cost savings, and lead velocity.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="text-xs bg-white border border-slate-200 rounded-lg px-3 py-1.5 font-medium text-slate-700"
          >
            <option value="all">All Channels</option>
            <option value="whatsapp">WhatsApp Business</option>
            <option value="instagram">Instagram DMs</option>
            <option value="website">Website Chat</option>
            <option value="email">Email</option>
          </select>

          <button
            onClick={() => showToast('Analytics Exported', 'Full KPI snapshot downloaded', 'success')}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      {/* 8 Primary KPI Tiles Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">First Response Time</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            11s
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1 flex items-center">
            <ArrowUpRight className="w-3 h-3" /> 98% faster than human SLA
          </div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Autonomous Resolution</div>
          <div className="text-2xl font-extrabold text-indigo-600 font-mono mt-1 tabular-nums">
            68%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">872 resolved without human</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Customer CSAT Score</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            4.8 <span className="text-xs font-normal text-slate-400">/ 5.0</span>
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">94% positive rating</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Cost Per Resolution</div>
          <div className="text-2xl font-extrabold text-emerald-700 font-mono mt-1 tabular-nums">
            ₹4.42
          </div>
          <div className="text-[11px] text-slate-500 mt-1 font-mono">vs ₹45/ticket human agent</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Qualified Pipeline</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            216 leads
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">+28.4% this period</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Attributed AI Revenue</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            ₹4,82,000
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Illustrative attribution</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Total AI Cloud Spend</div>
          <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
            ₹3,860
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Within ₹25,000 budget cap</div>
        </div>

        <div className="p-4 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="text-xs text-slate-500">Escalation Rate</div>
          <div className="text-2xl font-extrabold text-amber-600 font-mono mt-1 tabular-nums">
            32%
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Handed over with full context</div>
        </div>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trend 1: Daily Volume & Resolutions */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Conversation Volume & AI Resolutions</h3>
              <p className="text-xs text-slate-500">Daily breakdown of total vs autonomous handling</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#635BFF" stopOpacity={0} />
                  </linearGradient>
                </defs>
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
                <Area type="monotone" dataKey="totalConversations" stroke="#635BFF" fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="aiResolved" stroke="#10B981" fillOpacity={0} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Trend 2: Leads Qualified Over Time */}
        <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Daily B2B Leads Qualified</h3>
              <p className="text-xs text-slate-500">Leads scored and ingested into CRM pipeline</p>
            </div>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyMetrics} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
                <Bar dataKey="leadsQualified" fill="#635BFF" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Agent Performance Comparison Table */}
      <div className="p-5 bg-white rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Agent Performance Matrix</h3>
            <p className="text-xs text-slate-500">Autonomous resolution, CSAT, and cost efficiency across agents</p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400">Sort by:</span>
            <button
              onClick={() => setSortField('totalHandled')}
              className={`px-2.5 py-1 rounded font-semibold ${
                sortField === 'totalHandled' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Handled Volume
            </button>
            <button
              onClick={() => setSortField('resolutionRate')}
              className={`px-2.5 py-1 rounded font-semibold ${
                sortField === 'resolutionRate' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              Resolution %
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3">Agent Name</th>
                <th className="p-3 text-right">Handled</th>
                <th className="p-3 text-center">Resolution Rate</th>
                <th className="p-3 text-center">Avg TAT</th>
                <th className="p-3 text-center">CSAT</th>
                <th className="p-3 text-right">Cloud Cost</th>
                <th className="p-3 text-right">Cost / Ticket</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sortedAgents.map(ag => (
                <tr key={ag.agentName} className="hover:bg-slate-50">
                  <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                    <Bot className="w-4 h-4 text-[#635BFF]" />
                    <span>{ag.agentName}</span>
                  </td>
                  <td className="p-3 text-right font-mono font-semibold tabular-nums text-slate-800">
                    {ag.totalHandled}
                  </td>
                  <td className="p-3 text-center font-mono font-bold tabular-nums text-emerald-600">
                    {ag.resolutionRate}%
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums text-slate-700">
                    {ag.avgResponseTime}
                  </td>
                  <td className="p-3 text-center font-mono tabular-nums text-slate-700">{ag.csat}</td>
                  <td className="p-3 text-right font-mono tabular-nums text-slate-700">{ag.cost}</td>
                  <td className="p-3 text-right font-mono font-bold tabular-nums text-emerald-700">
                    {ag.costPerResolved}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
