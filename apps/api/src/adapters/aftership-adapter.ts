import type { Shipment, TrackingEvent, Location } from '@logistic/shared';
import { TrackingStatus } from '@logistic/shared';
import type { CarrierAdapter } from './base-adapter.js';

const API_BASE = 'https://api.aftership.com/v4';

// AfterShip status tag → standard TrackingStatus
const STATUS_MAP: Record<string, TrackingStatus> = {
  'Pending': TrackingStatus.PENDING,
  'InfoReceived': TrackingStatus.PENDING,
  'InTransit': TrackingStatus.IN_TRANSIT,
  'OutForDelivery': TrackingStatus.OUT_FOR_DELIVERY,
  'AttemptFail': TrackingStatus.FAILED,
  'Delivered': TrackingStatus.DELIVERED,
  'AvailableForPickup': TrackingStatus.OUT_FOR_DELIVERY,
  'Exception': TrackingStatus.FAILED,
  'Expired': TrackingStatus.EXPIRED,
  'ReversePickup': TrackingStatus.RETURNED,
  'ReverseDelivered': TrackingStatus.RETURNED,
  'ReverseInTransit': TrackingStatus.RETURNED,
};

export class AftershipAdapter implements CarrierAdapter {
  readonly name = 'AfterShip';
  readonly code = 'aftership';
  private apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  supports(_carrierCode: string): boolean {
    // AfterShip supports 900+ carriers, acts as universal fallback
    return true;
  }

  async track(trackingNumber: string, carrierSlug?: string): Promise<Shipment | null> {
    try {
      // If no carrier slug, try to detect it first
      if (!carrierSlug) {
        carrierSlug = await this.detectCarrier(trackingNumber);
      }

      const res = await fetch(`${API_BASE}/trackings/${carrierSlug}/${trackingNumber}`, {
        headers: {
          'aftership-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        // If tracking not found, try creating it first
        if (res.status === 404) {
          return this.createAndTrack(trackingNumber, carrierSlug);
        }
        return null;
      }

      const json = (await res.json()) as { data?: { tracking?: Record<string, unknown> } };
      return this.normalize(json.data?.tracking);
    } catch {
      return null;
    }
  }

  private async detectCarrier(trackingNumber: string): Promise<string | undefined> {
    try {
      const res = await fetch(`${API_BASE}/couriers/detect`, {
        method: 'POST',
        headers: {
          'aftership-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tracking: { tracking_number: trackingNumber } }),
      });
      if (!res.ok) return undefined;
      const json = (await res.json()) as { data?: { couriers?: Array<{ slug: string }> } };
      return json.data?.couriers?.[0]?.slug;
    } catch {
      return undefined;
    }
  }

  private async createAndTrack(trackingNumber: string, slug?: string): Promise<Shipment | null> {
    try {
      const body: Record<string, unknown> = { tracking: { tracking_number: trackingNumber } };
      if (slug) (body.tracking as Record<string, unknown>).slug = slug;

      const res = await fetch(`${API_BASE}/trackings`, {
        method: 'POST',
        headers: {
          'aftership-api-key': this.apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (!res.ok) return null;
      const json = (await res.json()) as { data?: { tracking?: Record<string, unknown> } };
      return this.normalize(json.data?.tracking);
    } catch {
      return null;
    }
  }

  private normalize(raw: Record<string, unknown> | undefined): Shipment | null {
    if (!raw) return null;

    const checkpoints = (raw.checkpoints as Array<Record<string, unknown>>) ?? [];
    const events: TrackingEvent[] = checkpoints.map((cp) => ({
      timestamp: (cp.checkpoint_time as string) ?? new Date().toISOString(),
      location: {
        city: (cp.city as string) ?? '',
        country: (cp.country_name as string) ?? '',
        countryCode: (cp.country_iso3 as string)?.substring(0, 2) ?? '',
      },
      statusCode: STATUS_MAP[cp.tag as string] ?? TrackingStatus.IN_TRANSIT,
      descriptionZh: (cp.message as string) ?? '',
      descriptionEn: (cp.message as string) ?? '',
      rawStatus: (cp.tag as string) ?? '',
    }));

    const originInfo = raw.origin_country_iso3 as string | undefined;
    const destInfo = raw.destination_country_iso3 as string | undefined;

    const emptyLocation: Location = { city: '', country: '', countryCode: '' };

    return {
      trackingNumber: raw.tracking_number as string,
      carrierCode: (raw.slug as string) ?? 'unknown',
      carrierName: (raw.courier_name as string) ?? (raw.slug as string) ?? 'Unknown',
      origin: originInfo
        ? { city: '', country: '', countryCode: originInfo.substring(0, 2) }
        : emptyLocation,
      destination: destInfo
        ? { city: '', country: '', countryCode: destInfo.substring(0, 2) }
        : emptyLocation,
      currentStatus: STATUS_MAP[raw.tag as string] ?? TrackingStatus.PENDING,
      estimatedDelivery: raw.expected_delivery as string | undefined,
      events,
      metadata: {
        dataSource: 'aftership',
        lastSynced: new Date().toISOString(),
        confidence: 70,
      },
      createdAt: (raw.created_at as string) ?? new Date().toISOString(),
      updatedAt: (raw.updated_at as string) ?? new Date().toISOString(),
    };
  }
}
