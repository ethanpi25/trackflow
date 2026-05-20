"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { scenarios, promptCategories, type ChatMessage, type CardType } from "./scenario-data";
import { PromptHome } from "./prompt-home";
import { SideNav } from "./side-nav";
import {
  DemandConfirmationCard,
  TLCBreakdownCard,
  ComplianceDiagnosisCard,
  ChannelComparisonCard,
  BulkQuoteComparisonCard,
  AlibabaLogisticsDetailCard,
  CostWaterfallCard,
} from "./cards";

// ── Card render dispatcher ─────────────────────────────────
function renderCard(type: CardType) {
  switch (type) {
    case "demand-confirmation":
      return <DemandConfirmationCard />;
    case "tlc-breakdown":
      return <TLCBreakdownCard />;
    case "cost-waterfall":
      return <CostWaterfallCard />;
    case "compliance-diagnosis":
      return <ComplianceDiagnosisCard />;
    case "channel-comparison":
      return <ChannelComparisonCard />;
    case "bulk-quote-comparison":
      return <BulkQuoteComparisonCard />;
    case "alibaba-logistics-detail":
      return <AlibabaLogisticsDetailCard />;
    default:
      return null;
  }
}

// ── Message Bubble ─────────────────────────────────────────
function MessageBubble({
  msg,
  onQuickReply,
}: {
  msg: ChatMessage;
  onQuickReply: (text: string) => void;
}) {
  const isUser = msg.role === "user";

  return (
    <div className={`flex items-end gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 bg-[#7c3aed] text-white font-bold shadow-sm">
          A
        </div>
      )}
      <div
        className={`max-w-[84%] space-y-2 ${isUser ? "items-end" : "items-start"} flex flex-col`}
      >
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
            {renderCard(msg.card)}
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
          Me
        </div>
      )}
    </div>
  );
}

// ── Typing Indicator ─────────────────────────────────────
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

// ── Main Page ──────────────────────────────────────────────
export default function BuyerAgentDemo() {
  const [viewMode, setViewMode] = useState<"home" | "scene">("home");
  const [activeId, setActiveId] = useState(scenarios[0].id);
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null);
  const [stepCounts, setStepCounts] = useState<Record<string, number>>({});
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pendingAdvanceRef = useRef<string | null>(null);

  const scenario = scenarios.find((s) => s.id === activeId)!;
  const currentStep = stepCounts[activeId] ?? 0;
  const totalSteps = scenario.steps.length;

  // Flatten visible messages
  const visibleMessages: ChatMessage[] = [];
  for (let i = 0; i < currentStep; i++) {
    scenario.steps[i]?.forEach((m) => visibleMessages.push({ ...m, id: `${m.id}-${i}` }));
  }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [visibleMessages.length, isTyping]);

  // Advance round: show user msg, then typing, then agent msg
  const advanceRound = useCallback(() => {
    const cur = stepCounts[activeId] ?? 0;
    if (cur >= totalSteps) return;
    const userStep = cur;
    const agentStep = cur + 1;

    setStepCounts((prev) => ({ ...prev, [activeId]: userStep + 1 }));
    if (agentStep < totalSteps) {
      const agentMsg = scenario.steps[agentStep]?.[0];
      const hasCard = agentMsg?.card;
      const delay = hasCard ? 1500 : 900;
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
        setStepCounts((prev) => ({ ...prev, [activeId]: agentStep + 1 }));
      }, delay);
    }
  }, [activeId, stepCounts, totalSteps, scenario.steps]);

  // Trigger advanceRound after scene switch committed by handlePromptClick
  useEffect(() => {
    const pendingScene = pendingAdvanceRef.current;
    if (pendingScene) {
      pendingAdvanceRef.current = null;
      setInputValue("");
      advanceRound();
    }
  }, [advanceRound]);

  const handleSelectHome = () => {
    setViewMode("home");
    setActiveCategoryId(null);
  };

  const handleSelectCategory = (categoryId: string) => {
    setViewMode("scene");
    setActiveCategoryId(categoryId);
    const cat = promptCategories.find((c) => c.id === categoryId);
    const targetScene = cat?.prompts[0]?.targetScene;
    if (targetScene) {
      setActiveId(targetScene);
      setStepCounts((prev) => ({ ...prev, [targetScene]: 0 }));
    }
    setInputValue("");
    setIsTyping(false);
  };

  const handleSelectScene = (sceneId: string) => {
    setViewMode("scene");
    setActiveId(sceneId);
    setActiveCategoryId(null);
    setInputValue("");
    setIsTyping(false);
  };

  const handleSend = () => {
    const textToSend = inputValue.trim();
    if (!textToSend) return;
    const cur = stepCounts[activeId] ?? 0;
    if (cur >= totalSteps) return;
    setInputValue("");
    advanceRound();
  };

  const handleQuickReply = (text: string) => {
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

  const handlePromptClick = (text: string, targetScene?: string) => {
    if (targetScene) {
      setViewMode("scene");
      setActiveId(targetScene);
      setActiveCategoryId(null);
      setStepCounts((prev) => ({ ...prev, [targetScene]: 0 }));
      setInputValue(text);
      // Flag the scene for advanceRound — useEffect will fire after state is committed
      pendingAdvanceRef.current = targetScene;
    } else {
      setViewMode("scene");
      setInputValue(text);
    }
  };

  const isFinished = currentStep >= totalSteps;
  const nextStepMsg = scenario.steps[currentStep]?.[0];
  const suggestedInput =
    !isFinished && !isTyping && nextStepMsg?.role === "user" ? nextStepMsg.text : "";

  return (
    <div className="flex h-screen bg-[#f0f2f5] overflow-hidden">
      {/* Side Nav */}
      <SideNav
        viewMode={viewMode}
        activeScenario={activeId}
        activeCategoryId={activeCategoryId}
        onSelectHome={handleSelectHome}
        onSelectCategory={handleSelectCategory}
        onSelectScene={handleSelectScene}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-white min-w-0">
        {viewMode === "home" ? (
          <PromptHome onPromptClick={handlePromptClick} />
        ) : (
          <>
            {/* Scene Banner */}
            <div className="px-6 py-3 bg-white border-b border-slate-100 flex items-center gap-3 flex-shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#7c3aed] to-[#6d28d9] flex items-center justify-center shadow-sm shadow-purple-500/15 flex-shrink-0">
                <span className="text-white text-sm">{scenario.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-800 text-sm">{scenario.title}</span>
                  <span className="text-[11px] bg-[#7c3aed]/8 text-[#7c3aed] px-2 py-0.5 rounded-full font-medium border border-[#7c3aed]/15">
                    {scenario.valueTag}
                  </span>
                </div>
                <div className="text-xs text-slate-400 truncate mt-0.5">{scenario.subtitle}</div>
              </div>
              <button
                onClick={() => setStepCounts((prev) => ({ ...prev, [activeId]: 0 }))}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1 flex-shrink-0"
              >
                ↺ Reset
              </button>
            </div>

            {/* Chat Area */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {/* Welcome */}
              {currentStep === 0 && (
                <div className="flex items-end gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#7c3aed] flex items-center justify-center text-sm text-white font-bold flex-shrink-0">
                    A
                  </div>
                  <div className="max-w-[84%] space-y-2">
                    <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 shadow-sm">
                      Hi! I&apos;m your <strong>Import Cost &amp; Compliance Copilot</strong> 🧮<br />
                      Tell me what you want to source, where it&apos;s going, and the quantity.<br />
                      I&apos;ll calculate the total landed cost and compliance requirements for you.<br />
                      <span className="text-slate-400 text-xs mt-1 block">Current demo: {scenario.title}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Messages */}
              {visibleMessages.map((msg) => (
                <MessageBubble
                  key={msg.id}
                  msg={msg}
                  onQuickReply={handleQuickReply}
                />
              ))}

              {/* Typing */}
              {isTyping && <TypingIndicator />}

              {/* Finished */}
              {isFinished && !isTyping && (
                <div className="flex justify-center">
                  <div className="text-xs text-slate-400 bg-slate-50 border border-slate-200 rounded-full px-4 py-1.5">
                    ✅ Demo complete · Switch scenes via the left sidebar
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-slate-200 px-6 py-4 bg-white flex-shrink-0">
              <div className="flex items-end gap-3">
                <div className="flex-1 relative">
                  <textarea
                    value={inputValue !== "" ? inputValue : suggestedInput}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={isFinished ? "Demo complete, switch to another scene..." : "Type your request or click Send to advance..."}
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
                  <span>Send</span>
                  <span className="text-base">↑</span>
                </button>
              </div>
              <div className="mt-2 text-xs text-slate-400 text-center">
                {!isFinished && !isTyping && currentStep < scenario.steps.length
                  ? `💡 Click "Send" to advance, or click quick reply buttons above`
                  : ""}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}