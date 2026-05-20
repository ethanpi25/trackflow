# Buyer Agent — Product Design Specification (SPEC)

> **Handoff**: Planner → Designer
> **Version**: v1.1
> **Date**: 2026-05-19
> **Status**: ✅ Confirmed by Planner + User, ready for Designer handoff
> **Next Step**: Designer produces conversation UI + mockup visuals (including Demo conversation examples)

---

## 一、Product Definition: This is an Agent, Not a Form

### 1.1 Core Identity

**Buyer Agent is a Plugin SubAgent within ACCIO WORK.**

Users do not fill out forms or click buttons to trigger workflows — users **speak in natural language**, the Agent **understands intent, makes autonomous decisions, and delivers results**.

```
User says: "I want to source 500 Bluetooth earbuds from China to Germany. How much will it cost landed?"
                              ↓
              Agent automatically parses:
              - Product: Bluetooth earbuds (contains lithium battery)
              - Quantity: 500 units
              - Destination: Germany
              - Intent: TLC (Total Landed Cost) calculation
                              ↓
              Agent auto-judges: Small parcel → Standard TLC calculation flow
                              ↓
              Returns: Structured TLC cost breakdown card + compliance risk diagnosis
```

### 1.2 Conversation-Driven Capability Boundary

| User Natural Language Input | Agent Intent Recognition | Triggered Capability |
|----------------------------|-------------------------|---------------------|
| "I want to source phone cases from China to the US" | Small parcel sourcing — TLC calculation | TLC Calculator |
| "How much tax will I pay for this shipment to Germany?" | Small parcel — duty query | TLC Calculator (duty breakdown) |
| "I want to import a full container of furniture to LA" | Bulk procurement — custom solution | Bulk TLC calculation + consolidation planning |
| "What certifications do I need for Saudi Arabia?" | Compliance pre-diagnosis | Compliance check (destination rule matching) |
| "Can you verify this HS code is correct?" | HS code query / correction | HS Code Assistant |
| "I have three suppliers, how to ship together and save?" | Multi-supplier consolidation | Consolidation plan |
| "Which is better for me, FOB or DDP?" | Trade term comparison | Trade term recommendation |

### 1.3 Integration Form (Plugin in ACCIO WORK)

```
ACCIO WORK Main Interface
┌─────────────────────────────────────┐
│  [Other Plugins]  [Import Copilot ▼] │
│                                     │
│  ┌──────────────────────────────┐   │
│  │   Buyer Agent (SubAgent)     │   │
│  │                              │   │
│  │  💬 Conversation UI (Main)   │   │
│  │                              │   │
│  │  [Result Card Render Area]   │   │
│  └──────────────────────────────┘   │
└─────────────────────────────────────┘
```

---

## 二、Capability Overview (Buyer Side Full Scope)

> Note: All capabilities are implemented via **Mock data**, simulating real API responses.

### 2.1 Capability Tree (Buyer)

```
Buyer Agent Capability Tree
│
├── 🧮 TLC (Total Landed Cost) Calculation (Small Parcel)
│   ├── Natural language procurement demand parsing
│   ├── HS code intelligent matching (AI inference)
│   ├── Duty / VAT / GST automatic calculation
│   ├── Customs clearance fee estimation (by destination country)
│   ├── International freight estimation (Mock historical rates)
│   ├── Full landed cost breakdown (CIF → TLC)
│   ├── Cost waterfall chart visualization
│   └── PDF report export
│
├── 📋 Bulk Import Solution (Large Commodities)
│   ├── Natural language bulk procurement demand parsing
│   ├── Multi-supplier consolidation planning
│   ├── Sea / Air / Rail cost comparison
│   ├── Trade term (Incoterms) pros & cons analysis
│   ├── FCL / LCL break-even calculation
│   ├── Bulk TLC calculation (including warehousing / insurance)
│   ├── Estimated cost range and solution recommendation
│   └── Solution timeline + cost breakdown
│
├── 🔍 Compliance Pre-Diagnosis
│   ├── HS code matching and validation
│   ├── Destination country certification checklist (CE / FCC / SASO / REACH etc.)
│   ├── Prohibited / restricted goods identification with red/yellow/green risk labels
│   ├── Certificate of origin requirement hints
│   ├── Fumigation / phytosanitary requirements (bulk)
│   └── Compliance risk card output
│
├── 🏷️ HS Code Assistant
│   ├── Product description → HS code AI inference
│   ├── Existing HS code validation and correction
│   ├── Duty rate lookup
│   └── Query history
│
└── 📊 Channel & Term Recommendation
    ├── Small parcel import channel comparison (post-tax total cost)
    ├── FOB / CIF / DDP / DAP scenario analysis
    ├── Risk-return comparison
    └── Cost optimization suggestions
```

---

## 三、Conversation Interaction Design Specification

### 3.1 Conversation UI Structure

```
┌─────────────────────────────────────────────────────┐
│  🧮 Buyer Agent — Import Cost & Compliance Copilot  │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  [Conversation History Area]                        │
│                                                     │
│  ● Agent:  Hi! I'm your import cost assistant.      │
│            Tell me what you want to source,         │
│            where it's going, and the quantity.      │
│            I'll calculate the total landed cost     │
│            and compliance requirements for you.     │
│                                                     │
│  ── ── ── ── ── ── ── ── ── ── ── ── ── ── ──       │
│                                                     │
│  ● User:   I want to source 500 Bluetooth earbuds   │
│            from China to Germany                    │
│                                                     │
│  ● Agent:  [Parsing...] ✓                           │
│            📦 Sourcing: Bluetooth earbuds (Li-ion)  │
│            🎯 Destination: Germany                  │
│            📊 Quantity: 500 units                   │
│            ⚡ Calculating landed cost & compliance...│
│                                                     │
│  ┌─ TLC Cost Breakdown Card ─────────────────┐     │
│  │  [Cost Waterfall Chart]                   │     │
│  │  [Compliance Risk Diagnosis]              │     │
│  │  [Channel Post-Tax Comparison]            │     │
│  └───────────────────────────────────────────┘     │
│                                                     │
│  ● Agent:  Total landed cost is approx. $3,763.    │
│            Duty + VAT: $699.                        │
│            ⚠️ Note: CE + RED certification required │
│            for Bluetooth earbuds in Germany.        │
│                                                     │
│            Export the report or adjust conditions?  │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  [Quick Actions: 📄 Export Report  🔍 Recalculate   │
│                  🔍 Compliance Details]             │
│  ┌─────────────────────────────────┐ [Send]        │
│  │  Type your request...           │               │
│  └─────────────────────────────────┘               │
└─────────────────────────────────────────────────────┘
```

### 3.2 Quick Action Design

Context-aware quick action buttons below the dialog box, dynamically changing with conversation state:

| Conversation State | Quick Actions |
|-------------------|---------------|
| Initial state | [🧮 TLC Calculation] [🔍 Compliance Check] [🏷️ HS Code Lookup] [🚢 Bulk Solution] |
| After TLC result | [📄 Export PDF] [🔍 Recalculate] [🔍 View Compliance] [📦 Channel Recommendation] |
| After compliance diagnosis | [📄 Export Checklist] [🔍 HS Code Lookup] [🔄 Change Destination] |
| After bulk solution | [📄 Export Solution] [📍 Adjust Suppliers] [📊 Compare Terms] |

### 3.3 Card Component Specifications (Embedded in Conversation Flow)

#### Card 1: Procurement Demand Confirmation Card

```
┌─────────────────────────────────────────┐
│  📦 Here's what I understand            │
│                                         │
│  Product       Bluetooth Earbuds        │
│  Quantity      500 units                │
│  Destination   Germany (DEU)            │
│  Type          ✅ Small Parcel (auto)   │
│  Special Cargo ⚠️ Contains Li-ion       │
│                                         │
│  Not right? [Edit]     Looks good [OK]  │
└─────────────────────────────────────────┘
```

#### Card 2: TLC Cost Breakdown Card (Core Card)

```
┌─────────────────────────────────────────────┐
│  🧮 Total Landed Cost (TLC) Breakdown       │
│                                              │
│  📦 Goods Value (FOB)        $2,500.00      │
│  ✈️  International Freight    $350.00       │
│  🛡️ Insurance (0.5%)          $14.25       │
│  ─────────────── CIF     = $2,864.25        │
│                                              │
│  💰 Import Duty (4.5%)         $128.89      │
│  📊 VAT (19%)                  $569.69      │
│  📋 Customs Fees + AMS/ISF     $120.00      │
│  🚚 Inland Delivery (optional)  $80.00      │
│  ═══════════════════════════════════════    │
│  💵 Total Landed Cost (TLC)  $3,762.83     │
│                                              │
│  Landed unit price: $7.53 | Markup: +50.5%  │
│                                              │
│  [📄 Export PDF Report]  [🔍 Fee Details]   │
└─────────────────────────────────────────────┘
```

#### Card 3: Cost Waterfall Chart

```
  $4,000 │                                    ┌──┐
         │                              ┌──┐ │TL│
  $3,000 │                        ┌──┐ │VA│ │C │
         │                  ┌──┐ │TA│ │T │ │  │
  $2,000 │            ┌──┐ │DU│ │R │ │  │ │  │
         │      ┌──┐ │IN│ │TY│ │IF│ │  │ │  │
  $1,000 │ ┌──┐ │FR│ │S │ │  │ │  │ │  │ │  │
         │ │FO│ │EI│ │UR│ │  │ │  │ │  │ │  │
    $500 │ │B │ │GH│ │AN│ │  │ │  │ │  │ │  │
         │ │  │ │T │ │CE│ │  │ │  │ │  │ │  │
       0 └─┴──┴─┴──┴─┴──┴─┴──┴─┴──┴─┴──┴─┴──┘
          FOB  Freight Ins. Duty VAT  Customs Inland TLC

  Legend: FOB $2,500 | Freight $350 | Insurance $14 | Duty $129 | VAT $570 | Customs $120 | Inland $80
```

#### Card 4: Compliance Risk Diagnosis Card

```
┌─────────────────────────────────────────────┐
│  🔍 Compliance Pre-Diagnosis — Germany      │
│                                              │
│  HS Code     8518.30.20 (Speakers/Headsets) │
│  Duty Rate   4.5%                            │
│  VAT Rate    19%                             │
│                                              │
│  ⚠️ Risk Level: 🟡 Medium                    │
│                                              │
│  Certifications Required:                    │
│  ⚠️ CE Marking      — Mandatory, tech docs  │
│  ⚠️ RED Directive   — Radio equipment       │
│  ⚠️ RoHS Compliance — Hazardous substances  │
│  ✅ WEEE Registration — Met (repeat import) │
│                                              │
│  Restricted Goods Check: ✅ No restrictions  │
│  Li-ion Battery: ⚠️ UN38.3 test report req. │
│                                              │
│  [📄 Export Compliance List] [🔍 Details]   │
└─────────────────────────────────────────────┘
```

#### Card 5: Bulk Import Solution Card

```
┌────────────────────────────────────────────┐
│  🚢 Bulk Import Solution — Furniture (3)   │
│                                            │
│  Supplier Consolidation:                   │
│  📍 Yiwu · 0.8 CBM · Ready                 │
│  📍 Dongguan · 1.2 CBM · Ready in 3 days   │
│  📍 Foshan · 2.0 CBM · Ready               │
│  ─────────────────────────                 │
│  Total: 4.0 CBM / approx. 2,800 kg         │
│                                            │
│  💡 Break-even: LCL is more economical     │
│     (volume < 15 CBM)                      │
│                                            │
│  ┌─ Solution Comparison ───────────┐      │
│  │                                 │      │
│  │  🏆 Option 1: FCL 20GP Sea      │      │
│  │     Route: Shenzhen → Hamburg   │      │
│  │     Transit: 28-35 days         │      │
│  │     Estimate: $3,200 ~ $3,800   │      │
│  │     Incl: Ocean + THC + port    │      │
│  │                                 │      │
│  │  Option 2: LCL Consolidation    │      │
│  │     Transit: 32-40 days         │      │
│  │     Estimate: $2,600 ~ $3,000   │      │
│  │                                 │      │
│  └─────────────────────────────────┘      │
│                                            │
│  [View Full Solution] [Adjust Suppliers]   │
│  [Compare Terms]                           │
└────────────────────────────────────────────┘
```

#### Card 6: Channel Post-Tax Comparison Card

```
┌─────────────────────────────────────────────┐
│  📦 Channel Comparison (Post-Tax Total)     │
│                                              │
│  ┌──────────────┬──────────────┬──────────┐ │
│  │ 🏆 AI Pick    │ 💰 Lowest    │ ⚡ Fastest│ │
│  │              │              │          │ │
│  │ YunTu Europe │ 4PX Economy  │ DHL Exp. │ │
│  │ $3,763       │ $3,580       │ $4,120   │ │
│  │ 12-16 days   │ 15-20 days   │ 5-7 days │ │
│  │ 94% on-time  │ 88% on-time  │ 99% o-t  │ │
│  │              │              │          │ │
│  │ [Select]     │ [Select]     │ [Select] │ │
│  └──────────────┴──────────────┴──────────┘ │
│                                              │
│  💡 AI Pick Reason:                          │
│  YunTu offers the best balance between total │
│  landed cost and transit time.               │
│  Saves $357 vs. DHL, 3-4 days faster than    │
│  4PX. Matches your "balanced" preference.    │
└─────────────────────────────────────────────┘
```

---

## 四、Natural Language Intent Parsing Specification (Agent Brain)

### 4.1 Auto-Judgment Logic for Cargo Type & Business Line

Agent **automatically judges** the business line and cargo type by analyzing user input, without requiring manual selection:

```
Input Signal                          →  Judgment Result
"source" "procure" "import" "buy"     →  Buyer Agent (buyer side)
"dozens" "hundreds" "samples"         →  Small parcel standard goods
"full container" "FCL" "tons"         →  Bulk procurement
"multiple suppliers" "ship together"  →  Multi-supplier → consolidation plan
"landed cost" "total cost" "duty"     →  TLC calculation intent
"what certification" "compliance"     →  Compliance pre-diagnosis intent
Cannot determine                      →  Agent asks for confirmation
```

### 4.2 Intent Recognition Keyword Matrix

```
TLC Calculation Intent:
  ["landed cost", "total cost", "duty", "how much", "VAT", "tax included", "all-in price"]

Compliance Pre-Diagnosis Intent:
  ["certification needed", "compliance", "can I import", "prohibited", "restricted", "SASO", "CE", "FCC"]

HS Code Intent:
  ["HS code", "HS classification", "tariff code", "is this code correct"]

Bulk Procurement Intent:
  ["full container", "FCL", "LCL", "consolidation", "tons", "container", "bulk", "batch"]

Consolidation Intent:
  ["multiple suppliers", "ship together", "consolidate", "combine", "merge shipment"]

Trade Term Intent:
  ["FOB", "CIF", "DDP", "DAP", "EXW", "trade term", "which term"]
```

### 4.3 Follow-up Strategy

When information is incomplete, Agent **prioritizes asking for the most critical missing information** rather than requesting everything at once:

```
Missing: Destination        → "Which country are you shipping to?"
Missing: Product desc       → "What product are you sourcing? Brief description is fine."
Missing: Quantity / Value   → "How many units approximately? Or what's the total goods value?"
Missing: Destination port   → "Which port or city? (e.g., Hamburg / Los Angeles / Dubai)"
Missing bulk supplier info  → "How many suppliers do you have, and which cities are they in?"
Suspected special cargo     → "Does this shipment contain lithium batteries?"
```

---

## 五、TLC Calculation Model Specification

### 5.1 Calculation Formula

```
TLC = CIF + Import Duty + VAT/GST + Customs Fees + Inland Transport

Where:
  CIF           = FOB Goods Value + International Freight + Insurance
  Import Duty   = CIF × HS Duty Rate
  VAT/GST       = (CIF + Import Duty) × VAT Rate
  Customs Fees  = Fixed estimate by destination country
  Inland Transport = Destination port → Buyer warehouse (optional input)
```

### 5.2 Destination Country Customs Fee Estimates (Mock Baseline)

```
Country     AMS/ISF    Port Fee   Customs    Total
USA         $25        $80        $120       $225
Germany     —          €60        €100       €160
UK          —          £50        £80        £130
Saudi       —          SAR 200    SAR 300    SAR 500
UAE         —          AED 150    AED 250    AED 400
Australia   —          AUD 90     AUD 150    AUD 240
(All amounts are Mock estimates in destination currency)
```

### 5.3 VAT / GST Rate Table (Mock Baseline)

```
Country      VAT / GST Rate
Germany      19%
France       20%
UK           20%
Italy        22%
Saudi        15%
UAE          5%
USA          0% (state tax excluded in Mock)
Australia    10%
Japan        10%
```

### 5.4 Mock HS Codes & Duty Rates (Reference Samples)

```
Product          HS Code       EU Rate   US Rate   SA Rate
Phone Case       3926.90       6.5%      3.4%      5%
Bluetooth Earbuds 8518.30       4.5%      0%        5%
LED Light        9405.40       3.7%      3.9%      5%
Wood Furniture   9403.60       2.5%      0%        5%
Cotton Clothing  6109.10       12%       8.5%      5%
Toys             9503.00       4.7%      0%        5%
```

### 5.5 Small Parcel International Freight Estimates (Mock, per kg)

```
Destination    Air ($/kg)    Sea ($/kg) (reference)
USA            $8-12         $2-3
Germany        $7-10         $1.5-2.5
UK             $7-10         $1.5-2.5
Saudi          $9-14         $2-4
UAE            $8-12         $2-3
Australia      $10-15        $2.5-4
Japan          $6-9          $1-2
```

---

## 六、Mock Scenario Library (Demo Conversation Scripts)

The following are **complete conversation scenarios** for Designer to use when creating Demo mockups. **Order: (1) Small Parcel TLC → (2) Bulk Inquiry (with Eco Partners & Alibaba Logistics) → (3) Compliance Diagnosis**

### Scenario 1: Small Parcel TLC Calculation (Most Common)

```
User:   I want to source 500 Bluetooth earbuds from China to Germany.
        What's the total landed cost?

Agent:  Got it, let me analyze for you 👇

        ┌─ Sourcing Request ─────────────────────┐
        │ Bluetooth Earbuds · 500 units · Germany│
        │ Type: ✅ Small Parcel | Hazmat: ⚠️ Li-ion│
        └────────────────────────────────────────┘

        Matching HS code... ✓ 8518.30.20
        Calculating duty & VAT... ✓
        Estimating freight... ✓

        [TLC Cost Breakdown Card]
        [Compliance Risk Diagnosis Card]

        Total landed cost is approx. $3,763.
        Duty + VAT: $699.
        ⚠️ Note: CE + RED certification required for
           Bluetooth earbuds imported into Germany.

        Want to export the report, or see recommended shipping channels?

User:   Show me the best shipping channel

Agent:  Here's the post-tax total cost comparison ↓

        [Channel Post-Tax Comparison Card]
        ┌──────────────┬──────────────┬──────────┐
        │ 🏆 AI Pick    │ 💰 Lowest    │ ⚡ Fastest│
        │ YunTu Europe │ 4PX Economy  │ DHL Exp. │
        │ $3,763       │ $3,580       │ $4,120   │
        │ 12-16 days   │ 15-20 days   │ 5-7 days │
        └──────────────┴──────────────┴──────────┘

        YunTu offers the best balance between total landed cost
        and transit time. Saves $357 vs. DHL.

User:   Export the report

Agent:  ✅ Report generated!
        [Download PDF Report] [View Compliance Checklist]
```

### Scenario 2: Bulk Inquiry with Eco Partners & Alibaba Logistics

```
User:   I need to ship 15 tons of electronics parts from China to Germany.
        Can you compare options including Alibaba Logistics?

Agent:  Bulk inquiry! Let me pull quotes from multiple sources 🚢

        ┌─ Bulk Inquiry Request ─────────────────────┐
        │ Product: Electronics Parts                 │
        │ Weight: 15 tons / approx. 60 CBM           │
        │ Route: China → Germany                     │
        │ Type: ✅ Bulk (auto-detected)              │
        └────────────────────────────────────────────┘

        Collecting quotes from ecosystem partners... ✓
        Fetching Alibaba Logistics rates... ✓

        [Bulk Quote Comparison Card]
        ┌─────────────────┬──────────┬──────────┬──────────┐
        │ Provider        │ Mode     │ Cost     │ Transit  │
        ├─────────────────┼──────────┼──────────┼──────────┤
        │ 🏆 Alibaba Log. │ Sea FCL  │ $4,200   │ 22-28d   │
        │ Eco Partner A   │ Sea FCL  │ $4,650   │ 25-32d   │
        │ Eco Partner B   │ Rail     │ $5,100   │ 18-22d   │
        │ DHL Global      │ Air      │ $12,800  │ 5-7d     │
        └─────────────────┴──────────┴──────────┴──────────┘

        🏆 AI Pick: Alibaba Logistics Sea FCL
           Best cost-efficiency for 15-ton bulk shipment.
           Includes: pickup, ocean freight, destination charges.

        💡 Tip: Rail is 4-6 days faster but costs $900 more.
           Choose Rail if you need stock replenishment urgently.

        [View Full Quote Details] [Select Alibaba Logistics]
        [Compare Transit Timeline]

User:   Tell me more about Alibaba Logistics option

Agent:  Here's the full breakdown ↓

        [Alibaba Logistics Detail Card]
        Provider:   Alibaba Logistics (Cainiao)
        Service:    Sea Freight FCL 40HQ
        Route:      Shenzhen/Yantian → Hamburg
        Cost Breakdown:
          - Pickup & inland (China):     $350
          - Ocean freight (FCL 40HQ):    $2,800
          - Destination charges:         $650
          - Customs clearance (Germany): $400
          ─────────────────────────────
          Total:                         $4,200
        Transit:    22-28 days
        Tracking:   Real-time via Alibaba Logistics portal

        [Book Shipment] [Save for Later] [Export Quote]
```

### Scenario 3: Compliance Pre-Diagnosis

```
User:   I want to import LED lights to Saudi Arabia.
        What certifications do I need?

Agent:  Let me run a compliance pre-diagnosis for you 🔍

        ┌─ Compliance Pre-Diagnosis ──────────────┐
        │ Product: LED Lights | Dest: Saudi Arabia│
        │ HS Code: 9405.40.00 | Duty: 5%          │
        │                                         │
        │ ⚠️ Risk Level: 🟡 Medium                 │
        │                                         │
        │ Mandatory Certifications:               │
        │ 🚨 SASO Energy Label  — Mandatory       │
        │ 🚨 IECEE Certificate  — Mandatory       │
        │ ⚠️ SABER Registration — Required before │
        │                         customs         │
        │ ⚠️ EER Registration   — Lighting goods  │
        │                                         │
        │ Voltage / Plug: 220V / Type G (UK 3-pin)│
        │                                         │
        │ Restricted Goods: ✅ No restrictions     │
        └─────────────────────────────────────────┘

        ⚠️ Important: Without SABER registration, your shipment
           will be rejected by Saudi customs.
           Apply 2-3 weeks in advance.

        Shall I calculate the landed cost for these LED lights?

User:   Yes, 1000 units, total value $8,000

Agent:  Calculating... ✓

        [TLC Cost Breakdown Card]
        FOB Value:         $8,000.00
        Freight (sea):     $1,200.00
        Insurance:         $46.00
        ──────── CIF:      $9,246.00
        Duty (5%):         $462.30
        VAT (15%):         $1,456.25
        Customs fees:      SAR 500 (~$133)
        ────────────────────────────────
        TLC:               ~$11,298

        Landed unit price: ~$11.30/unit
```

---

## 七、Designer Deliverables

### 7.1 Required Design Outputs

1. **Buyer Agent Main Interface** (conversation UI overall layout)
   - Conversation area + card render area + quick actions area
   - Brand tone: Professional, Transparent, Trustworthy

2. **Procurement Demand Confirmation Card** component design

3. **TLC Cost Breakdown Card** component design (core card, with cost waterfall chart)

4. **Compliance Risk Diagnosis Card** component design (with red/yellow/green risk labels)

5. **Channel Post-Tax Comparison Card** component design (3-column with AI Pick badge)

6. **Bulk Import Solution Card** component design (with consolidation + provider comparison)

7. **Bulk Quote Comparison Card** component design (ecosystem partners + Alibaba Logistics)

8. **Complete Demo Conversation Mockups**
   - Scenario 1 (small parcel TLC) + Scenario 2 (bulk inquiry with Alibaba Logistics) + Scenario 3 (compliance diagnosis)
   - Showcase: natural language input → Agent understanding → result card visual chain

### 7.2 Design Style Requirements

> ** aligned with Seller Agent design style **

- **Color Palette**: Professional blue + white background, with status colors (green / yellow / red)
- **Card Style**: Rounded corners, subtle shadows, clear information hierarchy (Notion/Linear inspired)
- **AI Feel**: Chat bubbles, typing animation placeholder, "Agent is calculating" state
- **Data Feel**: Prominent numbers, unified currency symbols ($ / € / £), clear percentages
- **Mobile Adaptation**: Conversation UI should consider mobile scenarios (ACCIO WORK may have mobile support)

### 7.3 Technical Constraints (for Designer Reference)

- Integration: Plugin iFrame / WebComponent embedded in ACCIO WORK
- Frontend Stack: Next.js 16 + React 19 + Tailwind CSS
- Card Data: All Mock, no real API required

---

## 八、SPEC Confirmation Gate

**This document has been confirmed by Planner + User and is ready for Designer handoff.**

Checklist:
- [x] Agent product positioning (conversation-driven vs. form-driven) approved
- [x] Buyer-side full capability scope confirmed (TLC / Bulk / Compliance / HS Code / Terms)
- [x] Mock data implementation approach approved (no dependency on real API)
- [x] Demo scenario selection approved: (1) Small Parcel TLC → (2) Bulk Inquiry (Eco Partners + Alibaba Logistics) → (3) Compliance Diagnosis
- [x] Design style direction approved: aligned with Seller Agent (professional blue + white + status colors)

---

*Next Step: Designer takes over and produces visual design drafts and Demo mockups based on this SPEC*
