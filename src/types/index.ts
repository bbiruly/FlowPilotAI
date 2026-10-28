export type ChannelType = 'whatsapp' | 'instagram' | 'website' | 'email';

export type ConversationStatus = 'open' | 'ai_handling' | 'human_handling' | 'resolved' | 'escalated';

export interface MessageAttachment {
  id: string;
  name: string;
  size: string;
  type: string;
}

export interface ToolEvent {
  id: string;
  toolName: string;
  input: string;
  output: string;
  timestamp: string;
  status: 'success' | 'warning' | 'pending';
}

export interface Message {
  id: string;
  conversationId: string;
  sender: 'customer' | 'agent' | 'human_agent' | 'system';
  senderName: string;
  content: string;
  timestamp: string;
  isAiGenerated?: boolean;
  isInternalNote?: boolean;
  toolEvents?: ToolEvent[];
  attachments?: MessageAttachment[];
}

export interface CustomerOrder {
  orderId: string;
  orderNumber: string;
  date: string;
  items: string[];
  totalAmount: number;
  currency: string;
  shippingStatus: 'Delivered' | 'In Transit' | 'Out for Delivery' | 'Order Confirmed' | 'Delayed';
  trackingNumber: string;
  carrier: string;
}

export interface Customer {
  id: string;
  name: string;
  avatar?: string;
  email: string;
  phone: string;
  location: string;
  channel: ChannelType;
  firstSeen: string;
  leadScore: number;
  totalSpend: number;
  tags: string[];
  notes: string;
  assignedOwner: string;
  orders: CustomerOrder[];
  customAttributes: Record<string, string>;
}

export interface Conversation {
  id: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string;
  channel: ChannelType;
  status: ConversationStatus;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  assignedAgent: string;
  isEscalated: boolean;
  escalationReason?: string;
  suggestedAiResponse?: string;
  tags: string[];
}

export type AgentStatus = 'active' | 'paused' | 'draft';

export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  status: AgentStatus;
  channels: ChannelType[];
  conversationsHandled: number;
  resolutionRate: number; // percentage, e.g. 78
  avgResponseTime: string;
  estimatedCost: number; // in INR
  lastActive: string;
  avatarColor: string;
  systemInstructions: string;
  tone: 'professional' | 'friendly' | 'concise' | 'empathetic';
  languagePreference: string[];
  allowedTasks: string[];
  restrictedTasks: string[];
  escalationConditions: string[];
  maxToolCalls: number;
  monthlyBudget: number;
  requireHumanApproval: boolean;
}

export type LeadStage = 'new' | 'contacted' | 'qualified' | 'proposal' | 'converted' | 'lost';

export interface Lead {
  id: string;
  customerName: string;
  companyName: string;
  email: string;
  phone: string;
  leadSource: 'WhatsApp Inbound' | 'Instagram DM' | 'Website Chat' | 'Email Referral' | 'Organic Search';
  estimatedValue: number; // in INR
  leadScore: number;
  stage: LeadStage;
  lastInteraction: string;
  assignedOwner: string;
  tags: string[];
  notes: string;
  nextFollowUp?: string;
}

export type WorkflowNodeType = 'trigger' | 'condition' | 'ai_agent' | 'action' | 'completion';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  title: string;
  description: string;
  config: Record<string, any>;
  status?: 'active' | 'ready' | 'idle';
}

export interface Workflow {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'draft';
  nodes: WorkflowNode[];
  totalRuns: number;
  successRate: number;
  lastRun: string;
  triggerChannel: ChannelType | 'all';
}

export type KnowledgeCategory = 'products' | 'shipping' | 'returns' | 'faqs' | 'policies';
export type KnowledgeSourceType = 'document' | 'pdf' | 'url' | 'faq' | 'catalog';

export interface KnowledgeItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  sourceType: KnowledgeSourceType;
  content: string;
  lastUpdated: string;
  assignedAgents: string[];
  status: 'indexed' | 'needs_review' | 'indexing';
  tokenCount: number;
  viewsOrUses: number;
}

export interface IntegrationItem {
  id: string;
  name: string;
  category: 'Messaging' | 'E-commerce' | 'CRM' | 'Spreadsheet' | 'Developer';
  description: string;
  iconName: string;
  status: 'connected' | 'disconnected' | 'configuring';
  capabilities: string[];
  lastSync?: string;
  connectedAccount?: string;
  webhookUrl?: string;
}

export interface RuleConfig {
  maxMonthlySpending: number;
  maxActionCallsPerTask: number;
  requireRefundApprovalAbove: number;
  requireDiscountApprovalAbove: number;
  confidenceEscalationThreshold: number;
  customerDataAccessLevel: 'restricted' | 'standard' | 'full';
  workingHoursEnabled: boolean;
  workingHoursStart: string;
  workingHoursEnd: string;
  followUpMaxAttempts: number;
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  agentName: string;
  actionAttempted: string;
  customerTarget: string;
  approvalStatus: 'approved' | 'auto_approved' | 'rejected' | 'pending';
  result: string;
  details: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  type: 'urgent' | 'info' | 'success';
  read: boolean;
  linkRoute?: string;
}
