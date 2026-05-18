"use client";

import type { TrackingEvent } from "@logistic/shared";
import { STATUS_COLORS, translateStatus, t } from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";
import { MapPin } from "lucide-react";

interface TrackingTimelineProps {
  events: TrackingEvent[];
}

function formatFullDate(iso: string, locale: string): string {
  const d = new Date(iso);
  if (locale === "zh") {
    return d.toLocaleString("zh-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  }
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function formatLocation(
  loc: { city: string; country: string },
  locale: string
): string {
  if (locale === "zh") return `${loc.country} ${loc.city}`;
  return `${loc.city}, ${loc.country}`;
}

export function TrackingTimeline({ events }: TrackingTimelineProps) {
  const { locale } = useLocale();

  if (events.length === 0) {
    return (
      <div className="flex flex-col items-center gap-3 py-12 text-text-tertiary">
        <MapPin className="h-8 w-8" />
        <p className="text-sm">{t("result.notFound", locale)}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {events.map((event, i) => {
        const color = STATUS_COLORS[event.statusCode];
        const isFirst = i === 0;
        const description =
          locale === "zh" ? event.descriptionZh : event.descriptionEn;

        return (
          <div
            key={i}
            className="timeline-item relative flex gap-4 pb-8 last:pb-0"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            {/* Vertical line */}
            {i < events.length - 1 && (
              <div
                className="absolute left-[13px] top-8 h-[calc(100%-24px)] w-px"
                style={{ backgroundColor: "#E5E7EB" }}
              />
            )}

            {/* Dot */}
            <div className="relative z-10 flex-shrink-0 pt-0.5">
              <div
                className={`timeline-dot flex h-7 w-7 items-center justify-center rounded-full ${isFirst ? "current" : ""}`}
                style={{
                  backgroundColor: isFirst ? color : "white",
                  border: `2px solid ${color}`,
                  boxShadow: isFirst ? `0 0 0 4px ${color}15` : undefined,
                }}
              >
                {isFirst && (
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse-dot" />
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 pt-0.5">
              <p
                className={`text-sm leading-snug ${
                  isFirst
                    ? "font-semibold text-text-primary"
                    : "text-text-secondary"
                }`}
              >
                {description}
              </p>
              <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-tertiary">
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {formatLocation(event.location, locale)}
                </span>
                <span>{formatFullDate(event.timestamp, locale)}</span>
                <span
                  className="rounded px-1.5 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: `${color}10`,
                    color: color,
                  }}
                >
                  {translateStatus(event.statusCode, locale)}
                </span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
