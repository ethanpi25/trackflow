"use client";

import { t } from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";
import { Package } from "lucide-react";

export function Footer() {
  const { locale } = useLocale();

  return (
    <footer className="border-t border-border-default bg-surface py-12">
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
              <Package className="h-3.5 w-3.5 text-text-inverse" strokeWidth={2.5} />
            </div>
            <span className="text-base font-bold text-text-primary tracking-tight">
              Track<span className="text-primary">Flow</span>
            </span>
          </div>
          <p className="text-sm text-text-tertiary">
            {t("footer.description", locale)}
          </p>
          <div className="flex items-center gap-6 text-xs text-text-tertiary">
            <span>&copy; {new Date().getFullYear()} TrackFlow</span>
            <span className="h-3 w-px bg-border-default" />
            <span>{locale === "zh" ? "隐私政策" : "Privacy"}</span>
            <span className="h-3 w-px bg-border-default" />
            <span>{locale === "zh" ? "服务条款" : "Terms"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
