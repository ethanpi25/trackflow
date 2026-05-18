"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t } from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";
import { Search, ArrowRight } from "lucide-react";

interface SearchBoxProps {
  variant?: "hero" | "compact";
}

export function SearchBox({ variant = "hero" }: SearchBoxProps) {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const router = useRouter();
  const { locale } = useLocale();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = trackingNumber.trim();
    if (trimmed.length >= 5) {
      router.push(`/track/${encodeURIComponent(trimmed)}`);
    }
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
    <form onSubmit={handleSubmit} className="w-full max-w-xl">
      <div className="search-container flex items-center">
        <Search className="ml-4 h-5 w-5 flex-shrink-0 text-text-tertiary" />
        <input
          type="text"
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
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

      {/* Hint */}
      <p className="mt-4 text-center text-sm text-text-tertiary">
        {t("search.hint", locale)}
      </p>

      {/* Quick demo hint */}
      {isFocused && trackingNumber.length === 0 && (
        <div className="mt-2 animate-fade-in text-center">
          <button
            type="button"
            onClick={() => setTrackingNumber("MOCK123456789")}
            className="text-xs text-primary hover:underline"
          >
            {locale === "zh" ? "试试示例单号: MOCK123456789" : "Try demo: MOCK123456789"}
          </button>
        </div>
      )}
    </form>
  );
}
