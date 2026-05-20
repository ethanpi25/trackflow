/**
 * Compliance Checker Service
 *
 * Provides compliance pre-diagnosis based on destination country and HS code.
 * Returns certification requirements, risk levels, and restriction info.
 */

interface Certification {
  name: string;
  type: 'mandatory' | 'recommended';
  description: string;
}

export interface ComplianceRequest {
  product_description: string;
  hs_code?: string;
  destination_country: string;
}

export interface ComplianceResponse {
  hs_code: string;
  duty_rate: number;
  vat_rate: number;
  risk_level: 'low' | 'medium' | 'high';
  certifications: Certification[];
  restricted: boolean;
  restrictions?: string[];
  battery_requirements?: string;
}

// --- Country-specific VAT lookup (shared with TLC calculator) ---
const VAT_RATES: Record<string, number> = {
  DE: 0.19, FR: 0.20, GB: 0.20, SA: 0.15, AE: 0.05,
  US: 0.00, AU: 0.10, JP: 0.10,
};

// --- HS code duty rates (simplified) ---
const HS_DUTY_RATES: Record<string, Record<string, number>> = {
  '3926.90': { EU: 0.065, US: 0.034 },
  '8518.30': { EU: 0.045, US: 0.0 },
  '9405.40': { EU: 0.037, US: 0.039 },
};

const EU_COUNTRIES = new Set([
  'DE', 'FR', 'ES', 'IT', 'NL', 'BE', 'AT', 'PT', 'IE',
  'FI', 'SE', 'DK', 'PL', 'CZ', 'GR', 'HU', 'RO', 'BG',
  'HR', 'SK', 'SI', 'EE', 'LV', 'LT', 'LU', 'CY', 'MT',
]);

function evaluateCompliance(
  productDescription: string,
  hsCode: string | undefined,
  destinationCountry: string
): { certifications: Certification[]; riskLevel: 'low' | 'medium' | 'high'; restricted: boolean; restrictions?: string[]; batteryRequirements?: string } {
  const desc = productDescription.toLowerCase();
  const country = destinationCountry.toUpperCase();
  const certifications: Certification[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let restricted = false;
  const restrictions: string[] = [];
  let batteryRequirements: string | undefined;

  // Battery check (applies to all countries)
  const hasBattery = /电池|battery|锂|lithium|充电|rechargeable/i.test(desc);
  if (hasBattery) {
    certifications.push({
      name: 'UN38.3',
      type: 'mandatory',
      description: '锂电池运输安全测试标准，所有含锂电池产品必需',
    });
    batteryRequirements = 'UN38.3 锂电池安全测试报告 + MSDS + 危险品申报';
    riskLevel = 'medium';
  }

  // Country-specific rules
  if (EU_COUNTRIES.has(country)) {
    certifications.push({
      name: 'CE',
      type: 'mandatory',
      description: '欧盟合格评定标志，产品进入欧洲市场必需',
    });

    const isWireless = /wireless|蓝牙|bluetooth|wifi|无线|rf/i.test(desc);
    if (isWireless) {
      certifications.push({
        name: 'RED',
        type: 'mandatory',
        description: '欧盟无线电设备指令，适用于无线通信设备',
      });
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }

    const isToy = /玩具|toy|儿童|children/i.test(desc);
    if (isToy) {
      certifications.push({
        name: 'EN71',
        type: 'mandatory',
        description: '欧盟玩具安全标准',
      });
      riskLevel = 'high';
    }
  }

  if (country === 'SA') {
    certifications.push({
      name: 'SABER',
      type: 'mandatory',
      description: '沙特产品安全与质量电子认证平台注册',
    });
    certifications.push({
      name: 'SASO COC',
      type: 'mandatory',
      description: '装运前符合性验证证书',
    });

    const isLighting = /灯|light|led|照明|luminaire/i.test(desc);
    if (isLighting) {
      certifications.push({
        name: 'SASO',
        type: 'mandatory',
        description: '沙特标准、计量和质量组织认证',
      });
      certifications.push({
        name: 'IECEE',
        type: 'mandatory',
        description: '国际电工委员会电工产品合格测试与认证',
      });
      riskLevel = 'medium';
    }

    // Saudi has stricter restrictions for certain categories
    const isRestricted = /酒精|alcohol|猪肉|pork|色情|adult/i.test(desc);
    if (isRestricted) {
      restricted = true;
      restrictions.push('沙特禁止进口该类产品');
      riskLevel = 'high';
    }
  }

  if (country === 'US') {
    const isElectronic = /电子|electronic|蓝牙|bluetooth|wireless|无线|电源|power|usb/i.test(desc);
    if (isElectronic) {
      certifications.push({
        name: 'FCC',
        type: 'mandatory',
        description: '美国联邦通信委员会认证，适用于电子通信设备',
      });
    }

    certifications.push({
      name: 'FDA',
      type: 'recommended',
      description: '美国食品药品监督管理局注册（如适用）',
    });
  }

  if (country === 'GB') {
    certifications.push({
      name: 'UKCA',
      type: 'mandatory',
      description: '英国合格评定标志（脱欧后替代 CE 标志）',
    });

    const isWireless = /wireless|蓝牙|bluetooth|wifi|无线|rf/i.test(desc);
    if (isWireless) {
      certifications.push({
        name: 'UK Radio Equipment Regulations',
        type: 'mandatory',
        description: '英国无线电设备法规',
      });
      riskLevel = riskLevel === 'low' ? 'medium' : riskLevel;
    }
  }

  if (country === 'AE') {
    certifications.push({
      name: 'ECAS',
      type: 'mandatory',
      description: '阿联酋符合性评估计划',
    });
    certifications.push({
      name: 'ESMA',
      type: 'recommended',
      description: '阿联酋标准化与计量管理局注册',
    });
  }

  if (country === 'AU') {
    const isElectronic = /电子|electronic|电源|power|充电|charger/i.test(desc);
    if (isElectronic) {
      certifications.push({
        name: 'RCM',
        type: 'mandatory',
        description: '澳大利亚规管合规标志',
      });
    }
  }

  if (country === 'JP') {
    const isElectronic = /电子|electronic|电源|power/i.test(desc);
    if (isElectronic) {
      certifications.push({
        name: 'PSE',
        type: 'mandatory',
        description: '日本电气用品安全法认证',
      });
    }
  }

  return {
    certifications,
    riskLevel,
    restricted,
    restrictions: restrictions.length > 0 ? restrictions : undefined,
    batteryRequirements,
  };
}

function getDutyRate(hsCode: string | undefined, country: string): number {
  if (!hsCode || !HS_DUTY_RATES[hsCode]) {
    return EU_COUNTRIES.has(country) ? 0.05 : 0.035;
  }
  const region = EU_COUNTRIES.has(country) ? 'EU' : country;
  return HS_DUTY_RATES[hsCode][region] ?? 0.05;
}

export function checkCompliance(req: ComplianceRequest): ComplianceResponse {
  const country = req.destination_country.toUpperCase();
  const result = evaluateCompliance(req.product_description, req.hs_code, country);
  const dutyRate = getDutyRate(req.hs_code, country);
  const vatRate = VAT_RATES[country] ?? 0.1;

  return {
    hs_code: req.hs_code ?? '9999.99',
    duty_rate: dutyRate,
    vat_rate: vatRate,
    risk_level: result.riskLevel,
    certifications: result.certifications,
    restricted: result.restricted,
    restrictions: result.restrictions,
    battery_requirements: result.batteryRequirements,
  };
}
