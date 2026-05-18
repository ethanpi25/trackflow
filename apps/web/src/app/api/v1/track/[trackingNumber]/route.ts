import { NextResponse } from "next/server";
import { TrackingStatus } from "@logistic/shared";

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

  const shipment = {
    trackingNumber,
    carrierCode: "dhl",
    carrierName: "DHL Express",
    origin: { city: "Shanghai", country: "China", countryCode: "CN" },
    destination: {
      city: "Los Angeles",
      country: "United States",
      countryCode: "US",
    },
    currentStatus: TrackingStatus.IN_TRANSIT,
    estimatedDelivery: new Date(now.getTime() + 5 * 86400000).toISOString(),
    events: [
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
        location: {
          city: "Anchorage",
          country: "United States",
          countryCode: "US",
        },
        statusCode: TrackingStatus.IN_TRANSIT,
        descriptionZh: "快件已到达安克雷奇转运中心",
        descriptionEn: "Arrived at Anchorage transit hub",
        rawStatus: "IN_TRANSIT",
      },
      {
        timestamp: new Date(now.getTime() - 0.5 * 86400000).toISOString(),
        location: {
          city: "Los Angeles",
          country: "United States",
          countryCode: "US",
        },
        statusCode: TrackingStatus.IMPORT_CUSTOMS,
        descriptionZh: "快件正在洛杉矶海关进口清关中",
        descriptionEn: "Undergoing import customs clearance in Los Angeles",
        rawStatus: "CUSTOMS",
      },
    ],
    metadata: {
      dataSource: "mock",
      lastSynced: now.toISOString(),
      confidence: 100,
    },
    createdAt: new Date(now.getTime() - 3 * 86400000).toISOString(),
    updatedAt: now.toISOString(),
  };

  return NextResponse.json({ success: true, data: shipment });
}
