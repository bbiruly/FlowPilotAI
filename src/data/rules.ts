import { RuleConfig, AuditEvent } from '../types';

export const initialRules: RuleConfig = {
  maxMonthlySpending: 25000,
  maxActionCallsPerTask: 5,
  requireRefundApprovalAbove: 1000, // INR
  requireDiscountApprovalAbove: 15, // percent
  confidenceEscalationThreshold: 75, // percent
  customerDataAccessLevel: 'standard',
  workingHoursEnabled: true,
  workingHoursStart: '08:00',
  workingHoursEnd: '21:00',
  followUpMaxAttempts: 2
};

export const initialAuditEvents: AuditEvent[] = [
  {
    id: 'aud-1',
    timestamp: 'Today, 10:41 AM',
    agentName: 'Customer Support Agent',
    actionAttempted: 'Shopify order lookup & Delhivery tracking',
    customerTarget: 'Priya Sharma (+91 98201 44521)',
    approvalStatus: 'auto_approved',
    result: 'Success',
    details: 'Queried tracking DEL-88392110; rider details shared.'
  },
  {
    id: 'aud-2',
    timestamp: 'Today, 09:13 AM',
    agentName: 'Sales Qualification Agent',
    actionAttempted: 'Create CRM lead & score computation',
    customerTarget: 'Rohan Mehta (FintechLabs)',
    approvalStatus: 'auto_approved',
    result: 'Success',
    details: 'Created lead with score 88 and estimated value ₹45,000.'
  },
  {
    id: 'aud-3',
    timestamp: 'Yesterday, 04:31 PM',
    agentName: 'Sales Qualification Agent',
    actionAttempted: 'Distributor Contract Generation (>₹1,00,000)',
    customerTarget: 'Vikram Verma (Delhi Merchants)',
    approvalStatus: 'pending',
    result: 'Escalated to Human',
    details: 'Exceeded autonomous wholesale contract threshold. Routed to Aryan Patel.'
  },
  {
    id: 'aud-4',
    timestamp: 'Yesterday, 02:15 PM',
    agentName: 'Order Assistance Agent',
    actionAttempted: 'Refund issuance ₹1,899',
    customerTarget: 'Sneha Roy (Kolkata)',
    approvalStatus: 'approved',
    result: 'Manager Approved',
    details: 'Package arrived with torn inner packaging. Aryan Patel approved refund.'
  },
  {
    id: 'aud-5',
    timestamp: 'Oct 24, 07:45 PM',
    agentName: 'Lead Follow-up Agent',
    actionAttempted: 'Out-of-hours WhatsApp template dispatch (21:45 IST)',
    customerTarget: 'Arjun Nair (+91 98470 65123)',
    approvalStatus: 'rejected',
    result: 'Blocked by Rule Engine',
    details: 'Blocked: Automated customer nudges restricted between 21:00 and 08:00 IST.'
  }
];
