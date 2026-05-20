// ---------------------------------------------------------------------------
// Mock Compliance Rules — Mock data layer for Buyer Agent
// Provides regulatory compliance pre-diagnosis data by destination + category
// ---------------------------------------------------------------------------

/** A certification requirement within a compliance rule */
export interface Certification {
  name: string;
  type: 'mandatory' | 'recommended';
  description: string;
}

/** A compliance rule for a destination country + product category */
export interface ComplianceRule {
  destination_country: string;
  product_category: string;
  risk_level: 'low' | 'medium' | 'high';
  certifications: Certification[];
  restricted: boolean;
  restrictions?: string[];
  battery_requirements?: string;
}

// ---------------------------------------------------------------------------
// Mock compliance database
// ---------------------------------------------------------------------------

const COMPLIANCE_DB: ComplianceRule[] = [
  // Germany + electronics
  {
    destination_country: 'DE',
    product_category: 'electronics',
    risk_level: 'medium',
    certifications: [
      { name: 'CE', type: 'mandatory', description: 'Conformité Européenne marking required for EU market access' },
      { name: 'RED', type: 'mandatory', description: 'Radio Equipment Directive for wireless devices' },
      { name: 'RoHS', type: 'mandatory', description: 'Restriction of Hazardous Substances in electrical equipment' },
      { name: 'WEEE', type: 'mandatory', description: 'Waste Electrical and Electronic Equipment registration' },
    ],
    restricted: false,
  },
  // Germany + lighting
  {
    destination_country: 'DE',
    product_category: 'lighting',
    risk_level: 'low',
    certifications: [
      { name: 'CE', type: 'mandatory', description: 'Conformité Européenne marking required for EU market access' },
      { name: 'RoHS', type: 'mandatory', description: 'Restriction of Hazardous Substances' },
      { name: 'ERP', type: 'mandatory', description: 'Energy-related Products Directive for energy efficiency' },
    ],
    restricted: false,
  },
  // Saudi Arabia + electronics
  {
    destination_country: 'SA',
    product_category: 'electronics',
    risk_level: 'medium',
    certifications: [
      { name: 'SASO', type: 'mandatory', description: 'Saudi Standards, Metrology and Quality Organization certification' },
      { name: 'IECEE', type: 'mandatory', description: 'International Electrotechnical Commission Certification Scheme' },
      { name: 'SABER', type: 'mandatory', description: 'Saudi product safety and conformity assessment platform' },
    ],
    restricted: false,
  },
  // Saudi Arabia + lighting
  {
    destination_country: 'SA',
    product_category: 'lighting',
    risk_level: 'medium',
    certifications: [
      { name: 'SASO', type: 'mandatory', description: 'Saudi Standards, Metrology and Quality Organization certification' },
      { name: 'IECEE', type: 'mandatory', description: 'International Electrotechnical Commission Certification Scheme' },
      { name: 'SABER', type: 'mandatory', description: 'Saudi product safety and conformity assessment platform' },
      { name: 'EER', type: 'mandatory', description: 'Energy Efficiency Rating for lighting products' },
    ],
    restricted: false,
  },
  // USA + electronics
  {
    destination_country: 'US',
    product_category: 'electronics',
    risk_level: 'low',
    certifications: [
      { name: 'FCC', type: 'mandatory', description: 'Federal Communications Commission certification for electronic devices' },
    ],
    restricted: false,
  },
  // UK + electronics
  {
    destination_country: 'GB',
    product_category: 'electronics',
    risk_level: 'low',
    certifications: [
      { name: 'UKCA', type: 'mandatory', description: 'UK Conformity Assessed marking (post-Brexit replacement for CE)' },
    ],
    restricted: false,
  },
  // Lithium battery add-on — applies to all countries
  {
    destination_country: '*',
    product_category: 'lithium_battery',
    risk_level: 'medium',
    certifications: [
      { name: 'UN38.3', type: 'mandatory', description: 'UN Manual of Tests and Criteria for lithium battery transport safety' },
    ],
    restricted: false,
    battery_requirements: 'UN38.3 test report required; packaging must comply with IATA/IMDG dangerous goods regulations',
  },
];

// Map country codes to their primary country for lookup
const COUNTRY_MAP: Record<string, string> = {
  DE: 'DE',
  AT: 'DE',
  NL: 'DE',
  BE: 'DE',
  FR: 'DE', // EU countries map to DE for German-centric rules
  US: 'US',
  SA: 'SA',
  AE: 'SA',
  GB: 'GB',
  UK: 'GB',
};

// Map product-related HS codes / descriptions to categories
const PRODUCT_CATEGORY_KEYWORDS: Record<string, string[]> = {
  electronics: ['electronics', 'electronic', 'bluetooth', 'earbuds', 'headphones', 'adapter', 'charger', 'laptop', 'computer', 'camera', 'phone', 'phone case'],
  lighting: ['led', 'light', 'lamp', 'lighting', 'lamp'],
  lithium_battery: ['battery', 'lithium', 'batteries', '锂电池', '电池'],
};

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Get compliance rules for a destination country and product category.
 * Always includes the universal lithium battery add-on if applicable.
 */
export function getComplianceRules(
  destinationCountry: string,
  productCategory: string,
): ComplianceRule[] {
  const results: ComplianceRule[] = [];
  const mappedCountry = COUNTRY_MAP[destinationCountry.toUpperCase()] ?? destinationCountry.toUpperCase();
  const normalizedCategory = productCategory.toLowerCase().trim();

  // Find country-specific rules
  const countryRule = COMPLIANCE_DB.find(
    (r) => r.destination_country === mappedCountry && r.product_category === normalizedCategory,
  );
  if (countryRule) {
    results.push({ ...countryRule, destination_country: destinationCountry.toUpperCase() });
  }

  // Add lithium battery add-on if the product category involves batteries
  // or if the description hints at battery-powered products
  if (normalizedCategory === 'lithium_battery' || normalizedCategory === 'electronics') {
    const batteryRule = COMPLIANCE_DB.find(
      (r) => r.destination_country === '*' && r.product_category === 'lithium_battery',
    );
    if (batteryRule) {
      results.push({ ...batteryRule, destination_country: destinationCountry.toUpperCase() });
    }
  }

  return results;
}

/**
 * Infer product category from a description string.
 * Returns the most likely category or null if no match.
 */
export function inferProductCategory(description: string): string | null {
  const lower = description.toLowerCase().trim();
  if (!lower) return null;

  let bestCategory: string | null = null;
  let bestScore = 0;

  for (const [category, keywords] of Object.entries(PRODUCT_CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      if (lower.includes(keyword)) {
        score += keyword.length;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      bestCategory = category;
    }
  }

  return bestCategory;
}
