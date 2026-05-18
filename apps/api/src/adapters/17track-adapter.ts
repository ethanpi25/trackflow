import type { Shipment, TrackingEvent, Location } from '@logistic/shared';
import { TrackingStatus } from '@logistic/shared';
import type { CarrierAdapter } from './base-adapter.js';

const API_BASE = 'https://api.17track.net/track/v2.2';

// 17Track status codes → standard TrackingStatus
const STATUS_MAP: Record<number, TrackingStatus> = {
  0: TrackingStatus.PENDING,       // Not Found
  10: TrackingStatus.IN_TRANSIT,   // In Transit
  20: TrackingStatus.PICKED_UP,    // Expired (pick up)
  30: TrackingStatus.FAILED,       // Pick Up Failed
  35: TrackingStatus.IN_TRANSIT,   // Undelivered
  40: TrackingStatus.DELIVERED,    // Delivered
  50: TrackingStatus.FAILED,       // Alert (exception)
};

// 17Track sub-status for customs detection
const CUSTOMS_KEYWORDS = ['customs', 'clearance', '清关', '海关', 'import', 'export', '出口', '进口'];

export class Track17Adapter implements CarrierAdapter {
  readonly name = '17Track';
  readonly code = '17track';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  supports(carrierCode: string): boolean {
    // 17Track is strong for China-origin carriers
    const chinaCarriers = [
      'ems', 'postal', 'china_post', 'yunexpress', 'yanwen',
      '4px', 'cainiao', 'sf_express', 'sto', 'zto', 'yto',
      'best_express', 'jd_logistics',
    ];
    return chinaCarriers.includes(carrierCode) || carrierCode === 'postal_registered';
  }

  async track(trackingNumber: string, _carrierCode?: string): Promise<Shipment | null> {
    try {
      const res = await fetch(`${API_BASE}/gettrackinfo`, {
        method: 'POST',
        headers: {
          '17token': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([{ number: trackingNumber }]),
      });

      if (!res.ok) return null;

      const data = (await res.json()) as { data?: { accepted?: Record<string, unknown>[]; rejected?: Record<string, unknown>[] } };
      const trackInfo = data.data?.accepted?.[0] ?? data.data?.rejected?.[0];
      if (!trackInfo) return null;

      return this.normalize(trackInfo, trackingNumber);
    } catch {
      return null;
    }
  }

  private normalize(raw: Record<string, unknown>, trackingNumber: string): Shipment | null {
    const track = raw.track as Record<string, unknown> | undefined;
    if (!track) return null;

    const rawEvents = (track.z as Array<Record<string, unknown>>) ?? [];
    const carrierCode = (track.carrier as string) ?? 'unknown';

    const events: TrackingEvent[] = rawEvents.map((evt) => {
      const desc = (evt.z as string) ?? '';
      const location = (evt.a as string) ?? '';

      // Detect customs status from description
      let statusCode = TrackingStatus.IN_TRANSIT;
      const descLower = desc.toLowerCase();
      if (CUSTOMS_KEYWORDS.some((kw) => descLower.includes(kw))) {
        statusCode = descLower.includes('export') || descLower.includes('出口')
          ? TrackingStatus.EXPORT_CUSTOMS
          : TrackingStatus.IMPORT_CUSTOMS;
      }

      return {
        timestamp: (evt.a as string) ?? new Date().toISOString(),
        location: {
          city: location,
          country: '',
          countryCode: '',
        },
        statusCode,
        descriptionZh: desc,
        descriptionEn: desc,
        rawStatus: String(evt.s ?? ''),
      };
    });

    const statusNum = (track.e as number) ?? 0;
    const emptyLocation: Location = { city: '', country: '', countryCode: '' };

    return {
      trackingNumber,
      carrierCode,
      carrierName: (track.carrier_name as string) ?? carrierCode,
      origin: emptyLocation,
      destination: emptyLocation,
      currentStatus: STATUS_MAP[statusNum] ?? TrackingStatus.PENDING,
      events,
      metadata: {
        dataSource: '17track',
        lastSynced: new Date().toISOString(),
        confidence: 75,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }
}
