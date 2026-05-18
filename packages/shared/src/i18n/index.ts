import { TrackingStatus } from '../types/index';

export type SupportedLocale = 'zh' | 'en';

// Status translations
const statusTranslations: Record<TrackingStatus, Record<SupportedLocale, string>> = {
  [TrackingStatus.PENDING]: { zh: '待揽收', en: 'Pending' },
  [TrackingStatus.PICKED_UP]: { zh: '已揽收', en: 'Picked Up' },
  [TrackingStatus.IN_TRANSIT]: { zh: '运输中', en: 'In Transit' },
  [TrackingStatus.EXPORT_CUSTOMS]: { zh: '出口清关', en: 'Export Customs' },
  [TrackingStatus.IMPORT_CUSTOMS]: { zh: '进口清关', en: 'Import Customs' },
  [TrackingStatus.OUT_FOR_DELIVERY]: { zh: '派送中', en: 'Out for Delivery' },
  [TrackingStatus.DELIVERED]: { zh: '已签收', en: 'Delivered' },
  [TrackingStatus.FAILED]: { zh: '投递失败', en: 'Delivery Failed' },
  [TrackingStatus.RETURNED]: { zh: '已退回', en: 'Returned' },
  [TrackingStatus.EXPIRED]: { zh: '已过期', en: 'Expired' },
};

// UI translations
const uiTranslations: Record<string, Record<SupportedLocale, string>> = {
  'search.title': { zh: '跨境物流轨迹查询', en: 'Cross-Border Shipment Tracking' },
  'search.placeholder': { zh: '输入运单号查询物流轨迹', en: 'Enter tracking number' },
  'search.button': { zh: '查询', en: 'Track' },
  'search.batch': { zh: '批量查询', en: 'Batch Track' },
  'search.hint': { zh: '支持 DHL、FedEx、UPS、中国邮政、云途、燕文、4PX 等全球 900+ 承运商', en: 'Supporting 900+ carriers worldwide including DHL, FedEx, UPS, China Post, YunExpress, Yanwen, 4PX and more' },
  'result.timeline': { zh: '物流轨迹', en: 'Tracking Timeline' },
  'result.map': { zh: '路线地图', en: 'Route Map' },
  'result.carrier': { zh: '承运商', en: 'Carrier' },
  'result.origin': { zh: '发件地', en: 'Origin' },
  'result.destination': { zh: '目的地', en: 'Destination' },
  'result.status': { zh: '当前状态', en: 'Current Status' },
  'result.estimated': { zh: '预计送达', en: 'Estimated Delivery' },
  'result.days': { zh: '运输天数', en: 'Transit Days' },
  'result.notFound': { zh: '未找到物流信息，请检查单号是否正确', en: 'No tracking information found. Please check the tracking number.' },
  'milestone.pickup': { zh: '揽收', en: 'Pickup' },
  'milestone.exportCustoms': { zh: '出口清关', en: 'Export' },
  'milestone.transit': { zh: '国际运输', en: 'Transit' },
  'milestone.importCustoms': { zh: '进口清关', en: 'Import' },
  'milestone.delivery': { zh: '派送', en: 'Delivery' },
  'milestone.signed': { zh: '签收', en: 'Signed' },
  'nav.home': { zh: '首页', en: 'Home' },
  'nav.dashboard': { zh: '管理面板', en: 'Dashboard' },
  'nav.apiDocs': { zh: 'API 文档', en: 'API Docs' },
  'nav.pricing': { zh: '价格方案', en: 'Pricing' },
  'nav.login': { zh: '登录', en: 'Login' },
  'nav.register': { zh: '注册', en: 'Register' },
  'nav.language': { zh: 'English', en: '中文' },
  'footer.description': { zh: '免费的跨境物流轨迹查询平台', en: 'Free cross-border logistics tracking platform' },
  'tier.free': { zh: '免费版', en: 'Free' },
  'tier.pro': { zh: 'Pro 版', en: 'Pro' },
  'tier.enterprise': { zh: '企业版', en: 'Enterprise' },
};

export function translateStatus(status: TrackingStatus, locale: SupportedLocale): string {
  return statusTranslations[status]?.[locale] ?? status;
}

export function t(key: string, locale: SupportedLocale): string {
  return uiTranslations[key]?.[locale] ?? key;
}
