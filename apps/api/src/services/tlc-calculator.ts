/**
 * TLC (Total Landed Cost) Calculator Service
 *
 * Formula:
 *   CIF = FOB + Freight + Insurance
 *   Import Duty = CIF × HS Duty Rate
 *   VAT/GST = (CIF + Import Duty) × VAT Rate
 *   Customs Fees = Fixed estimate by destination country
 *   Inland Transport = Estimated based on destination
 *   TLC = CIF + Import Duty + VAT/GST + Customs Fees + Inland Transport
 */

// --- VAT/GST rates by country ---
const VAT_RATES: Record<string, number> = {
  DE: 0.19, // Germany
  FR: 0.20, // France
  GB: 0.20, // United Kingdom
  SA: 0.15, // Saudi Arabia
  AE: 0.05, // UAE
  US: 0.00, // USA
  AU: 0.10, // Australia
  JP: 0.10, // Japan
};

// --- HS code duty rates by destination region ---
interface HsDutyEntry {
  description: string;
  dutyRates: Record<string, number>; // country code → rate
}

const HS_DUTY_TABLE: Record<string, HsDutyEntry> = {
  '3926.90': {
    description: '手机壳 / Plastic cases',
    dutyRates: { EU: 0.065, US: 0.034 },
  },
  '8518.30': {
    description: '蓝牙耳机 / Bluetooth headphones',
    dutyRates: { EU: 0.045, US: 0.0 },
  },
  '9405.40': {
    description: 'LED灯 / LED lights',
    dutyRates: { EU: 0.037, US: 0.039 },
  },
};

// --- Freight cost per kg by mode and region ---
interface FreightRange {
  min: number;
  max: number;
}

const FREIGHT_RATES: Record<string, FreightRange> = {
  'air-US': { min: 8, max: 12 },
  'air-EU': { min: 7, max: 10 },
  'air-default': { min: 7, max: 11 },
  'sea-US': { min: 2, max: 3 },
  'sea-EU': { min: 2, max: 3 },
  'sea-default': { min: 2, max: 3 },
  'rail-EU': { min: 3, max: 5 },
  'rail-default': { min: 3, max: 5 },
};

// --- Customs fees by destination country (in USD equivalent) ---
const CUSTOMS_FEES: Record<string, number> = {
  US: 225,
  DE: 175, // ~€160
  GB: 165, // ~£130
  SA: 133, // ~SAR 500
  FR: 175,
  AE: 150,
  AU: 180,
  JP: 160,
};

// --- Inland delivery estimates by country (USD) ---
const INLAND_DELIVERY: Record<string, number> = {
  US: 120,
  DE: 80,
  GB: 75,
  FR: 85,
  SA: 95,
  AE: 90,
  AU: 110,
  JP: 70,
};

// --- Currency by country ---
const CURRENCY_BY_COUNTRY: Record<string, string> = {
  US: 'USD',
  DE: 'EUR',
  FR: 'EUR',
  GB: 'GBP',
  SA: 'SAR',
  AE: 'AED',
  AU: 'AUD',
  JP: 'JPY',
};

// --- EU country codes ---
const EU_COUNTRIES = new Set(['DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'PT', 'IE', 'FI', 'SE', 'DK', 'PL', 'CZ', 'GR', 'HU', 'RO', 'BG', 'HR', 'SK', 'SI', 'EE', 'LV', 'LT', 'LU', 'CY', 'MT']);

export interface TlcRequest {
  cargo_description: string;
  hs_code?: string;
  unit_value: number;
  quantity: number;
  origin_country: string;
  destination_country: string;
  destination_port?: string;
  incoterms?: string;
  freight_mode: 'air' | 'sea' | 'rail';
  include_vat?: boolean;
  include_inland_delivery?: boolean;
}

export interface TlcResponse {
  fob_value: number;
  freight_cost: number;
  insurance: number;
  cif: number;
  import_duty: number;
  vat_gst: number;
  customs_fees: number;
  inland_delivery: number;
  total_landed_cost: number;
  landed_unit_price: number;
  markup_rate: number;
  hs_code: string;
  duty_rate: number;
  vat_rate: number;
  currency: string;
}

function getRegion(countryCode: string): string {
  if (EU_COUNTRIES.has(countryCode)) return 'EU';
  return countryCode;
}

function resolveDutyRate(hsCode: string | undefined, destinationCountry: string): { rate: number; resolvedHsCode: string } {
  if (hsCode && HS_DUTY_TABLE[hsCode]) {
    const entry = HS_DUTY_TABLE[hsCode];
    const region = getRegion(destinationCountry);
    const rate = entry.dutyRates[region] ?? entry.dutyRates['EU'] ?? 0.05;
    return { rate, resolvedHsCode: hsCode };
  }

  // Default duty rate for unknown HS codes
  const defaultRate = EU_COUNTRIES.has(destinationCountry) ? 0.05 : 0.035;
  return { rate: defaultRate, resolvedHsCode: hsCode ?? '9999.99' };
}

function estimateFreight(freightMode: 'air' | 'sea' | 'rail', destinationCountry: string, totalWeightKg: number): number {
  const region = getRegion(destinationCountry);
  const key = `${freightMode}-${region}`;
  const range = FREIGHT_RATES[key] ?? FREIGHT_RATES[`${freightMode}-default`] ?? { min: 5, max: 8 };

  // Use midpoint of range
  const ratePerKg = (range.min + range.max) / 2;
  return Math.round(ratePerKg * totalWeightKg * 100) / 100;
}

function estimateWeight(cargoDescription: string, quantity: number): number {
  // Rough mock: estimate ~0.3 kg per unit for consumer electronics accessories
  const lower = cargoDescription.toLowerCase();

  if (lower.includes('壳') || lower.includes('case')) {
    return quantity * 0.15;
  }
  if (lower.includes('耳机') || lower.includes('headphone') || lower.includes('earbud')) {
    return quantity * 0.25;
  }
  if (lower.includes('灯') || lower.includes('led') || lower.includes('light')) {
    return quantity * 0.2;
  }

  // Default: 0.3 kg per unit
  return quantity * 0.3;
}

export function calculateTlc(req: TlcRequest): TlcResponse {
  const destCountry = req.destination_country.toUpperCase();

  // 1. FOB value
  const fobValue = req.unit_value * req.quantity;

  // 2. Freight cost
  const estimatedWeightKg = estimateWeight(req.cargo_description, req.quantity);
  const freightCost = estimateFreight(req.freight_mode, destCountry, estimatedWeightKg);

  // 3. Insurance (~0.5% of FOB, minimum $50)
  const insurance = Math.max(fobValue * 0.005, 50);

  // 4. CIF
  const cif = fobValue + freightCost + insurance;

  // 5. Import duty
  const { rate: dutyRate, resolvedHsCode } = resolveDutyRate(req.hs_code, destCountry);
  const importDuty = cif * dutyRate;

  // 6. VAT/GST
  const vatRate = VAT_RATES[destCountry] ?? 0.1;
  const includeVat = req.include_vat !== false; // default true
  const vatGst = includeVat ? (cif + importDuty) * vatRate : 0;

  // 7. Customs fees
  const customsFees = CUSTOMS_FEES[destCountry] ?? 150;

  // 8. Inland delivery
  const includeInland = req.include_inland_delivery !== false; // default true
  const inlandDelivery = includeInland ? (INLAND_DELIVERY[destCountry] ?? 100) : 0;

  // 9. Total landed cost
  const totalLandedCost = cif + importDuty + vatGst + customsFees + inlandDelivery;

  // 10. Landed unit price
  const landedUnitPrice = totalLandedCost / req.quantity;

  // 11. Markup rate (how much TLC adds over FOB)
  const markupRate = fobValue > 0 ? (totalLandedCost - fobValue) / fobValue : 0;

  // 12. Currency
  const currency = CURRENCY_BY_COUNTRY[destCountry] ?? 'USD';

  return {
    fob_value: Math.round(fobValue * 100) / 100,
    freight_cost: Math.round(freightCost * 100) / 100,
    insurance: Math.round(insurance * 100) / 100,
    cif: Math.round(cif * 100) / 100,
    import_duty: Math.round(importDuty * 100) / 100,
    vat_gst: Math.round(vatGst * 100) / 100,
    customs_fees: Math.round(customsFees * 100) / 100,
    inland_delivery: Math.round(inlandDelivery * 100) / 100,
    total_landed_cost: Math.round(totalLandedCost * 100) / 100,
    landed_unit_price: Math.round(landedUnitPrice * 100) / 100,
    markup_rate: Math.round(markupRate * 1000) / 1000,
    hs_code: resolvedHsCode,
    duty_rate: dutyRate,
    vat_rate: vatRate,
    currency,
  };
}
