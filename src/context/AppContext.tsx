import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Customer,
  Conversation,
  Message,
  Agent,
  Lead,
  LeadStage,
  Workflow,
  KnowledgeItem,
  IntegrationItem,
  RuleConfig,
  AuditEvent,
  NotificationItem,
  ChannelType
} from '../types';
import { initialCustomers } from '../data/customers';
import { initialConversations, initialMessages } from '../data/conversations';
import { initialAgents } from '../data/agents';
import { initialLeads } from '../data/leads';
import { initialWorkflows } from '../data/workflows';
import { initialKnowledge } from '../data/knowledge';
import { initialIntegrations } from '../data/integrations';
import { initialRules, initialAuditEvents } from '../data/rules';

export type NavigationPage =
  | 'landing'
  | 'overview'
  | 'inbox'
  | 'agents'
  | 'crm'
  | 'automations'
  | 'knowledge'
  | 'analytics'
  | 'integrations'
  | 'rules'
  | 'settings';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info';
}

interface AppContextType {
  currentPage: NavigationPage;
  setCurrentPage: (page: NavigationPage) => void;
  isSidebarCollapsed: boolean;
  setIsSidebarCollapsed: (collapsed: boolean | ((prev: boolean) => boolean)) => void;
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  globalSearchQuery: string;
  setGlobalSearchQuery: (q: string) => void;
  dateRange: 'today' | '7d' | '30d' | '90d';
  setDateRange: (range: 'today' | '7d' | '30d' | '90d') => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
  toggleTheme: () => void;
  
  // Toasts
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
  dismissToast: (id: string) => void;

  // Data & Actions
  customers: Customer[];
  conversations: Conversation[];
  selectedConversationId: string;
  setSelectedConversationId: (id: string) => void;
  messages: Record<string, Message[]>;
  sendMessage: (conversationId: string, content: string, isInternalNote?: boolean) => void;
  resolveConversation: (conversationId: string) => void;
  reopenConversation: (conversationId: string) => void;
  escalateConversation: (conversationId: string, reason?: string) => void;
  assignConversationAgent: (conversationId: string, agentName: string) => void;
  addTagToConversation: (conversationId: string, tag: string) => void;

  // Agents
  agents: Agent[];
  selectedAgentId: string;
  setSelectedAgentId: (id: string) => void;
  toggleAgentStatus: (agentId: string) => void;
  updateAgent: (agent: Agent) => void;
  createAgent: (agent: Partial<Agent>) => void;
  duplicateAgent: (agentId: string) => void;

  // Leads
  leads: Lead[];
  selectedLeadId: string | null;
  setSelectedLeadId: (id: string | null) => void;
  updateLeadStage: (leadId: string, newStage: LeadStage) => void;
  createLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (leadId: string) => void;

  // Workflows
  workflows: Workflow[];
  selectedWorkflowId: string;
  setSelectedWorkflowId: (id: string) => void;
  toggleWorkflowStatus: (id: string) => void;
  updateWorkflow: (workflow: Workflow) => void;
  duplicateWorkflow: (id: string) => void;

  // Knowledge Base
  knowledge: KnowledgeItem[];
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id' | 'viewsOrUses'>) => void;
  updateKnowledgeItem: (item: KnowledgeItem) => void;
  deleteKnowledgeItem: (id: string) => void;

  // Integrations
  integrations: IntegrationItem[];
  toggleIntegrationConnection: (id: string) => void;

  // Rules & Audits
  rules: RuleConfig;
  updateRules: (newRules: Partial<RuleConfig>) => void;
  auditEvents: AuditEvent[];

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Onboarding modal
  isOnboardingOpen: boolean;
  setIsOnboardingOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<NavigationPage>('overview');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState<'today' | '7d' | '30d' | '90d'>('7d');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const showToast = (title: string, description?: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = 'toast-' + Date.now();
    setToasts(prev => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };
  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
    showToast('Theme Changed', `Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, 'info');
  };

  // Customers & Conversations
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers);
  const [conversations, setConversations] = useState<Conversation[]>(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState<string>('conv-1');
  const [messages, setMessages] = useState<Record<string, Message[]>>(initialMessages);

  // Agents
  const [agents, setAgents] = useState<Agent[]>(initialAgents);
  const [selectedAgentId, setSelectedAgentId] = useState<string>('agent-1');

  // Leads
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [selectedLeadId, setSelectedLeadId] = useState<string | null>(null);

  // Workflows
  const [workflows, setWorkflows] = useState<Workflow[]>(initialWorkflows);
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>('wf-1');

  // Knowledge
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>(initialKnowledge);

  // Integrations
  const [integrations, setIntegrations] = useState<IntegrationItem[]>(initialIntegrations);

  // Rules & Audits
  const [rules, setRules] = useState<RuleConfig>(initialRules);
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>(initialAuditEvents);

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'Wholesale Lead Escalated',
      message: 'Vikram Verma requested 5,000 units/quarter retail contract. Needs founder approval.',
      time: '1h ago',
      type: 'urgent',
      read: false,
      linkRoute: 'inbox'
    },
    {
      id: 'notif-2',
      title: 'NDR Landmark Verified',
      message: 'Pooja Patel provided landmark near Iscon Gathiya. Re-attempt scheduled.',
      time: '2h ago',
      type: 'info',
      read: false,
      linkRoute: 'inbox'
    },
    {
      id: 'notif-3',
      title: 'Weekly AI Operations Report',
      message: 'Resolved 68% of 1,284 chats autonomously with ₹4,82,000 attributed revenue.',
      time: 'Yesterday',
      type: 'success',
      read: true,
      linkRoute: 'analytics'
    }
  ]);

  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);

  // Keyboard shortcut ⌘K or Ctrl+K for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Send message action with simulated AI response
  const sendMessage = (conversationId: string, content: string, isInternalNote: boolean = false) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: 'msg-' + Date.now(),
      conversationId,
      sender: isInternalNote ? 'human_agent' : 'human_agent',
      senderName: isInternalNote ? 'Aryan Patel (Internal Note)' : 'Aryan Patel',
      content,
      timestamp: 'Just now',
      isAiGenerated: false,
      isInternalNote
    };

    setMessages(prev => ({
      ...prev,
      [conversationId]: [...(prev[conversationId] || []), newMessage]
    }));

    if (!isInternalNote) {
      setConversations(prev =>
        prev.map(c =>
          c.id === conversationId
            ? { ...c, lastMessage: content, lastMessageTime: 'Just now', unreadCount: 0 }
            : c
        )
      );
      showToast('Message Sent', 'Customer notified via primary channel', 'success');

      // If customer asks a question in test mode, trigger a realistic AI response after 1.2s
      if (conversationId === 'conv-6') {
        setTimeout(() => {
          const aiReply: Message = {
            id: 'msg-ai-' + Date.now(),
            conversationId,
            sender: 'agent',
            senderName: 'Customer Support Agent',
            content:
              'Thank you for confirming, Arjun! Our Baby Fabric Strips are 100% hypoallergenic and zero-residue certified. I have noted your baby eczema sensitivity in your profile.',
            timestamp: 'Just now',
            isAiGenerated: true,
            toolEvents: [
              {
                id: 'te-auto-' + Date.now(),
                toolName: 'CRM.appendCustomerTag',
                input: '{"tag": "Baby Eczema Safe", "customerId": "cust-6"}',
                output: '{"status": "tag_added"}',
                timestamp: 'Just now',
                status: 'success'
              }
            ]
          };
          setMessages(m => ({
            ...m,
            [conversationId]: [...(m[conversationId] || []), aiReply]
          }));
          setConversations(c =>
            c.map(conv =>
              conv.id === conversationId
                ? {
                    ...conv,
                    lastMessage: aiReply.content,
                    lastMessageTime: 'Just now',
                    status: 'ai_handling'
                  }
                : conv
            )
          );
        }, 1200);
      }
    } else {
      showToast('Internal Note Added', 'Visible only to team operators', 'info');
    }
  };

  const resolveConversation = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, status: 'resolved', isEscalated: false } : c))
    );
    showToast('Conversation Resolved', 'Ticket closed and satisfaction survey queued', 'success');
  };

  const reopenConversation = (conversationId: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, status: 'open' } : c))
    );
    showToast('Conversation Reopened', 'Ticket moved back to active queue', 'info');
  };

  const escalateConversation = (conversationId: string, reason: string = 'Operator manual escalation') => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId
          ? { ...c, status: 'escalated', isEscalated: true, escalationReason: reason }
          : c
      )
    );
    showToast('Escalated to Human', 'High priority alert dispatched to operations desk', 'info');
  };

  const assignConversationAgent = (conversationId: string, agentName: string) => {
    setConversations(prev =>
      prev.map(c => (c.id === conversationId ? { ...c, assignedAgent: agentName } : c))
    );
    showToast('Agent Assigned', `Assigned to ${agentName}`, 'success');
  };

  const addTagToConversation = (conversationId: string, tag: string) => {
    setConversations(prev =>
      prev.map(c =>
        c.id === conversationId && !c.tags.includes(tag)
          ? { ...c, tags: [...c.tags, tag] }
          : c
      )
    );
    showToast('Tag Added', `Tag "${tag}" attached`, 'success');
  };

  // Agent Actions
  const toggleAgentStatus = (agentId: string) => {
    setAgents(prev =>
      prev.map(a =>
        a.id === agentId
          ? { ...a, status: a.status === 'active' ? 'paused' : 'active' }
          : a
      )
    );
    const agent = agents.find(a => a.id === agentId);
    showToast(
      'Agent Status Updated',
      `${agent?.name} is now ${agent?.status === 'active' ? 'paused' : 'active'}`,
      'info'
    );
  };

  const updateAgent = (updated: Agent) => {
    setAgents(prev => prev.map(a => (a.id === updated.id ? updated : a)));
    showToast('Agent Configuration Saved', `${updated.name} updated successfully`, 'success');
  };

  const createAgent = (newAgentData: Partial<Agent>) => {
    const newAgent: Agent = {
      id: 'agent-' + Date.now(),
      name: newAgentData.name || 'New Custom Agent',
      role: newAgentData.role || 'Custom Operations Assistant',
      description: newAgentData.description || 'Configured via FlowPilot studio.',
      status: 'active',
      channels: newAgentData.channels || ['whatsapp', 'website'],
      conversationsHandled: 0,
      resolutionRate: 100,
      avgResponseTime: '8s',
      estimatedCost: 0,
      lastActive: 'Just now',
      avatarColor: 'bg-teal-500',
      systemInstructions: newAgentData.systemInstructions || 'You are an intelligent customer operations agent.',
      tone: newAgentData.tone || 'friendly',
      languagePreference: newAgentData.languagePreference || ['English (Indian)'],
      allowedTasks: newAgentData.allowedTasks || ['General Support'],
      restrictedTasks: newAgentData.restrictedTasks || ['Refunds > ₹1,000'],
      escalationConditions: newAgentData.escalationConditions || ['Customer asks for supervisor'],
      maxToolCalls: 4,
      monthlyBudget: 3000,
      requireHumanApproval: true
    };
    setAgents(prev => [newAgent, ...prev]);
    setSelectedAgentId(newAgent.id);
    showToast('AI Agent Created', `${newAgent.name} is ready for deployment`, 'success');
  };

  const duplicateAgent = (agentId: string) => {
    const existing = agents.find(a => a.id === agentId);
    if (!existing) return;
    const duplicated: Agent = {
      ...existing,
      id: 'agent-' + Date.now(),
      name: `${existing.name} (Copy)`,
      status: 'draft',
      conversationsHandled: 0,
      estimatedCost: 0
    };
    setAgents(prev => [duplicated, ...prev]);
    showToast('Agent Duplicated', `Created draft clone of ${existing.name}`, 'info');
  };

  // Leads
  const updateLeadStage = (leadId: string, newStage: LeadStage) => {
    setLeads(prev =>
      prev.map(lead =>
        lead.id === leadId
          ? { ...lead, stage: newStage, lastInteraction: 'Just now' }
          : lead
      )
    );
    showToast('Pipeline Updated', `Moved lead to ${newStage.toUpperCase()}`, 'success');
  };

  const createLead = (leadData: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...leadData,
      id: 'lead-' + Date.now()
    };
    setLeads(prev => [newLead, ...prev]);
    showToast('Lead Created', `${newLead.customerName} added to CRM pipeline`, 'success');
  };

  const updateLead = (updated: Lead) => {
    setLeads(prev => prev.map(l => (l.id === updated.id ? updated : l)));
    showToast('Lead Updated', 'Changes saved to CRM record', 'success');
  };

  const deleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    if (selectedLeadId === leadId) setSelectedLeadId(null);
    showToast('Lead Deleted', 'Lead removed from pipeline', 'info');
  };

  // Workflows
  const toggleWorkflowStatus = (id: string) => {
    setWorkflows(prev =>
      prev.map(wf =>
        wf.id === id ? { ...wf, status: wf.status === 'active' ? 'paused' : 'active' } : wf
      )
    );
    const wf = workflows.find(w => w.id === id);
    showToast(
      'Workflow Updated',
      `${wf?.name} is now ${wf?.status === 'active' ? 'paused' : 'active'}`,
      'info'
    );
  };

  const updateWorkflow = (wf: Workflow) => {
    setWorkflows(prev => prev.map(w => (w.id === wf.id ? wf : w)));
    showToast('Automation Saved', `${wf.name} configuration updated`, 'success');
  };

  const duplicateWorkflow = (id: string) => {
    const existing = workflows.find(w => w.id === id);
    if (!existing) return;
    const duplicated: Workflow = {
      ...existing,
      id: 'wf-' + Date.now(),
      name: `${existing.name} (Copy)`,
      status: 'draft',
      totalRuns: 0
    };
    setWorkflows(prev => [duplicated, ...prev]);
    showToast('Workflow Cloned', `Draft copy of ${existing.name} created`, 'info');
  };

  // Knowledge Base
  const addKnowledgeItem = (item: Omit<KnowledgeItem, 'id' | 'viewsOrUses'>) => {
    const newItem: KnowledgeItem = {
      ...item,
      id: 'kb-' + Date.now(),
      viewsOrUses: 0
    };
    setKnowledge(prev => [newItem, ...prev]);
    showToast('Knowledge Ingested', `"${newItem.title}" indexed for agent retrieval`, 'success');
  };

  const updateKnowledgeItem = (item: KnowledgeItem) => {
    setKnowledge(prev => prev.map(k => (k.id === item.id ? item : k)));
    showToast('Document Updated', `"${item.title}" re-indexed`, 'success');
  };

  const deleteKnowledgeItem = (id: string) => {
    setKnowledge(prev => prev.filter(k => k.id !== id));
    showToast('Document Removed', 'Source deleted from agent knowledge base', 'info');
  };

  // Integrations
  const toggleIntegrationConnection = (id: string) => {
    setIntegrations(prev =>
      prev.map(i => {
        if (i.id === id) {
          const newStatus = i.status === 'connected' ? 'disconnected' : 'connected';
          return {
            ...i,
            status: newStatus,
            lastSync: newStatus === 'connected' ? 'Just now' : undefined
          };
        }
        return i;
      })
    );
    const item = integrations.find(i => i.id === id);
    showToast(
      'Integration State Changed',
      `${item?.name} is now ${item?.status === 'connected' ? 'disconnected' : 'connected'}`,
      'info'
    );
  };

  // Rules
  const updateRules = (newRules: Partial<RuleConfig>) => {
    setRules(prev => ({ ...prev, ...newRules }));
    showToast('Governance Rules Saved', 'Operational guardrails updated for all agents', 'success');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All Caught Up', 'All notifications marked as read', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        isSidebarCollapsed,
        setIsSidebarCollapsed,
        isMobileSidebarOpen,
        setIsMobileSidebarOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        globalSearchQuery,
        setGlobalSearchQuery,
        dateRange,
        setDateRange,
        theme,
        setTheme,
        toggleTheme,

        toasts,
        showToast,
        dismissToast,

        customers,
        conversations,
        selectedConversationId,
        setSelectedConversationId,
        messages,
        sendMessage,
        resolveConversation,
        reopenConversation,
        escalateConversation,
        assignConversationAgent,
        addTagToConversation,

        agents,
        selectedAgentId,
        setSelectedAgentId,
        toggleAgentStatus,
        updateAgent,
        createAgent,
        duplicateAgent,

        leads,
        selectedLeadId,
        setSelectedLeadId,
        updateLeadStage,
        createLead,
        updateLead,
        deleteLead,

        workflows,
        selectedWorkflowId,
        setSelectedWorkflowId,
        toggleWorkflowStatus,
        updateWorkflow,
        duplicateWorkflow,

        knowledge,
        addKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,

        integrations,
        toggleIntegrationConnection,

        rules,
        updateRules,
        auditEvents,

        notifications,
        markNotificationRead,
        markAllNotificationsRead,

        isOnboardingOpen,
        setIsOnboardingOpen
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
