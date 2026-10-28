import { Customer } from '../types';

export const initialCustomers: Customer[] = [
  {
    id: 'cust-1',
    name: 'Priya Sharma',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    email: 'priya.sharma91@gmail.com',
    phone: '+91 98201 44521',
    location: 'Bandra West, Mumbai, MH',
    channel: 'whatsapp',
    firstSeen: '2026-08-14',
    leadScore: 92,
    totalSpend: 14850,
    tags: ['VIP Customer', 'Eco Enthusiast', 'Repeat Buyer'],
    notes: 'Sensitive skin. Loves lavender unscented laundry sheets. Prefers WhatsApp updates.',
    assignedOwner: 'Aryan Patel',
    orders: [
      {
        orderId: 'ord-101',
        orderNumber: 'NC-9842',
        date: '2026-10-24',
        items: ['Eco Laundry Sheets (90 Washes)', 'Zero-Waste Wool Dryer Balls (Pack of 4)'],
        totalAmount: 1899,
        currency: '₹',
        shippingStatus: 'In Transit',
        trackingNumber: 'DEL-88392110',
        carrier: 'Delhivery Surface'
      },
      {
        orderId: 'ord-102',
        orderNumber: 'NC-8730',
        date: '2026-09-02',
        items: ['Plant Dishwashing Gel - Citrus Lemon (500ml)'],
        totalAmount: 549,
        currency: '₹',
        shippingStatus: 'Delivered',
        trackingNumber: 'DEL-74829104',
        carrier: 'Delhivery Express'
      }
    ],
    customAttributes: {
      'Preferred Fragrance': 'Fragrance-Free Lavender',
      'Wash Machine Type': 'Front Load IFB',
      'Wholesale Inquirer': 'No'
    }
  },
  {
    id: 'cust-2',
    name: 'Rohan Mehta',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    email: 'rohan.mehta@fintechlabs.in',
    phone: '+91 99002 88314',
    location: 'Indiranagar, Bengaluru, KA',
    channel: 'instagram',
    firstSeen: '2026-10-18',
    leadScore: 78,
    totalSpend: 3499,
    tags: ['Instagram Lead', 'Product Trial'],
    notes: 'Inquired from Instagram ad on corporate office green cleaning kit.',
    assignedOwner: 'Meera Rao',
    orders: [
      {
        orderId: 'ord-103',
        orderNumber: 'NC-9910',
        date: '2026-10-20',
        items: ['Executive Starter Cleaning Kit'],
        totalAmount: 3499,
        currency: '₹',
        shippingStatus: 'Out for Delivery',
        trackingNumber: 'BLU-30918844',
        carrier: 'BlueDart Air'
      }
    ],
    customAttributes: {
      'Company Name': 'FintechLabs India',
      'Employee Count': '45',
      'Lead Stage': 'Trial Kit Evaluation'
    }
  },
  {
    id: 'cust-3',
    name: 'Ananya Iyer',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    email: 'ananya.iyer@gmail.com',
    phone: '+91 94440 12789',
    location: 'Adyar, Chennai, TN',
    channel: 'website',
    firstSeen: '2026-09-10',
    leadScore: 65,
    totalSpend: 4200,
    tags: ['Active Subscriber', 'Monthly Refill'],
    notes: 'Subscribed to 60-day auto detergent refills. Looking to swap to unscented variant.',
    assignedOwner: 'AI Agent Auto',
    orders: [
      {
        orderId: 'ord-104',
        orderNumber: 'NC-9512',
        date: '2026-10-15',
        items: ['Detergent Sheets 60-Day Subscription refill'],
        totalAmount: 1299,
        currency: '₹',
        shippingStatus: 'Delivered',
        trackingNumber: 'DEL-99182344',
        carrier: 'Delhivery Surface'
      }
    ],
    customAttributes: {
      'Subscription Tier': 'Bi-monthly Refill Plan',
      'Eco Score': '84/100'
    }
  },
  {
    id: 'cust-4',
    name: 'Vikram Verma',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    email: 'v.verma@delhimerchants.com',
    phone: '+91 98110 33411',
    location: 'Civil Lines, Delhi, DL',
    channel: 'email',
    firstSeen: '2026-10-22',
    leadScore: 96,
    totalSpend: 0,
    tags: ['Wholesale Lead', 'High Priority', 'Requires Human Call'],
    notes: 'Runs 8 organic grocery retail stores across Delhi NCR. Wants wholesale pricing tier.',
    assignedOwner: 'Aryan Patel',
    orders: [],
    customAttributes: {
      'Business Type': 'Retail Chain (8 Locations)',
      'Projected Monthly Volume': '₹2,50,000 / month',
      'GSTIN': '07AABCV1234F1Z8'
    }
  },
  {
    id: 'cust-5',
    name: 'Pooja Patel',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    email: 'pooja.patel@zohomail.com',
    phone: '+91 97250 99823',
    location: 'Bodakdev, Ahmedabad, GJ',
    channel: 'whatsapp',
    firstSeen: '2026-10-25',
    leadScore: 84,
    totalSpend: 2899,
    tags: ['NDR Alert', 'Needs Address Confirmation'],
    notes: 'Courier failed delivery on first attempt due to incomplete landmark.',
    assignedOwner: 'Order Assistance Agent',
    orders: [
      {
        orderId: 'ord-105',
        orderNumber: 'NC-9988',
        date: '2026-10-22',
        items: ['All-Natural Stain Remover Pen (Pack of 3)', 'Detergent Sheets Mega Pack'],
        totalAmount: 2899,
        currency: '₹',
        shippingStatus: 'Delayed',
        trackingNumber: 'SHADOW-481920',
        carrier: 'Shadowfax Express'
      }
    ],
    customAttributes: {
      'Delivery Attempt': '1 Failed (Address Incomplete)',
      'Action Taken': 'WhatsApp NDR automated prompt sent'
    }
  },
  {
    id: 'cust-6',
    name: 'Arjun Nair',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    email: 'arjun.nair@live.in',
    phone: '+91 98470 65123',
    location: 'Panampilly Nagar, Kochi, KL',
    channel: 'whatsapp',
    firstSeen: '2026-10-26',
    leadScore: 72,
    totalSpend: 1199,
    tags: ['New Customer'],
    notes: 'Asked about newborn baby safety and chemical residue in washing machines.',
    assignedOwner: 'Customer Support Agent',
    orders: [
      {
        orderId: 'ord-106',
        orderNumber: 'NC-10002',
        date: '2026-10-26',
        items: ['Gentle Baby Fabric Wash Strips (45 Washes)'],
        totalAmount: 1199,
        currency: '₹',
        shippingStatus: 'Order Confirmed',
        trackingNumber: 'DEL-PENDING',
        carrier: 'Delhivery Surface'
      }
    ],
    customAttributes: {
      'Customer Segment': 'Young Parents',
      'Inquiry Topic': 'Hypoallergenic Safety'
    }
  }
];
