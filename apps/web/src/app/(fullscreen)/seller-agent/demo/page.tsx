"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { scenarios, type ChatMessage, type CardType } from "./scenario-data";
import {
  CargoRecognitionCard,
  QuoteComparisonCard,
  SpecialCargoCard,
  BulkBasicQuoteCard,
  ExpertConnectCard,
  ExpertQuotesCard,
  BulkOrderDetailCard,
  BulkInquiryCard,
  ExceptionHealingCard,
  ShipmentCreatedCard,
  CostTrendCard,
} from "./cards";

// ── 卡片渲染分发 ───────────────────────────────────────────
function renderCard(
  type: CardType,
  stepIndex: number,
  selectedTierId: string,
  onTierSelect: (tierId: string) => void,
  expertModeActive: boolean,
  quoteValidationError: string,
  onRouteSelectionChange: (ids: string[]) => void,
  onCardAction: () => void,
) {
  switch (type) {
    case "cargo-recognition": return <CargoRecognitionCard />;
    case "quote-comparison": return (
      <QuoteComparisonCard
        selectedTierId={selectedTierId}
        onTierSelect={onTierSelect}
        validationError={quoteValidationError}
        onRouteSelectionChange={onRouteSelectionChange}
      />
    );
    case "special-cargo":
      return <SpecialCargoCard selectedTierId={selectedTierId} onTierSelect={onTierSelect} />;
    case "bulk-basic-quote": return <BulkBasicQuoteCard />;
    case "expert-connect": return <ExpertConnectCard onStartFullSearch={onCardAction} />;
    case "expert-quotes": return <ExpertQuotesCard onProviderConfirm={onCardAction} />;
    case "bulk-inquiry": return <BulkInquiryCard mode={expertModeActive ? "expert" : "basic"} onLockComplete={onCardAction} />;
    case "bulk-order-detail": return <BulkOrderDetailCard />;
    case "exception-healing": return <ExceptionHealingCard />;
    case "shipment-created": return <ShipmentCreatedCard selectedTierId={selectedTierId} />;
    case "cost-trend": return <CostTrendCard />;
    default: return null;
  }
}

// ── 消息气泡 ───────────────────────────────────────────────
function MessageBubble({
  msg,
  onQuickReply,
  stepIndex,
  selectedTierId,
  onTierSelect,
  expertModeActive,
  quoteValidationError,
  onRouteSelectionChange,
  onCardAction,
}: {
  msg: ChatMessage;
  onQuickReply: (text: string) => void;
  stepIndex: number;
  selectedTierId: string;
  onTierSelect: (tierId: string) => void;
  expertModeActive: boolean;
  quoteValidationError: string;
  onRouteSelectionChange: (ids: string[]) => void;
  onCardAction: () => void;
}) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-[#7c3aed] text-white font-bold shadow-sm">
          A
        </div>
      )}
      <div className={`max-w-[84%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-line ${
            isUser
              ? "bg-[#7c3aed] text-white rounded-tr-sm"
              : "bg-white border border-slate-200 text-slate-700 rounded-tl-sm shadow-sm"
          }`}
        >
          {msg.text}
        </div>
        {msg.card && (
          <div className="w-full">
            {renderCard(msg.card, stepIndex, selectedTierId, onTierSelect, expertModeActive, quoteValidationError, onRouteSelectionChange, onCardAction)}
          </div>
        )}
        {msg.quickReplies && msg.quickReplies.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {msg.quickReplies.map((qr) => (
              <button
                key={qr}
                onClick={() => onQuickReply(qr)}
                className="text-xs px-3 py-1.5 rounded-full border border-[#7c3aed]/20 text-[#7c3aed] bg-[#7c3aed]/5 hover:bg-[#7c3aed]/10 hover:border-[#7c3aed]/30 transition-all active:scale-95"
              >
                {qr}
              </button>
            ))}
          </div>
        )}
      </div>
      {isUser && (
        <div className="w-7 h-7 rounded-full flex-shrink-0 bg-slate-200 flex items-center justify-center text-xs text-slate-600 font-bold">
          我
        </div>
      )}
    </div>
  );
}

// ── 打字中动画 ─────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center text-sm text-white font-bold flex-shrink-0">
        A
      </div>
      <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
        <div className="flex gap-1 items-center">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-[#7c3aed]/40 inline-block animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── 线性 SVG 图标库（与 Accio Work 参考一致：1.6px 描边、24x24 viewBox）─────
const NavIcon = ({ children }: { children: React.ReactNode }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="flex-shrink-0"
  >
    {children}
  </svg>
);

const Icons = {
  newMessage: <NavIcon><path d="M12 5v14M5 12h14" /></NavIcon>,
  agent: (
    <NavIcon>
      <path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3z" />
      <path d="M19 14l.7 1.9L21.5 16.6 19.7 17.3 19 19.2 18.3 17.3 16.5 16.6 18.3 15.9 19 14z" />
    </NavIcon>
  ),
  plugin: (
    <NavIcon>
      <path d="M9 3h3v3a1.5 1.5 0 0 0 3 0V3h3a1 1 0 0 1 1 1v3h-1.5a1.5 1.5 0 0 0 0 3H21v3a1 1 0 0 1-1 1h-3v-1.5a1.5 1.5 0 0 0-3 0V21H9a1 1 0 0 1-1-1v-3.5a1.5 1.5 0 0 0-3 0V20a1 1 0 0 1-1 1H1" />
    </NavIcon>
  ),
  capability: <NavIcon><path d="M13 2L4 14h7l-1 8 9-12h-7l1-8z" /></NavIcon>,
  schedule: (
    <NavIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </NavIcon>
  ),
  appAuth: (
    <NavIcon>
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </NavIcon>
  ),
  skill: <NavIcon><path d="M12 3l2 5 5 1-3.5 3.5L17 18l-5-3-5 3 1.5-5.5L5 9l5-1 2-5z" /></NavIcon>,
  channel: (
    <NavIcon>
      <path d="M21 12a8 8 0 1 1-3.4-6.5L21 4v6h-6" />
      <path d="M8 12h.01M12 12h.01M16 12h.01" />
    </NavIcon>
  ),
  pairAuth: (
    <NavIcon>
      <circle cx="9" cy="8" r="3" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M3 19c.6-3.3 3-5 6-5s5.4 1.7 6 5" />
      <path d="M14.5 14.5c1-.3 1.7-.5 2.5-.5 2.5 0 4.2 1.3 4.7 3.8" />
    </NavIcon>
  ),
  package: (
    <NavIcon>
      <path d="M21 8l-9-5-9 5 9 5 9-5z" />
      <path d="M3 8v8l9 5 9-5V8" />
      <path d="M3 8l9 5 9-5" />
    </NavIcon>
  ),
  alertTri: (
    <NavIcon>
      <path d="M10.3 3.7L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.7a2 2 0 0 0-3.4 0z" />
      <path d="M12 9v4M12 17h.01" />
    </NavIcon>
  ),
  ship: (
    <NavIcon>
      <path d="M3 18s2 2 4.5 2 4.5-2 4.5-2 2 2 4.5 2S21 18 21 18" />
      <path d="M5 14l1-7h12l1 7" />
      <path d="M12 4v3" />
      <path d="M9 14V9h6v5" />
    </NavIcon>
  ),
  exception: (
    <NavIcon>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5M12 16h.01" />
    </NavIcon>
  ),
  chart: (
    <NavIcon>
      <path d="M3 3v18h18" />
      <path d="M7 16V11M12 16V8M17 16v-3" />
    </NavIcon>
  ),
  chevronDown: <NavIcon><path d="M6 9l6 6 6-6" /></NavIcon>,
  settings: (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
    </svg>
  ),
};

// ── 左侧导航（参考 Accio Work 浅色主题）─────────────────────
function SideNav({ activeScenario, onSelect }: { activeScenario: string; onSelect: (id: string) => void }) {
  const scenarioIcons: Record<string, React.ReactNode> = {
    quote:     Icons.package,
    special:   Icons.alertTri,
    bulk:      Icons.ship,
    exception: Icons.exception,
    insight:   Icons.chart,
  };
  const scenarioLabels: Record<string, string> = {
    quote:     "中小件询价",
    special:   "特货发运",
    bulk:      "大件询价",
    exception: "异常售后处理",
    insight:   "成本优化分析",
  };

  // 顶部主菜单（参考图：新消息高亮，其余常态）
  const topNavItems = [
    { label: "新消息", icon: Icons.newMessage, active: true  },
    { label: "智能体", icon: Icons.agent,      active: false },
    { label: "插件",   icon: Icons.plugin,     active: false },
    { label: "能力",   icon: Icons.capability, active: false },
  ];

  // 子菜单（能力下属）
  const subItems = [
    { label: "定时任务", icon: Icons.schedule },
    { label: "应用授权", icon: Icons.appAuth },
    { label: "技能",     icon: Icons.skill },
    { label: "消息渠道", icon: Icons.channel },
    { label: "配对授权", icon: Icons.pairAuth },
  ];

  return (
    <div className="w-[260px] bg-[#eef3ef] flex flex-col h-full flex-shrink-0 select-none border-r border-[#dde4df]">
      {/* Logo — Accio Work 品牌区 */}
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

      {/* 物流场景区（保留原选择逻辑） */}
      <div className="px-5 pb-1.5 flex items-center gap-2">
        <span className="text-[#5d6b64]">{Icons.chevronDown}</span>
        <span className="text-[12.5px] text-[#3f4a44] font-medium">物流场景</span>
        <span
          className="text-[9px] text-[#0f3a2e] px-1.5 py-[1px] rounded font-semibold tracking-wider"
          style={{ background: "rgba(15,58,46,0.08)" }}
        >
          AGENT
        </span>
      </div>

      <div className="px-3 space-y-[2px] flex-1 overflow-y-auto">
        {scenarios.map((s) => {
          const isActive = s.id === activeScenario;
          return (
            <div
              key={s.id}
              onClick={() => onSelect(s.id)}
              className={`flex items-center gap-3 px-3 h-9 rounded-lg cursor-pointer text-[13.5px] transition-all ${
                isActive
                  ? "bg-white text-[#111827] shadow-[0_1px_2px_rgba(15,23,42,0.04)] font-medium"
                  : "text-[#3f4a44] hover:bg-white/60"
              }`}
            >
              <span className={isActive ? "text-[#0f3a2e]" : "text-[#5d6b64]"}>
                {scenarioIcons[s.id]}
              </span>
              <span className="truncate">{scenarioLabels[s.id]}</span>
            </div>
          );
        })}
      </div>

      {/* 底部用户信息 */}
      <div className="px-4 py-3.5 border-t border-[#dde4df] flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#8b5cf6] to-[#6d28d9] flex items-center justify-center text-white text-[13px] font-bold flex-shrink-0">
          P
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-[#111827] text-[13px] font-medium truncate leading-tight">pi da feng</span>
          <span className="text-[#6b7280] text-[11px] truncate leading-tight mt-0.5">团队空间</span>
        </div>
        <button
          className="ml-auto text-[#6b7280] hover:text-[#111827] transition-colors flex-shrink-0"
          aria-label="设置"
        >
          {Icons.settings}
        </button>
      </div>
    </div>
  );
}

// ── 主对话区域 ─────────────────────────────────────────────
// steps 结构：[user, agent, user, agent, ...] 交替
// stepCounts 跟踪已展示的总步数（含 user + agent 步）
// 点击发送：立刻展示 user 步，经 typing 延迟后展示 agent 步
export default function SellerAgentDemo() {
  const [activeId, setActiveId] = useState(scenarios[0].id);
  const [stepCounts, setStepCounts] = useState<Record<string, number>>({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTierId, setSelectedTierId] = useState("standard");
  const [expertModeActive, setExpertModeActive] = useState(false);
  const [quoteValidationError, setQuoteValidationError] = useState("");
  const [quoteSelectedRouteIds, setQuoteSelectedRouteIds] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scenario = scenarios.find((s) => s.id === activeId)!;
  const currentStep = stepCounts[activeId] ?? 0;
  const totalSteps = scenario.steps.length;

  // 已展示的消息（扁平化）
  const visibleMessages: ChatMessage[] = [];
  for (let i = 0; i < currentStep; i++) {
    scenario.steps[i]?.forEach((m) => visibleMessages.push({ ...m, id: `${m.id}-${i}` }));
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages.length, isTyping]);

  const handleSelectScenario = (id: string) => {
    setActiveId(id);
    setInputValue("");
    setIsTyping(false);
    setExpertModeActive(false);
    setQuoteValidationError("");
    setQuoteSelectedRouteIds([]);
  };

  // 一次发送推进两步：立刻展示 user 消息，延迟后展示 agent 回复
  const advanceRound = useCallback(() => {
    const cur = stepCounts[activeId] ?? 0;
    if (cur >= totalSteps) return;
    const userStep = cur;
    const agentStep = cur + 1;

    // 检测是否进入专家模式（bulk 场景第2步用户选择升级）
    if (activeId === "bulk" && userStep === 1) {
      setExpertModeActive(true);
    }

    // 立刻推进 user 步（user 消息出现在气泡里）
    setStepCounts((prev) => ({ ...prev, [activeId]: userStep + 1 }));
    // 如果后面还有 agent 步，显示 typing 后推进
    if (agentStep < totalSteps) {
      const agentMsg = scenario.steps[agentStep]?.[0];
      const expertCards = ["expert-connect", "expert-quotes", "bulk-order-detail"];
      const delay = agentMsg?.card && expertCards.includes(agentMsg.card) ? 1500 : 900;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setStepCounts((prev) => ({ ...prev, [activeId]: agentStep + 1 }));
      }, delay);
    }
  }, [activeId, stepCounts, totalSteps, scenario.steps]);

  // 卡片内部触发下一步（无需 user 输入）— 用于 ExpertConnectCard、BulkInquiryCard 等
  const triggerAgentStep = useCallback(() => {
    setStepCounts((prev) => {
      const cur = prev[activeId] ?? 0;
      const nextAgentStep = cur; // current position is already pointing to next agent msg
      if (nextAgentStep >= totalSteps) return prev;
      const agentMsg = scenario.steps[nextAgentStep]?.[0];
      const expertCards = ["expert-quotes", "bulk-order-detail"];
      const delay = agentMsg?.card && expertCards.includes(agentMsg.card) ? 1200 : 600;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setStepCounts((p) => ({ ...p, [activeId]: nextAgentStep + 1 }));
      }, delay);
      return prev; // don't change yet, wait for timeout
    });
  }, [activeId, totalSteps, scenario.steps]);

  const handleSend = () => {
    const textToSend = inputValue.trim() || suggestedInput.trim();
    if (!textToSend) return;
    const cur = stepCounts[activeId] ?? 0;
    if (cur >= totalSteps) return;
    setInputValue("");
    advanceRound();
  };

  const handleQuickReply = (text: string) => {
    // 创建物流订单前校验：更多线路模式下必须恰好选 1 条线路
    if (text === "帮我创建物流订单") {
      if (quoteSelectedRouteIds.length > 1) {
        setQuoteValidationError("请只勾选一条线路后再创建物流订单（当前已选 " + quoteSelectedRouteIds.length + " 条）");
        return;
      }
      // 若未选更多线路（使用三档位），则直接通过；否则选了刚好 1 条也通过
      setQuoteValidationError("");
    }
    setInputValue(text);
    setTimeout(() => {
      setInputValue("");
      advanceRound();
    }, 200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isFinished = currentStep >= totalSteps;
  const nextStepMsg = scenario.steps[currentStep]?.[0];
  const suggestedInput =
    !isFinished && !isTyping && nextStepMsg?.role === "user" ? nextStepMsg.text : "";

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      {/* 左侧导航 */}
      <SideNav activeScenario={activeId} onSelect={handleSelectScenario} />

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {/* 场景说明横幅 */}
        <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm shadow-purple-500/15 flex-shrink-0">
            <span className="text-white text-sm">{scenario.icon}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-slate-800 text-sm">{scenario.title}</span>
              <span className="text-[11px] bg-[#7c3aed]/8 text-[#7c3aed] px-2 py-0.5 rounded-full font-medium border border-[#7c3aed]/15">{scenario.valueTag}</span>
            </div>
            <div className="text-xs text-slate-400 truncate mt-0.5">{scenario.subtitle}</div>
          </div>
          <button
            onClick={() => setStepCounts((prev) => ({ ...prev, [activeId]: 0 }))}
            className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 flex-shrink-0"
          >
            ↺ 重置
          </button>
        </div>

        {/* 对话区域 */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* 欢迎语 */}
          {currentStep === 0 && (
            <div className="flex items-end gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center text-sm text-white font-bold flex-shrink-0">A</div>
              <div className="max-w-[84%] space-y-2">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 shadow-sm">
                  你好！我是你的<strong>跨境物流副驾驶</strong> 🚢<br />
                  告诉我你要发什么货、发去哪里，我来帮你找最合适的方案。<br />
                  <span className="text-slate-400 text-xs mt-1 block">当前演示场景：{scenario.title}</span>
                </div>
              </div>
            </div>
          )}

          {/* 对话消息 */}
          {visibleMessages.map((msg, i) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              onQuickReply={handleQuickReply}
              stepIndex={Math.floor(i / 2)}
              selectedTierId={selectedTierId}
              onTierSelect={setSelectedTierId}
              expertModeActive={expertModeActive}
              quoteValidationError={quoteValidationError}
              onRouteSelectionChange={setQuoteSelectedRouteIds}
              onCardAction={triggerAgentStep}
            />
          ))}

          {/* 打字中 */}
          {isTyping && <TypingIndicator />}

          {/* 结束提示 */}
          {isFinished && !isTyping && (
            <div className="flex justify-center">
              <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5">
                ✅ 场景演示完毕 · 点击左侧导航切换其他场景
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* 底部输入区 */}
        <div className="border-t border-slate-200 px-6 py-4 bg-white flex-shrink-0">
          <div className="flex items-end gap-3">
            <div className="flex-1 relative">
              <textarea
                value={inputValue !== "" ? inputValue : suggestedInput}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={isFinished ? "场景已完成，切换其他场景继续演示..." : "输入你的需求，或点击发送按钮推进演示..."}
                rows={1}
                disabled={isFinished}
                className="w-full resize-none border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]/40 transition-all bg-slate-50/50 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ minHeight: "44px", maxHeight: "120px" }}
              />
            </div>
            <button
              onClick={handleSend}
              disabled={isFinished || isTyping}
              className="px-4 py-3 bg-[#7c3aed] text-white rounded-xl text-sm font-medium hover:bg-[#6d28d9] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 shadow-sm shadow-purple-500/15 flex items-center gap-1.5 flex-shrink-0"
            >
              <span>发送</span>
              <span className="text-base">↑</span>
            </button>
          </div>
          <div className="mt-2 text-xs text-slate-400 text-center">
            {!isFinished && !isTyping && currentStep < scenario.steps.length
              ? `💡 点击「发送」推进演示，或直接点击蓝色快捷回复按钮`
              : ""}
          </div>
        </div>
      </div>
    </div>
  );
}
