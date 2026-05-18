import {
  Package,
  Globe,
  Zap,
  Shield,
  BarChart3,
  Clock,
  type LucideIcon,
} from "lucide-react";

export { Package, Globe, Zap, Shield, BarChart3, Clock };
export type { LucideIcon };

export function TrackingIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="8" y="14" width="32" height="24" rx="3" stroke="currentColor" strokeWidth="2" />
      <line x1="8" y1="22" x2="40" y2="22" stroke="currentColor" strokeWidth="2" />
      <line x1="24" y1="22" x2="24" y2="38" stroke="currentColor" strokeWidth="1.5" />
      <polyline points="16,14 24,8 32,14" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="36" cy="12" r="6" fill="var(--primary)" stroke="white" strokeWidth="2" />
      <path d="M34 12 L36 14 L39 10" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function GlobalIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <circle cx="24" cy="24" r="16" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="24" cy="24" rx="8" ry="16" stroke="currentColor" strokeWidth="1.5" />
      <line x1="8" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="1.5" />
      <line x1="11" y1="16" x2="37" y2="16" stroke="currentColor" strokeWidth="1" />
      <line x1="11" y1="32" x2="37" y2="32" stroke="currentColor" strokeWidth="1" />
      <circle cx="34" cy="12" r="4" fill="var(--success)" />
      <path d="M32 12 L34 14 L37 10" stroke="white" strokeWidth="1.5" fill="none" />
    </svg>
  );
}

export function FreeIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={className}>
      <rect x="6" y="10" width="36" height="28" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M6 18 L24 26 L42 18" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="24" cy="24" r="8" fill="var(--primary-light)" stroke="var(--primary)" strokeWidth="1.5" />
      <text x="24" y="28" textAnchor="middle" fill="var(--primary)" fontSize="10" fontWeight="bold">$0</text>
    </svg>
  );
}
