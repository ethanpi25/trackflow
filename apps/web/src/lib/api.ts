import type { TrackResponse, BatchTrackResponse } from "@logistic/shared";

const API_BASE = "/api/v1";

export async function trackShipment(
  trackingNumber: string
): Promise<TrackResponse> {
  const res = await fetch(`${API_BASE}/track/${encodeURIComponent(trackingNumber)}`);
  return res.json();
}

export async function trackBatch(
  trackingNumbers: string[]
): Promise<BatchTrackResponse> {
  const res = await fetch(`${API_BASE}/track/batch`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ trackingNumbers }),
  });
  return res.json();
}
