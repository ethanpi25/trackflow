import type { Shipment, TrackingEvent } from '@logistic/shared';

// Base interface for all carrier adapters
export interface CarrierAdapter {
  readonly name: string;
  readonly code: string;

  /**
   * Fetch tracking info for a given tracking number.
   * Returns null if tracking number not found.
   */
  track(trackingNumber: string, carrierCode?: string): Promise<Shipment | null>;

  /**
   * Check if this adapter supports the given carrier code.
   */
  supports(carrierCode: string): boolean;
}

// Normalized response from carrier APIs before full Shipment mapping
export interface RawTrackingResult {
  trackingNumber: string;
  carrierCode: string;
  carrierName: string;
  originCountry?: string;
  destinationCountry?: string;
  currentStatus: string;
  estimatedDelivery?: string;
  events: RawTrackingEvent[];
}

export interface RawTrackingEvent {
  timestamp: string;
  location: string;
  country?: string;
  status: string;
  description: string;
}
