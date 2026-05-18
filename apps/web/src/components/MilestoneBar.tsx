"use client";

import {
  TrackingStatus,
  MILESTONE_ORDER,
  STATUS_COLORS,
  t as translate,
} from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";
import { Check } from "lucide-react";

const MILESTONE_KEYS: Record<string, string> = {
  [TrackingStatus.PICKED_UP]: "milestone.pickup",
  [TrackingStatus.EXPORT_CUSTOMS]: "milestone.exportCustoms",
  [TrackingStatus.IN_TRANSIT]: "milestone.transit",
  [TrackingStatus.IMPORT_CUSTOMS]: "milestone.importCustoms",
  [TrackingStatus.OUT_FOR_DELIVERY]: "milestone.delivery",
  [TrackingStatus.DELIVERED]: "milestone.signed",
};

interface MilestoneBarProps {
  currentStatus: TrackingStatus;
  reachedStatuses: TrackingStatus[];
}

export function MilestoneBar({ currentStatus, reachedStatuses }: MilestoneBarProps) {
  const { locale } = useLocale();
  const reachedSet = new Set(reachedStatuses);

  const isErrorState = [
    TrackingStatus.FAILED,
    TrackingStatus.RETURNED,
    TrackingStatus.EXPIRED,
  ].includes(currentStatus);

  return (
    <div className="w-full">
      {/* Desktop milestone bar */}
      <div className="hidden sm:flex items-start justify-between">
        {MILESTONE_ORDER.map((status, i) => {
          const reached = reachedSet.has(status);
          const isCurrent = status === currentStatus;
          const color = reached ? STATUS_COLORS[status] : "#D1D5DB";

          return (
            <div key={status} className="flex flex-1 items-start">
              <div className="flex flex-col items-center" style={{ minWidth: 40 }}>
                {/* Dot */}
                <div
                  className={`milestone-dot flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-300 ${isCurrent ? "active" : ""}`}
                  style={{
                    backgroundColor: reached ? color : "#F3F4F6",
                    color: reached ? "white" : "#9CA3AF",
                    boxShadow: isCurrent ? `0 0 0 4px ${color}25` : undefined,
                  }}
                >
                  {reached ? (
                    <Check className="h-4 w-4" strokeWidth={3} />
                  ) : (
                    i + 1
                  )}
                </div>
                {/* Label */}
                <span
                  className="mt-2 text-xs font-medium text-center leading-tight"
                  style={{ color: reached ? color : "#9CA3AF" }}
                >
                  {translate(MILESTONE_KEYS[status], locale)}
                </span>
              </div>

              {/* Connecting line */}
              {i < MILESTONE_ORDER.length - 1 && (
                <div className="flex-1 pt-[18px] px-1">
                  <div
                    className="milestone-line h-0.5 w-full rounded-full"
                    style={{
                      backgroundColor: reachedSet.has(MILESTONE_ORDER[i + 1])
                        ? STATUS_COLORS[MILESTONE_ORDER[i + 1]]
                        : "#E5E7EB",
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Mobile milestone bar - vertical */}
      <div className="flex flex-col gap-2 sm:hidden">
        {MILESTONE_ORDER.map((status, i) => {
          const reached = reachedSet.has(status);
          const color = reached ? STATUS_COLORS[status] : "#D1D5DB";
          return (
            <div key={status} className="flex items-center gap-3">
              <div
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                style={{
                  backgroundColor: reached ? color : "#F3F4F6",
                  color: reached ? "white" : "#9CA3AF",
                }}
              >
                {reached ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
              </div>
              <span
                className="text-sm font-medium"
                style={{ color: reached ? color : "#9CA3AF" }}
              >
                {translate(MILESTONE_KEYS[status], locale)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Error state banner */}
      {isErrorState && (
        <div
          className="mt-4 rounded-lg px-4 py-3 text-center text-sm font-medium animate-fade-in"
          style={{
            backgroundColor: `${STATUS_COLORS[currentStatus]}10`,
            color: STATUS_COLORS[currentStatus],
            border: `1px solid ${STATUS_COLORS[currentStatus]}25`,
          }}
        >
          {currentStatus === TrackingStatus.FAILED &&
            (locale === "zh" ? "投递失败" : "Delivery Failed")}
          {currentStatus === TrackingStatus.RETURNED &&
            (locale === "zh" ? "包裹已退回" : "Package Returned")}
          {currentStatus === TrackingStatus.EXPIRED &&
            (locale === "zh" ? "轨迹已过期" : "Tracking Expired")}
        </div>
      )}
    </div>
  );
}
