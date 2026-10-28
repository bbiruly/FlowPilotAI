import { Workflow } from '../types';

export const initialWorkflows: Workflow[] = [
  {
    id: 'wf-1',
    name: 'Qualify Instagram Leads',
    description: 'Listens for inbound Instagram direct messages, detects wholesale or bulk purchase intent, qualifies team size and budget, and logs to CRM.',
    status: 'active',
    totalRuns: 1420,
    successRate: 98.4,
    lastRun: '12m ago',
    triggerChannel: 'instagram',
    nodes: [
      {
        id: 'node-1',
        type: 'trigger',
        title: 'New Instagram Message',
        description: 'Triggers when a prospect sends a DM on Instagram or replies to a story/reel.',
        config: { channel: 'instagram', event: 'message_received' },
        status: 'active'
      },
      {
        id: 'node-2',
        type: 'condition',
        title: 'Detect Commercial Intent',
        description: 'Evaluates if customer mentions pricing, bulk boxes, corporate trials, or retailer margins.',
        config: { intentType: 'pricing_or_bulk', minConfidence: 0.8 },
        status: 'active'
      },
      {
        id: 'node-3',
        type: 'ai_agent',
        title: 'Sales Qualification Agent',
        description: 'Extracts company name, estimated units needed, and shares interactive digital catalog.',
        config: { agentId: 'agent-2', model: 'gemini-2.5-flash', maxTurns: 3 },
        status: 'active'
      },
      {
        id: 'node-4',
        type: 'action',
        title: 'Sync CRM & Calculate Lead Score',
        description: 'Creates lead in FlowPilot CRM, assigns score based on unit volume, and notifies sales rep.',
        config: { autoAssignOwner: 'Aryan Patel', notifySlack: true, tag: 'Instagram Lead' },
        status: 'active'
      },
      {
        id: 'node-5',
        type: 'completion',
        title: 'Record Timeline & Schedule Nudge',
        description: 'Saves full transcript to customer history and queues WhatsApp follow-up after 48 hours.',
        config: { followUpWindowHours: 48, appendTimeline: true },
        status: 'ready'
      }
    ]
  },
  {
    id: 'wf-2',
    name: 'Instant WhatsApp Order Tracking & Logistics',
    description: 'Instantly identifies when a customer inquires about their shipment on WhatsApp, queries Delhivery/Shadowfax/BlueDart, and provides real-time courier updates.',
    status: 'active',
    totalRuns: 3840,
    successRate: 99.2,
    lastRun: '3m ago',
    triggerChannel: 'whatsapp',
    nodes: [
      {
        id: 'node-201',
        type: 'trigger',
        title: 'WhatsApp "Where is my order?"',
        description: 'Captures incoming messages containing keywords like order, tracking, kab aayega, status.',
        config: { channel: 'whatsapp', keywords: ['track', 'order', 'status', 'delivery'] },
        status: 'active'
      },
      {
        id: 'node-202',
        type: 'condition',
        title: 'Find Matching Customer Order',
        description: 'Matches sender WhatsApp phone number against recent Shopify/WooCommerce orders.',
        config: { matchByPhone: true, lookbackDays: 30 },
        status: 'active'
      },
      {
        id: 'node-203',
        type: 'ai_agent',
        title: 'Customer Support Agent',
        description: 'Queries courier API for live GPS/transit checkpoints and formats a polite Indian English message.',
        config: { agentId: 'agent-1', includeCourierContact: true },
        status: 'active'
      },
      {
        id: 'node-204',
        type: 'action',
        title: 'Dispatch Real-Time Status Link',
        description: 'Sends WhatsApp message with live tracking link and estimated delivery window.',
        config: { sendWhatsAppTemplate: 'order_status_update_v2' },
        status: 'active'
      },
      {
        id: 'node-205',
        type: 'completion',
        title: 'Auto-Resolve Ticket',
        description: 'Marks conversation resolved if no further inquiry within 15 minutes.',
        config: { autoResolveTimerMinutes: 15 },
        status: 'ready'
      }
    ]
  },
  {
    id: 'wf-3',
    name: 'Proactive NDR (Non-Delivery) Landmark Resolver',
    description: 'Catches carrier webhook for failed delivery attempt, sends instant WhatsApp prompt for nearby landmark, and schedules same-day re-attempt.',
    status: 'active',
    totalRuns: 620,
    successRate: 94.6,
    lastRun: '18m ago',
    triggerChannel: 'all',
    nodes: [
      {
        id: 'node-301',
        type: 'trigger',
        title: 'Courier Webhook: NDR Event',
        description: 'Fired when Delhivery or Shadowfax returns status: Incomplete Address / Customer Unreachable.',
        config: { event: 'carrier.ndr_reported', source: 'courier_apis' },
        status: 'active'
      },
      {
        id: 'node-302',
        type: 'ai_agent',
        title: 'Order Assistance Agent',
        description: 'Generates localized WhatsApp message asking for recognizable local landmark and preferred delivery slot.',
        config: { agentId: 'agent-4', language: 'bilingual_hinglish' },
        status: 'active'
      },
      {
        id: 'node-303',
        type: 'action',
        title: 'Push Landmark to Carrier & Shopify',
        description: 'Updates Shopify shipping address note and calls carrier Re-attempt API.',
        config: { courierApiEndpoint: '/api/v1/courier/reattempt' },
        status: 'active'
      },
      {
        id: 'node-304',
        type: 'completion',
        title: 'Alert Logistics Desk',
        description: 'Flags ticket green on dashboard so warehouse team monitors successful delivery.',
        config: { notifyLogistics: true },
        status: 'ready'
      }
    ]
  }
];
