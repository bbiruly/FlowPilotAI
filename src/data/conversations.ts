import { Conversation, Message } from '../types';

export const initialConversations: Conversation[] = [
  {
    id: 'conv-1',
    customerId: 'cust-1',
    customerName: 'Priya Sharma',
    customerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    channel: 'whatsapp',
    status: 'ai_handling',
    lastMessage: 'Your shipment is out for delivery with Delhivery rider Suresh (+91 98210 00192).',
    lastMessageTime: '10:42 AM',
    unreadCount: 0,
    assignedAgent: 'Customer Support Agent',
    isEscalated: false,
    suggestedAiResponse: 'Hi Priya, would you also like to receive a reminder on WhatsApp once the delivery is marked completed?',
    tags: ['Order Tracking', 'Delhivery API', 'VIP']
  },
  {
    id: 'conv-2',
    customerId: 'cust-2',
    customerName: 'Rohan Mehta',
    customerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    channel: 'instagram',
    status: 'ai_handling',
    lastMessage: 'Can we get customized corporate trial kits for 50 people at our Indiranagar office?',
    lastMessageTime: '09:15 AM',
    unreadCount: 1,
    assignedAgent: 'Sales Qualification Agent',
    isEscalated: false,
    suggestedAiResponse: 'Absolutely Rohan! We offer custom corporate starter boxes with tailored branding and tiered bulk pricing (up to 30% off for 50+ kits). Shall I connect you with our B2B accounts lead Aryan?',
    tags: ['B2B Lead', 'High Intent', 'Office Kits']
  },
  {
    id: 'conv-3',
    customerId: 'cust-4',
    customerName: 'Vikram Verma',
    customerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    channel: 'email',
    status: 'escalated',
    lastMessage: 'Looking for distributor margins on 5,000 units/quarter for our NCR stores. Need GST invoice & credit terms.',
    lastMessageTime: 'Yesterday',
    unreadCount: 2,
    assignedAgent: 'Aryan Patel (Operations Lead)',
    isEscalated: true,
    escalationReason: 'High-value wholesale distributor request (estimated ₹3,50,000/quarter) requires founder/lead authorization.',
    suggestedAiResponse: 'Drafted wholesale quotation sent to your operations review queue.',
    tags: ['Wholesale', 'Distributor', 'Needs Call']
  },
  {
    id: 'conv-4',
    customerId: 'cust-5',
    customerName: 'Pooja Patel',
    customerAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    channel: 'whatsapp',
    status: 'human_handling',
    lastMessage: 'I updated my landmark: Near Iscon Gathiya, Bodakdev. Can they re-attempt delivery by 4 PM today?',
    lastMessageTime: '08:30 AM',
    unreadCount: 1,
    assignedAgent: 'Order Assistance Agent',
    isEscalated: false,
    suggestedAiResponse: 'Thank you Pooja! I have updated the delivery address with Shadowfax logistics and scheduled re-attempt priority for today before 5:00 PM.',
    tags: ['NDR Fix', 'Urgent Logistics']
  },
  {
    id: 'conv-5',
    customerId: 'cust-3',
    customerName: 'Ananya Iyer',
    customerAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    channel: 'website',
    status: 'resolved',
    lastMessage: 'Your subscription fragrance preference has been updated to Fragrance-Free Lavender.',
    lastMessageTime: 'Oct 25',
    unreadCount: 0,
    assignedAgent: 'Customer Support Agent',
    isEscalated: false,
    suggestedAiResponse: '',
    tags: ['Subscription Swap', 'Auto-Resolved']
  },
  {
    id: 'conv-6',
    customerId: 'cust-6',
    customerName: 'Arjun Nair',
    customerAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    channel: 'whatsapp',
    status: 'open',
    lastMessage: 'Are the baby detergent sheets certified zero residue? My 3-month-old has mild eczema.',
    lastMessageTime: '10:55 AM',
    unreadCount: 1,
    assignedAgent: 'Customer Support Agent',
    isEscalated: false,
    suggestedAiResponse: 'Hello Arjun! Yes, our Baby Fabric Strips are dermatologically tested by Dermatest Germany (Zero Residue rating), certified hypoallergenic, and 100% free from optical brighteners, dyes, and enzymes. They dissolve completely even in cold water.',
    tags: ['Hypoallergenic', 'Product Ingredients']
  }
];

export const initialMessages: Record<string, Message[]> = {
  'conv-1': [
    {
      id: 'm-101',
      conversationId: 'conv-1',
      sender: 'customer',
      senderName: 'Priya Sharma',
      content: 'Hi! I ordered the 90-wash laundry sheets 2 days ago (Order #NC-9842). Has it shipped yet? Needed it before my weekend travel.',
      timestamp: '10:40 AM',
      isAiGenerated: false
    },
    {
      id: 'm-102',
      conversationId: 'conv-1',
      sender: 'agent',
      senderName: 'FlowPilot Support Agent',
      content: 'Hello Priya! Let me check that order right away for you.',
      timestamp: '10:40 AM',
      isAiGenerated: true,
      toolEvents: [
        {
          id: 'te-1',
          toolName: 'Shopify.getOrderDetails',
          input: '{"orderNumber": "NC-9842", "phone": "+919820144521"}',
          output: '{"status": "in_transit", "trackingNumber": "DEL-88392110", "carrier": "Delhivery Surface"}',
          timestamp: '10:40 AM',
          status: 'success'
        },
        {
          id: 'te-2',
          toolName: 'Delhivery.getRealtimeTracking',
          input: '{"waybill": "DEL-88392110"}',
          output: '{"currentStatus": "Out for delivery", "destination": "Bandra West, Mumbai", "rider": "Suresh (+91 98210 00192)"}',
          timestamp: '10:41 AM',
          status: 'success'
        }
      ]
    },
    {
      id: 'm-103',
      conversationId: 'conv-1',
      sender: 'agent',
      senderName: 'FlowPilot Support Agent',
      content: 'Good news Priya! Your shipment for Order #NC-9842 is currently out for delivery in Bandra West with Delhivery rider Suresh (+91 98210 00192). You should receive it today before 2:00 PM.',
      timestamp: '10:42 AM',
      isAiGenerated: true
    }
  ],
  'conv-2': [
    {
      id: 'm-201',
      conversationId: 'conv-2',
      sender: 'customer',
      senderName: 'Rohan Mehta',
      content: 'Saw your reel about plastic-free detergent sheets for corporate offices. Can we get customized trial kits for 50 people at our Indiranagar office in Bangalore?',
      timestamp: '09:12 AM',
      isAiGenerated: false
    },
    {
      id: 'm-202',
      conversationId: 'conv-2',
      sender: 'agent',
      senderName: 'Sales Qualification Agent',
      content: 'Hi Rohan! Thank you for reaching out through Instagram. Yes, we provide custom workplace sustainability boxes for teams across India.',
      timestamp: '09:13 AM',
      isAiGenerated: true,
      toolEvents: [
        {
          id: 'te-3',
          toolName: 'CRM.createOrUpdateLead',
          input: '{"name": "Rohan Mehta", "company": "FintechLabs India", "estValue": 25000, "source": "Instagram"}',
          output: '{"leadId": "lead-rohan-50", "score": 85, "stage": "qualified"}',
          timestamp: '09:13 AM',
          status: 'success'
        }
      ]
    },
    {
      id: 'm-203',
      conversationId: 'conv-2',
      sender: 'customer',
      senderName: 'Rohan Mehta',
      content: 'Great. What would be the turnaround time and sample cost for 50 boxes?',
      timestamp: '09:15 AM',
      isAiGenerated: false
    }
  ],
  'conv-3': [
    {
      id: 'm-301',
      conversationId: 'conv-3',
      sender: 'customer',
      senderName: 'Vikram Verma',
      content: 'Greetings team. We manage 8 prime organic and lifestyle supermarkets across South Delhi and Gurgaon. We are interested in stocking NurtureClean laundry strips and multi-surface pods. Looking for distributor margins on 5,000 units/quarter for our NCR stores. Need GST invoice & credit terms.',
      timestamp: 'Yesterday 04:30 PM',
      isAiGenerated: false
    },
    {
      id: 'm-302',
      conversationId: 'conv-3',
      sender: 'system',
      senderName: 'FlowPilot Guardrail Engine',
      content: 'Automated Escalation Triggered: Wholesale volume >= 1,000 units and credit terms request exceeds autonomous threshold. Handed over to Aryan Patel.',
      timestamp: 'Yesterday 04:31 PM',
      isAiGenerated: false
    },
    {
      id: 'm-303',
      conversationId: 'conv-3',
      sender: 'human_agent',
      senderName: 'Aryan Patel (Operations Lead)',
      content: 'Dear Mr. Verma, thank you for reaching out. We would be delighted to partner with your retail chain. I am reviewing your quarterly volume and preparing our B2B retail catalog with tiered margin brackets (32% - 38%). May we schedule a brief 10-minute discovery call tomorrow at 11:30 AM?',
      timestamp: 'Yesterday 05:15 PM',
      isAiGenerated: false
    }
  ],
  'conv-4': [
    {
      id: 'm-401',
      conversationId: 'conv-4',
      sender: 'system',
      senderName: 'Shadowfax Webhook',
      content: 'Delivery status alert: Undelivered - Customer address incomplete / landmark missing. (Order #NC-9988)',
      timestamp: '08:15 AM'
    },
    {
      id: 'm-402',
      conversationId: 'conv-4',
      sender: 'agent',
      senderName: 'Order Assistance Agent',
      content: 'Namaste Pooja! Our delivery partner Shadowfax attempted delivery of your NurtureClean order (#NC-9988) this morning in Bodakdev, Ahmedabad, but needed a clearer landmark. Could you reply with your nearby landmark so we can dispatch the rider immediately?',
      timestamp: '08:16 AM',
      isAiGenerated: true
    },
    {
      id: 'm-403',
      conversationId: 'conv-4',
      sender: 'customer',
      senderName: 'Pooja Patel',
      content: 'I updated my landmark: Near Iscon Gathiya, Bodakdev. Can they re-attempt delivery by 4 PM today?',
      timestamp: '08:30 AM',
      isAiGenerated: false
    }
  ],
  'conv-5': [
    {
      id: 'm-501',
      conversationId: 'conv-5',
      sender: 'customer',
      senderName: 'Ananya Iyer',
      content: 'Hi! I currently have a bi-monthly subscription for Ocean Fresh scent. Can I swap the upcoming refill to Fragrance-Free Lavender instead?',
      timestamp: 'Oct 25, 02:10 PM',
      isAiGenerated: false
    },
    {
      id: 'm-502',
      conversationId: 'conv-5',
      sender: 'agent',
      senderName: 'Customer Support Agent',
      content: 'Your subscription fragrance preference has been updated to Fragrance-Free Lavender for your upcoming November refill! No change in billing amount.',
      timestamp: 'Oct 25, 02:11 PM',
      isAiGenerated: true,
      toolEvents: [
        {
          id: 'te-501',
          toolName: 'ShopifySubscriptions.updateVariant',
          input: '{"subscriptionId": "sub-991", "variant": "Fragrance-Free Lavender"}',
          output: '{"status": "updated", "nextBillingDate": "2026-11-15"}',
          timestamp: 'Oct 25, 02:11 PM',
          status: 'success'
        }
      ]
    }
  ],
  'conv-6': [
    {
      id: 'm-601',
      conversationId: 'conv-6',
      sender: 'customer',
      senderName: 'Arjun Nair',
      content: 'Are the baby detergent sheets certified zero residue? My 3-month-old has mild eczema, so our pediatrician strictly advised avoiding synthetic fragrances and optical brighteners.',
      timestamp: '10:55 AM',
      isAiGenerated: false
    }
  ]
};
