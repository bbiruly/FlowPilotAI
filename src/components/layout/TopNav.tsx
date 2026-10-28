import React, { useState } from 'react';
import {
  Menu,
  Search,
  Bell,
  Calendar,
  Plus,
  Moon,
  Sun,
  Check,
  ChevronDown,
  Sparkles,
  Bot,
  ExternalLink
} from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';

export const TopNav: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    setIsMobileSidebarOpen,
    setIsSearchModalOpen,
    dateRange,
    setDateRange,
    theme,
    toggleTheme,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    createAgent
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDateOpen, setIsDateOpen] = useState(false);

  const unreadNotifs = notifications.filter(n => !n.read).length;

  const pageTitles: Record<NavigationPage, { title: string; subtitle: string }> = {
    landing: { title: '3D Neural Architecture', subtitle: 'Three.js Operational Viewport' },
    overview: { title: 'Overview Dashboard', subtitle: 'Live Operations & Performance' },
    inbox: { title: 'Unified Inbox', subtitle: 'Omnichannel Conversations & Live Triage' },
    agents: { title: 'AI Agents', subtitle: 'Agent Fleet, Instructions & Guardrails' },
    crm: { title: 'CRM & Leads Pipeline', subtitle: 'Deal Stages, Attribution & Follow-ups' },
    automations: { title: 'Automations Builder', subtitle: 'Event Triggers & Action Workflows' },
    knowledge: { title: 'Knowledge Base', subtitle: 'RAG Sources, Catalogs & Policies' },
    analytics: { title: 'Analytics & Reporting', subtitle: 'Channel Attribution & Resolution Trends' },
    integrations: { title: 'Integrations Hub', subtitle: 'Connected Channels & Webhooks' },
    rules: { title: 'Rules & Governance', subtitle: 'Spending Caps & Human Approvals' },
    settings: { title: 'Workspace Settings', subtitle: 'Team Roles & Preferences' }
  };

  const handleQuickCreateAgent = () => {
    createAgent({
      name: 'Festive Season Escalation Agent',
      role: 'Holiday Rush Support & Dispatch',
      description: 'Engineered for high-volume festival delivery queries and gift coupons.'
    });
    setCurrentPage('agents');
  };

  return (
    <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-xs border-b border-[#E2E8F0] px-4 lg:px-8 py-3.5 flex items-center justify-between gap-4 select-none">
      {/* Left: Mobile hamburger + Breadcrumbs */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setIsMobileSidebarOpen(true)}
          className="md:hidden p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex flex-col">
          <div className="flex items-center gap-2 text-xs text-[#64748B]">
            <span>FlowPilot</span>
            <span>/</span>
            <span className="font-semibold text-[#0F172A] capitalize">
              {pageTitles[currentPage]?.title || currentPage}
            </span>
          </div>
          <span className="text-xs text-[#64748B] hidden sm:inline">
            {pageTitles[currentPage]?.subtitle}
          </span>
        </div>
      </div>

      {/* Right: Search, Date Filter, Notifications, Theme, CTA */}
      <div className="flex items-center gap-2.5 sm:gap-3">
        {/* Global Search Button */}
        <button
          onClick={() => setIsSearchModalOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 text-xs text-[#64748B] bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-[#E2E8F0] transition-colors cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-[#64748B]" />
          <span className="hidden sm:inline">Search ops, leads, docs...</span>
          <kbd className="hidden sm:inline font-mono text-[10px] bg-white px-1.5 py-0.5 rounded border border-slate-300 text-slate-500 shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Date Filter Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsDateOpen(!isDateOpen)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#0F172A] bg-white border border-[#E2E8F0] rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5 text-[#64748B]" />
            <span>
              {dateRange === 'today'
                ? 'Today'
                : dateRange === '7d'
                ? 'Last 7 Days'
                : dateRange === '30d'
                ? 'Last 30 Days'
                : 'This Quarter'}
            </span>
            <ChevronDown className="w-3 h-3 text-[#64748B]" />
          </button>

          {isDateOpen && (
            <div className="absolute right-0 mt-1 w-40 bg-white border border-[#E2E8F0] rounded-lg shadow-lg py-1 z-30">
              {(['today', '7d', '30d', '90d'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => {
                    setDateRange(range);
                    setIsDateOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-xs text-[#0F172A] hover:bg-slate-50 flex items-center justify-between"
                >
                  <span>
                    {range === 'today'
                      ? 'Today'
                      : range === '7d'
                      ? 'Last 7 Days'
                      : range === '30d'
                      ? 'Last 30 Days'
                      : 'This Quarter'}
                  </span>
                  {dateRange === range && <Check className="w-3.5 h-3.5 text-[#635BFF]" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
            aria-label="View notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifs > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-[#DC2626]" />
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#E2E8F0] rounded-xl shadow-xl py-2 z-40">
              <div className="px-4 py-2 border-b border-[#E2E8F0] flex items-center justify-between">
                <span className="font-semibold text-xs text-[#0F172A]">Notifications</span>
                {unreadNotifs > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-[11px] text-[#635BFF] hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                {notifications.map(n => (
                  <div
                    key={n.id}
                    onClick={() => {
                      markNotificationRead(n.id);
                      if (n.linkRoute) setCurrentPage(n.linkRoute as NavigationPage);
                      setIsNotifOpen(false);
                    }}
                    className={`px-4 py-3 hover:bg-slate-50 cursor-pointer transition-colors ${
                      !n.read ? 'bg-indigo-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#0F172A]">{n.title}</span>
                      <span className="text-[10px] text-[#64748B]">{n.time}</span>
                    </div>
                    <p className="text-xs text-[#64748B] mt-1 leading-snug">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-500" />}
        </button>

        {/* Primary CTA */}
        <button
          onClick={handleQuickCreateAgent}
          className="hidden sm:flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-[#635BFF] hover:bg-[#5145E5] rounded-lg shadow-sm shadow-[#635BFF]/30 transition-all cursor-pointer whitespace-nowrap"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Create AI Agent</span>
        </button>
      </div>
    </header>
  );
};
