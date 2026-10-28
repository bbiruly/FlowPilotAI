import React from 'react';
import {
  LayoutDashboard,
  Inbox,
  Bot,
  Users,
  GitBranch,
  BookOpen,
  BarChart3,
  Boxes,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  HelpCircle,
  Sparkles,
  Zap
} from 'lucide-react';
import { useApp, NavigationPage } from '../../context/AppContext';

export const Sidebar: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    isMobileSidebarOpen,
    setIsMobileSidebarOpen,
    conversations,
    leads
  } = useApp();

  const unreadCount = conversations.reduce((acc, c) => acc + c.unreadCount, 0);
  const openLeadsCount = leads.filter(l => l.stage === 'new' || l.stage === 'contacted').length;

  const navItems: { id: NavigationPage; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'inbox', label: 'Unified Inbox', icon: <Inbox className="w-4 h-4" />, badge: unreadCount > 0 ? unreadCount : undefined },
    { id: 'agents', label: 'AI Agents', icon: <Bot className="w-4 h-4" />, badge: '4 Active' },
    { id: 'crm', label: 'CRM & Leads', icon: <Users className="w-4 h-4" />, badge: openLeadsCount },
    { id: 'automations', label: 'Automations', icon: <GitBranch className="w-4 h-4" /> },
    { id: 'knowledge', label: 'Knowledge Base', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'integrations', label: 'Integrations', icon: <Boxes className="w-4 h-4" />, badge: '7/8' },
    { id: 'rules', label: 'Rules & Permissions', icon: <ShieldCheck className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-4 h-4" /> }
  ];

  const handleNavClick = (id: NavigationPage) => {
    setCurrentPage(id);
    setIsMobileSidebarOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#E2E8F0] select-none">
      {/* Brand & Workspace Header */}
      <div className="p-4 border-b border-[#E2E8F0] flex items-center justify-between">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-9 h-9 rounded-xl bg-[#635BFF] flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-sm shadow-[#635BFF]/30">
            FP
          </div>
          {!isSidebarCollapsed && (
            <div className="truncate">
              <div className="font-bold text-sm text-[#0F172A] tracking-tight flex items-center gap-1.5">
                FlowPilot AI
                <span className="text-[10px] font-semibold text-[#635BFF] bg-[#635BFF]/10 px-1.5 py-0.5 rounded">
                  SaaS
                </span>
              </div>
              <div className="text-xs text-[#64748B] truncate">NurtureClean India (D2C)</div>
            </div>
          )}
        </div>

        {/* Desktop Collapse Toggle */}
        <button
          onClick={() => setIsSidebarCollapsed(prev => !prev)}
          className="hidden md:flex p-1.5 rounded-lg text-[#64748B] hover:text-[#0F172A] hover:bg-slate-100 transition-colors"
          title={isSidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isSidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* 3D Scene View Link */}
      <div className="px-3 pt-3">
        <button
          onClick={() => handleNavClick('landing')}
          className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
            currentPage === 'landing'
              ? 'bg-[#0F172A] text-white shadow-sm'
              : 'bg-[#635BFF]/5 text-[#635BFF] hover:bg-[#635BFF]/10 border border-[#635BFF]/20'
          }`}
          title="Interactive 3D Three.js Hub"
        >
          <Sparkles className="w-4 h-4 shrink-0" />
          {!isSidebarCollapsed && (
            <span className="truncate flex items-center justify-between w-full">
              3D Neural Landing <ExternalLink className="w-3 h-3 opacity-60" />
            </span>
          )}
        </button>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navItems.map(item => {
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                isActive
                  ? 'bg-[#635BFF] text-white shadow-sm shadow-[#635BFF]/25 font-semibold'
                  : 'text-[#64748B] hover:text-[#0F172A] hover:bg-slate-50'
              }`}
              title={item.label}
            >
              <div className={isActive ? 'text-white' : 'text-[#64748B] group-hover:text-[#0F172A]'}>
                {item.icon}
              </div>
              {!isSidebarCollapsed && (
                <div className="flex-1 flex items-center justify-between truncate text-left">
                  <span className="truncate">{item.label}</span>
                  {item.badge !== undefined && (
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : typeof item.badge === 'number'
                          ? 'bg-[#635BFF]/10 text-[#635BFF]'
                          : 'bg-slate-100 text-[#64748B]'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Plan Meter & User Profile */}
      <div className="p-3 border-t border-[#E2E8F0] space-y-3">
        {!isSidebarCollapsed && (
          <div className="bg-slate-50 border border-[#E2E8F0] rounded-xl p-3">
            <div className="flex items-center justify-between text-xs font-semibold text-[#0F172A]">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#635BFF]" /> Growth Plan
              </span>
              <span className="text-slate-500 font-mono text-[11px] tabular-nums">51%</span>
            </div>
            <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#635BFF] h-full rounded-full" style={{ width: '51%' }} />
            </div>
            <div className="mt-1.5 text-[10px] text-[#64748B] flex justify-between">
              <span>12,840 ops</span>
              <span>25,000 limit</span>
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 p-1.5 rounded-lg hover:bg-slate-50 transition-colors">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Aryan Patel"
            className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
          />
          {!isSidebarCollapsed && (
            <div className="truncate flex-1">
              <div className="text-xs font-semibold text-[#0F172A] truncate">Aryan Patel</div>
              <div className="text-[10px] text-[#64748B] truncate">VP Operations (Admin)</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside
        className={`hidden md:block transition-all duration-200 z-30 shrink-0 h-screen sticky top-0 ${
          isSidebarCollapsed ? 'w-[72px]' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full shadow-2xl z-10">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
