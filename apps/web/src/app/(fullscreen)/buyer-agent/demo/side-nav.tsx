"use client";

import { scenarios, promptCategories } from "./scenario-data";

const NavIcon = ({ children }: { children: React.ReactNode }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
    {children}
  </svg>
);

const Icons = {
  newMessage: <NavIcon><path d="M12 5v14M5 12h14" /></NavIcon>,
  agent: <NavIcon><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" /><path d="M19 14l.7 1.9L21.5 16.6 19.7 17.3 19 19.2 18.3 17.3 16.5 16.6 18.3 15.9 19 14z" /></NavIcon>,
  plugin: <NavIcon><path d="M9 3h3v3a1.5 1.5 0 0 0 3 0V3h3a1 1 0 0 1 1 1v3h-1.5a1.5 1.5 0 0 0 0 3H21v3a1 1 0 0 1-1 1h-3v-1.5a1.5 1.5 0 0 0-3 0V21H9a1 1 0 0 1-1-1v-3.5a1.5 1.5 0 0 0-3 0V20a1 1 0 0 1-1 1H1" /></NavIcon>,
  capability: <NavIcon><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></NavIcon>,
  schedule: <NavIcon><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></NavIcon>,
  appAuth: <NavIcon><rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" /><rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" /></NavIcon>,
  skill: <NavIcon><path d="M12 3l2 5 5 1-3.5 3.5L17 18l-5-3-5 3 1.5-5.5L5 9l5-1 2-5z" /></NavIcon>,
  channel: <NavIcon><path d="M21 12a8 8 0 1 1-3.4-6.5L21 4v6h-6" /><path d="M8 12h.01M12 12h.01M16 12h.01" /></NavIcon>,
  pairAuth: <NavIcon><circle cx="9" cy="8" r="3" /><circle cx="17" cy="9" r="2.5" /><path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5" /><path d="M14.5 14.5c1-.3 1.7-.5 2.5-.5 2.5 0 4.2 1.3 4.7 3.8" /></NavIcon>,
  package: <NavIcon><path d="M21 8l-9-5-9 5 9 5 9-5z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M3 8l9 5 9-5" /></NavIcon>,
  alertTri: <NavIcon><path d="M10.3 3.7L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></NavIcon>,
  ship: <NavIcon><path d="M3 18s2 2 4.5 2 4.5-2 4.5-2 2 2 4.5 2S21 18 21 18" /><path d="M5 14l1-7h12l1 7" /><path d="M12 4v3" /><path d="M9 14V9h6v5" /></NavIcon>,
  exception: <NavIcon><circle cx="12" cy="12" r="9" /><path d="M12 7v5M12 16h.01" /></NavIcon>,
  chart: <NavIcon><path d="M3 3v18h18" /><path d="M7 16V11M12 16V8M17 16v-3" /></NavIcon>,
  chevronDown: <NavIcon><path d="M6 9l6 6 6-6" /></NavIcon>,
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  home: <NavIcon><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></NavIcon>,
};

interface SideNavProps {
  viewMode: "home" | "scene";
  activeScenario: string;
  activeCategoryId: string | null;
  onSelectHome: () => void;
  onSelectCategory: (categoryId: string) => void;
  onSelectScene: (sceneId: string) => void;
}

export function SideNav({ viewMode, activeScenario, activeCategoryId, onSelectHome, onSelectCategory, onSelectScene }: SideNavProps) {
  const scenarioIcons: Record<string, React.ReactNode> = {
    "small-parcel": Icons.package,
    bulk: Icons.ship,
    compliance: Icons.alertTri,
  };
  const scenarioLabels: Record<string, string> = {
    "small-parcel": "Small Parcel TLC",
    bulk: "Bulk Inquiry",
    compliance: "Compliance Check",
  };

  const topNavItems = [
    { label: "New Message", icon: Icons.newMessage, active: true },
    { label: "Agent", icon: Icons.agent, active: false },
    { label: "Plugin", icon: Icons.plugin, active: false },
    { label: "Capability", icon: Icons.capability, active: false },
  ];

  const subItems = [
    { label: "Schedule", icon: Icons.schedule },
    { label: "App Auth", icon: Icons.appAuth },
    { label: "Skill", icon: Icons.skill },
    { label: "Channel", icon: Icons.channel },
    { label: "Pair Auth", icon: Icons.pairAuth },
  ];

  const isHomeActive = viewMode === "home";

  return (
    <div className="w-[260px] bg-[#eef3ef] flex flex-col h-full flex-shrink-0 select-none border-r border-[#dde4df]">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
          <defs>
            <linearGradient id="acc-mark-buyer" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1ec396" />
              <stop offset="100%" stopColor="#0d6e5a" />
            </linearGradient>
          </defs>
          <path d="M16 2L30 16 16 30 2 16z" fill="url(#acc-mark-buyer)" />
          <path d="M10.5 21l5.5-12 5.5 12h-3.2L16 16.4 13.7 21h-3.2z" fill="#fff" />
        </svg>
        <span
          className="text-[#0f3a2e] text-[19px] tracking-tight leading-none"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontWeight: 600 }}
        >
          Accio<span style={{ fontWeight: 800 }}> Work</span>
        </span>
      </div>

      {/* Top nav */}
      <div className="px-3 pt-1 space-y-[2px]">
        {topNavItems.map((item) => (
          <div
            key={item.label}
            className={`flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer transition-all text-[13.5px] ${
              item.active
                ? "bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.04)]"
                : "text-[#3f4a44] hover:bg-white/60"
            }`}
          >
            <span className={item.active ? "text-[#0f3a2e]" : "text-[#5d6b64]"}>{item.icon}</span>
            <span className={item.active ? "font-medium" : ""}>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Sub menu */}
      <div className="px-3 mt-0.5 space-y-[2px]">
        {subItems.map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer text-[13.5px] text-[#3f4a44] hover:bg-white/60 transition-all"
          >
            <span className="text-[#5d6b64]">{item.icon}</span>
            <span>{item.label}</span>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="mx-5 my-3 h-px bg-[#dde4df]" />

      {/* Import Copilot section */}
      <div className="px-5 pb-1.5 flex items-center gap-2">
        <span className="text-[#5d6b64]">{Icons.chevronDown}</span>
        <span className="text-[12.5px] text-[#3f4a44] font-medium">Import Copilot</span>
        <span
          className="text-[9px] text-[#0f3a2e] px-1.5 py-[1px] rounded font-semibold tracking-wider"
          style={{ background: "rgba(15,58,46,0.08)" }}
        >
          AGENT
        </span>
      </div>

      {/* Home entry */}
      <div className="px-3 pb-1 space-y-[2px]">
        <div
          onClick={onSelectHome}
          className={`flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer text-[13.5px] transition-all ${
            isHomeActive
              ? "bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-medium"
              : "text-[#3f4a44] hover:bg-white/60"
          }`}
        >
          <span className={isHomeActive ? "text-[#0f3a2e]" : "text-[#5d6b64]"}>{Icons.home}</span>
          <span>Copilot Home</span>
        </div>
      </div>

      {/* Prompt categories */}
      <div className="px-3 space-y-[2px] flex-1 overflow-y-auto">
        {promptCategories.map((cat) => {
          const isActive = !isHomeActive && activeCategoryId === cat.id;
          const firstPrompt = cat.prompts[0];
          return (
            <div key={cat.id} className="space-y-[2px]">
              <div
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-3 px-3 h-8 rounded-lg cursor-pointer text-[13px] transition-all ${
                  isActive
                    ? "bg-white/80 text-[#111827] font-medium"
                    : "text-[#3f4a44] hover:bg-white/60"
                }`}
              >
                <span className={isActive ? "text-[#0f3a2e]" : "text-[#5d6b64]"}>{cat.icon}</span>
                <span className="truncate">{cat.label}</span>
              </div>
              <div
                onClick={() => {
                  if (firstPrompt?.targetScene) {
                    onSelectScene(firstPrompt.targetScene);
                  } else {
                    onSelectCategory(cat.id);
                  }
                }}
                className="flex items-center gap-2 px-3 pl-9 h-7 rounded-lg cursor-pointer text-[12px] text-[#6b7280] hover:bg-white/40 transition-all group"
                title={firstPrompt?.text}
              >
                <span className="w-1 h-1 rounded-full bg-[#9ca3af] flex-shrink-0 group-hover:bg-[#7c3aed]" />
                <span className="truncate">{firstPrompt?.text}</span>
              </div>
            </div>
          );
        })}

        {/* More scenes */}
        <div className="mx-2 my-2 h-px bg-[#dde4df]" />
        <div className="px-2 pb-1 text-[11px] text-[#9ca3af] font-medium">More Scenes</div>
        {scenarios.map((s) => {
          const isActive = !isHomeActive && activeScenario === s.id;
          return (
            <div
              key={s.id}
              onClick={() => onSelectScene(s.id)}
              className={`flex items-center gap-3 px-3 h-8 rounded-lg cursor-pointer text-[13px] transition-all ${
                isActive
                  ? "bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-medium"
                  : "text-[#3f4a44] hover:bg-white/60"
              }`}
            >
              <span className={isActive ? "text-[#0f3a2e]" : "text-[#5d6b64]"}>{scenarioIcons[s.id]}</span>
              <span className="truncate">{scenarioLabels[s.id]}</span>
            </div>
          );
        })}
      </div>

      {/* Back to Logistics Expert */}
      <div className="px-3 py-2">
        <div
          onClick={() => { window.location.href = "/seller-agent/demo"; }}
          className="flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer text-[13px] text-[#5d6b64] hover:bg-white/60 transition-all group"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          <span className="group-hover:text-[#0f3a2e] transition-colors">Back to Logistics Expert</span>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3.5 border-t border-[#dde4df] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">B</div>
        <div className="flex flex-col min-w-0">
          <span className="text-[#111827] text-[13px] font-medium truncate leading-tight">Buyer User</span>
          <span className="text-[#6b7280] text-[11px] truncate leading-tight mt-0.5">Team Workspace</span>
        </div>
        <button className="ml-auto text-[#6b7280] hover:text-[#111827] transition-colors flex-shrink-0" aria-label="Settings">
          {Icons.settings}
        </button>
      </div>
    </div>
  );
}
