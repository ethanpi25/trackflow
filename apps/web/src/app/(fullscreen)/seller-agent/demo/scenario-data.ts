// ============================================================
// Seller Agent Demo — Mock Scenario Data
// 5 场景完整对话数据 + 卡片数据
// ============================================================

export type MessageRole = "user" | "agent";

export type CardType =
  | "cargo-recognition"
  | "quote-comparison"
  | "special-cargo"
  | "bulk-basic-quote"
  | "expert-connect"
  | "expert-quotes"
  | "bulk-inquiry"
  | "bulk-order-detail"
  | "exception-healing"
  | "shipment-created"
  | "cost-trend";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  card?: CardType;
  quickReplies?: string[];
  isTyping?: boolean;
}

export interface Scenario {
  id: string;
  tab: string;
  title: string;
  subtitle: string;
  icon: string;
  valueTag: string;
  steps: ChatMessage[][];
}

// ── 渠道 Mock 数据 ──────────────────────────────────────────
export const quoteChannels = [
  {
    id: "yuntu",
    name: "云途小包",
    badge: "AI 推荐",
    badgeColor: "blue",
    price: 8.5,
    days: "8-12 天",
    onTimeRate: 94,
    score: 8.2,
    scoreDims: { cost: 7.8, time: 7.5, stability: 9.4, service: 8.2, risk: 8.8 },
    highlight: true,
    tier: "standard" as const,
    provider: "Alibaba.com Logistics",
  },
  {
    id: "yanwen",
    name: "燕文经济",
    badge: "最省钱",
    badgeColor: "green",
    price: 6.2,
    days: "12-15 天",
    onTimeRate: 88,
    score: 7.1,
    scoreDims: { cost: 9.5, time: 5.5, stability: 8.8, service: 7.5, risk: 8.0 },
    highlight: false,
    tier: "economy" as const,
    provider: "Alibaba.com Logistics",
  },
  {
    id: "dhl",
    name: "DHL Express",
    badge: "最快",
    badgeColor: "amber",
    price: 28.0,
    days: "3-5 天",
    onTimeRate: 99,
    score: 7.8,
    scoreDims: { cost: 3.5, time: 9.5, stability: 9.8, service: 9.0, risk: 9.5 },
    highlight: false,
    tier: "premium" as const,
    provider: "Alibaba.com Logistics",
  },
];

// ── 全量渠道（6 条线路，供「更多线路」模式使用）──────────────
export const allQuoteChannels = [
  ...quoteChannels,
  {
    id: "4px",
    name: "4PX 标快",
    badge: "",
    badgeColor: "",
    price: 9.8,
    days: "7-11 天",
    onTimeRate: 93,
    score: 8.0,
    scoreDims: { cost: 7.2, time: 8.0, stability: 9.0, service: 8.5, risk: 7.5 },
    highlight: false,
    provider: "4PX Worldwide",
  },
  {
    id: "difang",
    name: "递四方小包",
    badge: "",
    badgeColor: "",
    price: 7.5,
    days: "9-13 天",
    onTimeRate: 90,
    score: 7.5,
    scoreDims: { cost: 8.5, time: 6.8, stability: 8.2, service: 7.8, risk: 6.5 },
    highlight: false,
    provider: "递四方",
  },
  {
    id: "ems",
    name: "EMS 国际",
    badge: "",
    badgeColor: "",
    price: 15.0,
    days: "5-8 天",
    onTimeRate: 96,
    score: 7.6,
    scoreDims: { cost: 5.5, time: 8.8, stability: 9.2, service: 7.0, risk: 7.8 },
    highlight: false,
    provider: "China Post EMS",
  },
];

// ── 3 档位映射（Economy / Standard / Premium）──────────────
export interface QuoteTier {
  id: string;
  label: string;
  tag: string;
  tagStyle: "gray" | "purple" | "blue";
  channelId: string;
  isDefault: boolean;
}

export const quoteTiers: QuoteTier[] = [
  { id: "economy",  label: "Economy",  tag: "Cheapest", tagStyle: "gray",   channelId: "yanwen", isDefault: false },
  { id: "standard", label: "Standard", tag: "AI 推荐",  tagStyle: "purple", channelId: "yuntu",  isDefault: true  },
  { id: "premium",  label: "Premium",  tag: "Fastest",   tagStyle: "blue",   channelId: "dhl",    isDefault: false },
];

// ── 选档类型 ─────────────────────────────────────────────────
export interface QuoteSelection {
  mode: "tier" | "route-list";
  selectedTierId: string;
  selectedRouteIds: string[];
}

export const specialCargoChannels = [
  { name: "云途锂电线", price: 12.5, days: "10-14 天", onTimeRate: 91, hasLithium: true },
  { name: "4PX 特货线", price: 11.8, days: "9-13 天", onTimeRate: 92, hasLithium: true },
  { name: "DHL 特货专线", price: 35.0, days: "3-5 天", onTimeRate: 99, hasLithium: true },
];

// ── 大件基础询价 — 海运线路 Mock 数据 ────────────────────
export const bulkSeaRoutes = [
  {
    id: "wuyou-sea-ddp",
    carrier: "无忧海运 DDP",
    route: "CNSZX → DEHAM",
    type: "海运 门到门 DDP",
    price: 3.2,
    priceUnit: "$/kg",
    transitDays: "28-35 天",
    onTimeRate: 92,
    scoreDims: { cost: 8.5, time: 6.0, stability: 8.5, service: 8.5, risk: 8.0 },
    badge: "🏆 AI 推荐",
    badgeStyle: "blue",
    highlights: ["DDP 全包税", "门到门配送", "价格最优"],
  },
  {
    id: "wuyou-sea-express",
    carrier: "无忧海运快船",
    route: "CNSZX → DEHAM",
    type: "海运快船 门到门 DDP",
    price: 4.8,
    priceUnit: "$/kg",
    transitDays: "18-22 天",
    onTimeRate: 95,
    scoreDims: { cost: 7.0, time: 8.5, stability: 9.0, service: 8.8, risk: 9.0 },
    badge: "⚡ 时效最快",
    badgeStyle: "amber",
    highlights: ["快船直达", "准点率最高", "DDP 含税"],
  },
];

// ── 大件基础询价 — 空运线路 Mock 数据 ────────────────────
export const bulkAirRoutes = [
  {
    id: "wuyou-air-ddp",
    carrier: "无忧空派送 DDP",
    route: "CNSZX → FRA",
    type: "空运派送 门到门 DDP",
    price: 18.5,
    priceUnit: "$/kg",
    transitDays: "5-8 天",
    onTimeRate: 96,
    scoreDims: { cost: 5.5, time: 9.0, stability: 9.2, service: 8.5, risk: 9.0 },
    badge: "✈️ AI 推荐",
    badgeStyle: "purple",
    highlights: ["DDP 全包税", "门到门派送", "性价比优"],
  },
  {
    id: "wuyou-air-charter",
    carrier: "无忧空运包机 DDP",
    route: "CNSZX → FRA",
    type: "空运包机 门到门 DDP",
    price: 26.0,
    priceUnit: "$/kg",
    transitDays: "3-5 天",
    onTimeRate: 98,
    scoreDims: { cost: 3.5, time: 9.8, stability: 9.8, service: 9.5, risk: 9.5 },
    badge: "⚡ 最快送达",
    badgeStyle: "amber",
    highlights: ["包机直飞", "3天极速到达", "DDP 含税"],
  },
];

// ── 专家模式 — 生态服务商 Mock 数据 ────────────────────────
export const expertProviders = [
  {
    id: "cosco-expert",
    name: "中远海运 COSCO",
    logo: "🚢",
    skillApiName: "COSCO_Quote_Skill",
    responseDelay: 1200,
    quote: {
      route: "深圳 → 汉堡 (直航)",
      type: "FCL 20GP + 门到门",
      price: 1750,
      priceUnit: "$/柜",
      transitDays: "26-30 天",
      onTimeRate: 93,
      incoterms: "FOB / CIF 可选",
      specialServices: ["德国清关代办", "内陆转运至柏林"],
    },
    scoreDims: { cost: 9.0, time: 7.2, stability: 8.5, service: 8.0, risk: 7.8, reliability: 8.5 },
    color: "#7c3aed",
  },
  {
    id: "db-schenker",
    name: "DB Schenker",
    logo: "🚂",
    skillApiName: "DBS_Quote_Skill",
    responseDelay: 2400,
    quote: {
      route: "深圳 → 杜伊斯堡 (海铁联运)",
      type: "FCL 20GP + 铁路转运",
      price: 2100,
      priceUnit: "$/柜",
      transitDays: "20-25 天",
      onTimeRate: 90,
      incoterms: "CIF / DAP",
      specialServices: ["中欧班列衔接", "欧洲仓暂存"],
    },
    scoreDims: { cost: 7.5, time: 8.5, stability: 7.8, service: 8.5, risk: 8.0, reliability: 8.0 },
    color: "#dc2626",
  },
  {
    id: "kuehne-nagel",
    name: "Kuehne+Nagel",
    logo: "✈️",
    skillApiName: "KN_Air_Skill",
    responseDelay: 3800,
    quote: {
      route: "深圳 → 法兰克福 (空运)",
      type: "空运 2000kg + 清关",
      price: 5400,
      priceUnit: "$/批",
      transitDays: "5-8 天",
      onTimeRate: 96,
      incoterms: "DDP",
      specialServices: ["全程保险含", "目的港仓配一体"],
    },
    scoreDims: { cost: 4.0, time: 9.5, stability: 9.2, service: 9.5, risk: 9.0, reliability: 9.2 },
    color: "#2563eb",
  },
];

// ── 专家模式 — 详细货物信息采集字段 ────────────────────────
export const expertDetailFields = [
  { key: "hs_code",      label: "HS 编码",      placeholder: "如 9506.91",             required: false },
  { key: "trade_terms",  label: "贸易条款",      placeholder: "FOB / CIF / DDP",        required: true  },
  { key: "target_date",  label: "期望到货日期",   placeholder: "2026-06-30",             required: false },
  { key: "special_reqs", label: "特殊要求",      placeholder: "如：需要熏蒸证明、温控",   required: false },
  { key: "insurance",    label: "货运保险",      placeholder: "是 / 否 / 待确认",        required: false },
  { key: "dest_address", label: "目的地详细地址",  placeholder: "如：柏林仓库地址",        required: false },
];

// ── Mock 交易订单（信用保障）────────────────────────────────
export const mockTradeOrders = [
  {
    id: "TO-20260517-001",
    buyer: "John Smith",
    buyerCountry: "🇺🇸 美国",
    product: "手机壳 × 50pcs",
    amount: "USD 245.00",
    platform: "Alibaba.com",
    status: "待发货",
    statusColor: "amber",
    createdAt: "2026-05-17",
  },
  {
    id: "TO-20260516-003",
    buyer: "Maria Garcia",
    buyerCountry: "🇺🇸 美国",
    product: "手机壳 × 30pcs",
    amount: "USD 147.00",
    platform: "Alibaba.com",
    status: "待发货",
    statusColor: "amber",
    createdAt: "2026-05-16",
  },
  {
    id: "TO-20260515-007",
    buyer: "David Lee",
    buyerCountry: "🇺🇸 美国",
    product: "手机壳 × 20pcs",
    amount: "USD 98.00",
    platform: "Alibaba.com",
    status: "已付款",
    statusColor: "green",
    createdAt: "2026-05-15",
  },
];

export type TradeOrder = typeof mockTradeOrders[number];

export const scenarios: Scenario[] = [
  // ── 场景一：中小件智能比价 ──────────────────────────────────
  {
    id: "quote",
    tab: "场景一",
    title: "中小件智能比价",
    subtitle: "自然语言输入 → AI 自动解析 → 即时多渠道比价 → 可解释推荐",
    icon: "🔍",
    valueTag: "核心价值：秒级比价，省去人工询价",
    steps: [
      [
        {
          id: "q-u1",
          role: "user",
          text: "我有一批手机壳，3公斤，发美国，要快点但不要太贵",
        },
      ],
      [
        {
          id: "q-a1",
          role: "agent",
          text: "好的，帮你解析一下货物信息 ↓",
          card: "cargo-recognition",
          quickReplies: ["信息正确，继续查询", "修改货物信息"],
        },
      ],
      [
        {
          id: "q-u2",
          role: "user",
          text: "信息正确，继续查询",
        },
      ],
      [
        {
          id: "q-a2",
          role: "agent",
          text: "综合你「时效/成本均衡」的需求，推荐 Standard 档位 ↓",
          card: "quote-comparison",
          quickReplies: ["帮我创建物流订单"],
        },
      ],
      [
        {
          id: "q-u3",
          role: "user",
          text: "帮我创建物流订单",
        },
      ],
      [
        {
          id: "q-a3",
          role: "agent",
          text: "✅ 建单成功！运单号 YT2026051801234 已生成。",
          card: "shipment-created",
          quickReplies: ["查看物流轨迹"],
        },
      ],
    ],
  },

  // ── 场景二：大件询价（基础 → 专家渐进式）──────────────
  {
    id: "bulk",
    tab: "场景二",
    title: "大件询价",
    subtitle: "基础即时报价 → 升级专家模式 → 全网询价 → 多维雷达对比",
    icon: "🏗️",
    valueTag: "核心价值：从即时参考价到全网定制询价",
    steps: [
      [
        {
          id: "b-u1",
          role: "user",
          text: "我要发一批健身器材去德国，大约2吨，走海运",
        },
      ],
      [
        {
          id: "b-a1",
          role: "agent",
          text: "识别到大件货物需求 🏗️ 已自动切换到大件询价模式，基础即时报价 ↓",
          card: "bulk-basic-quote",
          quickReplies: ["升级专家模式，获取全网报价"],
        },
      ],
      [
        {
          id: "b-u2",
          role: "user",
          text: "升级专家模式，获取全网报价",
        },
      ],
      [
        {
          id: "b-a3",
          role: "agent",
          text: "正在链接阿里巴巴认证服务商，获取实时报价... 🔗",
          card: "expert-connect",
        },
      ],
      [
        {
          id: "b-a5",
          role: "agent",
          text: "已收到补充信息，全网搜索中 ✨ 实时报价陆续返回 ↓",
          card: "expert-quotes",
        },
      ],
      [
        {
          id: "b-u6",
          role: "user",
          text: "选择中远海运",
        },
      ],
      [
        {
          id: "b-a7",
          role: "agent",
          text: "✅ 已选中远海运方案！AI 方案已生成，正在自动启动准实时锁仓 ⚡",
          card: "bulk-inquiry",
        },
      ],
      [
        {
          id: "b-a9",
          role: "agent",
          text: "🎉 锁仓成功！订单已生成，运单号 **BLK-2026051802-FCL**，请完成支付以确认舱位。",
          card: "bulk-order-detail",
          quickReplies: ["查看物流轨迹"],
        },
      ],
    ],
  },

  // ── 场景三：特货识别与安全过滤 ─────────────────────────
  {
    id: "special",
    tab: "场景三",
    title: "特货识别与安全过滤",
    subtitle: "AI 主动检测特货风险 → 锂电/非锂电分支 → 合规渠道过滤 → 可解释推荐",
    icon: "⚡",
    valueTag: "核心价值：避免因特货发错渠道造成退件/罚款",
    steps: [
      [
        {
          id: "s-u1",
          role: "user",
          text: "帮我发一批蓝牙耳机去英国，5公斤",
        },
      ],
      [
        {
          id: "s-a1",
          role: "agent",
          text: "收到！蓝牙耳机通常含有锂电池，我先帮你确认一下 ↓",
          card: "special-cargo",
          quickReplies: ["帮我创建物流订单"],
        },
      ],
    ],
  },

  // ── 场景四：售后自愈异常处理 ───────────────────────────
  {
    id: "exception",
    tab: "场景四",
    title: "售后自愈异常处理",
    subtitle: "AI 主动检测异常 → 智能诊断原因 → 提供补救方案 → 生成客户沟通话术",
    icon: "🚨",
    valueTag: "核心价值：在买家投诉前主动解决，保护店铺评分",
    steps: [
      [
        {
          id: "e-u1",
          role: "user",
          text: "我有个单子卡在美国清关好多天了，单号 JD0099112233",
        },
      ],
      [
        {
          id: "e-a1",
          role: "agent",
          text: "正在查询运单 JD0099112233 的轨迹... 发现异常，帮你诊断 ↓",
          card: "exception-healing",
          quickReplies: ["查看清关文件清单", "生成催促话术", "提前通知买家"],
        },
      ],
      [
        {
          id: "e-u2",
          role: "user",
          text: "提前通知买家",
        },
      ],
      [
        {
          id: "e-a2",
          role: "agent",
          text: `✅ 已为你生成买家通知邮件（中英双语）↓\n\n**英文版**\n---\nSubject: Update on Your Order — Shipment Delay Notice\n\nDear Customer,\n\nWe wanted to proactively inform you that your order (Tracking: JD0099112233) is currently experiencing a customs clearance delay in Los Angeles.\n\nNew estimated delivery: **May 25, 2026**\n\nWe sincerely apologize for the inconvenience and are actively following up with the carrier to expedite clearance.\n\nBest regards\n---`,
          quickReplies: ["复制英文邮件", "查看中文版", "申请延误赔偿"],
        },
      ],
      [
        {
          id: "e-u3",
          role: "user",
          text: "申请延误赔偿",
        },
      ],
      [
        {
          id: "e-a3",
          role: "agent",
          text: `📋 **DHL 延误赔偿申请指南**\n\n根据云途小包的服务协议，清关延误超过 5 个工作日可申请赔偿：\n\n• **赔偿金额**：最高运费 × 200%\n• **申请条件**：延误 ≥ 5 个工作日（当前已滞留 72h，即将达到申请条件）\n• **所需材料**：运单号、发货凭证、延误证明截图\n\n要我帮你起草赔偿申请邮件吗？`,
          quickReplies: ["生成赔偿申请邮件", "先等等看", "查看历史理赔记录"],
        },
      ],
    ],
  },

  // ── 场景五：成本洞察与优化建议 ─────────────────────────
  {
    id: "insight",
    tab: "场景五",
    title: "成本洞察与优化建议",
    subtitle: "历史渠道费率趋势 → AI 分析用货模式 → 主动提供降本建议",
    icon: "📊",
    valueTag: "核心价值：从「单票比价」到「全局成本优化」",
    steps: [
      [
        {
          id: "i-u1",
          role: "user",
          text: "帮我看看最近发货的成本情况，有没有优化空间",
        },
      ],
      [
        {
          id: "i-a1",
          role: "agent",
          text: "好的，已分析你过去 30 天的发货记录（共 247 票），发现 3 个优化机会 ↓",
          card: "cost-trend",
          quickReplies: ["查看优化方案详情", "按渠道分析", "导出成本报告"],
        },
      ],
      [
        {
          id: "i-u2",
          role: "user",
          text: "查看优化方案详情",
        },
      ],
      [
        {
          id: "i-a2",
          role: "agent",
          text: `📈 **3 个降本优化建议**\n\n**① 渠道迁移（预计节省 $312/月）**\n你有 43 票发往美国的普通件走了 DHL Express，平均 $28/票。\n换成云途小包（$8.5/票），时效差 5-7 天但准点率 94%，适合非急单。\n\n**② 合并发货（预计节省 $89/月）**\n你每周有 8-10 票重量 <500g 的小件，单独发费用高。\n建议每周二/五合并发货，可申请批量折扣（预计优惠 8-12%）。\n\n**③ 旺季提前锁价（Q4 即将来临）**\nQ4 渠道费率平均上涨 15-25%，建议在 9 月前与主力渠道签订月结协议锁定费率。\n\n**合计预计每月节省：¥2,900 左右**`,
          quickReplies: ["一键切换云途小包", "设置合并发货提醒", "了解月结锁价"],
        },
      ],
      [
        {
          id: "i-u3",
          role: "user",
          text: "一键切换云途小包",
        },
      ],
      [
        {
          id: "i-a3",
          role: "agent",
          text: `✅ 已将你的**美国线路默认渠道**从 DHL Express 切换为云途小包。\n\n生效范围：下次询价时将优先展示云途小包作为 AI 推荐首选。\n你随时可以在发货时手动覆盖此偏好。\n\n预计下个月成本报告中可看到优化效果 📊`,
          quickReplies: ["好的，继续", "查看偏好设置", "再看看其他建议"],
        },
      ],
    ],
  },
];
