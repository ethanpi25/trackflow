"use client";

import { useLocale } from "@/lib/locale-context";
import { Check, Zap } from "lucide-react";
import Link from "next/link";

interface PlanFeature {
  textZh: string;
  textEn: string;
  included: boolean;
}

interface Plan {
  nameZh: string;
  nameEn: string;
  priceZh: string;
  priceEn: string;
  periodZh: string;
  periodEn: string;
  descZh: string;
  descEn: string;
  featured: boolean;
  features: PlanFeature[];
  ctaZh: string;
  ctaEn: string;
}

const plans: Plan[] = [
  {
    nameZh: "免费版",
    nameEn: "Free",
    priceZh: "¥0",
    priceEn: "$0",
    periodZh: "永久免费",
    periodEn: "Forever free",
    descZh: "适合个人卖家和轻量使用",
    descEn: "Perfect for individual sellers",
    featured: false,
    ctaZh: "开始使用",
    ctaEn: "Get Started",
    features: [
      { textZh: "每天 10 次查询", textEn: "10 queries / day", included: true },
      { textZh: "单号逐个查询", textEn: "Single tracking query", included: true },
      { textZh: "7 天历史记录", textEn: "7-day history", included: true },
      { textZh: "中英双语轨迹", textEn: "Bilingual tracking", included: true },
      { textZh: "批量查询", textEn: "Batch tracking", included: false },
      { textZh: "Webhook 推送", textEn: "Webhook push", included: false },
      { textZh: "数据导出", textEn: "Data export", included: false },
    ],
  },
  {
    nameZh: "Pro 版",
    nameEn: "Pro",
    priceZh: "¥199",
    priceEn: "$29",
    periodZh: "/ 月",
    periodEn: "/ month",
    descZh: "适合中小型电商卖家和货代",
    descEn: "For growing e-commerce businesses",
    featured: true,
    ctaZh: "升级 Pro",
    ctaEn: "Upgrade to Pro",
    features: [
      { textZh: "每天 50,000 次查询", textEn: "50,000 queries / day", included: true },
      { textZh: "每分钟 300 次请求", textEn: "300 requests / min", included: true },
      { textZh: "批量查询（50个/次）", textEn: "Batch tracking (50/req)", included: true },
      { textZh: "90 天历史记录", textEn: "90-day history", included: true },
      { textZh: "Webhook 推送通知", textEn: "Webhook notifications", included: true },
      { textZh: "CSV 数据导出", textEn: "CSV data export", included: true },
      { textZh: "专属 API Key", textEn: "Dedicated API key", included: true },
    ],
  },
  {
    nameZh: "企业版",
    nameEn: "Enterprise",
    priceZh: "定制",
    priceEn: "Custom",
    periodZh: "按需定价",
    periodEn: "Contact us",
    descZh: "适合大型企业和平台集成",
    descEn: "For large businesses and platform integration",
    featured: false,
    ctaZh: "联系我们",
    ctaEn: "Contact Sales",
    features: [
      { textZh: "无限查询次数", textEn: "Unlimited queries", included: true },
      { textZh: "每分钟 10,000 次请求", textEn: "10,000 requests / min", included: true },
      { textZh: "批量查询（1000个/次）", textEn: "Batch tracking (1000/req)", included: true },
      { textZh: "无限历史记录", textEn: "Unlimited history", included: true },
      { textZh: "多格式导出（CSV/Excel/JSON）", textEn: "Multi-format export", included: true },
      { textZh: "专属技术支持", textEn: "Dedicated support", included: true },
      { textZh: "SLA 保障", textEn: "SLA guarantee", included: true },
    ],
  },
];

export default function PricingPage() {
  const { locale } = useLocale();

  return (
    <div className="py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="text-center animate-fade-in">
          <h1 className="text-4xl font-bold tracking-tight text-text-primary sm:text-5xl">
            {locale === "zh" ? "价格方案" : "Pricing Plans"}
          </h1>
          <p className="mx-auto mt-4 max-w-lg text-base text-text-secondary leading-relaxed">
            {locale === "zh"
              ? "从免费版开始，随业务增长灵活升级。所有方案均包含核心追踪功能。"
              : "Start free and scale as you grow. All plans include core tracking features."}
          </p>
        </div>

        {/* Plans grid */}
        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <div
              key={plan.nameEn}
              className={`card pricing-card ${plan.featured ? "featured" : ""} flex flex-col p-8 animate-fade-in-up`}
              style={{ animationDelay: `${i * 120}ms` }}
            >
              {/* Badge for featured */}
              {plan.featured && (
                <div className="mb-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-text-inverse">
                  <Zap className="h-3 w-3" />
                  {locale === "zh" ? "最受欢迎" : "Most Popular"}
                </div>
              )}

              {/* Plan name */}
              <h3 className="text-lg font-semibold text-text-primary">
                {locale === "zh" ? plan.nameZh : plan.nameEn}
              </h3>
              <p className="mt-1 text-sm text-text-tertiary">
                {locale === "zh" ? plan.descZh : plan.descEn}
              </p>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-text-primary tracking-tight">
                  {locale === "zh" ? plan.priceZh : plan.priceEn}
                </span>
                <span className="text-sm text-text-tertiary">
                  {locale === "zh" ? plan.periodZh : plan.periodEn}
                </span>
              </div>

              {/* CTA */}
              <button
                className={`mt-6 w-full rounded-lg py-2.5 text-sm font-semibold transition-all duration-200 ${
                  plan.featured
                    ? "text-text-inverse shadow-[var(--shadow-primary)] hover:opacity-90"
                    : "border border-border-default text-text-primary hover:border-primary hover:text-primary hover:bg-primary-light"
                }`}
                style={
                  plan.featured
                    ? { background: "var(--gradient-primary-btn)" }
                    : undefined
                }
              >
                {locale === "zh" ? plan.ctaZh : plan.ctaEn}
              </button>

              {/* Divider */}
              <div className="my-6 h-px bg-border-default" />

              {/* Features */}
              <ul className="flex-1 space-y-3">
                {plan.features.map((feature, fi) => (
                  <li key={fi} className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full ${
                        feature.included
                          ? "bg-success-light"
                          : "bg-surface"
                      }`}
                    >
                      {feature.included ? (
                        <Check className="h-2.5 w-2.5 text-success" strokeWidth={3} />
                      ) : (
                        <span className="h-0.5 w-2 rounded bg-text-tertiary opacity-40" />
                      )}
                    </div>
                    <span
                      className={`text-sm ${
                        feature.included ? "text-text-secondary" : "text-text-tertiary"
                      }`}
                    >
                      {locale === "zh" ? feature.textZh : feature.textEn}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center animate-fade-in">
          <p className="text-sm text-text-tertiary">
            {locale === "zh"
              ? "不确定选择哪个方案？"
              : "Not sure which plan to choose?"}
          </p>
          <Link
            href="/"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            {locale === "zh" ? "先免费试用 →" : "Try free first →"}
          </Link>
        </div>
      </div>
    </div>
  );
}
