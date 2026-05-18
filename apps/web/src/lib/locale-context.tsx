"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { SupportedLocale } from "@logistic/shared";

interface LocaleContextValue {
  locale: SupportedLocale;
  toggleLocale: () => void;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: "zh",
  toggleLocale: () => {},
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<SupportedLocale>("zh");

  const toggleLocale = () => {
    setLocale((prev) => (prev === "zh" ? "en" : "zh"));
  };

  return (
    <LocaleContext.Provider value={{ locale, toggleLocale }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
