export function HeroIllustration({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 900 420"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        {/* Air route path for motion */}
        <path id="air-path" d="M620 180 C560 100, 440 90, 360 130 C300 158, 260 175, 210 180" />
        {/* Sea route path for motion */}
        <path id="sea-path" d="M640 240 C680 270, 730 285, 780 265 C820 250, 845 235, 860 225" />
        {/* Truck route */}
        <path id="truck-path" d="M60 280 C120 275, 160 270, 210 265" />
      </defs>

      {/* ===== World Map Grid ===== */}
      {/* Latitude lines */}
      {[120, 170, 220, 270, 320].map((y) => (
        <line key={`lat-${y}`} x1="0" y1={y} x2="900" y2={y}
          stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
      ))}
      {/* Longitude lines */}
      {[90, 180, 270, 360, 450, 540, 630, 720, 810].map((x) => (
        <line key={`lon-${x}`} x1={x} y1="80" x2={x} y2="380"
          stroke="rgba(255,255,255,0.035)" strokeWidth="1" />
      ))}

      {/* ===== Continent Shapes (simplified outlines) ===== */}
      {/* Asia */}
      <path
        d="M560 140 C580 130, 640 125, 680 140 C720 155, 740 175, 730 200 C720 220, 700 230, 670 225 C640 220, 620 210, 600 200 C575 185, 555 165, 560 140Z"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"
      />
      {/* Europe */}
      <path
        d="M380 130 C395 120, 420 118, 435 130 C445 140, 442 158, 430 165 C415 172, 395 168, 385 158 C375 148, 372 138, 380 130Z"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"
      />
      {/* North America */}
      <path
        d="M120 135 C145 120, 195 118, 225 135 C248 148, 252 170, 238 188 C220 208, 190 215, 165 208 C138 200, 118 180, 115 162 C112 148, 112 142, 120 135Z"
        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5"
      />
      {/* Africa (partial) */}
      <path
        d="M390 220 C405 215, 425 218, 432 235 C438 250, 428 268, 412 272 C396 276, 382 260, 382 245 C382 232, 385 224, 390 220Z"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"
      />
      {/* South America (partial) */}
      <path
        d="M195 230 C210 225, 228 228, 232 245 C236 260, 224 278, 210 280 C196 282, 186 268, 188 252 C190 238, 192 232, 195 230Z"
        fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"
      />

      {/* ===== Shipping Routes ===== */}

      {/* Air route: Shanghai → Los Angeles (blue, dashed arc) */}
      <path
        d="M620 180 C560 100, 440 90, 360 130 C300 158, 260 175, 210 180"
        stroke="rgba(59,130,246,0.55)" strokeWidth="2" strokeDasharray="10 6" fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-32" dur="2.5s" repeatCount="indefinite" />
      </path>

      {/* Sea route: Shanghai → Rotterdam/Hamburg (teal, longer bottom arc) */}
      <path
        d="M640 240 C680 270, 730 285, 780 265 C820 250, 845 235, 860 225"
        stroke="rgba(13,148,136,0.5)" strokeWidth="2.5" strokeDasharray="8 5" fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-26" dur="3.5s" repeatCount="indefinite" />
      </path>

      {/* Sea route 2: Asia → Europe via Indian Ocean */}
      <path
        d="M600 255 C560 285, 500 300, 450 290 C410 282, 390 265, 380 250"
        stroke="rgba(13,148,136,0.35)" strokeWidth="1.5" strokeDasharray="6 4" fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="4s" repeatCount="indefinite" />
      </path>

      {/* Ground route: Europe → warehouse (amber) */}
      <path
        d="M60 280 C120 275, 160 270, 210 265"
        stroke="rgba(249,115,22,0.5)" strokeWidth="2" strokeDasharray="6 4" fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-20" dur="2s" repeatCount="indefinite" />
      </path>

      {/* Secondary air route: shorter hop */}
      <path
        d="M435 155 C415 125, 395 118, 380 140"
        stroke="rgba(14,165,233,0.45)" strokeWidth="1.5" strokeDasharray="5 4" fill="none"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="-18" dur="2s" repeatCount="indefinite" />
      </path>

      {/* ===== Airplane ===== */}
      <g>
        <animateMotion dur="8s" repeatCount="indefinite" rotate="auto">
          <mpath href="#air-path" />
        </animateMotion>
        {/* Airplane body */}
        <g transform="translate(-10, -6)">
          <path
            d="M10 6 L18 2 L20 4 L13 7 L20 10 L18 12 L10 8 L4 10 L5 8 L4 6 L5 4 L10 6Z"
            fill="rgba(147,197,253,0.95)"
          />
        </g>
      </g>

      {/* ===== Ship ===== */}
      <g>
        <animateMotion dur="14s" repeatCount="indefinite" rotate="auto">
          <mpath href="#sea-path" />
        </animateMotion>
        <g transform="translate(-12, -7)">
          {/* Ship hull */}
          <path d="M4 8 Q12 12 20 8 L18 6 L6 6 Z" fill="rgba(94,234,212,0.85)" />
          {/* Ship deck */}
          <rect x="8" y="3" width="8" height="4" rx="1" fill="rgba(94,234,212,0.7)" />
          {/* Funnel */}
          <rect x="11" y="1" width="3" height="3" rx="0.5" fill="rgba(94,234,212,0.6)" />
        </g>
      </g>

      {/* ===== Truck ===== */}
      <g>
        <animateMotion dur="5s" repeatCount="indefinite" rotate="auto">
          <mpath href="#truck-path" />
        </animateMotion>
        <g transform="translate(-10, -7)">
          {/* Cab */}
          <rect x="12" y="2" width="8" height="8" rx="1.5" fill="rgba(253,186,116,0.9)" />
          {/* Trailer */}
          <rect x="2" y="3" width="10" height="7" rx="1" fill="rgba(253,186,116,0.75)" />
          {/* Wheels */}
          <circle cx="5" cy="11" r="2" fill="rgba(253,186,116,0.6)" />
          <circle cx="16" cy="11" r="2" fill="rgba(253,186,116,0.6)" />
        </g>
      </g>

      {/* ===== City Nodes ===== */}

      {/* Shanghai */}
      <g>
        <circle cx="632" cy="192" r="7" fill="rgba(59,130,246,0.25)" stroke="rgba(59,130,246,0.8)" strokeWidth="1.5">
          <animate attributeName="r" values="6;9;6" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="632" cy="192" r="3" fill="#60a5fa" />
        {/* Pulse ring */}
        <circle cx="632" cy="192" r="14" stroke="rgba(59,130,246,0.3)" strokeWidth="1" fill="none">
          <animate attributeName="r" values="10;20;10" dur="2.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="2.5s" repeatCount="indefinite" />
        </circle>
        <text x="648" y="196" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="system-ui">上海</text>
      </g>

      {/* Los Angeles */}
      <g>
        <circle cx="195" cy="185" r="7" fill="rgba(16,185,129,0.25)" stroke="rgba(16,185,129,0.8)" strokeWidth="1.5">
          <animate attributeName="r" values="6;9;6" dur="3s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="1;0.6;1" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="195" cy="185" r="3" fill="#34d399" />
        <circle cx="195" cy="185" r="14" stroke="rgba(16,185,129,0.3)" strokeWidth="1" fill="none">
          <animate attributeName="r" values="10;20;10" dur="3s" begin="1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="3s" begin="1s" repeatCount="indefinite" />
        </circle>
        <text x="200" y="175" fontSize="10" fill="rgba(255,255,255,0.6)" fontFamily="system-ui">Los Angeles</text>
      </g>

      {/* Rotterdam/Europe */}
      <g>
        <circle cx="380" cy="148" r="5" fill="rgba(249,115,22,0.25)" stroke="rgba(249,115,22,0.8)" strokeWidth="1.5">
          <animate attributeName="r" values="4;7;4" dur="3.5s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="380" cy="148" r="2.5" fill="#fb923c" />
        <text x="385" y="143" fontSize="9" fill="rgba(255,255,255,0.5)" fontFamily="system-ui">Rotterdam</text>
      </g>

      {/* New York */}
      <g>
        <circle cx="230" cy="155" r="4" fill="rgba(167,139,250,0.25)" stroke="rgba(167,139,250,0.7)" strokeWidth="1.5">
          <animate attributeName="r" values="3;6;3" dur="4s" begin="1.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="230" cy="155" r="2" fill="#a78bfa" />
        <text x="235" y="150" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="system-ui">New York</text>
      </g>

      {/* Dubai */}
      <g>
        <circle cx="500" cy="222" r="4" fill="rgba(251,191,36,0.25)" stroke="rgba(251,191,36,0.7)" strokeWidth="1.5">
          <animate attributeName="r" values="3;6;3" dur="3s" begin="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="500" cy="222" r="2" fill="#fbbf24" />
        <text x="505" y="217" fontSize="9" fill="rgba(255,255,255,0.45)" fontFamily="system-ui">Dubai</text>
      </g>

      {/* ===== Floating Package Icons ===== */}

      {/* Package on air route (mid-point) */}
      <g transform="translate(390, 95)">
        <animateTransform attributeName="transform" type="translate"
          values="390,95;388,88;390,95" dur="3s" repeatCount="indefinite" />
        <rect x="0" y="3" width="14" height="12" rx="1.5" fill="rgba(59,130,246,0.3)" stroke="rgba(147,197,253,0.6)" strokeWidth="1" />
        <line x1="0" y1="7" x2="14" y2="7" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        <line x1="7" y1="7" x2="7" y2="15" stroke="rgba(147,197,253,0.4)" strokeWidth="0.8" />
        <path d="M2 3 L7 0 L12 3" stroke="rgba(147,197,253,0.5)" strokeWidth="0.8" fill="none" />
      </g>

      {/* Small moving dots on sea route */}
      <circle r="3" fill="rgba(94,234,212,0.7)">
        <animateMotion
          path="M640 240 C680 270, 730 285, 780 265 C820 250, 845 235, 860 225"
          dur="10s" repeatCount="indefinite" />
      </circle>

      {/* ===== Ambient particles ===== */}
      {[
        { cx: 120, cy: 100, r: 1.5, o: 0.3, d: "2.5s" },
        { cx: 750, cy: 90, r: 1.5, o: 0.25, d: "3s" },
        { cx: 800, cy: 340, r: 1, o: 0.2, d: "4s" },
        { cx: 100, cy: 350, r: 1, o: 0.2, d: "3.5s" },
        { cx: 500, cy: 80, r: 1.5, o: 0.25, d: "2s" },
        { cx: 300, cy: 360, r: 1, o: 0.15, d: "5s" },
        { cx: 720, cy: 360, r: 1.5, o: 0.2, d: "4s" },
      ].map(({ cx, cy, r, o, d }, i) => (
        <circle key={i} cx={cx} cy={cy} r={r} fill={`rgba(255,255,255,${o})`}>
          <animate attributeName="opacity" values={`${o};${o * 2};${o}`} dur={d} repeatCount="indefinite" />
        </circle>
      ))}
    </svg>
  );
}
