"use client";

import { useState } from "react";

// ── Internal: Waterfall Chart ──────────────────────────────
function WaterfallChart() {
  const tlc = 3763;
  const items = [
    { label: "FOB", value: 2500, type: "base" as const },
    { label: "Freight", value: 350, type: "add" as const },
    { label: "Insure", value: 14, type: "add" as const },
    { label: "Duty", value: 129, type: "add" as const },
    { label: "VAT", value: 570, type: "add" as const },
    { label: "Customs", value: 120, type: "add" as const },
    { label: "Inland", value: 80, type: "add" as const },
    { label: "TLC", value: tlc, type: "total" as const },
  ];

  let cumulative = 0;
  const bars = items.map((item) => {
    const bottom = item.type === "total" ? 0 : cumulative;
    const height = Math.max((item.value / tlc) * 100, 1.2);
    if (item.type !== "total") cumulative += item.value;
    return { ...item, bottom, height };
  });

  const barColors: Record<"base" | "add" | "total", string> = {
    base: "bg-[#7c3aed]",
    add: "bg-blue-500",
    total: "bg-[#4c1d95]",
  };

  return (
    <div>
      <div className="flex gap-[3px]" style={{ height: 160, paddingBottom: 20, position: "relative" }}>
        {bars.map((bar, i) => (
          <div key={i} className="flex-1 relative h-full">
            <span
              className="absolute left-1/2 -translate-x-1/2 text-[9px] font-mono text-slate-600 whitespace-nowrap leading-none"
              style={{ bottom: `calc(${bar.bottom + bar.height}% + 2px)` }}
            >
              ${bar.value.toLocaleString()}
            </span>
            <div
              className={`absolute left-[2px] right-[2px] rounded-t-sm ${barColors[bar.type]}`}
              style={{ bottom: `${bar.bottom}%`, height: `${bar.height}%`, minHeight: 2 }}
            />
            {i < bars.length - 1 && (
              <div
                className="absolute left-[2px] right-[-3px] border-t border-dashed border-slate-300/80 z-10"
                style={{ bottom: `${bar.bottom + bar.height}%` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="flex gap-[3px]">
        {bars.map((bar) => (
          <div key={bar.label} className="flex-1 text-center text-[9px] text-slate-500 truncate">
            {bar.label}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-[10px] text-slate-500">
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#7c3aed] inline-block" />
          FOB (Base)
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
          Add-ons
        </span>
        <span className="flex items-center gap-1">
          <span className="w-2.5 h-2.5 rounded-sm bg-[#4c1d95] inline-block" />
          TLC (Total)
        </span>
      </div>
    </div>
  );
}

// ── Card 1: Demand Confirmation ────────────────────────────
export function DemandConfirmationCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📦</span>
        <span className="text-sm font-semibold text-slate-800">Here&apos;s what I understand</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Product</span>
          <span className="text-slate-700 font-medium">Bluetooth Earbuds</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Quantity</span>
          <span className="text-slate-700 font-medium">500 units</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Destination</span>
          <span className="text-slate-700 font-medium">Germany (DEU)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Type</span>
          <span className="text-slate-700">✅ Small Parcel (auto)</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Special Cargo</span>
          <span className="text-amber-600">⚠️ Contains Li-ion</span>
        </div>
      </div>
      <div className="flex gap-2 mt-4">
        <button className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all">
          Edit
        </button>
        <button className="flex-1 px-3 py-2 rounded-xl bg-[#7c3aed] text-white text-xs font-medium hover:bg-[#6d28d9] transition-all active:scale-95 shadow-sm">
          Looks good
        </button>
      </div>
    </div>
  );
}

// ── Card 2: TLC Breakdown ──────────────────────────────────
export function TLCBreakdownCard() {
  const [showWaterfall, setShowWaterfall] = useState(false);
  const rows = [
    { icon: "📦", label: "Goods Value (FOB)", value: "$2,500.00", type: "normal" as const },
    { icon: "✈️", label: "International Freight", value: "$350.00", type: "normal" as const },
    { icon: "🛡️", label: "Insurance (0.5%)", value: "$14.25", type: "normal" as const },
    { icon: "", label: "──────── CIF", value: "$2,864.25", type: "subtotal" as const },
    { icon: "💰", label: "Import Duty (4.5%)", value: "$128.89", type: "normal" as const },
    { icon: "📊", label: "VAT (19%)", value: "$569.69", type: "normal" as const },
    { icon: "📋", label: "Customs Fees + AMS/ISF", value: "$120.00", type: "normal" as const },
    { icon: "🚚", label: "Inland Delivery (optional)", value: "$80.00", type: "normal" as const },
    { icon: "", label: "══════════════════", value: "", type: "divider" as const },
    { icon: "💵", label: "Total Landed Cost (TLC)", value: "$3,762.83", type: "total" as const },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🧮</span>
        <span className="text-sm font-semibold text-slate-800">Total Landed Cost (TLC) Breakdown</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((row, i) => {
          if (row.type === "divider") {
            return <div key={i} className="border-t-2 border-slate-300 my-2" />;
          }
          return (
            <div key={i} className={`flex justify-between items-center text-sm ${
              row.type === "subtotal" ? "text-slate-500 font-medium" :
              row.type === "total" ? "text-slate-800 font-bold text-base" :
              ""
            }`}>
              <span className="flex items-center gap-1.5">
                {row.icon && <span className="text-xs">{row.icon}</span>}
                <span className={row.type === "total" ? "text-slate-800" : "text-slate-600"}>{row.label}</span>
              </span>
              <span className={row.type === "total" ? "text-[#7c3aed] font-black text-lg" : "text-slate-700 font-mono"}>
                {row.value}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 text-xs text-slate-500">
        Landed unit price: <span className="font-semibold text-slate-700">$7.53</span> | Markup: <span className="font-semibold text-amber-600">+50.5%</span>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 px-3 py-2 rounded-xl border border-[#7c3aed]/30 bg-[#7c3aed]/5 text-[#7c3aed] text-xs font-medium hover:bg-[#7c3aed]/10 transition-all">
          📄 Export PDF Report
        </button>
        <button className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all">
          🔍 Fee Details
        </button>
      </div>
      <button
        onClick={() => setShowWaterfall(!showWaterfall)}
        className="w-full mt-3 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5"
      >
        📊 {showWaterfall ? "Hide" : "View"} Waterfall Chart
      </button>
      {showWaterfall && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          <WaterfallChart />
        </div>
      )}
    </div>
  );
}

// ── Card 3: Compliance Diagnosis ───────────────────────────
export function ComplianceDiagnosisCard({ riskLevel = "medium" as "high" | "medium" | "low" }) {
  const riskConfig = {
    high: { bg: "bg-red-50", border: "border-red-100", text: "text-red-700", icon: "🚨", label: "High" },
    medium: { bg: "bg-amber-50", border: "border-amber-100", text: "text-amber-700", icon: "⚠️", label: "Medium" },
    low: { bg: "bg-emerald-50", border: "border-emerald-100", text: "text-emerald-700", icon: "✅", label: "Low" },
  };
  const risk = riskConfig[riskLevel];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🔍</span>
        <span className="text-sm font-semibold text-slate-800">Compliance Pre-Diagnosis — Saudi Arabia</span>
      </div>
      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">HS Code</span>
          <span className="text-slate-700 font-mono">9405.40.00</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Duty Rate</span>
          <span className="text-slate-700">5%</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">VAT Rate</span>
          <span className="text-slate-700">15%</span>
        </div>
      </div>
      <div className={`${risk.bg} border ${risk.border} rounded-xl p-3 mb-3`}>
        <div className="flex items-center gap-2 text-sm">
          <span>{risk.icon}</span>
          <span className={`font-medium ${risk.text}`}>Risk Level: {risk.label}</span>
        </div>
      </div>
      <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Mandatory Certifications</div>
      <div className="space-y-2">
        {[
          { level: "🚨", label: "SASO Energy Label", desc: "Mandatory", color: "text-red-600" },
          { level: "🚨", label: "IECEE Certificate", desc: "Mandatory", color: "text-red-600" },
          { level: "⚠️", label: "SABER Registration", desc: "Required before customs", color: "text-amber-600" },
          { level: "⚠️", label: "EER Registration", desc: "Lighting goods", color: "text-amber-600" },
        ].map((item, i) => (
          <div key={i} className="flex items-start gap-2 text-sm">
            <span className="text-xs mt-0.5">{item.level}</span>
            <div>
              <span className={`font-medium ${item.color}`}>{item.label}</span>
              <span className="text-slate-400 text-xs ml-2">— {item.desc}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-sm">
        <div className="flex items-center gap-2">
          <span>🔌</span>
          <span className="text-slate-600">Voltage / Plug: <span className="font-medium">220V / Type G (UK 3-pin)</span></span>
        </div>
        <div className="flex items-center gap-2">
          <span>✅</span>
          <span className="text-emerald-600">No restricted goods</span>
        </div>
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 px-3 py-2 rounded-xl border border-[#7c3aed]/30 bg-[#7c3aed]/5 text-[#7c3aed] text-xs font-medium hover:bg-[#7c3aed]/10 transition-all">
          📄 Export Checklist
        </button>
        <button className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all">
          🔍 Details
        </button>
      </div>
    </div>
  );
}

// ── Card 4: Channel Comparison ─────────────────────────────
export function ChannelComparisonCard() {
  const channels = [
    { badge: "🏆 AI Pick", name: "YunTu Europe", cost: "$3,763", transit: "12-16 days", onTime: "94%", highlight: true },
    { badge: "💰 Lowest", name: "4PX Economy", cost: "$3,580", transit: "15-20 days", onTime: "88%", highlight: false },
    { badge: "⚡ Fastest", name: "DHL Express", cost: "$4,120", transit: "5-7 days", onTime: "99%", highlight: false },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📦</span>
        <span className="text-sm font-semibold text-slate-800">Channel Comparison (Post-Tax Total)</span>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {channels.map((ch, i) => (
          <div
            key={i}
            className={`rounded-xl p-3 border ${
              ch.highlight
                ? "border-[#7c3aed]/30 bg-[#7c3aed]/[0.03] shadow-sm"
                : "border-slate-100 bg-slate-50/50"
            }`}
          >
            <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full inline-block mb-2 ${
              ch.highlight ? "bg-[#7c3aed] text-white" : "bg-slate-200 text-slate-600"
            }`}>
              {ch.badge}
            </div>
            <div className="text-sm font-semibold text-slate-800">{ch.name}</div>
            <div className="text-lg font-black text-slate-800 mt-1">{ch.cost}</div>
            <div className="text-xs text-slate-500 mt-0.5">{ch.transit}</div>
            <div className="text-xs text-slate-400">On-time: {ch.onTime}</div>
            <button className={`w-full mt-2 py-1.5 rounded-lg text-xs font-medium transition-all ${
              ch.highlight
                ? "bg-[#7c3aed] text-white hover:bg-[#6d28d9] active:scale-95"
                : "border border-slate-200 text-slate-600 hover:bg-white"
            }`}>
              Select
            </button>
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-blue-50/60 border border-blue-100 rounded-xl">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-blue-500">💡</span>
          <span className="text-slate-600">
            <span className="font-medium text-slate-700">AI Pick Reason:</span> YunTu offers the best balance between total landed cost and transit time. Saves <span className="font-semibold text-emerald-600">$357</span> vs. DHL.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Card 5: Bulk Quote Comparison ──────────────────────────
export function BulkQuoteComparisonCard() {
  const providers = [
    { badge: "🏆", name: "Alibaba Logistics", mode: "Sea FCL", cost: "$4,200", transit: "22-28d", highlight: true },
    { badge: "", name: "Eco Partner A", mode: "Sea FCL", cost: "$4,650", transit: "25-32d", highlight: false },
    { badge: "", name: "Eco Partner B", mode: "Rail", cost: "$5,100", transit: "18-22d", highlight: false },
    { badge: "", name: "DHL Global", mode: "Air", cost: "$12,800", transit: "5-7d", highlight: false },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-lg">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">🚢</span>
        <span className="text-sm font-semibold text-slate-800">Bulk Quote Comparison — 15 tons Electronics</span>
      </div>
      <div className="space-y-2">
        {providers.map((p, i) => (
          <div
            key={i}
            className={`flex items-center gap-3 p-3 rounded-xl border ${
              p.highlight
                ? "border-[#7c3aed]/30 bg-[#7c3aed]/[0.03]"
                : "border-slate-100 bg-slate-50/30"
            }`}
          >
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {p.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-slate-800">{p.name}</span>
                {p.highlight && <span className="text-[10px] bg-[#7c3aed] text-white px-1.5 py-0.5 rounded-full font-bold">AI Pick</span>}
              </div>
              <div className="text-xs text-slate-500">{p.mode}</div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-800">{p.cost}</div>
              <div className="text-xs text-slate-400">{p.transit}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 p-3 bg-emerald-50/60 border border-emerald-100 rounded-xl">
        <div className="flex items-start gap-2 text-sm">
          <span className="text-emerald-500">💡</span>
          <span className="text-slate-600">
            <span className="font-medium text-slate-700">AI Pick:</span> Alibaba Logistics Sea FCL offers the best cost-efficiency for 15-ton bulk shipment. Includes pickup, ocean freight, and destination charges.
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Card 6: Alibaba Logistics Detail ───────────────────────
export function AlibabaLogisticsDetailCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-sm font-bold">A</div>
        <div>
          <div className="text-sm font-semibold text-slate-800">Alibaba Logistics (Cainiao)</div>
          <div className="text-xs text-slate-400">Sea Freight FCL 40HQ</div>
        </div>
      </div>
      <div className="space-y-2 text-sm mb-3">
        <div className="flex justify-between">
          <span className="text-slate-400">Route</span>
          <span className="text-slate-700 font-medium">Shenzhen/Yantian → Hamburg</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Transit</span>
          <span className="text-slate-700">22-28 days</span>
        </div>
      </div>
      <div className="text-xs font-medium text-slate-500 mb-2 uppercase tracking-wider">Cost Breakdown</div>
      <div className="space-y-1.5 text-sm">
        {[
          { label: "Pickup & inland (China)", value: "$350" },
          { label: "Ocean freight (FCL 40HQ)", value: "$2,800" },
          { label: "Destination charges", value: "$650" },
          { label: "Customs clearance (Germany)", value: "$400" },
        ].map((item, i) => (
          <div key={i} className="flex justify-between">
            <span className="text-slate-500">{item.label}</span>
            <span className="text-slate-700 font-mono">{item.value}</span>
          </div>
        ))}
        <div className="border-t border-slate-200 pt-1.5 flex justify-between font-bold text-slate-800">
          <span>Total</span>
          <span className="text-[#7c3aed] text-base">$4,200</span>
        </div>
      </div>
      <div className="mt-3 p-2.5 bg-blue-50/60 border border-blue-100 rounded-xl text-xs text-blue-600">
        📍 Tracking: Real-time via Alibaba Logistics portal
      </div>
      <div className="flex gap-2 mt-3">
        <button className="flex-1 px-3 py-2 rounded-xl bg-[#7c3aed] text-white text-xs font-medium hover:bg-[#6d28d9] transition-all active:scale-95 shadow-sm">
          Book Shipment
        </button>
        <button className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all">
          Save
        </button>
        <button className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 transition-all">
          Export
        </button>
      </div>
    </div>
  );
}

// ── Card 7: Cost Waterfall (standalone) ────────────────────
export function CostWaterfallCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm max-w-md">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-base">📊</span>
        <span className="text-sm font-semibold text-slate-800">Cost Waterfall — TLC $3,763</span>
      </div>
      <WaterfallChart />
    </div>
  );
}
