import { IntegrationItem } from '../types';

export const initialIntegrations: IntegrationItem[] = [
  {
    id: 'int-whatsapp',
    name: 'WhatsApp Business Cloud API',
    category: 'Messaging',
    description: 'Official Meta Cloud API integration for high-volume customer chats, interactive button templates, and 24-hour service windows.',
    iconName: 'MessageCircle',
    status: 'connected',
    capabilities: ['Two-way conversations', 'Interactive quick replies', 'Order status templates', 'Catalog sync'],
    lastSync: '1 minute ago',
    connectedAccount: 'NurtureClean India (+91 98200 90011)',
    webhookUrl: 'https://api.flowpilot.ai/v1/webhooks/meta-wa/nc-98'
  },
  {
    id: 'int-instagram',
    name: 'Instagram Direct Messaging',
    category: 'Messaging',
    description: 'Connects Meta Graph API for automated DM lead triage, reel comment triggers, and story replies.',
    iconName: 'Instagram',
    status: 'connected',
    capabilities: ['DM automation', 'Story reply handling', 'Reel comment qualification', 'Lead capture'],
    lastSync: '4 minutes ago',
    connectedAccount: '@nurtureclean.in (48.2k followers)',
    webhookUrl: 'https://api.flowpilot.ai/v1/webhooks/meta-ig/nc-98'
  },
  {
    id: 'int-website',
    name: 'Website Live Chat Widget',
    category: 'Messaging',
    description: 'Embeddable lightweight Web chat widget for your Shopify store with instant AI response and human fallback.',
    iconName: 'Globe',
    status: 'connected',
    capabilities: ['Shopify cart context', 'Proactive popup triggers', 'Custom CSS styling', 'Typing indicators'],
    lastSync: 'Realtime active',
    connectedAccount: 'store.nurtureclean.in',
    webhookUrl: 'https://cdn.flowpilot.ai/widget/v2/nc-98.js'
  },
  {
    id: 'int-email',
    name: 'Email Support (Gmail & Outlook)',
    category: 'Messaging',
    description: 'Bi-directional email channel with automated threading, sentiment analysis, and rich HTML signatures.',
    iconName: 'Mail',
    status: 'connected',
    capabilities: ['Inbound email parsing', 'Automated ticket creation', 'Draft suggestions', 'Spam filtering'],
    lastSync: '10 minutes ago',
    connectedAccount: 'care@nurtureclean.in',
    webhookUrl: 'imap.nurtureclean.in:993'
  },
  {
    id: 'int-shopify',
    name: 'Shopify Storefront & Orders',
    category: 'E-commerce',
    description: 'Real-time order lookup, inventory synchronization, tracking number injection, and customer lifetime value mapping.',
    iconName: 'ShoppingBag',
    status: 'connected',
    capabilities: ['Order status lookup', 'Variant stock check', 'Customer tags sync', 'Discount coupon generation'],
    lastSync: '2 minutes ago',
    connectedAccount: 'nurtureclean-india.myshopify.com',
    webhookUrl: 'https://api.flowpilot.ai/v1/webhooks/shopify/nc-98'
  },
  {
    id: 'int-hubspot',
    name: 'HubSpot CRM',
    category: 'CRM',
    description: 'Bi-directional contact sync, deal pipeline synchronization, and meeting logging.',
    iconName: 'Database',
    status: 'connected',
    capabilities: ['Contact sync', 'Deal stage updates', 'Activity timeline logging'],
    lastSync: '15 minutes ago',
    connectedAccount: 'HubSpot Portal #8912401',
    webhookUrl: 'https://api.flowpilot.ai/v1/webhooks/hubspot/nc-98'
  },
  {
    id: 'int-gsheets',
    name: 'Google Sheets Live Sync',
    category: 'Spreadsheet',
    description: 'Instantly append qualified leads and daily operational KPIs into your team Google Sheet without third-party connectors.',
    iconName: 'FileSpreadsheet',
    status: 'connected',
    capabilities: ['Realtime lead row append', 'Daily KPI snapshot', 'Custom columns mapping'],
    lastSync: '1 hour ago',
    connectedAccount: 'FlowPilot_Leads_2026.xlsx',
    webhookUrl: 'drive.google.com/sheets/d/1Xy998...'
  },
  {
    id: 'int-rest',
    name: 'Generic REST API & Webhooks',
    category: 'Developer',
    description: 'Trigger custom warehouse ERP endpoints, Delhivery/Shiprocket courier updates, or internal microservices.',
    iconName: 'Code',
    status: 'disconnected',
    capabilities: ['HMAC SHA-256 signatures', 'Custom payload mapping', 'Retry backoff with alerts', 'Custom headers'],
    lastSync: 'Never',
    connectedAccount: 'Unconfigured',
    webhookUrl: 'https://api.nurtureclean.internal/v1/erp'
  }
];
