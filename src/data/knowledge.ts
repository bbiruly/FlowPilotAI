import { KnowledgeItem } from '../types';

export const initialKnowledge: KnowledgeItem[] = [
  {
    id: 'kb-1',
    title: 'Product Catalog & Pricing Matrix (2026)',
    category: 'products',
    sourceType: 'catalog',
    content: `NURTURECLEAN INDIA - PRODUCT SPECIFICATIONS & PRICING:
1. Eco Laundry Strips (Zero Plastic):
- 45 Washes Starter Pack: ₹699 MRP (Promo: ₹599)
- 90 Washes Family Pack: ₹1,299 MRP (Promo: ₹1,099)
- Scents: Mountain Fresh, Fragrance-Free Lavender, Pure Baby Unscented.
- Ingredients: Sodium dodecyl sulfate (coconut derived), Polyvinyl alcohol (PVA biodegradable polymer), Deionized water, Glycerol, Plant saponins.
2. Dishwashing Gel Concentrate:
- 500ml Bottle (Yields 1.5L): ₹449
3. Wool Dryer Balls (Pack of 4): ₹799
4. B2B Tier: Orders > 50 units receive 25% discount; > 250 units receive 35% margin.`,
    lastUpdated: '2026-10-20',
    assignedAgents: ['agent-1', 'agent-2'],
    status: 'indexed',
    tokenCount: 420,
    viewsOrUses: 1840
  },
  {
    id: 'kb-2',
    title: 'Delivery, Couriers & Shipping TAT Policy',
    category: 'shipping',
    sourceType: 'document',
    content: `SHIPPING & FULFILLMENT GUIDELINES:
- Warehouses located in Bhiwandi (Maharashtra) and Manesar (Haryana).
- Metro Cities (Mumbai, Delhi NCR, Bengaluru, Chennai, Hyderabad, Kolkata, Pune): 24 to 48 hours delivery via Delhivery Air or BlueDart Express.
- Tier 2 & Tier 3 Cities: 3 to 5 business days via Delhivery Surface or Shadowfax.
- Free Shipping threshold: All prepaid orders above ₹499 qualify for free shipping. Cash on Delivery (COD) carries a ₹50 handling surcharge.
- Tracking info is sent via WhatsApp within 2 hours of warehouse dispatch.`,
    lastUpdated: '2026-10-15',
    assignedAgents: ['agent-1', 'agent-4'],
    status: 'indexed',
    tokenCount: 310,
    viewsOrUses: 3410
  },
  {
    id: 'kb-3',
    title: '30-Day Happiness Guarantee & Return Policy',
    category: 'returns',
    sourceType: 'document',
    content: `RETURN & REFUND STANDARDS:
- We offer an unconditional 30-Day Happiness Guarantee. If a customer is not delighted with stain removal or fabric softness, they can request a replacement scent or refund.
- For orders where less than 20% of sheets were used, full refunds are issued within 3 working days back to original UPI/source method.
- Agents can autonomously issue replacement boxes or store credits up to ₹1,000 without supervisor approval.
- Damaged during transit: Customer must upload 1 photo of damaged packaging. Replacement is dispatched same day.`,
    lastUpdated: '2026-10-18',
    assignedAgents: ['agent-1', 'agent-4'],
    status: 'indexed',
    tokenCount: 290,
    viewsOrUses: 980
  },
  {
    id: 'kb-4',
    title: 'Dermatological Safety, Baby Clothing & Eczema FAQ',
    category: 'faqs',
    sourceType: 'faq',
    content: `FREQUENTLY ASKED QUESTIONS - HEALTH & SENSITIVE SKIN:
Q: Can I use this for newborn baby clothes and cloth diapers?
A: Yes! NurtureClean Baby Strips are 100% hypoallergenic, pH 7.0 neutral, and certified zero residue by Dermatest Germany. They contain zero optical brighteners, zero chlorine bleach, and zero artificial dyes.

Q: Are these safe for septic tanks and greywater systems?
A: Yes, the strips dissolve completely within 30 seconds of water contact and are 100% readily biodegradable according to OECD 301B standards.

Q: Do they work in cold water or hard borewell water?
A: Specially formulated for Indian groundwater hardness (tested up to 500 ppm TDS). Effective in cold tap water (15°C) as well as hot cycles.`,
    lastUpdated: '2026-10-22',
    assignedAgents: ['agent-1', 'agent-2', 'agent-3'],
    status: 'indexed',
    tokenCount: 480,
    viewsOrUses: 1250
  },
  {
    id: 'kb-5',
    title: 'Corporate Gifting & Wholesale Terms (PDF Guide)',
    category: 'policies',
    sourceType: 'pdf',
    content: `B2B & CORPORATE SUSTAINABILITY PROCUREMENT:
- Minimum Order Quantity (MOQ) for custom co-branded gift boxes: 50 units.
- Lead time for custom branded sleeve printing: 5 to 7 business days.
- Payment terms for GST-registered entities: 50% advance upon PO, balance 50% upon dispatch. Credit periods (15/30 days) require credit approval for recurring accounts above ₹1,00,000.`,
    lastUpdated: '2026-10-10',
    assignedAgents: ['agent-2'],
    status: 'needs_review',
    tokenCount: 560,
    viewsOrUses: 410
  }
];
