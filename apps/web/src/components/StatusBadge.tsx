"use client";

import { TrackingStatus, STATUS_COLORS, translateStatus } from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";

interface StatusBadgeProps {
  status: TrackingStatus;
  size?: "sm" | "md";
}

export function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const { locale } = useLocale();
  const color = STATUS_COLORS[status];

  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm";

  return (
    <span
      className={`status-badge ${sizeClasses}`}
      style={{
        backgroundColor: `${color}12`,
        color: color,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: color }}
      />
      {translateStatus(status, locale)}
    </span>
  );
}
