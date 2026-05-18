"use client";

import { SearchBox } from "@/components/SearchBox";
import { HeroIllustration } from "@/components/HeroIllustration";
import { useLocale } from "@/lib/locale-context";
import { Zap, Globe, Shield, Clock, BarChart3, Package } from "lucide-react";

const CARRIERS = [
  "DHL", "FedEx", "UPS", "SF Express", "China Post",
  "YunExpress", "4PX", "Yanwen", "TNT", "EMS",
];

const STATS = [
  { valueZh: "900+", valueEn: "900+", labelZh: "承运商", labelEn: "Carriers" },
  { valueZh: "220+", valueEn: "220+", labelZh: "国家地区", labelEn: "Countries" },
  { valueZh: "10种", valueEn: "10", labelZh: "标准状态", labelEn: "Std. Statuses" },
  { valueZh: "免费", valueEn: "Free", labelZh: "基础查询", labelEn: "Basic Use" },
];

// Floating status cards shown in hero (glassmorphism)
const FLOATING_CARDS = [
  {
    carrier: "DHL",
    number: "1234···789",
    route: "上海 → 洛杉矶",
    routeEn: "Shanghai → LA",
    status: "运输中",
    statusEn: "In Transit",
    statusColor: "#60a5fa",
    dotColor: "#3b82f6",
    tilt: "-rotate-2",
    floatClass: "animate-float-card-a",
  },
  {
    carrier: "FedEx",
    number: "7489···001",
    route: "北京 → 纽约",
    routeEn: "Beijing → NYC",
    status: "已送达",
    statusEn: "Delivered",
    statusColor: "#4ade80",
    dotColor: "#22c55e",
    tilt: "rotate-[1.5deg]",
    floatClass: "animate-float-card-b",
  },
  {
    carrier: "UPS",
    number: "1Z99···DEMO",
    route: "深圳 → 伦敦",
    routeEn: "Shenzhen → London",
    status: "派送中",
    statusEn: "Out for Delivery",
    statusColor: "#fbbf24",
    dotColor: "#f59e0b",
    tilt: "-rotate-1",
    floatClass: "animate-float-card-c",
  },
];

export default function Home() {
  const { locale } = useLocale();

  const features = [
    {
      icon: Zap,
      color: "#2563EB",
      titleZh: "实时追踪",
      titleEn: "Real-Time Tracking",
      descZh: "智能路由自动选择最佳数据源，秒级响应查询请求",
      descEn: "Smart routing selects the best data source automatically with instant response",
    },
    {
      icon: Globe,
      color: "#0d9488",
      titleZh: "全球覆盖",
      titleEn: "Global Coverage",
      descZh: "支持 DHL、FedEx、UPS 等全球 900+ 承运商，覆盖 220+ 国家",
      descEn: "900+ carriers worldwide including DHL, FedEx, UPS across 220+ countries",
    },
    {
      icon: Shield,
      color: "#7C3AED",
      titleZh: "安全可靠",
      titleEn: "Secure & Reliable",
      descZh: "数据加密传输，多源交叉验证确保轨迹信息准确可靠",
      descEn: "Encrypted data transmission with multi-source cross-validation for accuracy",
    },
    {
      icon: Clock,
      color: "#F59E0B",
      titleZh: "智能缓存",
      titleEn: "Smart Caching",
      descZh: "根据包裹状态动态调整缓存策略，平衡实时性与查询效率",
      descEn: "Dynamic cache strategies based on shipment status for optimal performance",
    },
    {
      icon: Package,
      color: "#f97316",
      titleZh: "批量查询",
      titleEn: "Batch Tracking",
      descZh: "支持单次最多 50 个运单号批量查询，适合电商卖家使用",
      descEn: "Track up to 50 shipments at once, perfect for e-commerce sellers",
    },
    {
      icon: BarChart3,
      color: "#06B6D4",
      titleZh: "标准化轨迹",
      titleEn: "Normalized Events",
      descZh: "10 种标准状态统一不同承运商的轨迹格式，中英双语展示",
      descEn: "10 standard statuses normalize events across carriers with bilingual display",
    },
  ];

  const steps = [
    {
      num: "01",
      icon: "✈",
      titleZh: "输入单号",
      titleEn: "Enter Number",
      descZh: "输入运单号，系统自动识别承运商",
      descEn: "Enter tracking number, carrier auto-detected",
    },
    {
      num: "02",
      icon: "🔍",
      titleZh: "智能查询",
      titleEn: "Smart Query",
      descZh: "多数据源并行查询，智能路由匹配",
      descEn: "Multi-source parallel query with smart routing",
    },
    {
      num: "03",
      icon: "📦",
      titleZh: "查看轨迹",
      titleEn: "View Timeline",
      descZh: "标准化时间线展示完整物流轨迹",
      descEn: "Standardized timeline with full tracking history",
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ===== Hero Section ===== */}
      <section
        className="relative overflow-hidden"
        style={{ background: "var(--gradient-hero)" }}
      >
        {/* Multi-layer glow overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "var(--gradient-hero-glow)" }}
        />

        {/* Subtle dot grid texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        {/* Floating status cards - left side */}
        <div className="absolute left-6 top-1/3 hidden 2xl:block z-10">
          <div className={`hero-card p-3.5 w-48 ${FLOATING_CARDS[2].floatClass} ${FLOATING_CARDS[2].tilt}`}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-white/80">{FLOATING_CARDS[2].carrier}</span>
              <span className="text-[10px] text-white/35 font-mono">{FLOATING_CARDS[2].number}</span>
            </div>
            <div className="flex items-center gap-1.5 mb-1.5">
              <span className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: FLOATING_CARDS[2].dotColor }} />
              <span className="text-xs font-medium" style={{ color: FLOATING_CARDS[2].statusColor }}>
                {locale === "zh" ? FLOATING_CARDS[2].status : FLOATING_CARDS[2].statusEn}
              </span>
            </div>
            <p className="text-[10px] text-white/35 flex items-center gap-1">
              <span>📦</span>
              {locale === "zh" ? FLOATING_CARDS[2].route : FLOATING_CARDS[2].routeEn}
            </p>
          </div>
        </div>

        {/* Floating status cards - right side */}
        <div className="absolute right-6 top-1/4 hidden xl:block z-10 space-y-3">
          {FLOATING_CARDS.slice(0, 2).map((card) => (
            <div key={card.carrier} className={`hero-card p-3.5 w-52 ${card.floatClass} ${card.tilt}`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-white/80">{card.carrier}</span>
                <span className="text-[10px] text-white/35 font-mono">{card.number}</span>
              </div>
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="h-1.5 w-1.5 rounded-full animate-pulse-dot" style={{ backgroundColor: card.dotColor }} />
                <span className="text-xs font-medium" style={{ color: card.statusColor }}>
                  {locale === "zh" ? card.status : card.statusEn}
                </span>
              </div>
              <p className="text-[10px] text-white/35 flex items-center gap-1">
                <span>✈</span>
                {locale === "zh" ? card.route : card.routeEn}
              </p>
            </div>
          ))}
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-12 pt-20 sm:pb-16 sm:pt-28">
          <div className="flex flex-col items-center text-center">
            {/* Badge */}
            <div className="animate-fade-in mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-sm text-white/80 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse-dot" />
              {locale === "zh" ? "免费使用 · 全球覆盖 · 实时追踪" : "Free · Global · Real-Time"}
            </div>

            {/* Title */}
            <h1 className="animate-fade-in-up delay-100 max-w-3xl text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {locale === "zh" ? (
                <>
                  跨境物流轨迹
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                    一键查询
                  </span>
                </>
              ) : (
                <>
                  Cross-Border Shipment
                  <br />
                  <span className="bg-gradient-to-r from-blue-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
                    Tracking Made Easy
                  </span>
                </>
              )}
            </h1>

            {/* Subtitle */}
            <p className="animate-fade-in-up delay-200 mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
              {locale === "zh"
                ? "输入运单号，实时追踪全球包裹状态。支持 900+ 承运商，覆盖 220+ 国家和地区。"
                : "Enter a tracking number to track your shipment worldwide. Supporting 900+ carriers across 220+ countries."}
            </p>

            {/* Search box with sample chips */}
            <div className="animate-fade-in-up delay-300 mt-10 w-full max-w-xl">
              <SearchBox />
            </div>

            {/* Stats row */}
            <div className="animate-fade-in-up delay-400 mt-10 flex items-center gap-0 divide-x divide-white/10 rounded-2xl border border-white/8 bg-white/4 backdrop-blur-sm">
              {STATS.map((stat) => (
                <div key={stat.labelZh} className="stat-item px-5 py-3">
                  <div className="stat-value text-2xl">
                    {locale === "zh" ? stat.valueZh : stat.valueEn}
                  </div>
                  <div className="stat-label">
                    {locale === "zh" ? stat.labelZh : stat.labelEn}
                  </div>
                </div>
              ))}
            </div>

            {/* Illustration */}
            <div className="animate-fade-in delay-500 mt-8 w-full max-w-3xl opacity-90">
              <HeroIllustration className="w-full h-auto" />
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
      </section>

      {/* ===== Transport Mode Bar ===== */}
      <section className="border-b border-border-subtle bg-white py-6">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-text-secondary">
            <div className="flex items-center gap-2">
              <span className="text-lg">✈</span>
              <span className="font-medium" style={{ color: "var(--sky)" }}>
                {locale === "zh" ? "空运" : "Air Freight"}
              </span>
            </div>
            <div className="w-px h-4 bg-border-default" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🚢</span>
              <span className="font-medium" style={{ color: "var(--teal)" }}>
                {locale === "zh" ? "海运" : "Sea Freight"}
              </span>
            </div>
            <div className="w-px h-4 bg-border-default" />
            <div className="flex items-center gap-2">
              <span className="text-lg">🚛</span>
              <span className="font-medium" style={{ color: "var(--amber)" }}>
                {locale === "zh" ? "陆运" : "Ground"}
              </span>
            </div>
            <div className="w-px h-4 bg-border-default" />
            <div className="flex items-center gap-2">
              <span className="text-lg">📮</span>
              <span className="font-medium text-text-secondary">
                {locale === "zh" ? "小包专线" : "Postal / Parcel"}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ===== Carrier Trust Bar ===== */}
      <section className="border-b border-border-subtle bg-surface py-8">
        <div className="mx-auto max-w-6xl px-6">
          <p className="mb-5 text-center text-xs font-medium uppercase tracking-wider text-text-tertiary">
            {locale === "zh" ? "支持全球主流承运商" : "Supporting Major Carriers Worldwide"}
          </p>
          <div className="carrier-grid">
            {CARRIERS.map((name) => (
              <span key={name} className="carrier-tag">
                {name}
              </span>
            ))}
            <span className="carrier-tag">
              {locale === "zh" ? "更多..." : "More..."}
            </span>
          </div>
        </div>
      </section>

      {/* ===== How It Works ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
              {locale === "zh" ? "如何使用" : "How It Works"}
            </h2>
            <p className="mt-3 text-text-secondary">
              {locale === "zh" ? "三步完成物流轨迹查询" : "Track your shipment in 3 simple steps"}
            </p>
          </div>

          <div className="mt-14 grid gap-8 sm:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="animate-fade-in-up relative text-center"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-light text-2xl">
                  {step.icon}
                </div>
                <div className="text-xs font-bold text-primary mb-1 tracking-widest">{step.num}</div>
                <h3 className="text-base font-semibold text-text-primary">
                  {locale === "zh" ? step.titleZh : step.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                  {locale === "zh" ? step.descZh : step.descEn}
                </p>
                {i < steps.length - 1 && (
                  <div className="absolute right-0 top-8 hidden w-8 sm:block">
                    <svg viewBox="0 0 24 8" fill="none" className="text-border-default">
                      <path d="M0 4h20M16 0l4 4-4 4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Features Grid ===== */}
      <section className="border-t border-border-subtle bg-surface py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-text-primary tracking-tight">
              {locale === "zh" ? "核心功能" : "Core Features"}
            </h2>
            <p className="mt-3 text-text-secondary">
              {locale === "zh"
                ? "为跨境电商卖家和货代量身打造"
                : "Built for cross-border e-commerce sellers and freight forwarders"}
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={i}
                  className="card card-interactive p-6 animate-fade-in-up"
                  style={{ animationDelay: `${i * 100}ms` }}
                >
                  <div
                    className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg"
                    style={{ backgroundColor: `${feature.color}14` }}
                  >
                    <Icon
                      className="h-5 w-5"
                      style={{ color: feature.color }}
                      strokeWidth={2}
                    />
                  </div>
                  <h3 className="text-base font-semibold text-text-primary">
                    {locale === "zh" ? feature.titleZh : feature.titleEn}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                    {locale === "zh" ? feature.descZh : feature.descEn}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CTA Section ===== */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-6">
          <div
            className="rounded-2xl px-8 py-14 text-center sm:px-16 relative overflow-hidden"
            style={{ background: "var(--gradient-hero)" }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "var(--gradient-hero-glow)" }}
            />
            <div className="relative">
              <h2 className="text-3xl font-bold text-white">
                {locale === "zh" ? "开始免费查询" : "Start Tracking for Free"}
              </h2>
              <p className="mx-auto mt-3 max-w-md text-white/60">
                {locale === "zh"
                  ? "无需注册，立即查询。每天 10 次免费查询额度。"
                  : "No registration needed. Get 10 free queries per day."}
              </p>
              <div className="mt-8 flex justify-center">
                <SearchBox variant="compact" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
