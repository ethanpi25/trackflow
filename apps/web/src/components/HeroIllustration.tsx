export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 800 400"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Globe */}
      <circle cx="400" cy="200" r="140" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
      <circle cx="400" cy="200" r="100" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <ellipse cx="400" cy="200" rx="140" ry="50" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
      <ellipse cx="400" cy="200" rx="50" ry="140" stroke="rgba(255,255,255,0.06)" strokeWidth="1" />

      {/* Route lines */}
      <path
        d="M200 220 C280 160, 350 180, 400 170 C450 160, 520 140, 600 180"
        stroke="rgba(59,130,246,0.5)"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </path>
      <path
        d="M180 260 C260 280, 340 240, 420 250 C500 260, 560 220, 640 240"
        stroke="rgba(16,185,129,0.4)"
        strokeWidth="2"
        strokeDasharray="6 4"
        fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* Location pins */}
      <g>
        <circle cx="200" cy="220" r="6" fill="#3B82F6" opacity="0.9">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="220" r="12" stroke="#3B82F6" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      <g>
        <circle cx="600" cy="180" r="6" fill="#10B981" opacity="0.9">
          <animate attributeName="r" values="5;7;5" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="600" cy="180" r="12" stroke="#10B981" strokeWidth="1" fill="none" opacity="0.3">
          <animate attributeName="r" values="12;18;12" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="2s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Package icon (center) */}
      <g transform="translate(388, 185)">
        <rect x="0" y="4" width="24" height="20" rx="2" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" fill="rgba(59,130,246,0.2)" />
        <line x1="0" y1="10" x2="24" y2="10" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <line x1="12" y1="10" x2="12" y2="24" stroke="rgba(255,255,255,0.4)" strokeWidth="1" />
        <polyline points="4,4 12,0 20,4" stroke="rgba(255,255,255,0.5)" strokeWidth="1" fill="none" />
        <animateTransform attributeName="transform" type="translate" values="388,185;388,179;388,185" dur="3s" repeatCount="indefinite" />
      </g>

      {/* Small dots - representing packages in transit */}
      <circle cx="320" cy="175" r="3" fill="#3B82F6" opacity="0.6">
        <animate attributeName="cx" values="280;380;280" dur="4s" repeatCount="indefinite" />
        <animate attributeName="cy" values="180;168;180" dur="4s" repeatCount="indefinite" />
      </circle>
      <circle cx="480" cy="165" r="3" fill="#10B981" opacity="0.6">
        <animate attributeName="cx" values="440;560;440" dur="3.5s" repeatCount="indefinite" />
        <animate attributeName="cy" values="165;175;165" dur="3.5s" repeatCount="indefinite" />
      </circle>

      {/* Stars / sparkle dots */}
      <circle cx="150" cy="100" r="1.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="650" cy="80" r="1.5" fill="rgba(255,255,255,0.3)" />
      <circle cx="700" cy="300" r="1" fill="rgba(255,255,255,0.2)" />
      <circle cx="120" cy="320" r="1" fill="rgba(255,255,255,0.2)" />
      <circle cx="550" cy="320" r="1.5" fill="rgba(255,255,255,0.25)" />
      <circle cx="250" cy="100" r="1" fill="rgba(255,255,255,0.2)" />
    </svg>
  );
}
