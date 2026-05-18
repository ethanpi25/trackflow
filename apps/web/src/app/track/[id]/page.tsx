"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import type { Shipment } from "@logistic/shared";
import { t, CARRIERS } from "@logistic/shared";
import { useLocale } from "@/lib/locale-context";
import { trackShipment } from "@/lib/api";
import { StatusBadge } from "@/components/StatusBadge";
import { MilestoneBar } from "@/components/MilestoneBar";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import { SearchBox } from "@/components/SearchBox";
import {
  MapPin,
  Navigation,
  Calendar,
  Clock,
  Truck,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";

export default function TrackResultPage() {
  const params = useParams<{ id: string }>();
  const trackingNumber = decodeURIComponent(params.id);
  const { locale } = useLocale();

  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await trackShipment(trackingNumber);
        if (cancelled) return;

        if (res.success && res.data) {
          setShipment(res.data);
        } else {
          setError(res.error ?? t("result.notFound", locale));
        }
      } catch {
        if (!cancelled) {
          setError(
            locale === "zh"
              ? "查询失败，请稍后重试"
              : "Failed to fetch tracking info. Please try again."
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [trackingNumber, locale]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(trackingNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const carrierName = shipment
    ? locale === "zh"
      ? (CARRIERS as Record<string, { nameZh: string }>)[shipment.carrierCode]
          ?.nameZh ?? shipment.carrierName
      : shipment.carrierName
    : "";

  const reachedStatuses = shipment
    ? [...new Set(shipment.events.map((e) => e.statusCode))]
    : [];

  const transitDays =
    shipment?.events.length && shipment.events.length > 1
      ? Math.max(
          1,
          Math.ceil(
            (new Date(shipment.events[0].timestamp).getTime() -
              new Date(
                shipment.events[shipment.events.length - 1].timestamp
              ).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 0;

  return (
    <div className="min-h-[60vh] bg-surface">
      {/* Top bar with search */}
      <div className="border-b border-border-default bg-surface-raised">
        <div className="mx-auto flex max-w-4xl items-center gap-4 px-6 py-4">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-text-secondary hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            {locale === "zh" ? "返回" : "Back"}
          </Link>
          <div className="flex-1">
            <SearchBox variant="compact" />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-6 py-8">
        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center gap-4 py-20 animate-fade-in">
            <div className="h-10 w-10 animate-spin rounded-full border-3 border-primary border-t-transparent" />
            <p className="text-sm text-text-tertiary">
              {locale === "zh" ? "正在查询轨迹信息..." : "Fetching tracking info..."}
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="animate-fade-in-up rounded-xl border border-error/20 bg-error-light px-8 py-12 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-error/10">
              <MapPin className="h-6 w-6 text-error" />
            </div>
            <p className="text-base font-medium text-error">{error}</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-1 text-sm text-primary hover:underline"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              {locale === "zh" ? "返回首页重新查询" : "Go back and try again"}
            </Link>
          </div>
        )}

        {/* Result */}
        {!loading && shipment && (
          <div className="space-y-6 animate-fade-in-up">
            {/* Tracking number header */}
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-bold text-text-primary tracking-tight">
                {trackingNumber}
              </h1>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 rounded-md border border-border-default px-2 py-1 text-xs text-text-tertiary transition-colors hover:border-primary hover:text-primary"
              >
                {copied ? (
                  <>
                    <Check className="h-3 w-3" />
                    {locale === "zh" ? "已复制" : "Copied"}
                  </>
                ) : (
                  <>
                    <Copy className="h-3 w-3" />
                    {locale === "zh" ? "复制" : "Copy"}
                  </>
                )}
              </button>
              <StatusBadge status={shipment.currentStatus} />
            </div>

            {/* Summary card */}
            <div className="card p-6">
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                <InfoItem
                  icon={Truck}
                  label={t("result.carrier", locale)}
                  value={carrierName}
                />
                <InfoItem
                  icon={Navigation}
                  label={t("result.origin", locale)}
                  value={`${shipment.origin.city}, ${shipment.origin.country}`}
                />
                <InfoItem
                  icon={MapPin}
                  label={t("result.destination", locale)}
                  value={`${shipment.destination.city}, ${shipment.destination.country}`}
                />
                {shipment.estimatedDelivery && (
                  <InfoItem
                    icon={Calendar}
                    label={t("result.estimated", locale)}
                    value={new Date(shipment.estimatedDelivery).toLocaleDateString(
                      locale === "zh" ? "zh-CN" : "en-US"
                    )}
                  />
                )}
                {!shipment.estimatedDelivery && transitDays > 0 && (
                  <InfoItem
                    icon={Clock}
                    label={t("result.days", locale)}
                    value={`${transitDays} ${locale === "zh" ? "天" : "days"}`}
                  />
                )}
              </div>
            </div>

            {/* Milestone bar */}
            <div className="card p-6">
              <MilestoneBar
                currentStatus={shipment.currentStatus}
                reachedStatuses={reachedStatuses}
              />
            </div>

            {/* Timeline */}
            <div className="card p-6">
              <h2 className="mb-5 flex items-center gap-2 text-sm font-semibold text-text-primary">
                <Clock className="h-4 w-4 text-text-tertiary" />
                {t("result.timeline", locale)}
              </h2>
              <TrackingTimeline events={shipment.events} />
            </div>

            {/* Data source footer */}
            <div className="text-center text-xs text-text-tertiary">
              {locale === "zh" ? "数据来源: " : "Data source: "}
              {shipment.metadata.dataSource} &middot;{" "}
              {locale === "zh" ? "最后同步: " : "Last sync: "}
              {new Date(shipment.metadata.lastSynced).toLocaleString(
                locale === "zh" ? "zh-CN" : "en-US"
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoItem({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-xs text-text-tertiary">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="mt-1 text-sm font-medium text-text-primary">{value}</p>
    </div>
  );
}
