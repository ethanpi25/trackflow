import { CARRIER_PATTERNS } from '@logistic/shared';

/**
 * Detect carrier from tracking number format.
 * Returns carrier code or 'unknown'.
 */
export function detectCarrier(trackingNumber: string): string {
  const cleaned = trackingNumber.trim().toUpperCase();

  for (const { pattern, carrier } of CARRIER_PATTERNS) {
    if (pattern.test(cleaned)) {
      return carrier;
    }
  }

  return 'unknown';
}

/**
 * Validate tracking number basic format.
 * Must be 5-50 alphanumeric characters.
 */
export function isValidTrackingNumber(trackingNumber: string): boolean {
  const cleaned = trackingNumber.trim();
  return /^[A-Za-z0-9]{5,50}$/.test(cleaned);
}
