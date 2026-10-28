import React, { useState } from 'react';
import {
  Bot,
  Plus,
  Play,
  Pause,
  Copy,
  Trash2,
  Sparkles,
  Settings,
  Shield,
  MessageSquare,
  Wrench,
  BookOpen,
  Send,
  CornerDownRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Sliders,
  DollarSign,
  Activity,
  Layers
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Agent, AgentStatus, ChannelType } from '../../types';

export const AgentsPage: React.FC = () => {
  const {
    agents,
    selectedAgentId,
    setSelectedAgentId,
    toggleAgentStatus,
    updateAgent,
    createAgent,
    duplicateAgent,
    knowledge
  } = useApp();

  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'instructions' | 'knowledge' | 'tools' | 'channels' | 'guardrails' | 'playground' | 'logs'
  >('playground');

  // Test playground state
  const [testInput, setTestInput] = useState('');
  const [playgroundChat, setPlaygroundChat] = useState<{
    id: string;
    sender: 'user' | 'agent';
    text: string;
    toolEvents?: { name: string; output: string }[];
  }[]>([
    {
      id: 'p-1',
      sender: 'user',
      text: 'Do your laundry sheets dissolve in hard water? We have 450 TDS borewell water in Bangalore.'
    },
    {
      id: 'p-2',
      sender: 'agent',
      text: 'Yes! NurtureClean Eco Laundry Strips are specifically formulated for Indian hard water conditions (tested up to 500 ppm TDS). The plant saponins and bio-surfactants dissolve completely in under 30 seconds without leaving any chalky residue.',
      toolEvents: [
        {
          name: 'KnowledgeBase.search("hard borewell water TDS Bangalore")',
          output: 'Found 1 verified match in Dermatological Safety & Hard Water FAQ (Score 0.94)'
        }
      ]
    }
  ]);

  const currentAgent = agents.find(a => a.id === selectedAgentId) || agents[0];

  // Editable form state
  const [editForm, setEditForm] = useState<Agent>(currentAgent);

  // Sync edit form when selected agent changes
  React.useEffect(() => {
    if (currentAgent) {
      setEditForm(currentAgent);
    }
  }, [currentAgent]);

  const handleSaveConfig = () => {
    updateAgent(editForm);
    setIsEditing(false);
  };

  const handleSendTestMessage = () => {
    if (!testInput.trim()) return;

    const userMsg = { id: 'p-' + Date.now(), sender: 'user' as const, text: testInput };
    setPlaygroundChat(prev => [...prev, userMsg]);
    const query = testInput;
    setTestInput('');

    // Simulate intelligent agent response based on agent role
    setTimeout(() => {
      let reply = '';
      let simulatedTools: { name: string; output: string }[] = [];

      if (query.toLowerCase().includes('order') || query.toLowerCase().includes('track') || query.toLowerCase().includes('delivery')) {
        reply = `I checked your simulated customer profile. Your latest Order #NC-9842 is out for delivery with Delhivery Express in Mumbai. Delivery estimated today before 3:00 PM.`;
        simulatedTools = [
          { name: 'Shopify.lookupOrder("NC-9842")', output: 'Carrier: Delhivery, Waybill: DEL-88392110, Status: Out for delivery' }
        ];
      } else if (query.toLowerCase().includes('wholesale') || query.toLowerCase().includes('bulk') || query.toLowerCase().includes('price')) {
        reply = `We offer tiered wholesale margins starting at 25% off for 50+ units, and 35% for 250+ units. I have generated a preliminary quote and logged your inquiry in the CRM.`;
        simulatedTools = [
          { name: 'CRM.createLead("Wholesale Inquiry")', output: 'Created lead with Score 85. Notified Aryan Patel.' }
        ];
      } else {
        reply = `Hello! Based on the configured ${currentAgent.name} instructions (${currentAgent.tone} tone), I am ready to resolve your request autonomously or route to our operations desk.`;
        simulatedTools = [
          { name: `AgentEngine.evaluateGuardrails("${currentAgent.name}")`, output: 'All policies verified. Human approval not required.' }
        ];
      }

      setPlaygroundChat(prev => [
        ...prev,
        {
          id: 'p-' + (Date.now() + 1),
          sender: 'agent',
          text: reply,
          toolEvents: simulatedTools
        }
      ]);
    }, 700);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[#0F172A] tracking-tight">AI Agent Management</h1>
          <p className="text-xs text-[#64748B] mt-0.5">
            Configure system prompts, tool permissions, escalation boundaries, and test live in the simulation playground.
          </p>
        </div>

        <button
          onClick={() =>
            createAgent({
              name: 'Festive Flash Agent',
              role: 'Promotional Discounts',
              description: 'Manages festival discount campaigns and flash stock alerts.'
            })
          }
          className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-sm transition-all cursor-pointer whitespace-nowrap self-start"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New AI Agent</span>
        </button>
      </div>

      {/* 4 Agent Overview Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        {agents.map(agent => {
          const isSelected = agent.id === currentAgent.id;
          return (
            <div
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-4 rounded-xl border bg-white shadow-xs cursor-pointer transition-all flex flex-col justify-between ${
                isSelected
                  ? 'border-[#635BFF] ring-2 ring-[#635BFF]/20 shadow-md'
                  : 'border-[#E2E8F0] hover:border-slate-300'
              }`}
            >
              <div>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-8 h-8 rounded-lg ${agent.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-bold text-slate-900 truncate max-w-[130px]">
                        {agent.name}
                      </h3>
                      <div className="text-[10px] text-slate-500 truncate">{agent.role}</div>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded capitalize ${
                      agent.status === 'active'
                        ? 'bg-emerald-50 text-emerald-700'
                        : agent.status === 'paused'
                        ? 'bg-amber-50 text-amber-700'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {agent.status}
                  </span>
                </div>

                <p className="mt-3 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {agent.description}
                </p>

                <div className="mt-3 flex flex-wrap gap-1">
                  {agent.channels.map(ch => (
                    <span
                      key={ch}
                      className="text-[9px] font-semibold uppercase text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded"
                    >
                      {ch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Handled:</span>
                  <span className="font-mono font-semibold text-slate-900 tabular-nums">
                    {agent.conversationsHandled} chats
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Resolution Rate:</span>
                  <span className="font-mono font-semibold text-emerald-600 tabular-nums">
                    {agent.resolutionRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500">Avg TAT:</span>
                  <span className="font-mono text-slate-700 tabular-nums">{agent.avgResponseTime}</span>
                </div>

                <div className="pt-2 flex items-center justify-between gap-2 border-t border-slate-100">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      toggleAgentStatus(agent.id);
                    }}
                    className={`flex-1 py-1 text-[11px] font-medium rounded flex items-center justify-center gap-1 transition-colors ${
                      agent.status === 'active'
                        ? 'text-amber-700 bg-amber-50 hover:bg-amber-100'
                        : 'text-emerald-700 bg-emerald-50 hover:bg-emerald-100'
                    }`}
                  >
                    {agent.status === 'active' ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
                    <span>{agent.status === 'active' ? 'Pause' : 'Activate'}</span>
                  </button>

                  <button
                    onClick={e => {
                      e.stopPropagation();
                      duplicateAgent(agent.id);
                    }}
                    className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    title="Clone Agent"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Agent Workspace & Tabs */}
      <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
        {/* Workspace Subheader */}
        <div className="p-5 border-b border-[#E2E8F0] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl ${currentAgent.avatarColor} text-white flex items-center justify-center font-bold`}>
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-900">{currentAgent.name}</h2>
                <span className="text-[10px] font-semibold bg-[#635BFF]/10 text-[#635BFF] px-2 py-0.5 rounded">
                  {currentAgent.role}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">{currentAgent.description}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-3.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
            >
              {isEditing ? 'Cancel Edit' : 'Edit Configuration'}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveConfig}
                className="px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg transition-colors cursor-pointer"
              >
                Save Changes
              </button>
            )}
          </div>
        </div>

        {/* 8 Configuration Tabs */}
        <div className="flex items-center gap-1 px-5 border-b border-[#E2E8F0] overflow-x-auto text-xs bg-slate-50/60">
          {(
            [
              { id: 'playground', label: 'Test Playground', icon: <Sparkles className="w-3.5 h-3.5" /> },
              { id: 'instructions', label: 'Instructions & Tone', icon: <Bot className="w-3.5 h-3.5" /> },
              { id: 'tools', label: 'Tools & Actions', icon: <Wrench className="w-3.5 h-3.5" /> },
              { id: 'guardrails', label: 'Guardrails & Budgets', icon: <Shield className="w-3.5 h-3.5" /> },
              { id: 'knowledge', label: 'Knowledge Sources', icon: <BookOpen className="w-3.5 h-3.5" /> },
              { id: 'channels', label: 'Assigned Channels', icon: <Layers className="w-3.5 h-3.5" /> },
              { id: 'overview', label: 'Performance', icon: <Activity className="w-3.5 h-3.5" /> }
            ] as const
          ).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 py-3 px-3 font-semibold border-b-2 whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-[#635BFF] text-[#635BFF]'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* TAB CONTENTS */}
        <div className="p-6">
          {/* TAB 1: TEST PLAYGROUND */}
          {activeTab === 'playground' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Simulation Chat Column */}
              <div className="lg:col-span-2 flex flex-col h-[480px] bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="p-3 bg-white border-b border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs">
                    <span className="font-semibold text-slate-800">Agent Interactive Simulation</span>
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-mono">
                      Active: {currentAgent.name}
                    </span>
                  </div>
                  <button
                    onClick={() => setPlaygroundChat([])}
                    className="text-[11px] text-slate-400 hover:text-slate-600"
                  >
                    Clear History
                  </button>
                </div>

                {/* Chat Stream */}
                <div className="flex-1 p-4 overflow-y-auto space-y-4">
                  {playgroundChat.map(msg => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[10px] font-medium text-slate-400 mb-1 px-1">
                        {msg.sender === 'user' ? 'You (Test Customer)' : currentAgent.name}
                      </span>
                      <div
                        className={`max-w-lg p-3 rounded-2xl text-xs leading-relaxed ${
                          msg.sender === 'user'
                            ? 'bg-[#635BFF] text-white rounded-tr-xs'
                            : 'bg-white border border-slate-200 text-slate-900 rounded-tl-xs shadow-2xs'
                        }`}
                      >
                        {msg.text}
                      </div>

                      {/* Tool Events */}
                      {msg.toolEvents && msg.toolEvents.length > 0 && (
                        <div className="mt-2 max-w-lg w-full space-y-1">
                          {msg.toolEvents.map((t, idx) => (
                            <div
                              key={idx}
                              className="p-2 rounded bg-slate-900 text-slate-300 font-mono text-[10px] border border-slate-800"
                            >
                              <div className="text-indigo-400 flex items-center gap-1">
                                <CornerDownRight className="w-3 h-3" /> Simulated Tool Call: {t.name}
                              </div>
                              <div className="text-slate-400 mt-0.5 truncate">{t.output}</div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Input Bar */}
                <div className="p-3 bg-white border-t border-slate-200 flex items-center gap-2">
                  <input
                    type="text"
                    placeholder={`Test message for ${currentAgent.name}... (e.g. Where is my order?)`}
                    value={testInput}
                    onChange={e => setTestInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleSendTestMessage();
                    }}
                    className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
                  />
                  <button
                    onClick={handleSendTestMessage}
                    className="p-2 rounded-lg bg-[#635BFF] hover:bg-[#5145E5] text-white transition-colors cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Simulation Parameters Column */}
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 mb-2">Simulated Runtime Parameters</h4>
                  <div className="space-y-2 text-slate-600">
                    <div className="flex justify-between">
                      <span>Model:</span>
                      <span className="font-mono text-slate-800">gemini-2.5-flash</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tone of Voice:</span>
                      <span className="font-semibold text-indigo-700 capitalize">
                        {currentAgent.tone}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Tool Depth:</span>
                      <span className="font-mono text-slate-800">{currentAgent.maxToolCalls} turns</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Human Approval:</span>
                      <span className="font-semibold text-emerald-700">
                        {currentAgent.requireHumanApproval ? 'Required for >₹1,000' : 'Autonomous'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-indigo-50/50 rounded-xl border border-[#635BFF]/20">
                  <h4 className="font-bold text-[#635BFF] mb-1">Quick Test Prompts</h4>
                  <p className="text-[11px] text-slate-500 mb-2">Click to test instant agent reasoning:</p>
                  <div className="space-y-1.5">
                    <button
                      onClick={() =>
                        setTestInput('Where is order #NC-9842? It was ordered on October 24th.')
                      }
                      className="w-full text-left p-2 rounded bg-white border border-slate-200 text-slate-700 hover:border-[#635BFF] text-[11px]"
                    >
                      "Where is order #NC-9842?"
                    </button>
                    <button
                      onClick={() =>
                        setTestInput('Do you offer corporate pricing for 100 employee welcome kits?')
                      }
                      className="w-full text-left p-2 rounded bg-white border border-slate-200 text-slate-700 hover:border-[#635BFF] text-[11px]"
                    >
                      "Corporate pricing for 100 kits"
                    </button>
                    <button
                      onClick={() =>
                        setTestInput('I received a torn box with leaking detergent. I want a refund.')
                      }
                      className="w-full text-left p-2 rounded bg-white border border-slate-200 text-slate-700 hover:border-[#635BFF] text-[11px]"
                    >
                      "Damaged box refund request"
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: INSTRUCTIONS & TONE */}
          {activeTab === 'instructions' && (
            <div className="space-y-5 max-w-3xl">
              <div>
                <label className="block text-xs font-bold text-slate-900 mb-1">
                  System Instructions (Prompt Blueprint)
                </label>
                <textarea
                  rows={6}
                  disabled={!isEditing}
                  value={editForm.systemInstructions}
                  onChange={e => setEditForm({ ...editForm, systemInstructions: e.target.value })}
                  className="w-full p-3 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:outline-none focus:ring-1 focus:ring-[#635BFF] disabled:bg-slate-50/60"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Tone of Voice</label>
                  <select
                    disabled={!isEditing}
                    value={editForm.tone}
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        tone: e.target.value as 'professional' | 'friendly' | 'concise' | 'empathetic'
                      })
                    }
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  >
                    <option value="friendly">Friendly & Warm (Indian D2C standard)</option>
                    <option value="empathetic">Empathetic (Support & Grievances)</option>
                    <option value="professional">Professional (B2B & Retail Wholesale)</option>
                    <option value="concise">Concise & Direct (Logistics & NDR)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-900 mb-1">Language Mode</label>
                  <input
                    type="text"
                    disabled={!isEditing}
                    value={editForm.languagePreference.join(', ')}
                    onChange={e =>
                      setEditForm({
                        ...editForm,
                        languagePreference: e.target.value.split(',').map(s => s.trim())
                      })
                    }
                    className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: TOOLS & ACTIONS */}
          {activeTab === 'tools' && (
            <div className="space-y-6 max-w-3xl">
              <div>
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-wider mb-2">
                  Allowed Tasks & API Tools
                </h4>
                <div className="space-y-2">
                  {currentAgent.allowedTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-emerald-50/50 border border-emerald-200/80 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-emerald-900">{task}</span>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-rose-800 uppercase tracking-wider mb-2">
                  Restricted Tasks (Strict Guardrails)
                </h4>
                <div className="space-y-2">
                  {currentAgent.restrictedTasks.map((task, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-rose-50/50 border border-rose-200/80 rounded-lg text-xs flex items-center justify-between"
                    >
                      <span className="font-semibold text-rose-900">{task}</span>
                      <Shield className="w-4 h-4 text-rose-600" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: GUARDRAILS */}
          {activeTab === 'guardrails' && (
            <div className="space-y-5 max-w-2xl text-xs">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900">Escalation Conditions</div>
                    <div className="text-slate-500">Autonomous handover triggers to human operator</div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  {currentAgent.escalationConditions.map((cond, idx) => (
                    <div key={idx} className="p-2 bg-white rounded border border-slate-200 text-slate-700">
                      • {cond}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Monthly AI Budget:</div>
                  <div className="text-lg font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
                    ₹{currentAgent.monthlyBudget.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <div className="text-slate-500">Max Tool Calls Per Turn:</div>
                  <div className="text-lg font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
                    {currentAgent.maxToolCalls}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: KNOWLEDGE SOURCES */}
          {activeTab === 'knowledge' && (
            <div className="space-y-4 max-w-3xl">
              <div className="text-xs text-slate-600 mb-2">
                Knowledge bases linked to <strong>{currentAgent.name}</strong> for RAG semantic search:
              </div>
              <div className="space-y-2">
                {knowledge.map(kb => (
                  <div
                    key={kb.id}
                    className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{kb.title}</div>
                      <div className="text-slate-500 mt-0.5">
                        Category: {kb.category} · {kb.tokenCount} tokens
                      </div>
                    </div>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      Linked & Indexed
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: CHANNELS */}
          {activeTab === 'channels' && (
            <div className="space-y-3 max-w-xl text-xs">
              {(['whatsapp', 'instagram', 'website', 'email'] as ChannelType[]).map(ch => {
                const isAssigned = currentAgent.channels.includes(ch);
                return (
                  <div
                    key={ch}
                    className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-slate-900 uppercase">{ch}</div>
                      <div className="text-slate-500">
                        {isAssigned ? 'Active listening enabled' : 'Disabled for this agent'}
                      </div>
                    </div>
                    <span
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${
                        isAssigned
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {isAssigned ? 'Connected' : 'Off'}
                    </span>
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 7: OVERVIEW METRICS */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Conversations Handled</div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
                  {currentAgent.conversationsHandled}
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Resolution Rate</div>
                <div className="text-2xl font-extrabold text-emerald-600 font-mono mt-1 tabular-nums">
                  {currentAgent.resolutionRate}%
                </div>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <div className="text-xs text-slate-500">Estimated Cost</div>
                <div className="text-2xl font-extrabold text-slate-900 font-mono mt-1 tabular-nums">
                  ₹{currentAgent.estimatedCost}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
