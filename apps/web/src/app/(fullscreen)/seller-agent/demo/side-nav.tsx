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
  chevronDown: <NavIcon><path d="M6 9l6 6 6-6" /></NavIcon>,
  settings: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
  // 物流专家首页专用图标（罗盘样式）
  logisticsHome: (
    <NavIcon>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3" />
      <path d="M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1" />
    </NavIcon>
  ),
  // 进口助手图标（全球/地球样式）
  importCopilot: (
    <NavIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2z" />
    </NavIcon>
  ),
};

// 所有会话条目（提示词统一展示）
interface SessionItem {
  id: string;
  text: string;
  targetScene?: string;
}

function buildSessionItems(): SessionItem[] {
  const items: SessionItem[] = [];
  // 从所有分类中抽取所有提示词（去除分类标题）
  promptCategories.forEach((cat) => {
    cat.prompts.forEach((p) => {
      items.push({ id: p.id, text: p.text, targetScene: p.targetScene });
    });
  });
  // 追加 5 大场景（更多场景）作为会话条目
  const scenarioPrompts: SessionItem[] = [
    { id: "sc-special", text: "帮我发一批蓝牙耳机去英国，5公斤", targetScene: "special" },
    { id: "sc-exception", text: "我有个单子卡在美国清关好多天了", targetScene: "exception" },
    { id: "sc-insight", text: "帮我看看最近发货的成本情况，有没有优化空间", targetScene: "insight" },
  ];
  scenarioPrompts.forEach((s) => {
    if (!items.find((i) => i.targetScene === s.targetScene)) {
      items.push(s);
    }
  });
  return items;
}

const sessionItems = buildSessionItems();

interface SideNavProps {
  viewMode: "home" | "scene";
  activeScenario: string;
  activeSessionId: string | null;
  onSelectHome: () => void;
  onSelectSession: (item: SessionItem) => void;
}

export type { SessionItem };

export function SideNav({ viewMode, activeScenario, activeSessionId, onSelectHome, onSelectSession }: SideNavProps) {
  const topNavItems = [
    { label: "新消息", icon: Icons.newMessage, active: true },
    { label: "智能体", icon: Icons.agent, active: false },
    { label: "插件", icon: Icons.plugin, active: false },
    { label: "能力", icon: Icons.capability, active: false },
  ];

  const subItems = [
    { label: "定时任务", icon: Icons.schedule },
    { label: "应用授权", icon: Icons.appAuth },
    { label: "技能", icon: Icons.skill },
    { label: "消息渠道", icon: Icons.channel },
    { label: "配对授权", icon: Icons.pairAuth },
  ];

  const isHomeActive = viewMode === "home";

  return (
    <div className="w-[260px] bg-[#eef3ef] flex flex-col h-full flex-shrink-0 select-none border-r border-[#dde4df]">
      {/* Logo */}
      <div className="px-5 pt-5 pb-4 flex items-center gap-2">
        <svg width="26" height="26" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
          <defs>
            <linearGradient id="acc-mark" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1ec396" />
              <stop offset="100%" stopColor="#0d6e5a" />
            </linearGradient>
          </defs>
          <path d="M16 2L30 16 16 30 2 16z" fill="url(#acc-mark)" />
          <path d="M10.5 21l5.5-12 5.5 12h-3.2L16 16.4 13.7 21h-3.2z" fill="#fff" />
        </svg>
        <span
          className="text-[#0f3a2e] text-[19px] tracking-tight leading-none"
          style={{ fontFamily: "'Plus Jakarta Sans', 'Inter', system-ui, sans-serif", fontWeight: 600 }}
        >
          Accio<span style={{ fontWeight: 800 }}> Work</span>
        </span>
      </div>

      {/* 顶部主导航 */}
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

      {/* 子菜单 */}
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

      {/* 分割线 */}
      <div className="mx-5 my-3 h-px bg-[#dde4df]" />

      {/* 会话区域标题 */}
      <div className="px-5 pb-1.5 flex items-center gap-2">
        <span className="text-[#5d6b64]">{Icons.chevronDown}</span>
        <span className="text-[12.5px] text-[#3f4a44] font-medium">会话</span>
        <span
          className="text-[9px] text-[#0f3a2e] px-1.5 py-[1px] rounded font-semibold tracking-wider"
          style={{ background: "rgba(15,58,46,0.08)" }}
        >
          AGENT
        </span>
      </div>

      {/* 物流专家入口（首页） */}
      <div className="px-3 pb-1">
        <div
          onClick={onSelectHome}
          className={`flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer text-[13.5px] transition-all ${
            isHomeActive
              ? "bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-medium"
              : "text-[#3f4a44] hover:bg-white/60"
          }`}
        >
          <span className={isHomeActive ? "text-[#0f3a2e]" : "text-[#5d6b64]"}>{Icons.logisticsHome}</span>
          <span>物流专家</span>
        </div>
      </div>

      {/* 分割线：物流专家与进口助手之间 */}
      <div className="mx-5 my-2 h-px bg-[#dde4df]" />

      {/* Import Copilot 区域标题 */}
      <div className="px-5 pb-1.5 flex items-center gap-2">
        <span className="text-[#5d6b64]">{Icons.chevronDown}</span>
        <span className="text-[12.5px] text-[#3f4a44] font-medium">Import Copilot</span>
        <span
          className="text-[9px] text-[#7c3aed] px-1.5 py-[1px] rounded font-semibold tracking-wider"
          style={{ background: "rgba(124,58,237,0.08)" }}
        >
          AGENT
        </span>
      </div>

      {/* Import Copilot Home 入口 */}
      <div className="px-3 pb-1">
        <div
          onClick={() => { window.location.href = "/buyer-agent/demo"; }}
          className="flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer text-[13.5px] text-[#3f4a44] hover:bg-white/60 transition-all"
        >
          <span className="text-[#5d6b64]">{Icons.importCopilot}</span>
          <span>Import Copilot Home</span>
        </div>
      </div>

      {/* Import Copilot 子场景 */}
      <div className="px-3 space-y-[2px]">
        {[
          { label: "Small Parcel TLC" },
          { label: "Bulk Inquiry" },
          { label: "Compliance Check" },
        ].map((item) => (
          <div
            key={item.label}
            onClick={() => { window.location.href = "/buyer-agent/demo"; }}
            className="flex items-center gap-2 px-3 pl-9 h-8 rounded-lg cursor-pointer text-[12.5px] text-[#6b7280] hover:bg-white/60 transition-all group"
          >
            <span className="w-1 h-1 rounded-full bg-[#9ca3af] flex-shrink-0 group-hover:bg-[#7c3aed]" />
            <span className="truncate">{item.label}</span>
          </div>
        ))}
      </div>

      {/* 分割线：进口助手与会话列表之间 */}
      <div className="mx-5 my-2 h-px bg-[#dde4df]" />

      {/* 会话列表（所有提示词，无分类标题） */}
      <div className="px-3 space-y-[2px] flex-1 overflow-y-auto pb-2">
        {sessionItems.map((item) => {
          const isActive = !isHomeActive && activeSessionId === item.id;
          return (
            <div
              key={item.id}
              onClick={() => onSelectSession(item)}
              className={`flex items-center gap-2 px-3 h-8 rounded-lg cursor-pointer text-[12.5px] transition-all ${
                isActive
                  ? "bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-medium"
                  : "text-[#3f4a44] hover:bg-white/60"
              }`}
              title={item.text}
            >
              <span className="w-1 h-1 rounded-full bg-[#c4cfc7] flex-shrink-0" />
              <span className="truncate">{item.text}</span>
            </div>
          );
        })}
      </div>

      {/* 底部用户信息 */}
      <div className="px-4 py-3.5 border-t border-[#dde4df] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">P</div>
        <div className="flex flex-col min-w-0">
          <span className="text-[#111827] text-[13px] font-medium truncate leading-tight">pi da feng</span>
          <span className="text-[#6b7280] text-[11px] truncate leading-tight mt-0.5">团队空间</span>
        </div>
        <button className="ml-auto text-[#6b7280] hover:text-[#111827] transition-colors flex-shrink-0" aria-label="设置">
          {Icons.settings}
        </button>
      </div>
    </div>
  );
}
