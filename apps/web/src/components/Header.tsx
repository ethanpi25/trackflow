"use client";

import Link from "next/link";
import { t } from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";
import { Package, Globe } from "lucide-react";

export function Header() {
  const { locale, toggleLocale } = useLocale();

  return (
    <header className="glass sticky top-0 z-50 border-b border-border-default">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <Package className="h-4 w-4 text-text-inverse" strokeWidth={2.5} />
          </div>
          <span className="text-lg font-bold text-text-primary tracking-tight">
            Track<span className="text-primary">Flow</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="flex items-center gap-1">
          <Link
            href="/"
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary hover:bg-surface"
          >
            {t("nav.home", locale)}
          </Link>
          <Link
            href="/pricing"
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary hover:bg-surface"
          >
            {t("nav.pricing", locale)}
          </Link>
          <Link
            href="/pricing"
            className="rounded-md px-3 py-2 text-sm font-medium text-text-secondary transition-colors duration-150 hover:text-text-primary hover:bg-surface"
          >
            {t("nav.apiDocs", locale)}
          </Link>

          <div className="ml-2 h-5 w-px bg-border-default" />

          <button
            onClick={toggleLocale}
            className="ml-2 flex items-center gap-1.5 rounded-md border border-border-default px-3 py-1.5 text-sm font-medium text-text-secondary transition-all duration-150 hover:border-primary hover:text-primary hover:bg-primary-light"
          >
            <Globe className="h-3.5 w-3.5" />
            {t("nav.language", locale)}
          </button>
        </nav>
      </div>
    </header>
  );
}
