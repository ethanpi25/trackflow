// ---------------------------------------------------------------------------
// Mock Channel Quotes — Mock data layer for Buyer Agent
// Provides shipping channel comparison data for small/medium parcels and bulk cargo
// ---------------------------------------------------------------------------

/** A single channel quote for parcel shipping */
export interface ChannelQuote {
  provider: string;
  service: string;
  mode: 'air' | 'sea' | 'rail' | 'express';
  cost_per_kg: number;
  transit_days: [number, number];
  on_time_rate: number;
  supports_special_cargo: boolean;
}

/** A single channel quote for bulk / FCL shipping */
export interface BulkChannelQuote {
  provider: string;
  service: string;
  mode: 'sea_fcl' | 'rail' | 'air';
  rate: number;
  rate_unit: string;
  transit_days: [number, number];
  notes: string;
}

// ---------------------------------------------------------------------------
// Mock parcel channel data (small & medium packages)
// ---------------------------------------------------------------------------

const PARCEL_CHANNELS: ChannelQuote[] = [
  {
    provider: 'YunTu Europe',
    service: 'Sea Economy',
    mode: 'sea',
    cost_per_kg: 2.5,
    transit_days: [12, 16],
    on_time_rate: 94,
    supports_special_cargo: false,
  },
  {
    provider: '4PX',
    service: 'Economy Sea',
    mode: 'sea',
    cost_per_kg: 1.8,
    transit_days: [15, 20],
    on_time_rate: 88,
    supports_special_cargo: false,
  },
  {
    provider: 'DHL',
    service: 'Express',
    mode: 'express',
    cost_per_kg: 12.0,
    transit_days: [5, 7],
    on_time_rate: 99,
    supports_special_cargo: true,
  },
  {
    provider: 'YunTu',
    service: 'Air Standard',
    mode: 'air',
    cost_per_kg: 8.5,
    transit_days: [8, 12],
    on_time_rate: 95,
    supports_special_cargo: true,
  },
  {
    provider: 'FedEx',
    service: 'International Priority',
    mode: 'air',
    cost_per_kg: 14.0,
    transit_days: [3, 5],
    on_time_rate: 98,
    supports_special_cargo: true,
  },
];

// ---------------------------------------------------------------------------
// Mock bulk channel data (FCL / large shipments)
// ---------------------------------------------------------------------------

const BULK_CHANNELS: BulkChannelQuote[] = [
  {
    provider: 'Alibaba Logistics',
    service: 'Sea FCL',
    mode: 'sea_fcl',
    rate: 4200,
    rate_unit: 'container',
    transit_days: [22, 28],
    notes: 'Pickup included',
  },
  {
    provider: 'Eco Partner A',
    service: 'Sea FCL',
    mode: 'sea_fcl',
    rate: 4650,
    rate_unit: 'container',
    transit_days: [25, 32],
    notes: 'Insurance included',
  },
  {
    provider: 'Eco Partner B',
    service: 'Rail FCL',
    mode: 'rail',
    rate: 5100,
    rate_unit: 'container',
    transit_days: [18, 22],
    notes: 'China-Europe Railway',
  },
  {
    provider: 'DHL Global Forwarding',
    service: 'Air Priority',
    mode: 'air',
    rate: 12800,
    rate_unit: 'shipment',
    transit_days: [5, 7],
    notes: 'Priority handling',
  },
];

// Weight threshold: above this we return bulk quotes instead of parcel quotes
const BULK_WEIGHT_THRESHOLD_KG = 500;

// Channels available per destination region (subset filtering)
const CHANNEL_AVAILABILITY: Record<string, number[]> = {
  EU: [0, 1, 2, 3, 4],
  US: [1, 2, 3, 4],
  SA: [0, 1, 2, 3],
  DEFAULT: [0, 1, 2, 3, 4],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get parcel channel quotes for a given destination and mode.
 * Filters by mode and destination availability, then sorts by cost.
 */
export function getChannelQuotes(
  destinationCountry: string,
  mode: 'air' | 'sea' | 'rail' | 'express',
  weight_kg: number,
): ChannelQuote[] {
  // If weight exceeds threshold, return empty — caller should use getBulkChannelQuotes
  if (weight_kg > BULK_WEIGHT_THRESHOLD_KG) return [];

  const region = resolveRegion(destinationCountry);
  const allowedIndices = CHANNEL_AVAILABILITY[region] ?? CHANNEL_AVAILABILITY['DEFAULT'];

  return PARCEL_CHANNELS
    .filter((_ch, idx) => allowedIndices.includes(idx))
    .filter((ch) => ch.mode === mode)
    .sort((a, b) => a.cost_per_kg - b.cost_per_kg);
}

/**
 * Get bulk / FCL channel quotes.
 * Returns all bulk channels sorted by rate.
 */
export function getBulkChannelQuotes(
  _destinationCountry: string,
): BulkChannelQuote[] {
  return [...BULK_CHANNELS].sort((a, b) => a.rate - b.rate);
}

/**
 * Resolve a country code to a regional group used for channel availability.
 */
function resolveRegion(country: string): string {
  const upper = country.toUpperCase();
  const EU_COUNTRIES = new Set([
    'DE', 'FR', 'NL', 'IT', 'ES', 'BE', 'AT', 'PL', 'PT', 'GR',
    'CZ', 'SE', 'DK', 'FI', 'IE', 'HU', 'RO', 'BG', 'HR', 'SK',
    'SI', 'LT', 'LV', 'EE', 'LU', 'MT', 'CY',
  ]);
  if (EU_COUNTRIES.has(upper) || upper === 'UK' || upper === 'GB') return 'EU';
  if (upper === 'US') return 'US';
  if (upper === 'SA' || upper === 'AE') return 'SA';
  return 'DEFAULT';
}
