import type { Shipment } from '@logistic/shared';
import { CACHE_TTL, TrackingStatus } from '@logistic/shared';
import type { CarrierAdapter } from '../adapters/base-adapter.js';
import { AftershipAdapter } from '../adapters/aftership-adapter.js';
import { Track17Adapter } from '../adapters/17track-adapter.js';
import { MockAdapter } from '../adapters/mock-adapter.js';
import { detectCarrier, isValidTrackingNumber } from './carrier-detect.js';
import type Redis from 'ioredis';

export class TrackingService {
  private adapters: CarrierAdapter[];
  private fallbackAdapter: CarrierAdapter;
  private redis: Redis | null;

  constructor(redis: Redis | null) {
    this.redis = redis;

    // Build adapter chain based on available API keys
    this.adapters = [];

    const track17Key = process.env.TRACK17_API_KEY;
    if (track17Key) {
      this.adapters.push(new Track17Adapter(track17Key));
    }

    const aftershipKey = process.env.AFTERSHIP_API_KEY;
    if (aftershipKey) {
      this.adapters.push(new AftershipAdapter(aftershipKey));
    }

    // If no API keys configured, use mock adapter for development
    if (this.adapters.length === 0) {
      this.adapters.push(new MockAdapter());
    }

    // AfterShip or Mock as universal fallback
    this.fallbackAdapter = this.adapters[this.adapters.length - 1];
  }

  async track(trackingNumber: string): Promise<Shipment | null> {
    const cleaned = trackingNumber.trim().toUpperCase();

    if (!isValidTrackingNumber(cleaned)) {
      return null;
    }

    // 1. Check cache
    const cached = await this.getFromCache(cleaned);
    if (cached) return cached;

    // 2. Detect carrier
    const carrierCode = detectCarrier(cleaned);

    // 3. Route to best adapter
    const shipment = await this.routeAndFetch(cleaned, carrierCode);
    if (!shipment) return null;

    // 4. Cache result
    await this.setCache(cleaned, shipment);

    return shipment;
  }

  async trackBatch(trackingNumbers: string[]): Promise<{
    results: Shipment[];
    failed: Array<{ trackingNumber: string; error: string }>;
  }> {
    const results: Shipment[] = [];
    const failed: Array<{ trackingNumber: string; error: string }> = [];

    // Process in parallel with concurrency limit
    const concurrency = 5;
    for (let i = 0; i < trackingNumbers.length; i += concurrency) {
      const batch = trackingNumbers.slice(i, i + concurrency);
      const promises = batch.map(async (tn) => {
        try {
          const result = await this.track(tn);
          if (result) {
            results.push(result);
          } else {
            failed.push({ trackingNumber: tn, error: 'Tracking number not found' });
          }
        } catch {
          failed.push({ trackingNumber: tn, error: 'Query failed' });
        }
      });
      await Promise.all(promises);
    }

    return { results, failed };
  }

  private async routeAndFetch(trackingNumber: string, carrierCode: string): Promise<Shipment | null> {
    // Try adapters that specifically support this carrier first
    for (const adapter of this.adapters) {
      if (adapter.supports(carrierCode)) {
        const result = await adapter.track(trackingNumber, carrierCode);
        if (result) return result;
      }
    }

    // Fallback to universal adapter
    const result = await this.fallbackAdapter.track(trackingNumber, carrierCode);
    return result;
  }

  private async getFromCache(trackingNumber: string): Promise<Shipment | null> {
    if (!this.redis) return null;
    try {
      const cached = await this.redis.get(`track:${trackingNumber}`);
      if (!cached) return null;
      return JSON.parse(cached) as Shipment;
    } catch {
      return null;
    }
  }

  private async setCache(trackingNumber: string, shipment: Shipment): Promise<void> {
    if (!this.redis) return;
    try {
      const ttl = CACHE_TTL[shipment.currentStatus] ?? 300;
      await this.redis.setex(`track:${trackingNumber}`, ttl, JSON.stringify(shipment));
    } catch {
      // Cache write failure is non-fatal
    }
  }
}
