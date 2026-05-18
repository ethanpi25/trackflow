// Tracking status enum - 10 standard cross-border logistics statuses
export enum TrackingStatus {
  PENDING = 'PENDING',
  PICKED_UP = 'PICKED_UP',
  IN_TRANSIT = 'IN_TRANSIT',
  EXPORT_CUSTOMS = 'EXPORT_CUSTOMS',
  IMPORT_CUSTOMS = 'IMPORT_CUSTOMS',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  RETURNED = 'RETURNED',
  EXPIRED = 'EXPIRED',
}

// Data source identifier
export type DataSource =
  | '17track'
  | 'aftership'
  | 'trackingmore'
  | 'dhl_direct'
  | 'fedex_direct'
  | 'ups_direct';

// Location info
export interface Location {
  city: string;
  state?: string;
  country: string;
  countryCode: string; // ISO 3166-1 alpha-2
  postalCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// A single tracking event
export interface TrackingEvent {
  timestamp: string; // ISO 8601 UTC
  location: Location;
  statusCode: TrackingStatus;
  descriptionZh: string;
  descriptionEn: string;
  rawStatus: string; // carrier's original status
}

// Full shipment record
export interface Shipment {
  trackingNumber: string;
  carrierCode: string;
  carrierName: string;
  origin: Location;
  destination: Location;
  currentStatus: TrackingStatus;
  estimatedDelivery?: string;
  actualDelivery?: string;
  events: TrackingEvent[];
  metadata: ShipmentMetadata;
  createdAt: string;
  updatedAt: string;
}

export interface ShipmentMetadata {
  dataSource: DataSource;
  lastSynced: string;
  confidence: number; // 0-100
}

// API response types
export interface TrackResponse {
  success: boolean;
  data?: Shipment;
  error?: string;
}

export interface BatchTrackResponse {
  success: boolean;
  results: Shipment[];
  failed: Array<{
    trackingNumber: string;
    error: string;
  }>;
}

// User tiers
export enum UserTier {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

// Rate limit config per tier
export interface TierConfig {
  queriesPerDay: number | null; // null = unlimited
  queriesPerMinute: number;
  batchSize: number;
  historyDays: number | null; // null = unlimited
  webhookEnabled: boolean;
  exportFormats: string[];
}
