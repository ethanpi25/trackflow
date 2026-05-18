import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Pricing - TrackFlow",
  description:
    "TrackFlow pricing plans. Start free with 10 queries per day, upgrade to Pro for 50,000 queries, or contact us for enterprise solutions.",
};

export default function PricingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
