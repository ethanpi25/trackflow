"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";
import { Search, ArrowRight } from "lucide-react";

interface SearchBoxProps {
  variant?: "hero" | "compact";
}

const SAMPLE_NUMBERS = [
  { carrier: "DHL", number: "MOCK123456789", color: "#FFCC00", dot: "#ea580c" },
  { carrier: "FedEx", number: "FEDEX-DEMO-7489", color: "#a78bfa", dot: "#7c3aed" },
  { carrier: "UPS", number: "UPS-1Z999-DEMO", color: "#fbbf24", dot: "#b45309" },
  { carrier: "SF Express", number: "SF-DEMO-20240001", color: "#f87171", dot: "#dc2626" },
];

export function SearchBox({ variant = "hero" }: SearchBoxProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const router = useRouter();
  const { locale } = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    if (trimmed.length >= 5) {
      router.push(`/track/${encodeURIComponent(trimmed)}`);
    }
  };

  const handleSample = (number: string) => {
    setTrackingNumber(number);
  };

  if (variant === "compact") {
    return (
      <form onSubmit={handleSubmit} className="w-full max-w-lg">
        <div className="search-container flex items-center">
          <Search className="ml-3 h-4 w-4 flex-shrink-0 text-text-tertiary" />
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder={t("search.placeholder", locale)}
            className="flex-1 bg-transparent px-3 py-2.5 text-sm outline-none placeholder:text-text-tertiary"
          />
          <button
            type="submit"
            disabled={trackingNumber.trim().length < 5}
            className="mr-1.5 rounded-md px-4 py-1.5 text-sm font-medium text-text-inverse transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{ background: "var(--gradient-primary-btn)" }}
          >
            {t("search.button", locale)}
          </button>
        </div>
      </form>
    );
  }

  return (
    <div className="w-full max-w-xl">
      <form onSubmit={handleSubmit}>
        <div className="search-container flex items-center">
          <Search className="ml-4 h-5 w-5 flex-shrink-0 text-text-tertiary" />
          <input
            type="text"
            value={trackingNumber}
            onChange={(e) => setTrackingNumber(e.target.value)}
            placeholder={t("search.placeholder", locale)}
            className="flex-1 bg-transparent px-4 py-4 text-base outline-none placeholder:text-text-tertiary"
          />
          <button
            type="submit"
            disabled={trackingNumber.trim().length < 5}
            className="group mr-2 flex items-center gap-2 rounded-lg px-6 py-2.5 text-sm font-semibold text-text-inverse transition-all duration-150 disabled:opacity-40 disabled:cursor-not-allowed hover:shadow-[var(--shadow-primary)]"
            style={{ background: "var(--gradient-primary-btn)" }}
          >
            {t("search.button", locale)}
            <ArrowRight className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5" />
          </button>
        </div>
      </form>

      {/* Sample tracking numbers */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <span className="text-xs text-white/40 mr-1">
          {locale === "zh" ? "试试示例：" : "Try demo:"}
        </span>
        {SAMPLE_NUMBERS.map((sample) => (
          <button
            key={sample.carrier}
            type="button"
            onClick={() => handleSample(sample.number)}
            className="sample-chip"
          >
            <span
              className="h-1.5 w-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: sample.dot }}
            />
            <span style={{ color: sample.color }} className="font-semibold">
              {sample.carrier}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
