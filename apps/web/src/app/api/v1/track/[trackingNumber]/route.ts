import { NextResponse } from "next/server";
import { TrackingStatus } from "@logistic/shared";

function getMockScenario(trackingNumber: string) {
  const tn = trackingNumber.toUpperCase();

  if (tn.includes("FEDEX")) {
    return {
      carrierCode: "fedex",
      carrierName: "FedEx Express",
      origin: { city: "Beijing", country: "China", countryCode: "CN" },
      destination: { city: "New York", country: "United States", countryCode: "US" },
      currentStatus: TrackingStatus.DELIVERED,
      daysOffset: 7,
      events: (now: Date) => [
        {
          timestamp: new Date(now.getTime() - 7 * 86400000).toISOString(),
          location: { city: "Beijing", country: "China", countryCode: "CN" },
          statusCode: TrackingStatus.PICKED_UP,
          descriptionZh: "快件已从北京揽收",
          descriptionEn: "Shipment picked up in Beijing",
          rawStatus: "PU",
        },
        {
          timestamp: new Date(now.getTime() - 6 * 86400000).toISOString(),
          location: { city: "Beijing", country: "China", countryCode: "CN" },
          statusCode: TrackingStatus.EXPORT_CUSTOMS,
          descriptionZh: "已完成北京出口清关",
          descriptionEn: "Cleared export customs in Beijing",
          rawStatus: "CUSTOMS_CLEARED",
        },
        {
          timestamp: new Date(now.getTime() - 4 * 86400000).toISOString(),
          location: { city: "Memphis", country: "United States", countryCode: "US" },
          statusCode: TrackingStatus.IN_TRANSIT,
          descriptionZh: "快件已到达孟菲斯FedEx枢纽中心",
          descriptionEn: "Arrived at FedEx hub in Memphis",
          rawStatus: "IN_TRANSIT",
        },
        {
          timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(),
          location: { city: "New York", country: "United States", countryCode: "US" },
          statusCode: TrackingStatus.OUT_FOR_DELIVERY,
          descriptionZh: "快件正在纽约派送途中",
          descriptionEn: "Out for delivery in New York",
          rawStatus: "OFD",
        },
        {
          timestamp: new Date(now.getTime() - 1.5 * 86400000).toISOString(),
          location: { city: "New York", country: "United States", countryCode: "US" },
          statusCode: TrackingStatus.DELIVERED,
          descriptionZh: "快件已成功签收",
          descriptionEn: "Package delivered successfully",
          rawStatus: "DL",
        },
      ],
    };
  }

  if (tn.includes("UPS")) {
    return {
      carrierCode: "ups",
      carrierName: "UPS Worldwide",
      origin: { city: "Shenzhen", country: "China", countryCode: "CN" },
      destination: { city: "London", country: "United Kingdom", countryCode: "GB" },
      currentStatus: TrackingStatus.OUT_FOR_DELIVERY,
      daysOffset: 3,
      events: (now: Date) => [
        {
          timestamp: new Date(now.getTime() - 5 * 86400000).toISOString(),
          location: { city: "Shenzhen", country: "China", countryCode: "CN" },
          statusCode: TrackingStatus.PICKED_UP,
          descriptionZh: "快件已从深圳揽收",
          descriptionEn: "Package picked up in Shenzhen",
          rawStatus: "PU",
        },
        {
          timestamp: new Date(now.getTime() - 4 * 86400000).toISOString(),
          location: { city: "Shenzhen", country: "China", countryCode: "CN" },
          statusCode: TrackingStatus.EXPORT_CUSTOMS,
          descriptionZh: "已完成深圳出口清关",
          descriptionEn: "Cleared export customs in Shenzhen",
          rawStatus: "CUSTOMS_CLEARED",
        },
        {
          timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(),
          location: { city: "Cologne", country: "Germany", countryCode: "DE" },
          statusCode: TrackingStatus.IN_TRANSIT,
          descriptionZh: "快件已到达科隆UPS国际枢纽",
          descriptionEn: "Arrived at UPS international hub in Cologne",
          rawStatus: "IN_TRANSIT",
        },
        {
          timestamp: new Date(now.getTime() - 0.5 * 86400000).toISOString(),
          location: { city: "London", country: "United Kingdom", countryCode: "GB" },
          statusCode: TrackingStatus.OUT_FOR_DELIVERY,
          descriptionZh: "快件正在伦敦派送途中",
          descriptionEn: "Out for delivery in London",
          rawStatus: "OFD",
        },
      ],
    };
  }

  if (tn.includes("SF")) {
    return {
      carrierCode: "sf",
      carrierName: "SF Express",
      origin: { city: "Guangzhou", country: "China", countryCode: "CN" },
      destination: { city: "Toronto", country: "Canada", countryCode: "CA" },
      currentStatus: TrackingStatus.EXPORT_CUSTOMS,
      daysOffset: 6,
      events: (now: Date) => [
        {
          timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(),
          location: { city: "Guangzhou", country: "China", countryCode: "CN" },
          statusCode: TrackingStatus.PICKED_UP,
          descriptionZh: "快件已从广州揽收",
          descriptionEn: "Shipment picked up in Guangzhou",
          rawStatus: "PU",
        },
        {
          timestamp: new Date(now.getTime() - 1.5 * 86400000).toISOString(),
          location: { city: "Shenzhen", country: "China", countryCode: "CN" },
          statusCode: TrackingStatus.IN_TRANSIT,
          descriptionZh: "快件已到达深圳顺丰国际分拨中心",
          descriptionEn: "Arrived at SF international hub in Shenzhen",
          rawStatus: "IN_TRANSIT",
        },
        {
          timestamp: new Date(now.getTime() - 0.5 * 86400000).toISOString(),
          location: { city: "Shenzhen", country: "China", countryCode: "CN" },
          statusCode: TrackingStatus.EXPORT_CUSTOMS,
          descriptionZh: "快件正在深圳机场办理出口清关手续",
          descriptionEn: "Undergoing export customs clearance at Shenzhen Airport",
          rawStatus: "CUSTOMS",
        },
      ],
    };
  }

  // Default: DHL Shanghai → Los Angeles (IN_TRANSIT)
  return {
    carrierCode: "dhl",
    carrierName: "DHL Express",
    origin: { city: "Shanghai", country: "China", countryCode: "CN" },
    destination: { city: "Los Angeles", country: "United States", countryCode: "US" },
    currentStatus: TrackingStatus.IN_TRANSIT,
    daysOffset: 5,
    events: (now: Date) => [
      {
        timestamp: new Date(now.getTime() - 3 * 86400000).toISOString(),
        location: { city: "Shanghai", country: "China", countryCode: "CN" },
        statusCode: TrackingStatus.PICKED_UP,
        descriptionZh: "快件已从上海揽收",
        descriptionEn: "Shipment picked up in Shanghai",
        rawStatus: "PU",
      },
      {
        timestamp: new Date(now.getTime() - 2 * 86400000).toISOString(),
        location: { city: "Shanghai", country: "China", countryCode: "CN" },
        statusCode: TrackingStatus.EXPORT_CUSTOMS,
        descriptionZh: "快件已通过上海海关出口清关",
        descriptionEn: "Cleared export customs in Shanghai",
        rawStatus: "CUSTOMS_CLEARED",
      },
      {
        timestamp: new Date(now.getTime() - 1 * 86400000).toISOString(),
        location: { city: "Anchorage", country: "United States", countryCode: "US" },
        statusCode: TrackingStatus.IN_TRANSIT,
        descriptionZh: "快件已到达安克雷奇转运中心",
        descriptionEn: "Arrived at Anchorage transit hub",
        rawStatus: "IN_TRANSIT",
      },
      {
        timestamp: new Date(now.getTime() - 0.5 * 86400000).toISOString(),
        location: { city: "Los Angeles", country: "United States", countryCode: "US" },
        statusCode: TrackingStatus.IMPORT_CUSTOMS,
        descriptionZh: "快件正在洛杉矶海关进口清关中",
        descriptionEn: "Undergoing import customs clearance in Los Angeles",
        rawStatus: "CUSTOMS",
      },
    ],
  };
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  const { trackingNumber } = await params;

  if (!trackingNumber || trackingNumber.trim().length < 5) {
    return NextResponse.json(
      { success: false, error: "Invalid tracking number" },
      { status: 400 }
    );
  }

  const now = new Date();
  const scenario = getMockScenario(trackingNumber);

  const shipment = {
    trackingNumber,
    carrierCode: scenario.carrierCode,
    carrierName: scenario.carrierName,
    origin: scenario.origin,
    destination: scenario.destination,
    currentStatus: scenario.currentStatus,
    estimatedDelivery: new Date(now.getTime() + scenario.daysOffset * 86400000).toISOString(),
    events: scenario.events(now),
    metadata: {
      dataSource: "mock",
      lastSynced: now.toISOString(),
      confidence: 100,
    },
    createdAt: new Date(now.getTime() - 7 * 86400000).toISOString(),
    updatedAt: now.toISOString(),
  };

  return NextResponse.json({ success: true, data: shipment });
}
