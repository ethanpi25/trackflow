/**
 * Buyer Agent API Routes
 *
 * Endpoints:
 *   POST /api/buyer-agent/tlc         - TLC 到岸成本计算
 *   POST /api/buyer-agent/compliance  - 合规预诊断
 *   POST /api/buyer-agent/hs-lookup   - HS 编码查询
 *   POST /api/buyer-agent/consolidate - 集货方案规划
 *   POST /api/buyer-agent/bulk-plan   - 大宗定制方案
 */

import type { FastifyInstance } from 'fastify';
import { calculateTlc, type TlcRequest, type TlcResponse } from '../services/tlc-calculator.js';
import { checkCompliance, type ComplianceRequest, type ComplianceResponse } from '../services/compliance-checker.js';

// --- JSON Schema definitions for Fastify validation ---

const tlcBodySchema = {
  type: 'object',
  required: ['cargo_description', 'unit_value', 'quantity', 'origin_country', 'destination_country', 'freight_mode'],
  properties: {
    cargo_description: { type: 'string', minLength: 1 },
    hs_code: { type: 'string' },
    unit_value: { type: 'number', minimum: 0 },
    quantity: { type: 'integer', minimum: 1 },
    origin_country: { type: 'string', minLength: 2 },
    destination_country: { type: 'string', minLength: 2 },
    destination_port: { type: 'string' },
    incoterms: { type: 'string' },
    freight_mode: { type: 'string', enum: ['air', 'sea', 'rail'] },
    include_vat: { type: 'boolean' },
    include_inland_delivery: { type: 'boolean' },
  },
  additionalProperties: false,
} as const;

const tlcResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        fob_value: { type: 'number' },
        freight_cost: { type: 'number' },
        insurance: { type: 'number' },
        cif: { type: 'number' },
        import_duty: { type: 'number' },
        vat_gst: { type: 'number' },
        customs_fees: { type: 'number' },
        inland_delivery: { type: 'number' },
        total_landed_cost: { type: 'number' },
        landed_unit_price: { type: 'number' },
        markup_rate: { type: 'number' },
        hs_code: { type: 'string' },
        duty_rate: { type: 'number' },
        vat_rate: { type: 'number' },
        currency: { type: 'string' },
      },
    },
  },
} as const;

const complianceBodySchema = {
  type: 'object',
  required: ['product_description', 'destination_country'],
  properties: {
    product_description: { type: 'string', minLength: 1 },
    hs_code: { type: 'string' },
    destination_country: { type: 'string', minLength: 2 },
  },
  additionalProperties: false,
} as const;

const complianceResponseSchema = {
  type: 'object',
  properties: {
    success: { type: 'boolean' },
    data: {
      type: 'object',
      properties: {
        hs_code: { type: 'string' },
        duty_rate: { type: 'number' },
        vat_rate: { type: 'number' },
        risk_level: { type: 'string', enum: ['low', 'medium', 'high'] },
        certifications: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              name: { type: 'string' },
              type: { type: 'string', enum: ['mandatory', 'recommended'] },
              description: { type: 'string' },
            },
          },
        },
        restricted: { type: 'boolean' },
        restrictions: { type: 'array', items: { type: 'string' } },
        battery_requirements: { type: 'string' },
      },
    },
  },
} as const;

const hsLookupBodySchema = {
  type: 'object',
  required: ['keyword'],
  properties: {
    keyword: { type: 'string', minLength: 1 },
    category: { type: 'string' },
  },
  additionalProperties: false,
} as const;

const consolidateBodySchema = {
  type: 'object',
  required: ['destination_country', 'items'],
  properties: {
    destination_country: { type: 'string', minLength: 2 },
    items: {
      type: 'array',
      items: {
        type: 'object',
        required: ['description', 'quantity', 'unit_value'],
        properties: {
          description: { type: 'string' },
          quantity: { type: 'integer', minimum: 1 },
          unit_value: { type: 'number', minimum: 0 },
          hs_code: { type: 'string' },
        },
        additionalProperties: false,
      },
      minItems: 1,
    },
    freight_mode: { type: 'string', enum: ['air', 'sea', 'rail'] },
  },
  additionalProperties: false,
} as const;

const bulkPlanBodySchema = {
  type: 'object',
  required: ['product_description', 'quantity', 'destination_country'],
  properties: {
    product_description: { type: 'string', minLength: 1 },
    hs_code: { type: 'string' },
    quantity: { type: 'integer', minimum: 100 },
    unit_value: { type: 'number', minimum: 0 },
    destination_country: { type: 'string', minLength: 2 },
    freight_mode: { type: 'string', enum: ['air', 'sea', 'rail'] },
  },
  additionalProperties: false,
} as const;

// --- Mock data for HS lookup ---

const HS_CATALOG = [
  { hs_code: '3926.90', description: '塑料制手机壳/保护套', category: '塑料制品', duty_rate_eu: 0.065, duty_rate_us: 0.034 },
  { hs_code: '8518.30', description: '蓝牙耳机/头戴式耳机', category: '音响设备', duty_rate_eu: 0.045, duty_rate_us: 0.0 },
  { hs_code: '9405.40', description: 'LED灯具/照明装置', category: '照明设备', duty_rate_eu: 0.037, duty_rate_us: 0.039 },
  { hs_code: '8504.40', description: '电源适配器/充电器', category: '电气设备', duty_rate_eu: 0.02, duty_rate_us: 0.015 },
  { hs_code: '8544.42', description: 'USB数据线/连接线', category: '电气设备', duty_rate_eu: 0.035, duty_rate_us: 0.025 },
  { hs_code: '9503.00', description: '玩具/儿童用品', category: '玩具', duty_rate_eu: 0.0, duty_rate_us: 0.0 },
  { hs_code: '6110.20', description: '棉制针织T恤/上衣', category: '服装', duty_rate_eu: 0.12, duty_rate_us: 0.165 },
  { hs_code: '4202.21', description: '手提包/箱包', category: '箱包', duty_rate_eu: 0.058, duty_rate_us: 0.179 },
];

export async function buyerAgentRoutes(app: FastifyInstance) {
  // ============================================================
  // POST /api/buyer-agent/tlc — TLC 到岸成本计算
  // ============================================================
  app.post<{ Body: TlcRequest; Reply: { success: boolean; data?: TlcResponse; error?: string } }>(
    '/api/buyer-agent/tlc',
    { schema: { body: tlcBodySchema, response: { 200: tlcResponseSchema } } },
    async (request, reply) => {
      try {
        const result = calculateTlc(request.body);
        return reply.send({ success: true, data: result });
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ success: false, error: 'TLC calculation failed' });
      }
    }
  );

  // ============================================================
  // POST /api/buyer-agent/compliance — 合规预诊断
  // ============================================================
  app.post<{ Body: ComplianceRequest; Reply: { success: boolean; data?: ComplianceResponse; error?: string } }>(
    '/api/buyer-agent/compliance',
    { schema: { body: complianceBodySchema, response: { 200: complianceResponseSchema } } },
    async (request, reply) => {
      try {
        const result = checkCompliance(request.body);
        return reply.send({ success: true, data: result });
      } catch (err) {
        request.log.error(err);
        return reply.status(500).send({ success: false, error: 'Compliance check failed' });
      }
    }
  );

  // ============================================================
  // POST /api/buyer-agent/hs-lookup — HS 编码查询
  // ============================================================
  app.post<{ Body: { keyword: string; category?: string }; Reply: { success: boolean; data?: unknown; error?: string } }>(
    '/api/buyer-agent/hs-lookup',
    { schema: { body: hsLookupBodySchema } },
    async (request, reply) => {
      const { keyword, category } = request.body;
      const lowerKeyword = keyword.toLowerCase();

      const results = HS_CATALOG.filter((item) => {
        const matchesKeyword =
          item.description.toLowerCase().includes(lowerKeyword) ||
          item.hs_code.includes(keyword) ||
          item.category.toLowerCase().includes(lowerKeyword);
        const matchesCategory = !category || item.category === category;
        return matchesKeyword && matchesCategory;
      });

      return reply.send({
        success: true,
        data: {
          keyword,
          results,
          total: results.length,
        },
      });
    }
  );

  // ============================================================
  // POST /api/buyer-agent/consolidate — 集货方案规划
  // ============================================================
  app.post<{
    Body: {
      destination_country: string;
      items: Array<{ description: string; quantity: number; unit_value: number; hs_code?: string }>;
      freight_mode?: 'air' | 'sea' | 'rail';
    };
    Reply: { success: boolean; data?: unknown; error?: string };
  }>(
    '/api/buyer-agent/consolidate',
    { schema: { body: consolidateBodySchema } },
    async (request, reply) => {
      const { destination_country, items, freight_mode = 'sea' } = request.body;

      // Mock consolidation plan
      const totalValue = items.reduce((sum, item) => sum + item.unit_value * item.quantity, 0);
      const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

      // Estimate weight
      const estimatedWeightKg = totalItems * 0.25;
      const containerType = estimatedWeightKg > 18000 ? '40ft' : estimatedWeightKg > 8000 ? '20ft' : 'LCL';

      const freightRatePerKg = freight_mode === 'air' ? 9.5 : freight_mode === 'rail' ? 4.0 : 2.5;
      const estimatedFreight = Math.round(estimatedWeightKg * freightRatePerKg * 100) / 100;

      const consolidationPlan = {
        destination_country: destination_country.toUpperCase(),
        freight_mode: freight_mode,
        container_type: containerType,
        estimated_weight_kg: Math.round(estimatedWeightKg * 100) / 100,
        estimated_freight_usd: estimatedFreight,
        total_items: totalItems,
        total_value_usd: Math.round(totalValue * 100) / 100,
        savings_vs_individual: Math.round(estimatedFreight * 0.15 * 100) / 100,
        estimated_transit_days: freight_mode === 'air' ? '5-7' : freight_mode === 'rail' ? '18-22' : '28-35',
        recommended_suppliers: [
          { name: '深圳集运仓', type: 'warehouse', location: '深圳' },
          { name: '义乌集运仓', type: 'warehouse', location: '义乌' },
        ],
      };

      return reply.send({ success: true, data: consolidationPlan });
    }
  );

  // ============================================================
  // POST /api/buyer-agent/bulk-plan — 大宗定制方案
  // ============================================================
  app.post<{
    Body: {
      product_description: string;
      hs_code?: string;
      quantity: number;
      unit_value?: number;
      destination_country: string;
      freight_mode?: 'air' | 'sea' | 'rail';
    };
    Reply: { success: boolean; data?: unknown; error?: string };
  }>(
    '/api/buyer-agent/bulk-plan',
    { schema: { body: bulkPlanBodySchema } },
    async (request, reply) => {
      const {
        product_description,
        hs_code,
        quantity,
        unit_value = 10,
        destination_country,
        freight_mode = 'sea',
      } = request.body;

      // Mock bulk order plan with tiered pricing
      const discountRate = quantity >= 10000 ? 0.2 : quantity >= 5000 ? 0.15 : quantity >= 1000 ? 0.1 : 0.05;
      const discountedUnitPrice = unit_value * (1 - discountRate);

      const totalProductCost = discountedUnitPrice * quantity;

      // Quick TLC estimate
      const tlcResult = calculateTlc({
        cargo_description: product_description,
        hs_code,
        unit_value: discountedUnitPrice,
        quantity,
        origin_country: 'CN',
        destination_country,
        freight_mode,
      });

      const bulkPlan = {
        product_description,
        hs_code: hs_code ?? tlcResult.hs_code,
        quantity,
        pricing_tiers: [
          { min_qty: 100, discount: '5%', unit_price: Math.round(unit_value * 0.95 * 100) / 100 },
          { min_qty: 1000, discount: '10%', unit_price: Math.round(unit_value * 0.9 * 100) / 100 },
          { min_qty: 5000, discount: '15%', unit_price: Math.round(unit_value * 0.85 * 100) / 100 },
          { min_qty: 10000, discount: '20%', unit_price: Math.round(unit_value * 0.8 * 100) / 100 },
        ],
        selected_tier: {
          discount: `${Math.round(discountRate * 100)}%`,
          unit_price: Math.round(discountedUnitPrice * 100) / 100,
          total_product_cost: Math.round(totalProductCost * 100) / 100,
        },
        tlc_breakdown: tlcResult,
        estimated_margin: {
          suggested_retail_price: Math.round(tlcResult.landed_unit_price * 1.5 * 100) / 100,
          gross_margin: Math.round((1 - tlcResult.landed_unit_price / (tlcResult.landed_unit_price * 1.5)) * 100 * 10) / 10,
        },
        lead_time: '15-25 工作日',
        moq: 100,
      };

      return reply.send({ success: true, data: bulkPlan });
    }
  );
}
