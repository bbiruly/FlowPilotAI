import React, { useState } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertCircle,
  Send,
  Sparkles,
  Paperclip,
  Tag,
  UserCheck,
  Phone,
  Mail,
  MapPin,
  ShoppingBag,
  ExternalLink,
  ChevronRight,
  ArrowLeft,
  FileText,
  CornerDownRight,
  Smile,
  ShieldAlert,
  RotateCcw
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ChannelType, ConversationStatus } from '../../types';

export const UnifiedInbox: React.FC = () => {
  const {
    conversations,
    selectedConversationId,
    setSelectedConversationId,
    messages,
    customers,
    sendMessage,
    resolveConversation,
    reopenConversation,
    escalateConversation,
    assignConversationAgent,
    addTagToConversation
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'ai_handling' | 'human_handling' | 'unread' | 'escalated'>('all');
  const [channelFilter, setChannelFilter] = useState<ChannelType | 'all'>('all');
  const [messageInput, setMessageInput] = useState('');
  const [isInternalNoteMode, setIsInternalNoteMode] = useState(false);
  const [showMobileDetail, setShowMobileDetail] = useState(false);
  const [showMobileContext, setShowMobileContext] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const selectedConv = conversations.find(c => c.id === selectedConversationId) || conversations[0];
  const selectedCustomer = customers.find(c => c.id === selectedConv?.customerId);
  const currentMessages = selectedConv ? messages[selectedConv.id] || [] : [];

  // Filter conversations
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch =
      conv.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesChannel = channelFilter === 'all' || conv.channel === channelFilter;

    let matchesStatus = true;
    if (statusFilter === 'open') matchesStatus = conv.status === 'open';
    else if (statusFilter === 'ai_handling') matchesStatus = conv.status === 'ai_handling';
    else if (statusFilter === 'human_handling') matchesStatus = conv.status === 'human_handling';
    else if (statusFilter === 'unread') matchesStatus = conv.unreadCount > 0;
    else if (statusFilter === 'escalated') matchesStatus = conv.isEscalated;

    return matchesSearch && matchesChannel && matchesStatus;
  });

  const handleSend = () => {
    if (!messageInput.trim() || !selectedConv) return;
    sendMessage(selectedConv.id, messageInput, isInternalNoteMode);
    setMessageInput('');
  };

  const handleUseAiSuggestion = () => {
    if (selectedConv?.suggestedAiResponse) {
      setMessageInput(selectedConv.suggestedAiResponse);
    }
  };

  const handleAddTag = () => {
    if (newTagInput.trim() && selectedConv) {
      addTagToConversation(selectedConv.id, newTagInput.trim());
      setNewTagInput('');
      setIsAddingTag(false);
    }
  };

  const getChannelBadge = (ch: ChannelType) => {
    switch (ch) {
      case 'whatsapp':
        return <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">WhatsApp</span>;
      case 'instagram':
        return <span className="text-[10px] font-semibold text-pink-700 bg-pink-50 px-2 py-0.5 rounded">Instagram</span>;
      case 'website':
        return <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded">Web Chat</span>;
      case 'email':
        return <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded">Email</span>;
    }
  };

  return (
    <div className="h-[calc(100vh-5.5rem)] flex flex-col bg-white rounded-2xl border border-[#E2E8F0] shadow-xs overflow-hidden">
      <div className="flex-1 flex overflow-hidden">
        {/* COLUMN 1: Conversation List */}
        <div
          className={`w-full md:w-80 lg:w-96 flex flex-col border-r border-[#E2E8F0] bg-white ${
            showMobileDetail ? 'hidden md:flex' : 'flex'
          }`}
        >
          {/* Search & Header */}
          <div className="p-3.5 border-b border-[#E2E8F0] space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-[#635BFF]"
              />
            </div>

            {/* Status Filter Tabs (Segmented Control) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 text-[11px]">
              {(['all', 'ai_handling', 'human_handling', 'unread', 'escalated'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setStatusFilter(tab)}
                  className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
                    statusFilter === tab
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  {tab === 'all'
                    ? 'All'
                    : tab === 'ai_handling'
                    ? 'AI Handled'
                    : tab === 'human_handling'
                    ? 'Human'
                    : tab === 'unread'
                    ? 'Unread'
                    : 'Escalated'}
                </button>
              ))}
            </div>

            {/* Channel Filters */}
            <div className="flex items-center gap-1 text-[11px] text-slate-500 pt-1 border-t border-slate-100">
              <span className="text-[10px] text-slate-400">Channel:</span>
              {(['all', 'whatsapp', 'instagram', 'website', 'email'] as const).map(ch => (
                <button
                  key={ch}
                  onClick={() => setChannelFilter(ch)}
                  className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${
                    channelFilter === ch
                      ? 'bg-[#635BFF]/10 text-[#635BFF] font-semibold'
                      : 'hover:text-slate-900'
                  }`}
                >
                  {ch === 'all' ? 'All' : ch.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation Cards List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations matching your filter
              </div>
            ) : (
              filteredConversations.map(conv => {
                const isSelected = conv.id === selectedConv?.id;
                return (
                  <div
                    key={conv.id}
                    onClick={() => {
                      setSelectedConversationId(conv.id);
                      setShowMobileDetail(true);
                    }}
                    className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors relative ${
                      isSelected ? 'bg-indigo-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5 overflow-hidden">
                        <img
                          src={conv.customerAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                          alt={conv.customerName}
                          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div className="truncate">
                          <div className="font-semibold text-xs text-slate-900 truncate">
                            {conv.customerName}
                          </div>
                          <div className="text-[10px] text-slate-500 flex items-center gap-1.5 mt-0.5">
                            {getChannelBadge(conv.channel)}
                            <span>·</span>
                            <span className="truncate">{conv.assignedAgent}</span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-[10px] text-slate-400 font-mono tabular-nums">
                          {conv.lastMessageTime}
                        </span>
                        {conv.unreadCount > 0 && (
                          <div className="mt-1 flex justify-end">
                            <span className="w-4 h-4 rounded-full bg-[#635BFF] text-white text-[9px] font-bold flex items-center justify-center">
                              {conv.unreadCount}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <p className="mt-2 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {conv.lastMessage}
                    </p>

                    {conv.isEscalated && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/60 font-medium">
                        <AlertCircle className="w-3 h-3 text-amber-600 shrink-0" />
                        <span className="truncate">{conv.escalationReason || 'Escalated to human operator'}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* COLUMN 2: Conversation Thread */}
        <div
          className={`flex-1 flex flex-col bg-slate-50/50 ${
            showMobileDetail ? 'flex' : 'hidden md:flex'
          }`}
        >
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-3.5 bg-white border-b border-[#E2E8F0] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowMobileDetail(false)}
                    className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>

                  <img
                    src={selectedConv.customerAvatar}
                    alt={selectedConv.customerName}
                    className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-bold text-slate-900">{selectedConv.customerName}</h2>
                      {getChannelBadge(selectedConv.channel)}
                      <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                        Status: {selectedConv.status.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5 flex items-center gap-2">
                      <span>Assigned: <strong>{selectedConv.assignedAgent}</strong></span>
                      <span>·</span>
                      <span>{selectedCustomer?.location || 'India'}</span>
                    </div>
                  </div>
                </div>

                {/* Header Action Buttons */}
                <div className="flex items-center gap-2">
                  {selectedConv.status === 'resolved' ? (
                    <button
                      onClick={() => reopenConversation(selectedConv.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reopen</span>
                    </button>
                  ) : (
                    <button
                      onClick={() => resolveConversation(selectedConv.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Resolved</span>
                    </button>
                  )}

                  {!selectedConv.isEscalated ? (
                    <button
                      onClick={() => escalateConversation(selectedConv.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-lg transition-colors cursor-pointer"
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      <span>Escalate to Human</span>
                    </button>
                  ) : (
                    <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2.5 py-1 rounded-lg">
                      Human Escrow
                    </span>
                  )}

                  <button
                    onClick={() => setShowMobileContext(!showMobileContext)}
                    className="xl:hidden p-2 rounded-lg text-slate-500 hover:bg-slate-100"
                    title="Toggle customer details"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Messages Body */}
              <div className="flex-1 p-4 lg:p-6 overflow-y-auto space-y-4">
                {currentMessages.map(msg => {
                  if (msg.isInternalNote) {
                    return (
                      <div
                        key={msg.id}
                        className="mx-auto max-w-lg p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900"
                      >
                        <div className="flex items-center justify-between pb-1 font-semibold text-[11px] text-amber-800 border-b border-amber-200/60">
                          <span className="flex items-center gap-1">
                            <FileText className="w-3 h-3 text-amber-700" /> Internal Team Note
                          </span>
                          <span className="font-mono text-[10px]">{msg.timestamp}</span>
                        </div>
                        <p className="mt-1.5 leading-relaxed">{msg.content}</p>
                      </div>
                    );
                  }

                  if (msg.sender === 'system') {
                    return (
                      <div
                        key={msg.id}
                        className="mx-auto max-w-md p-2 rounded-lg bg-slate-100 text-slate-600 text-[11px] text-center"
                      >
                        {msg.content}
                      </div>
                    );
                  }

                  const isCustomer = msg.sender === 'customer';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isCustomer ? 'items-start' : 'items-end'}`}
                    >
                      <div className="flex items-center gap-2 mb-1 px-1 text-[11px] text-slate-400">
                        <span className="font-medium text-slate-600">{msg.senderName}</span>
                        <span>·</span>
                        <span className="font-mono tabular-nums">{msg.timestamp}</span>
                        {msg.isAiGenerated && (
                          <span className="text-[10px] font-semibold text-[#635BFF] bg-[#635BFF]/10 px-1.5 py-0.2 rounded flex items-center gap-1">
                            <Sparkles className="w-2.5 h-2.5" /> AI Generated
                          </span>
                        )}
                      </div>

                      <div
                        className={`max-w-xl p-3.5 rounded-2xl text-xs leading-relaxed shadow-2xs ${
                          isCustomer
                            ? 'bg-white text-slate-900 rounded-tl-xs border border-slate-200'
                            : 'bg-[#635BFF] text-white rounded-tr-xs'
                        }`}
                      >
                        {msg.content}
                      </div>

                      {/* Tool Execution Events (AI Tool Call Records) */}
                      {msg.toolEvents && msg.toolEvents.length > 0 && (
                        <div className="mt-2 max-w-xl w-full space-y-1.5">
                          {msg.toolEvents.map(tool => (
                            <div
                              key={tool.id}
                              className="p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono border border-slate-800"
                            >
                              <div className="flex items-center justify-between text-indigo-400 text-[10px]">
                                <span className="flex items-center gap-1 font-semibold">
                                  <CornerDownRight className="w-3 h-3" /> Tool Call: {tool.toolName}
                                </span>
                                <span className="text-emerald-400 font-semibold">{tool.status}</span>
                              </div>
                              <div className="text-slate-400 text-[10px] truncate mt-1">
                                Input: {tool.input}
                              </div>
                              <div className="text-slate-300 text-[10px] truncate">
                                Output: {tool.output}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* AI Suggested Response Banner */}
              {selectedConv.suggestedAiResponse && (
                <div className="mx-4 mb-2 p-3 bg-indigo-50/80 border border-[#635BFF]/20 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-start gap-2 overflow-hidden">
                    <Sparkles className="w-4 h-4 text-[#635BFF] shrink-0 mt-0.5" />
                    <div>
                      <div className="font-semibold text-[#635BFF] text-[11px]">AI Suggested Reply:</div>
                      <div className="text-slate-700 truncate">{selectedConv.suggestedAiResponse}</div>
                    </div>
                  </div>
                  <button
                    onClick={handleUseAiSuggestion}
                    className="px-3 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                  >
                    Insert Draft
                  </button>
                </div>
              )}

              {/* Message Composer */}
              <div className="p-3.5 bg-white border-t border-[#E2E8F0]">
                {/* Note mode toggle & quick actions */}
                <div className="flex items-center justify-between mb-2 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setIsInternalNoteMode(false)}
                      className={`font-semibold transition-colors ${
                        !isInternalNoteMode ? 'text-[#635BFF]' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      Reply to Customer
                    </button>
                    <span className="text-slate-300">|</span>
                    <button
                      onClick={() => setIsInternalNoteMode(true)}
                      className={`font-semibold flex items-center gap-1 transition-colors ${
                        isInternalNoteMode ? 'text-amber-600' : 'text-slate-400 hover:text-slate-600'
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" /> Internal Note Mode
                    </button>
                  </div>

                  <div className="flex items-center gap-2 text-slate-400 text-xs">
                    <button
                      onClick={() => setMessageInput('Namaste! Thank you for contacting NurtureClean India. How can I assist you today?')}
                      className="hover:text-slate-700 text-[11px]"
                    >
                      + Greeting
                    </button>
                    <span>·</span>
                    <button
                      onClick={() => setMessageInput('Your shipment is scheduled for dispatch today via Delhivery Air.')}
                      className="hover:text-slate-700 text-[11px]"
                    >
                      + Shipping TAT
                    </button>
                  </div>
                </div>

                <div
                  className={`flex items-end gap-2 p-2 rounded-xl border transition-colors ${
                    isInternalNoteMode
                      ? 'bg-amber-50/50 border-amber-300'
                      : 'bg-white border-slate-200 focus-within:border-[#635BFF]'
                  }`}
                >
                  <textarea
                    rows={2}
                    placeholder={
                      isInternalNoteMode
                        ? 'Type an internal note visible only to team operators...'
                        : 'Type your message or click an AI suggestion above...'
                    }
                    value={messageInput}
                    onChange={e => setMessageInput(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                      }
                    }}
                    className="flex-1 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent"
                  />

                  <div className="flex items-center gap-1.5 pb-1">
                    <button
                      onClick={handleSend}
                      disabled={!messageInput.trim()}
                      className={`p-2 rounded-lg text-white transition-all cursor-pointer ${
                        !messageInput.trim()
                          ? 'bg-slate-300 cursor-not-allowed'
                          : isInternalNoteMode
                          ? 'bg-amber-600 hover:bg-amber-700'
                          : 'bg-[#635BFF] hover:bg-[#5145E5] shadow-xs'
                      }`}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a conversation to view thread
            </div>
          )}
        </div>

        {/* COLUMN 3: Customer Context */}
        <div
          className={`w-80 lg:w-88 border-l border-[#E2E8F0] bg-white flex flex-col overflow-y-auto ${
            showMobileContext ? 'fixed inset-y-0 right-0 z-40 shadow-2xl' : 'hidden xl:flex'
          }`}
        >
          {selectedCustomer ? (
            <div className="p-4 space-y-5">
              {/* Profile Card */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Customer Context
                </span>
                <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  Score: {selectedCustomer.leadScore}/100
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedCustomer.avatar}
                  alt={selectedCustomer.name}
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-slate-100"
                />
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{selectedCustomer.name}</h3>
                  <div className="text-xs text-slate-500">{selectedCustomer.location}</div>
                  <div className="text-[11px] text-[#635BFF] font-semibold mt-0.5">
                    LTV: ₹{selectedCustomer.totalSpend.toLocaleString('en-IN')}
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  <span className="font-mono">{selectedCustomer.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  <span className="truncate">{selectedCustomer.email}</span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{selectedCustomer.location}</span>
                </div>
              </div>

              {/* Tags Section */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                  <span>Customer Tags</span>
                  <button
                    onClick={() => setIsAddingTag(!isAddingTag)}
                    className="text-[11px] text-[#635BFF] hover:underline"
                  >
                    + Add
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCustomer.tags.map(tag => (
                    <span
                      key={tag}
                      className="text-[11px] font-medium text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {isAddingTag && (
                  <div className="mt-2 flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Tag name..."
                      value={newTagInput}
                      onChange={e => setNewTagInput(e.target.value)}
                      className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded"
                    />
                    <button
                      onClick={handleAddTag}
                      className="px-2 py-1 text-xs font-semibold text-white bg-[#635BFF] rounded"
                    >
                      Save
                    </button>
                  </div>
                )}
              </div>

              {/* Order History */}
              <div>
                <div className="flex items-center justify-between text-xs font-semibold text-slate-800 mb-2">
                  <span>Recent Orders</span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    {selectedCustomer.orders.length} orders
                  </span>
                </div>

                {selectedCustomer.orders.length === 0 ? (
                  <div className="text-xs text-slate-400 p-2 bg-slate-50 rounded">
                    No previous purchases logged.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {selectedCustomer.orders.map(order => (
                      <div
                        key={order.orderId}
                        className="p-2.5 bg-slate-50 border border-slate-200/80 rounded-lg text-xs space-y-1"
                      >
                        <div className="flex items-center justify-between font-semibold text-slate-900">
                          <span>Order #{order.orderNumber}</span>
                          <span className="font-mono tabular-nums text-slate-700">
                            {order.currency}{order.totalAmount}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {order.items.join(', ')}
                        </div>
                        <div className="flex items-center justify-between pt-1 border-t border-slate-200/50 text-[10px]">
                          <span className="font-medium text-indigo-700">
                            {order.carrier}
                          </span>
                          <span
                            className={`px-1.5 py-0.2 rounded font-semibold ${
                              order.shippingStatus === 'Delivered'
                                ? 'bg-emerald-100 text-emerald-800'
                                : order.shippingStatus === 'In Transit'
                                ? 'bg-indigo-100 text-indigo-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {order.shippingStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Custom Attributes */}
              <div>
                <div className="text-xs font-semibold text-slate-800 mb-2">
                  Custom Properties
                </div>
                <div className="bg-slate-50 rounded-lg p-2.5 space-y-1.5 text-xs">
                  {Object.entries(selectedCustomer.customAttributes).map(([k, v]) => (
                    <div key={k} className="flex justify-between items-center text-[11px]">
                      <span className="text-slate-500">{k}:</span>
                      <span className="font-medium text-slate-800 truncate max-w-[140px] text-right">
                        {v}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <div className="text-xs font-semibold text-slate-800 mb-1">CRM Notes</div>
                <p className="text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-100 italic">
                  "{selectedCustomer.notes}"
                </p>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select conversation to load customer context
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
