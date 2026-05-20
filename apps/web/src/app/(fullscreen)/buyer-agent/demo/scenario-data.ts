// Buyer Agent Demo — Scenario Data
// All copy in English for international buyers

export interface ChatMessage {
  id: string;
  role: "user" | "agent";
  text: string;
  card?: CardType;
  quickReplies?: string[];
}

export type CardType =
  | "demand-confirmation"
  | "tlc-breakdown"
  | "cost-waterfall"
  | "compliance-diagnosis"
  | "channel-comparison"
  | "bulk-solution"
  | "bulk-quote-comparison"
  | "alibaba-logistics-detail";

export interface Scenario {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  valueTag: string;
  steps: ChatMessage[][];
}

export interface PromptItem {
  id: string;
  text: string;
  targetScene?: string;
}

export interface PromptCategory {
  id: string;
  label: string;
  icon: string;
  prompts: PromptItem[];
}

// ── Scenarios ──────────────────────────────────────────────

export const scenarios: Scenario[] = [
  {
    id: "small-parcel",
    title: "Small Parcel TLC Calculation",
    subtitle: "Bluetooth earbuds from China to Germany — landed cost + compliance",
    icon: "🧮",
    valueTag: "Most Common",
    steps: [
      // Step 0: Agent welcome + user input
      [
        {
          id: "u1",
          role: "user",
          text: "I want to source 500 Bluetooth earbuds from China to Germany. What's the total landed cost?",
        },
      ],
      // Step 1: Agent parses + demand confirmation card
      [
        {
          id: "a1",
          role: "agent",
          text: "Got it, let me analyze your sourcing request 👇",
          card: "demand-confirmation",
          quickReplies: ["Looks good, continue", "Edit details"],
        },
      ],
      // Step 2: User confirms
      [{ id: "u2", role: "user", text: "Looks good, continue" }],
      // Step 3: Agent shows TLC breakdown + compliance
      [
        {
          id: "a2",
          role: "agent",
          text: "Matching HS code... ✓ 8518.30.20\nCalculating duty & VAT... ✓\nEstimating freight... ✓\n\nTotal landed cost is approx. $3,763.\nDuty + VAT: $699.\n⚠️ Note: CE + RED certification required for Bluetooth earbuds imported into Germany.",
          card: "tlc-breakdown",
          quickReplies: ["Show best channel", "Export PDF", "View compliance"],
        },
      ],
      // Step 4: User asks for channel
      [{ id: "u3", role: "user", text: "Show me the best shipping channel" }],
      // Step 5: Agent shows channel comparison
      [
        {
          id: "a3",
          role: "agent",
          text: "Here's the post-tax total cost comparison ↓\n\nYunTu offers the best balance between total landed cost and transit time. Saves $357 vs. DHL.",
          card: "channel-comparison",
          quickReplies: ["Export Report", "Recalculate", "View Compliance Details"],
        },
      ],
      // Step 6: User exports
      [{ id: "u4", role: "user", text: "Export the report" }],
      // Step 7: Agent confirms
      [
        {
          id: "a4",
          role: "agent",
          text: "✅ Report generated!\nYour TLC report includes cost breakdown, compliance checklist, and channel comparison.",
          quickReplies: ["Start new inquiry"],
        },
      ],
    ],
  },
  {
    id: "bulk",
    title: "Bulk Inquiry with Eco Partners",
    subtitle: "15 tons electronics parts — compare Alibaba Logistics vs ecosystem partners",
    icon: "🚢",
    valueTag: "Bulk + Alibaba",
    steps: [
      // Step 0
      [
        {
          id: "u1",
          role: "user",
          text: "I need to ship 15 tons of electronics parts from China to Germany. Can you compare options including Alibaba Logistics?",
        },
      ],
      // Step 1: Agent parses
      [
        {
          id: "a1",
          role: "agent",
          text: "Bulk inquiry! Let me pull quotes from multiple sources 🚢\n\nCollecting quotes from ecosystem partners... ✓\nFetching Alibaba Logistics rates... ✓",
          card: "bulk-quote-comparison",
          quickReplies: ["Tell me more about Alibaba Logistics", "Select Eco Partner A", "View timeline"],
        },
      ],
      // Step 2: User asks about Alibaba
      [{ id: "u2", role: "user", text: "Tell me more about Alibaba Logistics option" }],
      // Step 3: Agent shows detail
      [
        {
          id: "a2",
          role: "agent",
          text: "Here's the full Alibaba Logistics breakdown ↓",
          card: "alibaba-logistics-detail",
          quickReplies: ["Book Shipment", "Save for Later", "Export Quote"],
        },
      ],
      // Step 4: User books
      [{ id: "u3", role: "user", text: "Book Shipment" }],
      // Step 5: Agent confirms
      [
        {
          id: "a3",
          role: "agent",
          text: "✅ Booking request submitted to Alibaba Logistics!\n\nBooking Ref: ALB-20260519-8842\nRoute: Shenzhen/Yantian → Hamburg\nService: Sea Freight FCL 40HQ\nEstimated pickup: 2-3 business days\n\nYou'll receive tracking updates via the Alibaba Logistics portal.",
          quickReplies: ["Start new inquiry"],
        },
      ],
    ],
  },
  {
    id: "compliance",
    title: "Compliance Pre-Diagnosis",
    subtitle: "LED lights to Saudi Arabia — certifications & restrictions",
    icon: "🔍",
    valueTag: "Compliance",
    steps: [
      // Step 0
      [
        {
          id: "u1",
          role: "user",
          text: "I want to import LED lights to Saudi Arabia. What certifications do I need?",
        },
      ],
      // Step 1: Agent diagnosis
      [
        {
          id: "a1",
          role: "agent",
          text: "Let me run a compliance pre-diagnosis for you 🔍",
          card: "compliance-diagnosis",
          quickReplies: ["Calculate landed cost", "Export checklist", "Change destination"],
        },
      ],
      // Step 2: User asks for TLC
      [{ id: "u2", role: "user", text: "Yes, 1000 units, total value $8,000" }],
      // Step 3: Agent shows TLC
      [
        {
          id: "a2",
          role: "agent",
          text: "Calculating... ✓\n\nFOB Value: $8,000.00\nFreight (sea): $1,200.00\nInsurance: $46.00\n──────── CIF: $9,246.00\nDuty (5%): $462.30\nVAT (15%): $1,456.25\nCustoms fees: ~$133\n────────────────\nTLC: ~$11,298\n\nLanded unit price: ~$11.30/unit",
          quickReplies: ["Export Report", "View channels", "Start new inquiry"],
        },
      ],
    ],
  },
];

// ── Prompt Categories ──────────────────────────────────────

export const promptCategories: PromptCategory[] = [
  {
    id: "tlc",
    label: "TLC Calculation",
    icon: "🧮",
    prompts: [
      { id: "p1", text: "I want to source 500 Bluetooth earbuds from China to Germany. What's the total landed cost?", targetScene: "small-parcel" },
      { id: "p2", text: "How much tax will I pay for importing phone cases to the UK?", targetScene: "small-parcel" },
      { id: "p3", text: "Calculate landed cost for 200 LED lights shipped from China to France by air.", targetScene: "small-parcel" },
    ],
  },
  {
    id: "bulk",
    label: "Bulk Inquiry",
    icon: "🚢",
    prompts: [
      { id: "p4", text: "I need to ship 15 tons of electronics from China to Germany. Compare Alibaba Logistics and other options.", targetScene: "bulk" },
      { id: "p5", text: "What's the best way to ship a full container of furniture from China to Los Angeles?", targetScene: "bulk" },
      { id: "p6", text: "I have 3 suppliers in China. How can I consolidate shipments to Dubai?", targetScene: "bulk" },
    ],
  },
  {
    id: "compliance",
    label: "Compliance",
    icon: "🔍",
    prompts: [
      { id: "p7", text: "What certifications do I need to import LED lights to Saudi Arabia?", targetScene: "compliance" },
      { id: "p8", text: "Can I import Bluetooth earbuds with lithium batteries to Germany?", targetScene: "compliance" },
      { id: "p9", text: "Is my HS code 8518.30.20 correct for wireless headphones?", targetScene: "compliance" },
    ],
  },
];
