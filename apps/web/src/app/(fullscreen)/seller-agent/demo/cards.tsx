"use client";

import { allQuoteChannels, quoteTiers, bulkSeaRoutes, bulkAirRoutes, expertProviders, expertDetailFields, mockTradeOrders, type TradeOrder } from "./scenario-data";
import { useState, useEffect, useRef } from "react";

// ── 颜色常量 ───────────────────────────────────────────────
const ROUTE_COLORS = ["#7c3aed", "#2563eb", "#16a34a", "#d97706", "#dc2626", "#0891b2"];


// ── 多线路雷达图（叠加多边形，支持自定义维度）───────────────
function MultiRadarChart({ routes, size = 240, dimensions }: {
  routes: { dims: Record<string, number>; color: string; name: string }[];
  size?: number;
  dimensions?: { keys: string[]; labels: string[] };
}) {
  const dims = dimensions ?? { keys: ["cost", "time", "stability", "service", "risk"], labels: ["成本", "时效", "稳定性", "服务", "风险"] };
  const { keys, labels } = dims;
  const cx = size / 2, cy = size / 2, r = size * 0.375;
  const angles = keys.map((_, i) => (Math.PI * 2 * i) / keys.length - Math.PI / 2);
  const labelOffset = r + 16;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* 背景网格 */}
        {[0.25, 0.5, 0.75, 1].map((lv) => (
          <polygon key={lv}
            points={angles.map((a) => `${cx + lv * r * Math.cos(a)},${cy + lv * r * Math.sin(a)}`).join(" ")}
            fill="none" stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {/* 轴线 */}
        {angles.map((a, i) => (
          <line key={i} x1={cx} y1={cy}
            x2={cx + r * Math.cos(a)} y2={cy + r * Math.sin(a)}
            stroke="#e2e8f0" strokeWidth="1" />
        ))}
        {/* 多线路叠加多边形 */}
        {routes.map((route, ri) => {
          const pts = keys.map((k, i) => {
            const v = (route.dims[k] / 10) * r;
            return [cx + v * Math.cos(angles[i]), cy + v * Math.sin(angles[i])];
          });
          const poly = pts.map(([x, y]) => `${x},${y}`).join(" ");
          return (
            <g key={ri}>
              <polygon points={poly} fill={`${route.color}15`} stroke={route.color} strokeWidth="2" />
              {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill={route.color} />)}
            </g>
          );
        })}
        {/* 轴标签 */}
        {angles.map((a, i) => (
          <text key={i}
            x={cx + labelOffset * Math.cos(a)} y={cy + labelOffset * Math.sin(a)}
            textAnchor="middle" dominantBaseline="middle" fontSize="10" fill="#64748b">
            {labels[i]}
          </text>
        ))}
      </svg>
      {/* 图例 */}
      <div className="flex flex-wrap gap-3 justify-center">
        {routes.map((route, i) => (
          <div key={i} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: route.color }} />
            <span className="font-medium text-slate-700">{route.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 辅助：根据档位 ID 找渠道 ────────────────────────────────
function getTierChannel(tierId: string) {
  const tier = quoteTiers.find((t) => t.id === tierId);
  if (!tier) return allQuoteChannels[0]; // fallback: 云途
  return allQuoteChannels.find((ch) => ch.id === tier.channelId) ?? allQuoteChannels[0];
}

// ── 辅助：计算预计到达日期 ──────────────────────────────────
function computeDeliveryWindow(daysStr: string): string {
  const match = daysStr.match(/(\d+)-(\d+)/);
  if (!match) return daysStr;
  const min = parseInt(match[1], 10);
  const max = parseInt(match[2], 10);
  const now = new Date();
  const fmt = (d: Date) => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const start = new Date(now); start.setDate(start.getDate() + min);
  const end = new Date(now); end.setDate(end.getDate() + max);
  return `${fmt(start)} – ${fmt(end)}`;
}

// ── 卡片一：货物识别确认卡 ────────────────────────────────
export function CargoRecognitionCard() {
  return (
    <div className="rounded-2xl border border-blue-100 bg-gradient-to-br from-blue-50/80 to-white p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-2">
        <span className="text-base">📦</span>
        <span className="text-sm font-semibold text-blue-700">货物信息 — AI 解析完成</span>
        <span className="ml-auto text-[11px] bg-blue-100 text-blue-500 px-2 py-0.5 rounded-full">
          ✓ 自动识别
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-xs">
        {[
          { k: "品类", v: "手机壳" },
          { k: "重量", v: "3 kg" },
          { k: "目的地", v: "美国 🇺🇸" },
          { k: "货物类型", v: "中小件" },
          { k: "含锂电池", v: "否 ✅" },
          { k: "含液体", v: "否 ✅" },
        ].map(({ k, v }) => (
          <div key={k} className="bg-white rounded-xl px-3 py-2 border border-slate-100 shadow-sm">
            <div className="text-slate-400 text-[10px] mb-0.5">{k}</div>
            <div className="font-semibold text-slate-700">{v}</div>
          </div>
        ))}
      </div>
      <div className="flex items-center gap-2 bg-blue-600/5 border border-blue-100 rounded-xl px-3 py-2 text-xs">
        <span>🎯</span>
        <span className="text-slate-600">
          策略识别：<strong className="text-blue-600">时效 / 成本均衡</strong>
          <span className="text-slate-400 ml-1">（从「快点但不要太贵」自动推断）</span>
        </span>
      </div>
    </div>
  );
}

// ── 卡片二：双层比价（3 档位 + 更多线路）────────────────
const PAGE_SIZE = 5;
const DIM_KEYS = ["cost", "time", "stability", "service", "risk"] as const;
const DIM_LABELS = ["成本", "时效", "稳定性", "服务", "风险"];

export function QuoteComparisonCard({
  selectedTierId,
  onTierSelect,
  validationError,
  onRouteSelectionChange,
}: {
  selectedTierId: string;
  onTierSelect: (tierId: string) => void;
  validationError?: string;
  onRouteSelectionChange?: (ids: string[]) => void;
}) {
  const [showRouteList, setShowRouteList] = useState(false);
  const [selectedRouteIds, setSelectedRouteIds] = useState<string[]>([]);
  const [radarVisibleIds, setRadarVisibleIds] = useState<string[]>([]);
  const [showCompareRadar, setShowCompareRadar] = useState(false);
  const [routePage, setRoutePage] = useState(0);

  const standardChannel = getTierChannel("standard");
  const premiumChannel = getTierChannel("premium");
  const savings = premiumChannel.price - standardChannel.price;
  const savingsPct = Math.round((savings / premiumChannel.price) * 100);

  // 按综合评分排序的全量线路
  const sortedRoutes = [...allQuoteChannels].sort((a, b) => b.score - a.score);
  const totalPages = Math.ceil(sortedRoutes.length / PAGE_SIZE);
  const pageRoutes = sortedRoutes.slice(routePage * PAGE_SIZE, (routePage + 1) * PAGE_SIZE);

  const toggleRoute = (id: string) => {
    setSelectedRouteIds((prev) => {
      let next: string[];
      if (prev.includes(id)) {
        setRadarVisibleIds((rv) => rv.filter((r) => r !== id));
        next = prev.filter((r) => r !== id);
      } else {
        if (prev.length >= 5) return prev;
        setRadarVisibleIds((rv) => [...rv, id]);
        next = [...prev, id];
      }
      onRouteSelectionChange?.(next);
      return next;
    });
  };

  const toggleRadarVisible = (id: string) => {
    setRadarVisibleIds((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  // 获取摘要强弱分析（top 2 优势 / bottom 2 劣势）
  const getSummary = (dims: Record<string, number>) => {
    const sorted = [...DIM_KEYS]
      .map((k, i) => ({ key: k, label: DIM_LABELS[i], val: dims[k] }))
      .sort((a, b) => b.val - a.val);
    return {
      strengths: sorted.slice(0, 2),
      weaknesses: sorted.slice(-2).reverse(),
    };
  };

  return (
    <div className="space-y-3">
      {/* ── Layer 1: 3 档位卡片 ── */}
      <div className="flex gap-2">
        {quoteTiers.map((tier) => {
          const ch = getTierChannel(tier.id);
          const isSelected = selectedTierId === tier.id;
          return (
            <div
              key={tier.id}
              onClick={() => {
                onTierSelect(tier.id);
                // 选择档位时清除更多线路选择（两者互斥）
                if (selectedRouteIds.length > 0) {
                  setSelectedRouteIds([]);
                  setRadarVisibleIds([]);
                  onRouteSelectionChange?.([]);
                }
              }}
              className={`flex-1 min-w-0 rounded-xl border-2 p-3 cursor-pointer transition-all relative ${
                isSelected
                  ? "border-[#7c3aed] bg-white shadow-md shadow-purple-500/10"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              {/* 单选按钮 */}
              <div className="absolute top-3 right-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-[#7c3aed]" : "border-slate-300"
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />}
                </div>
              </div>

              {/* 标签 */}
              <div className="mb-2.5">
                {tier.tagStyle === "purple" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#7c3aed] text-white">
                    {tier.tag}
                  </span>
                ) : tier.tagStyle === "blue" ? (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-600 text-white">
                    {tier.tag}
                  </span>
                ) : (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-500 text-white">
                    {tier.tag}
                  </span>
                )}
              </div>

              {/* 预计到达 */}
              <div className="text-[11px] text-slate-500 mb-1.5">
                Delivery by {computeDeliveryWindow(ch.days)}
              </div>

              {/* 价格 */}
              <div className="text-xl font-black text-slate-800 mb-1.5">
                USD {ch.price.toFixed(2)}
              </div>

              {/* 承运信息 */}
              <div className="text-[11px] leading-snug">
                <span className="font-medium text-slate-700">{tier.label} via </span>
                <span className="font-semibold" style={{ color: "#ff6a00" }}>Alibaba.com</span>
                <span className="text-slate-400"> Logistics</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI 推荐理由（含个人历史偏好） */}
      <div className="bg-[#7c3aed]/5 border border-[#7c3aed]/15 rounded-xl px-3.5 py-2.5 text-xs space-y-1.5">
        <div className="flex items-start gap-2">
          <span className="flex-shrink-0 mt-0.5">💡</span>
          <span className="text-slate-600">
            <strong className="text-[#7c3aed]">AI 推荐 Standard</strong>：性价比最优，比 Premium 省 ${savings.toFixed(2)} ({savingsPct}%)，比 Economy 快约 3 天
          </span>
        </div>
        <div className="flex items-start gap-2 border-t border-[#7c3aed]/10 pt-1.5">
          <span className="flex-shrink-0 mt-0.5">🕐</span>
          <span className="text-slate-500">
            <strong className="text-slate-600">历史偏好参考：</strong>你过去 30 天有 23 票走云途小包，准点率满意度 94%，与 Standard 档位一致
          </span>
        </div>
      </div>

      {/* ── 更多线路 切换 ── */}
      <button
        onClick={() => {
          const next = !showRouteList;
          setShowRouteList(next);
          if (!next) {
            setSelectedRouteIds([]);
            setRadarVisibleIds([]);
            setShowCompareRadar(false);
            setRoutePage(0);
          }
        }}
        className={`w-full flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
          showRouteList
            ? "bg-[#7c3aed] text-white shadow-md shadow-purple-500/20"
            : "bg-[#7c3aed]/8 border border-[#7c3aed]/30 text-[#7c3aed] hover:bg-[#7c3aed]/15"
        }`}
      >
        <span className="flex items-center gap-2">
          <span className="text-base leading-none">{showRouteList ? "▲" : "▼"}</span>
          <span>{showRouteList ? "收起线路" : "更多线路"}</span>
        </span>
        <span className={`text-[11px] ${showRouteList ? "text-white/70" : "text-[#7c3aed]/60"}`}>
          {allQuoteChannels.length} 条线路 · 多维雷达对比
        </span>
      </button>

      {/* ── Layer 2: 线路列表 ── */}
      {showRouteList && (
        <div className="space-y-2 border border-[#7c3aed]/15 rounded-xl p-3 bg-purple-50/30">
          {/* 表头 */}
          <div className="grid grid-cols-[28px_1fr_60px_70px_60px_48px] gap-1.5 text-[10px] text-slate-400 font-medium px-1">
            <span></span>
            <span>线路</span>
            <span className="text-right">价格</span>
            <span className="text-right">时效</span>
            <span className="text-right">准点率</span>
            <span className="text-right">评分</span>
          </div>

          {/* 当前页线路行 */}
          {pageRoutes.map((ch) => {
            const globalIdx = sortedRoutes.findIndex((r) => r.id === ch.id);
            const isChecked = selectedRouteIds.includes(ch.id);
            const isDisabled = !isChecked && selectedRouteIds.length >= 5;
            return (
              <div
                key={ch.id}
                onClick={() => !isDisabled && toggleRoute(ch.id)}
                className={`grid grid-cols-[28px_1fr_60px_70px_60px_48px] gap-1.5 items-center rounded-lg px-1 py-2.5 text-xs transition-colors ${
                  isChecked ? "bg-[#7c3aed]/8 border border-[#7c3aed]/25" : "hover:bg-white/60 border border-transparent"
                } ${isDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                  isChecked ? "bg-[#7c3aed] border-[#7c3aed]" : "border-slate-300"
                }`}>
                  {isChecked && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-slate-700 truncate">{ch.name}</div>
                  <div className="text-[10px] text-slate-400 truncate">{ch.provider}</div>
                </div>
                <div className="text-right font-bold text-slate-700">${ch.price}</div>
                <div className="text-right text-slate-500">{ch.days}</div>
                <div className="text-right text-slate-500">{ch.onTimeRate}%</div>
                <div className="text-right font-bold" style={{ color: ROUTE_COLORS[globalIdx % ROUTE_COLORS.length] }}>{ch.score}</div>
              </div>
            );
          })}

          {/* 翻页控件 */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-1">
              <button
                onClick={() => setRoutePage((p) => Math.max(0, p - 1))}
                disabled={routePage === 0}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                ← 上一页
              </button>
              <span className="text-[11px] text-slate-400">
                {routePage + 1} / {totalPages}（共 {sortedRoutes.length} 条）
              </span>
              <button
                onClick={() => setRoutePage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={routePage === totalPages - 1}
                className="text-[11px] px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                下一页 →
              </button>
            </div>
          )}

          {/* 已选数量 + 雷达对比按钮 */}
          <div className="flex items-center justify-between pt-1 border-t border-[#7c3aed]/10">
            <span className="text-[11px] text-slate-500">
              已选 <strong className="text-[#7c3aed]">{selectedRouteIds.length}</strong>/5 条线路
            </span>
            <button
              onClick={() => setShowCompareRadar(!showCompareRadar)}
              disabled={selectedRouteIds.length < 2}
              className={`text-xs px-4 py-2 rounded-lg font-medium transition-all ${
                selectedRouteIds.length >= 2
                  ? "bg-[#7c3aed] text-white hover:bg-[#6d28d9] shadow-sm"
                  : "bg-slate-100 text-slate-400 cursor-not-allowed"
              }`}
            >
              {showCompareRadar ? "收起对比" : "📊 雷达对比"}
            </button>
          </div>

          {/* 多线路雷达对比 + 可点击图例 + Summary */}
          {showCompareRadar && selectedRouteIds.length >= 2 && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-4">
              <div className="text-xs font-semibold text-slate-600">📊 多维雷达对比</div>

              {/* 可点击图例（点击切换该线路在雷达上的显示） */}
              <div className="flex flex-wrap gap-2">
                {selectedRouteIds.map((id, i) => {
                  const ch = allQuoteChannels.find((c) => c.id === id)!;
                  const isVisible = radarVisibleIds.includes(id);
                  return (
                    <button
                      key={id}
                      onClick={() => toggleRadarVisible(id)}
                      className={`flex items-center gap-1.5 text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                        isVisible
                          ? "border-transparent text-white font-medium shadow-sm"
                          : "border-slate-200 text-slate-400 bg-white"
                      }`}
                      style={isVisible ? { background: ROUTE_COLORS[i % ROUTE_COLORS.length] } : {}}
                    >
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: ROUTE_COLORS[i % ROUTE_COLORS.length] }} />
                      {ch.name}
                      {isVisible ? " ✓" : " ○"}
                    </button>
                  );
                })}
              </div>

              {/* 雷达图（只显示 radarVisibleIds 中的线路） */}
              {radarVisibleIds.length >= 1 && (
                <MultiRadarChart
                  routes={radarVisibleIds.map((id) => {
                    const idx = selectedRouteIds.indexOf(id);
                    const ch = allQuoteChannels.find((c) => c.id === id)!;
                    return { dims: ch.scoreDims, color: ROUTE_COLORS[idx % ROUTE_COLORS.length], name: ch.name };
                  })}
                />
              )}
              {radarVisibleIds.length === 0 && (
                <div className="text-center text-xs text-slate-400 py-4">
                  点击上方标签显示对应线路
                </div>
              )}

              {/* 对比分析 Summary */}
              <div className="border-t border-slate-100 pt-3 space-y-2">
                <div className="text-xs font-semibold text-slate-600">对比分析 Summary</div>
                {selectedRouteIds.map((id, i) => {
                  const ch = allQuoteChannels.find((c) => c.id === id)!;
                  const { strengths, weaknesses } = getSummary(ch.scoreDims);
                  const color = ROUTE_COLORS[i % ROUTE_COLORS.length];
                  return (
                    <div key={id} className="rounded-lg border border-slate-100 p-2.5 space-y-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }} />
                        <span className="text-xs font-semibold text-slate-700">{ch.name}</span>
                        <span className="text-[10px] text-slate-400 ml-1">${ch.price} · {ch.days}</span>
                      </div>
                      <div className="flex gap-3 text-[11px]">
                        <div className="flex-1">
                          <span className="text-emerald-600 font-medium">▲ 优势：</span>
                          <span className="text-slate-600">{strengths.map((s) => `${s.label}(${s.val})`).join("、")}</span>
                        </div>
                        <div className="flex-1">
                          <span className="text-red-500 font-medium">▼ 劣势：</span>
                          <span className="text-slate-600">{weaknesses.map((w) => `${w.label}(${w.val})`).join("、")}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 线路选择校验提示 */}
      {validationError && (
        <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-3.5 py-2.5 text-xs">
          <span className="flex-shrink-0 text-red-500">⚠️</span>
          <span className="text-red-600 font-medium">{validationError}</span>
        </div>
      )}
    </div>
  );
}

// ── 卡片三：特货检测（自包含锂电/非锂电分支）──────────────
export function SpecialCargoCard({
  selectedTierId,
  onTierSelect,
}: {
  selectedTierId?: string;
  onTierSelect?: (tierId: string) => void;
}) {
  const [lithium, setLithium] = useState<"unknown" | "yes" | "no">("unknown");
  const [selectedSpecialIdx, setSelectedSpecialIdx] = useState<number | null>(null);

  // ── 初始检测询问 ──
  if (lithium === "unknown") {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 space-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          <span className="font-semibold text-amber-700 text-sm">特货风险检测</span>
          <span className="ml-auto text-[11px] bg-amber-100 text-amber-600 px-2 py-0.5 rounded-full">需确认</span>
        </div>
        <p className="text-sm text-slate-600">
          蓝牙耳机通常内含<strong>锂电池</strong>，属于航空运输危险品，若走普通渠道将面临：
        </p>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { icon: "❌", title: "退件损失", desc: "运费不退，货物原路返回" },
            { icon: "⛔", title: "清关扣押", desc: "目的国海关查扣，索赔困难" },
            { icon: "🔒", title: "账号封禁", desc: "承运商可能封停发货资质" },
          ].map((r) => (
            <div key={r.title} className="bg-white rounded-xl px-3 py-2.5 border border-amber-100 text-center">
              <div className="text-lg mb-1">{r.icon}</div>
              <div className="font-semibold text-slate-700 text-[11px]">{r.title}</div>
              <div className="text-slate-400 text-[10px] mt-0.5">{r.desc}</div>
            </div>
          ))}
        </div>
        <div className="flex gap-2 pt-1">
          <button
            onClick={() => setLithium("yes")}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-medium hover:bg-amber-600 transition-all shadow-sm"
          >
            🔋 有锂电池
          </button>
          <button
            onClick={() => setLithium("no")}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
          >
            ✅ 没有锂电池
          </button>
        </div>
      </div>
    );
  }

  // ── 无锂电池 → 切换到标准中小件询价逻辑 ──
  if (lithium === "no") {
    return (
      <div className="space-y-3">
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs">
          <span>✅</span>
          <span className="text-emerald-700 font-medium">已确认：无锂电池，切换至中小件标准比价模式</span>
        </div>
        <QuoteComparisonCard
          selectedTierId={selectedTierId ?? "standard"}
          onTierSelect={onTierSelect ?? (() => {})}
        />
      </div>
    );
  }

  // ── 有锂电池 → CE认证要求 + 锂电专线（类似档位卡片样式）──
  const lithiumTiers = [
    {
      id: "economy-li",
      label: "云途锂电线",
      tag: "经济",
      tagColor: "slate",
      price: 12.5,
      days: "10-14 天",
      onTimeRate: 91,
      badge: "✓ UN38.3",
      desc: "适合对时效要求不高的锂电普货",
    },
    {
      id: "standard-li",
      label: "4PX 特货线",
      tag: "AI 推荐",
      tagColor: "purple",
      price: 11.8,
      days: "9-13 天",
      onTimeRate: 92,
      badge: "✓ UN38.3",
      desc: "性价比最优，支持锂电池及锂电设备",
    },
    {
      id: "premium-li",
      label: "DHL 特货专线",
      tag: "最快",
      tagColor: "blue",
      price: 35.0,
      days: "3-5 天",
      onTimeRate: 99,
      badge: "✓ IATA",
      desc: "时效最快，完整 IATA 锂电合规资质",
    },
  ];

  return (
    <div className="space-y-3">
      {/* 锂电标记 banner */}
      <div className="rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 p-3.5 text-white shadow-md">
        <div className="text-[11px] opacity-80 mb-1">🔋 已标记含锂电特货 · 英国线路</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-base font-bold">2 家普通渠道已自动排除</span>
          </div>
          <div className="text-right text-[11px] opacity-90">
            <div>仅展示有锂电资质</div>
            <div className="font-bold text-yellow-200">3 家合规专线</div>
          </div>
        </div>
      </div>

      {/* CE 认证要求说明 */}
      <div className="rounded-xl border border-red-200 bg-red-50/60 p-3.5 space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-base">🇬🇧</span>
          <span className="text-sm font-bold text-red-700">英国 CE/UKCA 认证要求</span>
        </div>
        <div className="space-y-1.5 text-xs text-slate-600">
          {[
            { icon: "📋", text: "CE/UKCA 认证：无线设备须持有 RED 指令认证文件" },
            { icon: "🔋", text: "锂电池标签：需贴附 UN38.3 测试报告编号" },
            { icon: "📦", text: "包装标识：需显示 UKCA 标志（英国脱欧后适用）" },
          ].map((item) => (
            <div key={item.text} className="flex items-start gap-2">
              <span className="flex-shrink-0">{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-red-600 font-medium pt-0.5">
          ⚠️ 建议发货前核实认证文件有效期，避免清关被扣
        </div>
      </div>

      {/* 3 档位锂电专线卡片 */}
      <div className="flex gap-2">
        {lithiumTiers.map((tier, idx) => {
          const isSelected = selectedSpecialIdx === idx;
          return (
            <div
              key={tier.id}
              onClick={() => setSelectedSpecialIdx(isSelected ? null : idx)}
              className={`flex-1 min-w-0 rounded-xl border-2 p-3 cursor-pointer transition-all relative ${
                isSelected
                  ? "border-[#7c3aed] bg-white shadow-md shadow-purple-500/10"
                  : "border-slate-200 bg-slate-50 hover:border-slate-300"
              }`}
            >
              {/* 单选按钮 */}
              <div className="absolute top-3 right-3">
                <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? "border-[#7c3aed]" : "border-slate-300"
                }`}>
                  {isSelected && <div className="w-2 h-2 rounded-full bg-[#7c3aed]" />}
                </div>
              </div>

              {/* 档位标签 */}
              <div className="mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${
                  tier.tagColor === "purple" ? "bg-[#7c3aed]"
                  : tier.tagColor === "blue" ? "bg-blue-600"
                  : "bg-slate-500"
                }`}>{tier.tag}</span>
              </div>

              {/* 时效 */}
              <div className="text-[11px] text-slate-500 mb-1">
                {tier.days}
              </div>

              {/* 价格 */}
              <div className="text-xl font-black text-slate-800 mb-1">
                USD {tier.price.toFixed(2)}
              </div>

              {/* 承运 + 资质 */}
              <div className="text-[11px] leading-snug text-slate-600 font-medium truncate">{tier.label}</div>
              <div className="text-[10px] mt-0.5">
                <span className="bg-green-100 text-green-700 px-1.5 py-0.5 rounded font-medium">{tier.badge}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI 推荐说明 */}
      <div className="flex items-start gap-2 bg-[#7c3aed]/5 border border-[#7c3aed]/15 rounded-xl px-3.5 py-2.5 text-xs">
        <span className="flex-shrink-0">💡</span>
        <span className="text-slate-600">
          <strong className="text-[#7c3aed]">AI 推荐 4PX 特货线</strong>：性价比最优，UN38.3 完整资质，比 DHL 节省 ${(35.0 - 11.8).toFixed(2)}，适合蓝牙耳机等锂电小件
        </span>
      </div>

      {/* 建单提示 */}
      {selectedSpecialIdx !== null && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 rounded-xl px-3.5 py-2.5 text-xs">
          <span>✅</span>
          <span className="text-emerald-700">已选 <strong>{lithiumTiers[selectedSpecialIdx].label}</strong>，可点击「帮我创建物流订单」继续</span>
        </div>
      )}
    </div>
  );
}

// ── 卡片四：大件基础询价（海运 + 空运 Tab）─────────────
export function BulkBasicQuoteCard() {
  const [activeTab, setActiveTab] = useState<"sea" | "air">("sea");
  const [cargoInfo] = useState({
    type: "健身器材",
    weight: "约 2 吨",
    dest: "深圳 → 德国",
    transport: "海运",
  });
  const routes = activeTab === "sea" ? bulkSeaRoutes : bulkAirRoutes;
  const badgeBg: Record<string, string> = {
    blue: "bg-blue-600 text-white",
    amber: "bg-amber-500 text-white",
    purple: "bg-[#7c3aed] text-white",
  };

  return (
    <div className="space-y-3">
      {/* AI 货物解析摘要 */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-3.5 space-y-2.5">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">🤖</span>
          <span className="text-xs font-semibold text-blue-700">AI 货物解析结果</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: "货品类型", value: cargoInfo.type },
            { label: "重量 / 体积", value: cargoInfo.weight },
            { label: "目的地", value: cargoInfo.dest },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-lg px-2.5 py-2 border border-blue-100">
              <div className="text-[10px] text-slate-400 mb-0.5">{label}</div>
              <div className="text-xs font-semibold text-slate-700 truncate">{value}</div>
            </div>
          ))}
          <div className="col-span-3 flex gap-3 text-xs text-slate-500 mt-0.5">
            <span>运输方式：<strong className="text-slate-700">{cargoInfo.transport}</strong></span>
            <span>贸易术语：<strong className="text-slate-400">DDP 含税</strong></span>
          </div>
        </div>
      </div>

      {/* 顶部 banner */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-800 to-slate-700 p-3.5 text-white shadow-md">
        <div className="text-[11px] opacity-60 mb-1">大件 · 基础即时报价 · 深圳 → 德国 · DDP 门到门</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xl font-black">{activeTab === "sea" ? "$3.2" : "$18.5"}</span>
            <span className="text-sm opacity-70 ml-1">起 / kg</span>
          </div>
          <div className="text-right text-[11px]">
            <div className="opacity-60">{activeTab === "sea" ? "海运 门到门" : "空运 门到门"}</div>
            <div className="font-bold text-blue-300">{activeTab === "sea" ? "18-35 天到港" : "3-8 天到达"}</div>
          </div>
        </div>
      </div>

      {/* Tab 切换 */}
      <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
        {(["sea", "air"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-[#7c3aed] text-white shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span>{tab === "sea" ? "🌊" : "✈️"}</span>
            <span>{tab === "sea" ? "海运" : "空运"}</span>
          </button>
        ))}
      </div>

      {/* 线路列表 */}
      <div className="space-y-2">
        {routes.map((route) => (
          <div
            key={route.id}
            className={`rounded-xl border p-3.5 ${
              route.badgeStyle === "blue"
                ? "border-blue-200 bg-blue-50/30"
                : route.badgeStyle === "purple"
                ? "border-purple-200 bg-purple-50/30"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-2 mb-2">
              {route.badge && badgeBg[route.badgeStyle] && (
                <span className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${badgeBg[route.badgeStyle]}`}>
                  {route.badge}
                </span>
              )}
              <span className="text-sm font-bold text-slate-700">{route.carrier}</span>
            </div>
            <div className="flex items-start justify-between">
              <div>
                <div className="text-xs text-slate-500">{route.type}</div>
                <div className="text-xs text-slate-400 mb-2">{route.route}</div>
                <div className="flex flex-wrap gap-1">
                  {route.highlights.map((h) => (
                    <span key={h} className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{h}</span>
                  ))}
                </div>
              </div>
              <div className="text-right ml-3 flex-shrink-0">
                <div className="text-lg font-black text-blue-600 leading-tight">
                  ${route.price.toFixed(1)}<span className="text-xs font-medium text-slate-400 ml-0.5">{route.priceUnit.replace("$", "")}</span>
                </div>
                <div className="text-xs text-slate-500">{route.transitDays}</div>
                <div className="text-[10px] text-slate-400">准点率 {route.onTimeRate}%</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5">
        <span>ℹ️</span>
        <span className="text-slate-500">以上为参考报价，正式价格以确认为准。需要更精准的定制报价？升级专家模式获取全网比价 →</span>
      </div>
    </div>
  );
}

// ── 卡片五：大宗询价状态时间轴（含10s锁仓倒计时）──────────
export function BulkInquiryCard({
  mode = "basic",
  onLockComplete,
}: {
  mode?: "basic" | "expert";
  onLockComplete?: () => void;
}) {
  const [lockCountdown, setLockCountdown] = useState(10);
  const [lockDone, setLockDone] = useState(false);
  const onLockCompleteRef = useRef(onLockComplete);

  useEffect(() => {
    onLockCompleteRef.current = onLockComplete;
  });

  useEffect(() => {
    if (lockDone) return;
    const interval = setInterval(() => {
      setLockCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setLockDone(true);
          setTimeout(() => onLockCompleteRef.current?.(), 600);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [lockDone]);

  const steps = mode === "expert"
    ? [
        { label: "需求提交", time: "10:00", done: true },
        { label: "专家模式全网询价", time: "10:01", done: true },
        { label: "阿里巴巴认证连接 × 3", time: "10:02", done: true, note: "COSCO / DB Schenker / Kuehne+Nagel" },
        { label: "AI 方案生成", time: "10:03", done: true },
        { label: "准实时锁仓", time: "", done: lockDone, locking: !lockDone },
        { label: "开船提醒 / 监控", time: "2026-06-10（预计）", done: false },
      ]
    : [
        { label: "需求提交", time: "10:00", done: true },
        { label: "AI 方案生成", time: "10:02", done: true, note: "FCL 20GP 深圳→汉堡，$1,750/柜" },
        { label: "准实时锁仓", time: "", done: lockDone, locking: !lockDone },
        { label: "开船提醒 / 监控", time: "2026-06-10（预计）", done: false },
      ];

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3.5">
        <div className="flex items-center gap-2">
          <span className="text-sm">{mode === "expert" ? "🔗" : "🚢"}</span>
          <span className="text-sm font-bold text-slate-700">询价单 {mode === "expert" ? "#BLK-2026051802" : "#BLK-2026051801"}</span>
        </div>
        <span className={`text-[11px] px-2.5 py-1 rounded-full font-medium ${lockDone ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
          {lockDone ? "✅ 锁仓成功" : "⚡ 锁仓中"}
        </span>
      </div>
      <div className="space-y-0">
        {steps.map((step, i) => {
          const isLockingStep = (step as { locking?: boolean }).locking;
          const isDone = step.done;
          const isActive = (step as { active?: boolean }).active;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 ${
                  isDone ? "bg-blue-600 text-white" :
                  isActive ? "bg-amber-400 text-white ring-4 ring-amber-100" :
                  isLockingStep ? "bg-emerald-500 text-white ring-4 ring-emerald-100 animate-pulse" :
                  "bg-slate-200 text-slate-400"
                }`}>
                  {isDone ? "✓" : isLockingStep ? "⚡" : i + 1}
                </div>
                {i < steps.length - 1 && (
                  <div className={`w-0.5 h-6 mt-0.5 ${isDone ? "bg-blue-200" : "bg-slate-200"}`} />
                )}
              </div>
              <div className="pb-3 flex-1">
                <div className={`text-sm font-medium ${isDone ? "text-slate-700" : isActive ? "text-amber-700" : isLockingStep ? "text-emerald-700" : "text-slate-400"}`}>
                  {step.label}
                </div>
                {/* 锁仓步骤：显示倒计时进度条 */}
                {isLockingStep && (
                  <div className="mt-1.5 space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-emerald-600 font-medium">准实时锁仓中...</span>
                      <span className="text-emerald-500 font-bold">{lockCountdown}s</span>
                    </div>
                    <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full transition-all duration-1000"
                        style={{ width: `${((10 - lockCountdown) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                )}
                {isDone && step.label === "准实时锁仓" && (
                  <div className="text-xs text-emerald-500 font-medium mt-0.5">✅ 锁仓成功</div>
                )}
                {!isLockingStep && step.time && (
                  <div className={`text-xs ${isDone ? "text-slate-400" : isActive ? "text-amber-500 font-medium" : "text-slate-300"}`}>
                    {step.time}
                  </div>
                )}
                {(step as { note?: string }).note && (
                  <div className="text-[11px] text-blue-600 bg-blue-50 border border-blue-100 rounded-lg px-2.5 py-1.5 mt-1">
                    {(step as { note?: string }).note}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 卡片六：异常自愈诊断 ──────────────────────────────────
export function ExceptionHealingCard() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-r from-red-500 to-rose-600 p-3.5 text-white shadow-md">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-base">🚨</span>
          <span className="font-bold text-sm">异常检测 · 运单 JD0099112233</span>
          <span className="ml-auto text-[11px] bg-white/20 px-2 py-0.5 rounded-full">🟡 中等风险</span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {[
            { label: "异常类型", value: "清关延误" },
            { label: "已滞留", value: "72 小时", highlight: true },
            { label: "预计影响", value: "延误 3-5 天" },
          ].map((item) => (
            <div key={item.label} className="bg-white/10 rounded-lg px-2 py-1.5">
              <div className="opacity-70 text-[10px]">{item.label}</div>
              <div className={`font-bold ${item.highlight ? "text-yellow-300" : ""}`}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-blue-100 bg-blue-50/50 px-3.5 py-2.5 text-xs flex items-start gap-2">
        <span className="text-blue-500 text-base flex-shrink-0">🛡</span>
        <span className="text-slate-600">
          <strong className="text-blue-600">AI 主动发现</strong>——买家尚未投诉，你已提前掌握。
          买家投诉通常在延误 5 天后爆发，<strong className="text-blue-600">你现在还有 2-3 天窗口期</strong>可主动处理，保护店铺评分。
        </span>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-3.5 space-y-2">
        <div className="text-xs font-semibold text-slate-600 mb-2">AI 故障概率诊断</div>
        {[
          { reason: "清关文件缺失 / 信息不符", pct: 65, color: "#ef4444" },
          { reason: "海关随机抽查", pct: 25, color: "#f59e0b" },
          { reason: "目的地址信息有误", pct: 10, color: "#94a3b8" },
        ].map((r) => (
          <div key={r.reason} className="flex items-center gap-2.5 text-xs">
            <span className="text-slate-500 w-36 flex-shrink-0 truncate">{r.reason}</span>
            <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color }} />
            </div>
            <span className="w-8 text-right font-bold text-slate-600">{r.pct}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 卡片七：建单成功（含信用保障交易订单关联）────────────────
const TRACKING_EVENTS = [
  { time: "05-18 09:12", status: "done", label: "揽收成功", desc: "深圳网点已揽收，正在分拣" },
  { time: "05-18 14:35", status: "done", label: "已发出", desc: "已从深圳分拣中心发出，飞往美国" },
  { time: "05-19 02:10", status: "done", label: "到达目的国", desc: "货物已抵达洛杉矶，等待清关" },
  { time: "05-19 08:00", status: "active", label: "清关中", desc: "正在美国海关清关，预计 24h 完成" },
  { time: "预计 05-20", status: "pending", label: "派送中", desc: "" },
  { time: "预计 05-21", status: "pending", label: "签收完成", desc: "" },
];

type ShipmentView = "associate" | "select-trade" | "card" | "order" | "tracking";

export function ShipmentCreatedCard({ selectedTierId = "standard" }: { selectedTierId?: string }) {
  const [view, setView] = useState<ShipmentView>("associate");
  const [selectedTradeOrder, setSelectedTradeOrder] = useState<TradeOrder | null>(null);

  const ch = getTierChannel(selectedTierId);
  const tier = quoteTiers.find((t) => t.id === selectedTierId);
  const premiumCh = getTierChannel("premium");
  const savings = premiumCh.price - ch.price;
  const savingsPct = Math.round((savings / premiumCh.price) * 100);
  const prefixMap: Record<string, string> = { yuntu: "YT", yanwen: "YW", dhl: "DHL", "4px": "4PX", difang: "DF", ems: "EM" };
  const trackingNo = `${prefixMap[ch.id] ?? "TX"}2026051801234`;

  // ── 询问是否关联交易订单 ──
  if (view === "associate") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-base">🔗</span>
          <span className="text-sm font-bold text-blue-700">关联信用保障交易订单</span>
        </div>
        <p className="text-xs text-slate-600 leading-relaxed">
          检测到你有 <strong className="text-blue-600">{mockTradeOrders.length} 笔</strong>待发货的 Alibaba.com 信用保障交易订单，关联后物流信息将自动同步至买家，提升买家体验。
        </p>
        <div className="flex gap-2">
          <button
            onClick={() => setView("select-trade")}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
          >
            选择关联交易订单
          </button>
          <button
            onClick={() => setView("card")}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-medium hover:bg-slate-50 transition-all"
          >
            直接创建物流订单
          </button>
        </div>
      </div>
    );
  }

  // ── 选择交易订单 ──
  if (view === "select-trade") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-white p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => setView("associate")} className="text-blue-400 hover:text-blue-600 text-xs transition-colors">← 返回</button>
          <span className="text-sm font-bold text-slate-700">选择关联的交易订单</span>
        </div>
        <p className="text-[11px] text-slate-400">选择一笔信用保障交易订单，系统将自动填充买家地址和货物信息</p>

        <div className="space-y-2">
          {mockTradeOrders.map((order) => {
            const isSelected = selectedTradeOrder?.id === order.id;
            return (
              <div
                key={order.id}
                onClick={() => setSelectedTradeOrder(isSelected ? null : order)}
                className={`rounded-xl border-2 p-3 cursor-pointer transition-all ${
                  isSelected ? "border-blue-500 bg-blue-50/50" : "border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-slate-700 font-mono">{order.id}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                        order.statusColor === "amber" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"
                      }`}>{order.status}</span>
                    </div>
                    <div className="text-[11px] text-slate-600">{order.product}</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">{order.buyer} · {order.buyerCountry} · {order.createdAt}</div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-bold text-blue-600">{order.amount}</div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{order.platform}</div>
                  </div>
                </div>
                {isSelected && (
                  <div className="mt-2 pt-2 border-t border-blue-200 text-[11px] text-blue-600 flex items-center gap-1">
                    <span>✓</span><span>已选中，将自动填充买家地址和货物信息</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button
          onClick={() => { if (selectedTradeOrder) setView("card"); }}
          disabled={!selectedTradeOrder}
          className={`w-full py-2.5 rounded-xl text-sm font-medium transition-all ${
            selectedTradeOrder
              ? "bg-blue-600 text-white hover:bg-blue-700 shadow-sm"
              : "bg-slate-100 text-slate-400 cursor-not-allowed"
          }`}
        >
          {selectedTradeOrder ? `关联 ${selectedTradeOrder.id} 并创建物流订单` : "请先选择一笔交易订单"}
        </button>
      </div>
    );
  }

  // ── 物流轨迹视图 ──
  if (view === "tracking") {
    return (
      <div className="rounded-2xl border border-blue-200 bg-gradient-to-br from-blue-50/60 to-white p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => setView("order")} className="text-blue-400 hover:text-blue-600 transition-colors text-xs">← 返回</button>
          <span className="text-sm font-bold text-blue-700">物流轨迹</span>
          <span className="ml-auto text-[11px] bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full font-medium">清关中</span>
        </div>
        <div className="text-[11px] text-slate-400 font-mono">{trackingNo} · {ch.name}</div>

        <div className="space-y-0">
          {TRACKING_EVENTS.map((ev, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5 ${
                  ev.status === "done" ? "bg-blue-600 text-white"
                  : ev.status === "active" ? "bg-amber-400 text-white ring-4 ring-amber-100"
                  : "bg-slate-200 text-slate-400"
                }`}>
                  {ev.status === "done" ? "✓" : ev.status === "active" ? "●" : i + 1}
                </div>
                {i < TRACKING_EVENTS.length - 1 && (
                  <div className={`w-0.5 h-7 mt-0.5 ${ev.status === "done" ? "bg-blue-200" : "bg-slate-200"}`} />
                )}
              </div>
              <div className="pb-3 flex-1 min-w-0">
                <div className={`text-xs font-semibold ${ev.status === "done" ? "text-slate-700" : ev.status === "active" ? "text-amber-700" : "text-slate-400"}`}>{ev.label}</div>
                {ev.desc && <div className={`text-[11px] mt-0.5 ${ev.status === "pending" ? "text-slate-300" : "text-slate-400"}`}>{ev.desc}</div>}
                <div className={`text-[10px] mt-0.5 ${ev.status === "pending" ? "text-slate-300" : "text-slate-400"}`}>{ev.time}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 bg-blue-600/5 border border-blue-100 rounded-xl px-3 py-2 text-xs">
          <span>🚚</span>
          <span className="text-slate-600">预计 <strong className="text-blue-600">5月21日</strong> 签收，当前正在清关，请耐心等待</span>
        </div>
      </div>
    );
  }

  // ── 订单详情视图 ──
  if (view === "order") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-white p-4 space-y-3 shadow-sm">
        <div className="flex items-center gap-2">
          <button onClick={() => setView("card")} className="text-emerald-400 hover:text-emerald-600 transition-colors text-xs">← 返回</button>
          <span className="text-sm font-bold text-emerald-700">订单详情</span>
          <span className="ml-auto text-[11px] bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full font-medium">📦 清关中</span>
        </div>

        {selectedTradeOrder && (
          <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs">
            <span>🔗</span>
            <span className="text-blue-600 font-medium">已关联交易订单 {selectedTradeOrder.id}</span>
            <span className="text-slate-400 ml-1">· {selectedTradeOrder.buyer}</span>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          {[
            ["运单号", trackingNo],
            ["承运渠道", `${tier?.label ?? "Standard"} (${ch.name})`],
            ["发货日期", "2026-05-18"],
            ["预计到达", computeDeliveryWindow(ch.days)],
            ["货物品类", selectedTradeOrder ? selectedTradeOrder.product : "手机壳 × 3kg"],
            ["目的地", selectedTradeOrder ? selectedTradeOrder.buyerCountry : "美国 🇺🇸"],
            ["实付运费", `$${ch.price.toFixed(2)}`],
            ["保险", "基础运输险"],
          ].map(([k, v]) => (
            <div key={k} className="bg-white rounded-xl px-3 py-2 border border-emerald-100 shadow-sm">
              <div className="text-[10px] text-slate-400 mb-0.5">{k}</div>
              <div className="text-xs font-semibold text-slate-700 truncate">{v}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setView("tracking")}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
        >
          <span>🚚</span><span>查看物流轨迹</span>
        </button>
      </div>
    );
  }

  // ── 建单成功卡片视图 ──
  return (
    <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-4 space-y-3 shadow-sm">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 text-xl flex-shrink-0">✓</div>
        <div>
          <div className="text-sm font-bold text-emerald-700">建单成功！</div>
          <div className="text-xs text-slate-400 font-mono mt-0.5">运单号：{trackingNo}</div>
        </div>
        <div className="ml-auto">
          <span className="text-[11px] bg-emerald-100 text-emerald-600 px-2.5 py-1 rounded-full font-medium">📦 待揽收</span>
        </div>
      </div>

      {selectedTradeOrder && (
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-3 py-2 text-xs">
          <span>🔗</span>
          <span className="text-blue-600 font-medium">已关联：{selectedTradeOrder.id}</span>
          <span className="text-slate-400 ml-1">· {selectedTradeOrder.buyer} · {selectedTradeOrder.product}</span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-2">
        {[
          ["档位", `${tier?.label ?? "Standard"}（${ch.name}）`],
          ["预计到达", ch.days],
          ["实付运费", `$${ch.price.toFixed(2)}`],
          ...(selectedTierId !== "premium" ? [[`比 Premium 节省`, `$${savings.toFixed(2)} (${savingsPct}%) 🎉`] as const] : [] as readonly [string, string][]),
        ].map(([k, v]) => (
          <div key={k} className="bg-white rounded-xl px-3 py-2 border border-emerald-100 shadow-sm">
            <div className="text-[10px] text-slate-400 mb-0.5">{k}</div>
            <div className={`text-sm font-bold ${k.includes("节省") ? "text-emerald-600" : "text-slate-700"}`}>{v}</div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setView("order")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl border border-emerald-200 text-emerald-700 text-sm font-medium hover:bg-emerald-50 transition-all"
        >
          <span>📋</span><span>查看订单详情</span>
        </button>
        <button
          onClick={() => setView("tracking")}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-all shadow-sm"
        >
          <span>🚚</span><span>查看物流轨迹</span>
        </button>
      </div>
    </div>
  );
}

// ── 卡片：专家模式 — Skill API 连接 + 详细信息采集 ──────
export function ExpertConnectCard({ onStartFullSearch }: { onStartFullSearch?: () => void }) {
  const [phase, setPhase] = useState<"searching" | "found" | "form">("searching");
  const [tradeTerms, setTradeTerms] = useState("FOB");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("found"), 2500);
    const t2 = setTimeout(() => setPhase("form"), 4500);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  return (
    <div className="rounded-2xl border border-purple-200 bg-gradient-to-br from-purple-50/80 to-white p-4 space-y-3 shadow-sm">
      {/* 标题 */}
      <div className="flex items-center gap-2">
        <span className="text-base">🔗</span>
        <span className="text-sm font-semibold text-purple-700">专家询价模式</span>
        {phase === "form" && (
          <span className="ml-auto text-[11px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">
            3 家已连接
          </span>
        )}
      </div>

      {/* 搜索阶段 */}
      {phase === "searching" && (
        <div className="flex flex-col items-center py-6 space-y-4">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-xl">
              📡
            </div>
            <div className="absolute inset-0 w-12 h-12 rounded-full bg-purple-400/30 animate-ping" />
          </div>
          <div className="text-sm text-slate-600 font-medium">正在链接阿里巴巴认证服务商，获取实时报价...</div>
          <div className="space-y-1.5 w-full max-w-xs">
            {expertProviders.map((p) => (
              <div key={p.id} className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                <span className="text-slate-300">◌</span>
                <span className="font-mono">{p.skillApiName}</span>
                <span className="ml-auto text-slate-300">..........</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 已连接阶段 */}
      {phase === "found" && (
        <div className="space-y-2.5 py-2">
          <div className="text-sm text-slate-600 font-medium text-center">已链接 3 家阿里巴巴认证服务商</div>
          {expertProviders.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center gap-3 rounded-xl border border-emerald-100 bg-white px-3.5 py-2.5 animate-fade-in"
              style={{ animationDelay: `${i * 400}ms` }}
            >
              <span className="text-lg">{p.logo}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-semibold text-slate-700">{p.name}</div>
                <div className="text-[10px] font-mono text-slate-400">{p.skillApiName}</div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">✓ 已连接</span>
            </div>
          ))}
          <div className="text-xs text-slate-400 text-center mt-2">正在准备详细询价表单...</div>
        </div>
      )}

      {/* 表单阶段 */}
      {phase === "form" && (
        <div className="space-y-2.5">
          <div className="text-xs text-slate-500 mb-1">已链接 3 家阿里巴巴认证服务商，提供更多细节可获取精准定制报价</div>
          {expertDetailFields.map((field) => (
            <div key={field.key} className="space-y-1">
              <label className="text-xs font-medium text-slate-600">
                {field.label}
                {field.required && <span className="text-red-400 ml-0.5">*</span>}
              </label>
              {field.key === "trade_terms" ? (
                <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                  {["FOB", "CIF", "DDP", "DAP"].map((term) => (
                    <button
                      key={term}
                      onClick={() => setTradeTerms(term)}
                      className={`flex-1 px-2 py-1.5 rounded-md text-xs font-medium transition-all ${
                        tradeTerms === term
                          ? "bg-[#7c3aed] text-white shadow-sm"
                          : "text-slate-500 hover:text-slate-700"
                      }`}
                    >
                      {term}
                    </button>
                  ))}
                </div>
              ) : (
                <input
                  type="text"
                  placeholder={field.placeholder}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white placeholder-slate-300 focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 focus:border-[#7c3aed]/40 transition-all"
                />
              )}
            </div>
          ))}
          <button
            onClick={() => onStartFullSearch?.()}
            className="w-full mt-2 px-4 py-2.5 bg-gradient-to-r from-[#7c3aed] to-indigo-600 text-white rounded-xl text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.98] shadow-md shadow-purple-500/20 flex items-center justify-center gap-1.5"
          >
            <span>🚀</span>
            <span>开始全网询价</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── 卡片：专家模式 — 流式多服务商报价 + 雷达对比 ──────
export function ExpertQuotesCard({ onProviderConfirm }: { onProviderConfirm?: (providerId: string) => void }) {
  const [revealedProviders, setRevealedProviders] = useState(0);
  const [showRadar, setShowRadar] = useState(false);
  const [selectedProviderIds, setSelectedProviderIds] = useState<string[]>(expertProviders.map(p => p.id));

  const toggleProvider = (id: string) => {
    setSelectedProviderIds(prev => {
      if (prev.includes(id)) {
        if (prev.length <= 1) return prev; // keep at least 1
        return prev.filter(x => x !== id);
      }
      return [...prev, id];
    });
  };

  useEffect(() => {
    const t1 = setTimeout(() => setRevealedProviders(1), 0);
    const t2 = setTimeout(() => setRevealedProviders(2), 1200);
    const t3 = setTimeout(() => setRevealedProviders(3), 2400);
    const t4 = setTimeout(() => setShowRadar(true), 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <div className="space-y-3">
      {/* 顶部 banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#7c3aed] to-indigo-600 p-3.5 text-white shadow-md">
        <div className="text-[11px] opacity-75 mb-1">全网实时报价</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-sm font-bold">
              已收到 {revealedProviders}/3 报价 {revealedProviders === 3 ? "✓" : "..."}
            </span>
          </div>
          <div className="text-right text-[11px] opacity-80">
            报价从阿里巴巴认证服务商实时返回
          </div>
        </div>
      </div>

      {/* 流式服务商卡片 */}
      <div className="space-y-2">
        {expertProviders.map((provider, i) => {
          const isRevealed = revealedProviders > i;
          const isSelected = selectedProviderIds.includes(provider.id);
          return (
            <div
              key={provider.id}
              onClick={() => isRevealed && toggleProvider(provider.id)}
              className={`rounded-xl border p-3.5 transition-all duration-500 border-l-4 cursor-pointer ${
                isRevealed
                  ? isSelected
                    ? "opacity-100 translate-y-0 bg-white shadow-sm"
                    : "opacity-50 translate-y-0 bg-slate-50"
                  : "opacity-0 -translate-y-2 max-h-0 overflow-hidden p-0 border-0"
              }`}
              style={{ borderLeftColor: isRevealed ? provider.color : "transparent", borderColor: isRevealed && isSelected ? undefined : undefined }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{provider.logo}</span>
                  <span className="text-sm font-bold text-slate-700">{provider.name}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full font-medium">✓ 阿里巴巴认证</span>
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border-2 transition-all flex-shrink-0 ${
                    isSelected ? "border-[#7c3aed] bg-[#7c3aed] text-white" : "border-slate-300 bg-white text-slate-300"
                  }`}>
                    {isSelected ? "✓" : "+"}
                  </div>
                </div>
              </div>
              <div className="text-xs text-slate-500 mb-1.5">
                {provider.quote.route} · {provider.quote.type}
              </div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xl font-black" style={{ color: provider.color }}>
                    ${provider.quote.price.toFixed(2)}<span className="text-xs font-medium text-slate-400 ml-0.5">/{provider.quote.priceUnit.replace("$/", "")}</span>
                  </span>
                </div>
                <div className="text-right text-xs text-slate-500">
                  <div>{provider.quote.transitDays}</div>
                  <div>准点率 {provider.quote.onTimeRate}%</div>
                </div>
              </div>
              <div className="flex flex-wrap gap-1 mb-1.5">
                {provider.quote.specialServices.map((s) => (
                  <span key={s} className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>
              <div className="text-[10px] text-slate-400">贸易条款：{provider.quote.incoterms}</div>
            </div>
          );
        })}
      </div>

      {/* 多维雷达对比 */}
      {showRadar && (
        <div className="bg-white rounded-xl border border-slate-200 p-4 transition-opacity duration-700">
          <div className="text-xs font-semibold text-slate-600 mb-3">📊 多维对比分析</div>
          <MultiRadarChart
            routes={expertProviders.map((p) => ({
              dims: p.scoreDims,
              color: p.color,
              name: p.name,
            }))}
            dimensions={{
              keys: ["cost", "time", "service", "risk", "reliability", "stability"],
              labels: ["成本", "时效", "服务", "风险", "可靠性", "稳定性"],
            }}
          />
          <div className="flex items-start gap-2 bg-[#7c3aed]/5 border border-[#7c3aed]/15 rounded-xl px-3.5 py-2.5 text-xs mt-3">
            <span className="flex-shrink-0">💡</span>
            <span className="text-slate-600">
              <strong className="text-[#7c3aed]">AI 分析：</strong>
              COSCO 性价比最高（成本 9.0），DB Schenker 时效平衡最优，Kuehne+Nagel 速度最快但成本较高
            </span>
          </div>
        </div>
      )}

      {/* 确认选择服务商 */}
      {revealedProviders === 3 && (
        <div className="pt-1 space-y-2">
          <div className="text-[11px] text-slate-400 text-center">
            已选 {selectedProviderIds.length} 家服务商对比 · 点击卡片可切换选择
          </div>
          <button
            onClick={() => onProviderConfirm?.(selectedProviderIds[0])}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#7c3aed] to-indigo-600 text-white text-sm font-semibold shadow-md hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>✅</span>
            <span>确认选择，开始锁仓</span>
          </button>
        </div>
      )}
    </div>
  );
}

// ── 卡片八：成本洞察 ──────────────────────────────────────
export function CostTrendCard() {
  const months = ["1月", "2月", "3月", "4月", "5月"];
  const data = [1820, 2100, 1950, 2340, 2180];
  const max = Math.max(...data);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 p-3.5 text-white shadow-md">
        <div className="text-[11px] opacity-70 mb-1">近 30 天成本分析 · 共 247 票</div>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-black">¥2,900</span>
            <span className="text-sm opacity-80 ml-1">/月可节省</span>
          </div>
          <div className="text-right text-[11px]">
            <div className="opacity-70">发现优化空间</div>
            <div className="font-bold text-yellow-300">3 个降本机会</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-3.5">
        <div className="text-xs text-slate-500 font-medium mb-3">月度发货成本趋势（元）</div>
        <div className="flex items-end gap-2 h-20 mb-2">
          {data.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="text-[9px] text-slate-400">{v}</div>
              <div
                className={`w-full rounded-t ${i === 3 ? "bg-red-400" : "bg-blue-400"}`}
                style={{ height: `${(v / max) * 52}px` }}
              />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          {months.map((m, i) => (
            <div key={i} className="flex-1 text-center text-[10px] text-slate-400">{m}</div>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {[
          { icon: "🔄", title: "渠道迁移节省 $312/月", desc: "43 票美国普通件从 DHL ($28) → 云途 ($8.5)，非急单时效差可接受" },
          { icon: "📦", title: "合并发货节省 $89/月", desc: "每周 8-10 票 <500g 小件合并发货，申请批量折扣（预计 8-12%）" },
          { icon: "🔒", title: "Q4 旺季提前锁价", desc: "Q4 运价历史均涨 15-25%，建议 9 月前签月结协议锁定费率" },
        ].map((tip, i) => (
          <div key={tip.title}
            className={`flex items-start gap-3 rounded-xl px-3.5 py-3 border ${
              i === 0 ? "bg-blue-50/60 border-blue-100" :
              i === 1 ? "bg-emerald-50/60 border-emerald-100" :
              "bg-amber-50/60 border-amber-100"
            }`}>
            <span className="text-xl flex-shrink-0">{tip.icon}</span>
            <div>
              <div className={`text-sm font-bold ${i === 0 ? "text-blue-700" : i === 1 ? "text-emerald-700" : "text-amber-700"}`}>{tip.title}</div>
              <div className="text-xs text-slate-500 mt-0.5">{tip.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── 卡片：中大件锁仓成功 — 订单详情（含支付 + 客服弹层）──
export function BulkOrderDetailCard() {
  const [tab, setTab] = useState<"detail" | "docs">("detail");
  const [paymentStatus, setPaymentStatus] = useState<"pending" | "paying" | "paid">("pending");
  const [showCSModal, setShowCSModal] = useState(false);
  const [csMessages, setCsMessages] = useState<{ role: "agent" | "user"; text: string }[]>([
    { role: "agent", text: "您好！我是您的专属货代客服王晓明，负责您 BLK-2026051802-FCL 的全程服务。有任何问题请随时告诉我 😊" },
  ]);
  const [csInput, setCsInput] = useState("");
  const csEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    csEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [csMessages]);

  const handlePayment = () => {
    setPaymentStatus("paying");
    setTimeout(() => setPaymentStatus("paid"), 2000);
  };

  const csAutoReplies: Record<string, string> = {
    "查询开船状态": "已为您查询：BLK-2026051802-FCL 预计 2026-06-10 从深圳蛇口港开船，目前处于舱位确认阶段，一切正常 ✅",
    "清关文件核查": `需要提前准备的清关文件：
• 商业发票（Invoice）× 3份
• 装箱单（Packing List）× 3份
• 提单草稿确认
请在开船前 5 个工作日提交，我会帮您核对。`,
    "申请延误赔偿": "如货物延误超过约定时效，可申请赔偿。目前货物状态正常，暂无延误风险。如后续出现问题请及时告知，我会第一时间跟进 💪",
    "联系目的港代理": `目的港（汉堡）代理已安排：
Hamburg Logistics GmbH
📞 +49 40 1234 5678
我已将您的货物信息同步给他们，到港后会主动联系您。`,
  };

  const sendCsMessage = (text: string) => {
    const userMsg = text.trim() || csInput.trim();
    if (!userMsg) return;
    setCsInput("");
    setCsMessages(prev => [...prev, { role: "user", text: userMsg }]);
    const reply = csAutoReplies[userMsg] || "收到您的消息！我会尽快为您处理，通常 3 分钟内回复。如紧急情况可直接拨打专线：400-888-8888 🚢";
    setTimeout(() => {
      setCsMessages(prev => [...prev, { role: "agent", text: reply }]);
    }, 1000);
  };

  const orderFields = [
    ["订单编号", "BLK-2026051802-FCL"],
    ["承运商", "中远海运 COSCO"],
    ["航线", "深圳 → 汉堡 (直航)"],
    ["运输类型", "FCL 20GP 整柜"],
    ["贸易条款", "FOB 深圳"],
    ["订单金额", "USD 1,750"],
    ["开船日期", "2026-06-10（预计）"],
    ["预计到港", "2026-07-08（预计）"],
    ["支付状态", paymentStatus === "paid" ? "✅ 已支付" : "⏳ 待支付"],
    ["下单时间", "2026-05-19 10:32"],
  ];

  const docs = [
    { name: "提单草稿 (B/L Draft)", status: "ready", icon: "📄" },
    { name: "商业发票 (Invoice)", status: "pending", icon: "📋" },
    { name: "装箱单 (Packing List)", status: "pending", icon: "📦" },
    { name: "原产地证书 (CO)", status: "pending", icon: "🏛️" },
  ];

  return (
    <>
      <div className="rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50/80 to-white p-4 space-y-3 shadow-sm">
        {/* 标题 */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 flex-shrink-0 text-base">🎉</div>
          <div>
            <div className="text-sm font-bold text-emerald-700">锁仓成功 — 订单已确认</div>
            <div className="text-[11px] text-slate-400 font-mono">BLK-2026051802-FCL · 中远海运 COSCO</div>
          </div>
          <span className={`ml-auto text-[11px] px-2.5 py-1 rounded-full font-medium flex-shrink-0 ${
            paymentStatus === "paid" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-700"
          }`}>
            {paymentStatus === "paid" ? "✅ 已支付" : "⏳ 待支付"}
          </span>
        </div>

        {/* Tab 切换 */}
        <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
          {(["detail", "docs"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                tab === t ? "bg-white text-slate-700 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              {t === "detail" ? "📋 订单详情" : "📄 单据管理"}
            </button>
          ))}
        </div>

        {/* 订单详情 */}
        {tab === "detail" && (
          <div className="grid grid-cols-2 gap-1.5">
            {orderFields.map(([k, v]) => (
              <div key={k} className="bg-white rounded-xl px-3 py-2 border border-emerald-100 shadow-sm">
                <div className="text-[10px] text-slate-400 mb-0.5">{k}</div>
                <div className={`text-xs font-semibold truncate ${
                  k === "支付状态" && paymentStatus === "paid" ? "text-emerald-600" :
                  k === "支付状态" ? "text-amber-600" :
                  "text-slate-700"
                }`}>{v}</div>
              </div>
            ))}
          </div>
        )}

        {/* 单据管理 */}
        {tab === "docs" && (
          <div className="space-y-2">
            <div className="text-xs text-slate-500">锁仓成功后系统已自动准备以下单据，请逐一完善</div>
            {docs.map((doc) => (
              <div key={doc.name} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5">
                <span className="text-lg flex-shrink-0">{doc.icon}</span>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-medium text-slate-700">{doc.name}</div>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${
                  doc.status === "ready" ? "bg-emerald-100 text-emerald-600" : "bg-amber-100 text-amber-600"
                }`}>
                  {doc.status === "ready" ? "✓ 可下载" : "待填写"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* 支付按钮 / 支付完成后操作区 */}
        {paymentStatus === "pending" && (
          <button
            onClick={handlePayment}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-bold shadow-md hover:opacity-90 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <span>💳</span><span>去支付 USD 1,750</span>
          </button>
        )}
        {paymentStatus === "paying" && (
          <button disabled className="w-full py-3 rounded-xl bg-amber-400 text-white text-sm font-bold flex items-center justify-center gap-2 opacity-80">
            <span className="animate-spin">⏳</span><span>支付中...</span>
          </button>
        )}
        {paymentStatus === "paid" && (
          <div className="space-y-2">
            <button
              onClick={() => setShowCSModal(true)}
              className="w-full py-2.5 rounded-xl border-2 border-[#7c3aed]/30 bg-[#7c3aed]/5 text-[#7c3aed] text-sm font-semibold hover:bg-[#7c3aed]/10 transition-all flex items-center justify-center gap-2"
            >
              <span>🎧</span><span>联系专属客服</span>
              <span className="ml-auto text-[10px] bg-emerald-100 text-emerald-600 px-2 py-0.5 rounded-full">在线</span>
            </button>
            <div className="flex gap-2">
              <button className="flex-1 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-medium hover:bg-emerald-700 transition-all shadow-sm">
                📄 下载提单草稿
              </button>
              <button className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-medium hover:bg-slate-50 transition-all">
                🚢 跟踪物流
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 客服弹出层 */}
      {showCSModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col" style={{ maxHeight: "85vh" }}>
            {/* 弹层头部 */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100 flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">王</div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-slate-800">王晓明 · 专属货代客服</div>
                <div className="text-[11px] text-emerald-500 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                  在线 · 通常 3 分钟内回复
                </div>
              </div>
              <button
                onClick={() => setShowCSModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-all flex-shrink-0"
              >✕</button>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
              {csMessages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  {msg.role === "agent" && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#7c3aed] to-indigo-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">王</div>
                  )}
                  <div className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-[#7c3aed] text-white rounded-tr-sm"
                      : "bg-slate-100 text-slate-700 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={csEndRef} />
            </div>

            {/* 快捷按钮 */}
            <div className="px-4 py-2 border-t border-slate-100 flex-shrink-0">
              <div className="text-[10px] text-slate-400 mb-2">快捷服务</div>
              <div className="grid grid-cols-2 gap-1.5">
                {Object.keys(csAutoReplies).map((btn) => (
                  <button
                    key={btn}
                    onClick={() => sendCsMessage(btn)}
                    className="text-[11px] px-2.5 py-1.5 rounded-lg border border-[#7c3aed]/20 text-[#7c3aed] bg-[#7c3aed]/5 hover:bg-[#7c3aed]/10 transition-all text-left truncate"
                  >
                    {btn}
                  </button>
                ))}
              </div>
            </div>

            {/* 输入框 */}
            <div className="px-4 py-3 border-t border-slate-100 flex gap-2 flex-shrink-0">
              <input
                type="text"
                value={csInput}
                onChange={(e) => setCsInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") sendCsMessage(csInput); }}
                placeholder="发送消息..."
                className="flex-1 border border-slate-200 rounded-xl px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#7c3aed]/20 transition-all"
              />
              <button
                onClick={() => sendCsMessage(csInput)}
                className="px-4 py-2 rounded-xl bg-[#7c3aed] text-white text-sm font-medium hover:bg-[#6d28d9] transition-all"
              >发送</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

