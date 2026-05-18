import type { TrackResponse, BatchTrackResponse } from "@logistic/shared";

const API_BASE = "/api/v1";

export async function trackShipment(
  trackingNumber: string
): Promise<TrackResponse> {
  const res = await fetch(
    `${API_BASE}/track/${encodeURIComponent(trackingNumber)}`
  );

  if (!res.ok) {
    return {
      success: false,
      error: `查询服务暂时不可用（HTTP ${res.status}），请稍后重试`,
    };
  }

  try {
    return (await res.json()) as TrackResponse;
  } catch {
    return {
      success: false,
      error: "服务器返回了无效数据，请稍后重试",
    };
  }
}

export async function trackBatch(
  trackingNumbers: string[]
): Promise<BatchTrackResponse> {
  const res = await fetch(`${API_BASE}/track/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackingNumbers }),
  });

  if (!res.ok) {
    return {
      success: false,
      results: [],
      failed: [{ trackingNumber: "batch", error: `批量查询失败（HTTP ${res.status}）` }],
    };
  }

  try {
    return (await res.json()) as BatchTrackResponse;
  } catch {
    return {
      success: false,
      results: [],
      failed: [{ trackingNumber: "batch", error: "服务器返回了无效数据" }],
    };
  }
}
