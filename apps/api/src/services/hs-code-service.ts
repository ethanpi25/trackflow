// ---------------------------------------------------------------------------
// HS Code Service — Mock data layer for Buyer Agent
// Provides tariff lookup by HS code and inference from product description
// ---------------------------------------------------------------------------

/** Duty information for a specific HS code + destination pair */
export interface DutyInfo {
  hs_code: string;
  description: string;
  duty_rate: number;
  vat_rate: number;
}

/** Inference result from a product description */
export interface InferenceResult {
  hs_code: string;
  description: string;
  confidence: 'high' | 'medium' | 'low';
}

// ---------------------------------------------------------------------------
// Internal data structures
// ---------------------------------------------------------------------------

interface HsCodeEntry {
  hs_code: string;
  description: string;
  /** duty rate per destination country code (ISO 3166-1 alpha-2) */
  duties: Record<string, { duty_rate: number; vat_rate: number }>;
  /** keywords used for inference (lowercase) */
  keywords: string[];
}

// ---------------------------------------------------------------------------
// Mock HS code database
// ---------------------------------------------------------------------------

const HS_CODE_DB: HsCodeEntry[] = [
  {
    hs_code: '3926.90',
    description: 'Phone cases',
    duties: {
      EU: { duty_rate: 6.5, vat_rate: 20 },
      US: { duty_rate: 3.4, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['phone case', '手机壳', 'case', 'cover'],
  },
  {
    hs_code: '8518.30',
    description: 'Bluetooth earbuds',
    duties: {
      EU: { duty_rate: 4.5, vat_rate: 20 },
      US: { duty_rate: 0, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['bluetooth', 'earbuds', 'headphones', '耳机', 'earphone'],
  },
  {
    hs_code: '9405.40',
    description: 'LED lights',
    duties: {
      EU: { duty_rate: 3.7, vat_rate: 20 },
      US: { duty_rate: 3.9, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['led', 'light', 'lamp', '灯', 'lighting', 'illumination'],
  },
  {
    hs_code: '9403.60',
    description: 'Wooden furniture',
    duties: {
      EU: { duty_rate: 2.5, vat_rate: 20 },
      US: { duty_rate: 0, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['furniture', '家具', 'wooden', 'table', 'chair', 'desk', 'cabinet'],
  },
  {
    hs_code: '6109.10',
    description: 'Cotton clothing',
    duties: {
      EU: { duty_rate: 12, vat_rate: 20 },
      US: { duty_rate: 8.5, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['clothing', 'apparel', 'shirt', 't-shirt', 'garment', '服装', '衣服'],
  },
  {
    hs_code: '9503.00',
    description: 'Toys',
    duties: {
      EU: { duty_rate: 4.7, vat_rate: 20 },
      US: { duty_rate: 0, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['toy', '玩具', 'plaything', 'doll', 'game'],
  },
  {
    hs_code: '8504.40',
    description: 'Power adapters',
    duties: {
      EU: { duty_rate: 2.7, vat_rate: 20 },
      US: { duty_rate: 1.5, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['adapter', 'charger', 'power supply', '适配器', '充电器'],
  },
  {
    hs_code: '8544.42',
    description: 'Cables and connectors',
    duties: {
      EU: { duty_rate: 3.5, vat_rate: 20 },
      US: { duty_rate: 2.6, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['cable', 'connector', '线缆', 'wire', 'usb cable', 'hdmi'],
  },
  {
    hs_code: '8471.30',
    description: 'Laptops and computers',
    duties: {
      EU: { duty_rate: 0, vat_rate: 20 },
      US: { duty_rate: 0, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['laptop', 'computer', 'notebook', '笔记本', '电脑', 'pc'],
  },
  {
    hs_code: '8525.89',
    description: 'Security cameras',
    duties: {
      EU: { duty_rate: 0, vat_rate: 20 },
      US: { duty_rate: 0, vat_rate: 0 },
      SA: { duty_rate: 5, vat_rate: 15 },
    },
    keywords: ['camera', '摄像头', 'security camera', 'ip camera', 'cctv', '监控'],
  },
];

// Map country codes to regional groups for fallback
const COUNTRY_ALIASES: Record<string, string> = {
  DE: 'EU',
  FR: 'EU',
  NL: 'EU',
  IT: 'EU',
  ES: 'EU',
  BE: 'EU',
  AT: 'EU',
  PL: 'EU',
  GB: 'EU', // UK treated as EU for tariff purposes in mock
  UK: 'EU',
  SA: 'SA',
  AE: 'SA', // UAE grouped with Saudi for simplicity
  US: 'US',
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Look up duty information by HS code and destination country.
 * Returns null if the HS code or country is not found in the mock database.
 */
export function lookupByCode(
  hsCode: string,
  destinationCountry: string,
): DutyInfo | null {
  const normalized = hsCode.replace(/\s/g, '').trim();
  const entry = HS_CODE_DB.find((e) => e.hs_code === normalized);
  if (!entry) return null;

  const region = COUNTRY_ALIASES[destinationCountry.toUpperCase()] ?? destinationCountry.toUpperCase();
  const duty = entry.duties[region];
  if (!duty) return null;

  return {
    hs_code: entry.hs_code,
    description: entry.description,
    duty_rate: duty.duty_rate,
    vat_rate: duty.vat_rate,
  };
}

/**
 * Infer HS code from a product description using keyword matching.
 * Returns the best match with a confidence level, or null if no match.
 */
export function inferFromDescription(description: string): InferenceResult | null {
  const lower = description.toLowerCase().trim();
  if (!lower) return null;

  let bestEntry: HsCodeEntry | null = null;
  let bestScore = 0;

  for (const entry of HS_CODE_DB) {
    let score = 0;
    for (const keyword of entry.keywords) {
      if (lower.includes(keyword)) {
        // Longer keyword matches are weighted more heavily
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestEntry = entry;
    }
  }

  if (!bestEntry || bestScore === 0) return null;

  // Confidence heuristic based on match quality
  const confidence: 'high' | 'medium' | 'low' =
    bestScore >= 8 ? 'high' : bestScore >= 4 ? 'medium' : 'low';

  return {
    hs_code: bestEntry.hs_code,
    description: bestEntry.description,
    confidence,
  };
}
