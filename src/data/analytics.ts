export interface DailyMetric {
  date: string;
  totalConversations: number;
  aiResolved: number;
  humanEscalated: number;
  costInr: number;
  leadsQualified: number;
}

export const dailyMetrics: DailyMetric[] = [
  { date: 'Oct 20', totalConversations: 164, aiResolved: 112, humanEscalated: 52, costInr: 492, leadsQualified: 28 },
  { date: 'Oct 21', totalConversations: 182, aiResolved: 126, humanEscalated: 56, costInr: 546, leadsQualified: 32 },
  { date: 'Oct 22', totalConversations: 175, aiResolved: 121, humanEscalated: 54, costInr: 525, leadsQualified: 29 },
  { date: 'Oct 23', totalConversations: 198, aiResolved: 139, humanEscalated: 59, costInr: 594, leadsQualified: 36 },
  { date: 'Oct 24', totalConversations: 210, aiResolved: 148, humanEscalated: 62, costInr: 630, leadsQualified: 38 },
  { date: 'Oct 25', totalConversations: 195, aiResolved: 135, humanEscalated: 60, costInr: 585, leadsQualified: 34 },
  { date: 'Oct 26', totalConversations: 160, aiResolved: 110, humanEscalated: 50, costInr: 488, leadsQualified: 26 }
];

export const channelDistribution = [
  { name: 'WhatsApp', count: 642, percentage: 50, color: '#10B981' },
  { name: 'Instagram', count: 321, percentage: 25, color: '#EC4899' },
  { name: 'Website Chat', count: 205, percentage: 16, color: '#635BFF' },
  { name: 'Email', count: 116, percentage: 9, color: '#F59E0B' }
];

export const leadFunnelData = [
  { stage: 'New Inquiries', count: 580, dropoff: '100%' },
  { stage: 'Contacted', count: 420, dropoff: '72%' },
  { stage: 'Qualified Leads', count: 216, dropoff: '37%' },
  { stage: 'Proposal Sent', count: 94, dropoff: '16%' },
  { stage: 'Converted Customer', count: 52, dropoff: '9%' }
];

export const agentPerformanceComparison = [
  {
    agentName: 'Customer Support Agent',
    totalHandled: 842,
    resolutionRate: 74,
    avgResponseTime: '11s',
    csat: '4.8 / 5.0',
    cost: '₹1,420',
    costPerResolved: '₹2.28'
  },
  {
    agentName: 'Sales Qualification Agent',
    totalHandled: 312,
    resolutionRate: 62,
    avgResponseTime: '15s',
    csat: '4.7 / 5.0',
    cost: '₹980',
    costPerResolved: '₹5.07'
  },
  {
    agentName: 'Order Assistance Agent',
    totalHandled: 232,
    resolutionRate: 81,
    avgResponseTime: '9s',
    csat: '4.9 / 5.0',
    cost: '₹810',
    costPerResolved: '₹4.31'
  },
  {
    agentName: 'Lead Follow-up Agent',
    totalHandled: 198,
    resolutionRate: 58,
    avgResponseTime: 'Instant',
    csat: '4.6 / 5.0',
    cost: '₹650',
    costPerResolved: '₹5.65'
  }
];

export const recentActivityFeed = [
  {
    id: 'act-1',
    type: 'ai_resolved',
    title: 'AI resolved order tracking query',
    description: 'Provided real-time Delhivery dispatch details for Priya Sharma (Order #NC-9842)',
    time: '2m ago',
    channel: 'whatsapp'
  },
  {
    id: 'act-2',
    type: 'lead_qualified',
    title: 'New wholesale lead qualified',
    description: 'FintechLabs India requested 50 corporate trial boxes (Score: 88)',
    time: '18m ago',
    channel: 'instagram'
  },
  {
    id: 'act-3',
    type: 'escalated',
    title: 'High-value inquiry escalated to human',
    description: 'Vikram Verma requested 5,000 units/quarter retail distribution terms',
    time: '1h ago',
    channel: 'email'
  },
  {
    id: 'act-4',
    type: 'automation',
    title: 'NDR Landmark verification successful',
    description: 'Pooja Patel provided missing landmark; re-dispatch scheduled via Shadowfax',
    time: '2h ago',
    channel: 'whatsapp'
  },
  {
    id: 'act-5',
    type: 'kb_updated',
    title: 'Knowledge Base indexed',
    description: 'Updated Diwali festive corporate gifting guidelines & discount tiers',
    time: '4h ago',
    channel: 'system'
  }
];

export const attentionRequiredItems = [
  {
    id: 'att-1',
    severity: 'high',
    title: 'Wholesale distributor inquiry awaiting human call',
    description: 'Vikram Verma (Delhi Green Supermarkets) - 5,000 units/quarter inquiry.',
    actionLabel: 'Open Conversation',
    actionRoute: 'inbox',
    targetId: 'conv-3'
  },
  {
    id: 'att-2',
    severity: 'medium',
    title: 'Courier failed delivery attempt (Incomplete Landmark)',
    description: 'Shadowfax rider was unable to locate address in Bodakdev, Ahmedabad.',
    actionLabel: 'Review Order',
    actionRoute: 'inbox',
    targetId: 'conv-4'
  },
  {
    id: 'att-3',
    severity: 'low',
    title: 'Knowledge Base document needs review',
    description: 'Corporate Gifting & Wholesale Terms has outdated festival dates.',
    actionLabel: 'Review Article',
    actionRoute: 'knowledge',
    targetId: 'kb-5'
  }
];
