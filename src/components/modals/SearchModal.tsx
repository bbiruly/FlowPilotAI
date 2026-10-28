import React, { useState } from 'react';
import { Search, Bot, Users, MessageSquare, BookOpen, ArrowRight, X } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const SearchModal: React.FC = () => {
  const {
    isSearchModalOpen,
    setIsSearchModalOpen,
    conversations,
    leads,
    agents,
    knowledge,
    setCurrentPage,
    setSelectedConversationId,
    setSelectedLeadId,
    setSelectedAgentId
  } = useApp();

  const [query, setQuery] = useState('');

  if (!isSearchModalOpen) return null;

  const filteredConversations = conversations.filter(
    c =>
      c.customerName.toLowerCase().includes(query.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(query.toLowerCase())
  );

  const filteredLeads = leads.filter(
    l =>
      l.customerName.toLowerCase().includes(query.toLowerCase()) ||
      l.companyName.toLowerCase().includes(query.toLowerCase())
  );

  const filteredAgents = agents.filter(
    a =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.role.toLowerCase().includes(query.toLowerCase())
  );

  const filteredKb = knowledge.filter(
    k =>
      k.title.toLowerCase().includes(query.toLowerCase()) ||
      k.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            type="text"
            placeholder="Search conversations, B2B leads, agents, knowledge..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
            className="w-full text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchModalOpen(false)}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Search Results */}
        <div className="p-4 overflow-y-auto space-y-4 divide-y divide-slate-100 text-xs">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Quick Navigation
              </div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setCurrentPage('inbox');
                    setIsSearchModalOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left border border-slate-100"
                >
                  <MessageSquare className="w-4 h-4 text-[#635BFF]" />
                  <span>Go to Unified Inbox</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('crm');
                    setIsSearchModalOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left border border-slate-100"
                >
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>View CRM Pipeline</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('agents');
                    setIsSearchModalOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left border border-slate-100"
                >
                  <Bot className="w-4 h-4 text-purple-600" />
                  <span>Configure AI Agents</span>
                </button>
                <button
                  onClick={() => {
                    setCurrentPage('knowledge');
                    setIsSearchModalOpen(false);
                  }}
                  className="flex items-center gap-2 p-2.5 rounded-lg hover:bg-slate-50 text-slate-700 text-left border border-slate-100"
                >
                  <BookOpen className="w-4 h-4 text-amber-600" />
                  <span>Knowledge Base Articles</span>
                </button>
              </div>
            </div>
          )}

          {/* Conversations Section */}
          {filteredConversations.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Conversations
              </div>
              <div className="space-y-1">
                {filteredConversations.slice(0, 3).map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversationId(conv.id);
                      setCurrentPage('inbox');
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{conv.customerName}</div>
                      <div className="text-slate-500 truncate max-w-md">{conv.lastMessage}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Leads Section */}
          {filteredLeads.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                CRM Leads
              </div>
              <div className="space-y-1">
                {filteredLeads.slice(0, 3).map(lead => (
                  <div
                    key={lead.id}
                    onClick={() => {
                      setSelectedLeadId(lead.id);
                      setCurrentPage('crm');
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">
                        {lead.customerName} · {lead.companyName}
                      </div>
                      <div className="text-slate-500">
                        ₹{lead.estimatedValue.toLocaleString('en-IN')} · Score: {lead.leadScore}
                      </div>
                    </div>
                    <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      {lead.stage}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Agents Section */}
          {filteredAgents.length > 0 && (
            <div className="pt-2">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                AI Agents
              </div>
              <div className="space-y-1">
                {filteredAgents.slice(0, 2).map(agent => (
                  <div
                    key={agent.id}
                    onClick={() => {
                      setSelectedAgentId(agent.id);
                      setCurrentPage('agents');
                      setIsSearchModalOpen(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-lg hover:bg-slate-50 cursor-pointer"
                  >
                    <div>
                      <div className="font-semibold text-slate-900">{agent.name}</div>
                      <div className="text-slate-500">{agent.role}</div>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500 flex justify-between items-center">
          <span>Navigate with arrow keys or click</span>
          <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
};
