import { TrackingStatus, type TierConfig, UserTier } from '../types/index';

// Tier configurations
export const TIER_CONFIGS: Record<UserTier, TierConfig> = {
  [UserTier.FREE]: {
    queriesPerDay: 10,
    queriesPerMinute: 3,
    batchSize: 1,
    historyDays: 7,
    webhookEnabled: false,
    exportFormats: [],
  },
  [UserTier.PRO]: {
    queriesPerDay: 50000,
    queriesPerMinute: 300,
    batchSize: 50,
    historyDays: 90,
    webhookEnabled: true,
    exportFormats: ['csv'],
  },
  [UserTier.ENTERPRISE]: {
    queriesPerDay: null,
    queriesPerMinute: 10000,
    batchSize: 1000,
    historyDays: null,
    webhookEnabled: true,
    exportFormats: ['csv', 'excel', 'json'],
  },
};

// Cache TTL by status (seconds)
export const CACHE_TTL: Record<TrackingStatus, number> = {
  [TrackingStatus.PENDING]: 1800,        // 30 min
  [TrackingStatus.PICKED_UP]: 600,       // 10 min
  [TrackingStatus.IN_TRANSIT]: 300,      // 5 min
  [TrackingStatus.EXPORT_CUSTOMS]: 300,  // 5 min
  [TrackingStatus.IMPORT_CUSTOMS]: 300,  // 5 min
  [TrackingStatus.OUT_FOR_DELIVERY]: 180,// 3 min
  [TrackingStatus.DELIVERED]: 3600,      // 1 hour
  [TrackingStatus.FAILED]: 900,          // 15 min
  [TrackingStatus.RETURNED]: 900,        // 15 min
  [TrackingStatus.EXPIRED]: 3600,        // 1 hour
};

// Status visual config
export const STATUS_COLORS: Record<TrackingStatus, string> = {
  [TrackingStatus.PENDING]: '#9CA3AF',
  [TrackingStatus.PICKED_UP]: '#3B82F6',
  [TrackingStatus.IN_TRANSIT]: '#2563EB',
  [TrackingStatus.EXPORT_CUSTOMS]: '#F59E0B',
  [TrackingStatus.IMPORT_CUSTOMS]: '#D97706',
  [TrackingStatus.OUT_FOR_DELIVERY]: '#10B981',
  [TrackingStatus.DELIVERED]: '#059669',
  [TrackingStatus.FAILED]: '#EF4444',
  [TrackingStatus.RETURNED]: '#DC2626',
  [TrackingStatus.EXPIRED]: '#6B7280',
};

// Carrier detection patterns (tracking number prefix → carrier code)
export const CARRIER_PATTERNS: Array<{ pattern: RegExp; carrier: string }> = [
  { pattern: /^1Z[A-Z0-9]{16}$/i, carrier: 'ups' },
  { pattern: /^\d{12}$/, carrier: 'fedex' },
  { pattern: /^\d{15}$/, carrier: 'fedex' },
  { pattern: /^\d{20}$/, carrier: 'fedex' },
  { pattern: /^\d{22}$/, carrier: 'fedex' },
  { pattern: /^\d{10}$/, carrier: 'dhl' },
  { pattern: /^JD\d{9}$/, carrier: 'dhl' },
  { pattern: /^[A-Z]{2}\d{9}[A-Z]{2}$/, carrier: 'postal' }, // Universal postal format
  { pattern: /^E[A-Z]\d{9}[A-Z]{2}$/, carrier: 'ems' },
  { pattern: /^R[A-Z]\d{9}[A-Z]{2}$/, carrier: 'postal_registered' },
  { pattern: /^4PX\w+$/, carrier: '4px' },
  { pattern: /^YT\d{16}$/, carrier: 'yunexpress' },
  { pattern: /^YANWEN\w+$/, carrier: 'yanwen' },
  { pattern: /^SF\d{12,15}$/, carrier: 'sf_express' },
];

// Cross-border milestones order
export const MILESTONE_ORDER: TrackingStatus[] = [
  TrackingStatus.PICKED_UP,
  TrackingStatus.EXPORT_CUSTOMS,
  TrackingStatus.IN_TRANSIT,
  TrackingStatus.IMPORT_CUSTOMS,
  TrackingStatus.OUT_FOR_DELIVERY,
  TrackingStatus.DELIVERED,
];

// Supported carriers list
export const CARRIERS = {
  // International Express
  dhl: { name: 'DHL Express', nameZh: 'DHL 国际快递', type: 'express' },
  fedex: { name: 'FedEx', nameZh: '联邦快递', type: 'express' },
  ups: { name: 'UPS', nameZh: 'UPS 快递', type: 'express' },
  tnt: { name: 'TNT Express', nameZh: 'TNT 快递', type: 'express' },
  // China carriers
  sf_express: { name: 'SF Express', nameZh: '顺丰速运', type: 'express' },
  ems: { name: 'China Post EMS', nameZh: '中国邮政 EMS', type: 'postal' },
  postal: { name: 'China Post', nameZh: '中国邮政', type: 'postal' },
  yunexpress: { name: 'YunExpress', nameZh: '云途物流', type: 'line' },
  yanwen: { name: 'Yanwen Express', nameZh: '燕文物流', type: 'line' },
  '4px': { name: '4PX Express', nameZh: '递四方', type: 'line' },
  cainiao: { name: 'Cainiao', nameZh: '菜鸟物流', type: 'line' },
} as const;
