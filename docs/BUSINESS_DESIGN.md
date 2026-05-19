# 跨境物流 Copilot — 业务设计全案文档

> **版本**: v1.2  
> **日期**: 2026-05-18  
> **状态**: Planner 规划完成 → 卖家侧 SPEC 已输出，待 Designer 接手

---

> ⚠️ **产品定性说明（重要）**：本产品是一个 **Agent 产品**，不是传统流程产品。
> 用户通过**自然语言对话**驱动所有能力，Agent 自动解析意图、判断货物类型、执行任务、返回结构化卡片结果。
> Demo 形态为：模拟 SubAgent 对话界面，产出自然语言交互效果图。

---

> 📄 **配套文档**：
> - 卖家侧详细 SPEC: [`docs/SELLER_AGENT_SPEC.md`](./SELLER_AGENT_SPEC.md)（已完成，待 Designer 接手）
> - 买家侧 SPEC: 卖家侧完成后输出

---

## 一、项目定位

**产品名称**: Cross-Border Logistics Copilot（跨境物流副驾驶）

**接入方式**: 以插件形式嵌入 ACCIO WORK 产品，提供两个独立 SubAgent：
- **Seller Agent**（卖家副驾驶）
- **Buyer Agent**（买家副驾驶）

**核心价值主张**:

| SubAgent | 核心主张 |
|----------|---------|
| Seller Agent | 把"找货代"变成"AI 托管履约"，让每票货从发出到签收全程有 AI 守护 |
| Buyer Agent | 让每笔采购"所见即所得"，下单前就知道货到手的真实总成本 |

---

## 二、货物类型分层体系（核心架构决策）

本次设计引入**货物类型二分法**，这是整个业务逻辑的基础分叉点，影响服务流程、定价模式和 UI 交互。

### 2.1 分层定义

| 维度 | 中小件（标准品服务）| 大宗商品（定制询价服务）|
|------|-------------------|----------------------|
| **重量** | ≤ 30kg / 票 | > 30kg 或整柜/整批 |
| **形态** | 单件包裹、快递小包 | 托盘、木箱、整柜（LCL/FCL）|
| **渠道** | 国际快递（DHL/FedEx/UPS）、跨境小包、海外仓头程 | 海运整柜/拼柜、空运包板、铁路整列 |
| **报价方式** | **即时报价**（系统直接返回，秒级响应）| **单票单询**（人工/AI 辅助，分钟级响应）|
| **服务模式** | 标准化、自助化、批量处理 | 个性化、一对一、方案定制 |
| **典型客户** | 跨境电商卖家、货代零单 | B2B 贸易商、工厂直采买家 |

### 2.2 业务流程分叉逻辑

```
用户发起请求
      │
      ▼
┌─────────────────────────────────┐
│  货物类型识别（自动 + 手动确认）  │
│  依据：重量 / 体积 / 品类 / 贸易项 │
└──────┬──────────────┬───────────┘
       │              │
       ▼              ▼
 ┌──────────┐   ┌──────────────┐
 │  中小件   │   │   大宗商品   │
 │ 标准品流  │   │  定制询价流  │
 └──────────┘   └──────────────┘
       │              │
  即时比价报价    单票需求收集
  自助下单建单    AI 初步方案
  自动面单生成    人工确认报价
  轨迹监控托管    合同/舱位锁定
```

---

## 三、卖家 SubAgent（Seller Agent）设计

### 3.1 核心差异化价值

**最高优先级差异点**：**售后自愈（Proactive Exception Healing）**

不等买家投诉，AI 主动在问题扩大前识别并解决异常——这是市面上货代和 SaaS 都做不到的。

### 3.2 服务分层

#### 3.2.1 中小件服务（标准品快速通道）

**目标用户**: 日均出货量 10~1000 票的跨境电商卖家

**服务流程**:
```
填写货物信息（尺寸/重量/品类/目的地）
          │
          ▼
即时多渠道报价（<3秒返回）
[快递渠道: DHL / FedEx / UPS / TNT]
[小包渠道: 云途 / 燕文 / 4PX / 递四方]
[头程渠道: FBA头程 / 海外仓头程]
          │
          ▼
AI 可解释推荐
("推荐云途，比 DHL 便宜 $12，时效差 2 天，
  匹配您的非急单需求，历史准点率 94.2%")
          │
          ▼
一键建单 → 面单生成（PDF/ZPL）→ 自动报关单证
          │
          ▼
托管轨迹监控 → 主动异常预警 → 售后自愈建议
```

**核心功能模块**:

| 模块 | 功能点 | 优先级 |
|------|--------|--------|
| 比价引擎 | 多渠道即时询价、5维评分、三栏对比卡片、五维雷达图 | P1 |
| AI 推荐 | 可解释推荐理由、旺季调权、急单/普单策略 | P1 |
| 履约自动化 | 一键建单、PDF/ZPL 面单生成、报关单证模板 | P2 |
| 售后自愈 | 轨迹异常识别、主动预警推送、补救动作建议 | P3 |
| 成本看板 | 历史渠道费率趋势、反馈学习、权重校准 | P4 |

#### 3.2.2 大宗商品服务（定制询价通道）

**目标用户**: 有整柜/整批出口需求的工厂、贸易商

**服务流程**:
```
填写大宗需求（货描/HS编码/数量/体积/重量/特殊要求）
          │
          ▼
AI 初步方案生成
[海运整柜 FCL / 拼柜 LCL 建议]
[起运港 → 目的港 航线推荐]
[预估时效区间 & 费用范围]
          │
          ▼
需求单提交（结构化表单）→ 推送至合作货代网络
          │
          ▼
人工/AI 辅助报价确认（目标 < 2小时响应）
          │
          ▼
锁舱 → 订舱确认书 → 生成提单草稿（B/L Draft）
          │
          ▼
舱单监控 → 开船提醒 → 目的港清关协助建议
```

**核心功能模块**:

| 模块 | 功能点 | 优先级 |
|------|--------|--------|
| 需求采集 | 结构化大宗需求表单、特货标注（危品/超重超长/冷链）| P1 |
| AI 初步方案 | 航线推荐、FCL vs LCL 建议、预估费用区间 | P1 |
| 询价管理 | 需求单状态跟踪、多货代报价对比、历史询价记录 | P2 |
| 单证辅助 | 提单草稿、装箱单、原产地证建议 | P3 |
| 大宗监控 | 开船/到港提醒、目的港动态推送 | P3 |

### 3.3 卖家 Agent — 5维评分模型（中小件专用）

```
Score = w1×Cost + w2×Time + w3×Stability + w4×Service + w5×Risk

默认权重（可动态调整）:
  Cost      (成本)      = 0.30
  Time      (时效)      = 0.25
  Stability (稳定性)    = 0.25
  Service   (服务)      = 0.10
  Risk      (风险)      = 0.10

动态调权规则:
  旺季（Q4）→ Stability 权重 +0.10，Cost 权重 -0.10
  急单标记  → Time 权重 +0.20，Cost 权重 -0.20
  高货值    → Risk 权重 +0.15，Cost 权重 -0.15
  特货品类  → 进入硬过滤，排除无资质渠道
```

### 3.4 卖家 Agent — ACCIO WORK 插件接入

```
触发场景:
  1. 订单管理页面 → 点击"发货" → 启动比价流程
  2. 大宗需求页面 → 点击"询价" → 启动定制询价流程
  3. 轨迹页面     → 异常状态  → 启动自愈建议面板

API Endpoints:
  POST /api/seller-agent/quote           # 中小件即时比价
  POST /api/seller-agent/bulk-inquiry    # 大宗商品需求提交
  POST /api/seller-agent/monitor         # 注册轨迹监控
  GET  /api/seller-agent/inquiry/:id     # 询价状态查询
  POST /api/seller-agent/exception/heal  # 异常处理建议

输入参数（中小件）:
  cargo_type, weight_kg, dimensions_cm, category,
  origin_city, destination_country, urgency_level,
  battery_included, liquid_included

输入参数（大宗）:
  cargo_description, hs_code, quantity, total_cbm,
  total_weight_kg, origin_port, destination_port,
  incoterms, special_requirements[], target_delivery_date
```

---

## 四、买家 SubAgent（Buyer Agent）设计

### 4.1 核心差异化价值

**最高优先级差异点**：**TLC 落地成本透明化（Total Landed Cost）**

让买家在**下单前**就看到完整的到岸总成本，消除"预算 $10 万，到岸花 $14 万"的噩梦。

**第二差异化**：**合规预诊断**——买之前就知道目的国有哪些认证要求和禁限规定。

### 4.2 服务分层

#### 4.2.1 中小件采购物流（标准品采购助手）

**目标用户**: 从中国采购标准商品的中小型进口商、电商买家

**服务流程**:
```
输入采购信息（品名/货值/数量/目的地）
          │
          ▼
HS 编码智能匹配（AI 辅助）
          │
          ▼
合规预诊断（目的国认证/禁限品检查）
[CE / FCC / SASO / REACH / RoHS ...]
          │
          ▼
TLC 落地成本测算（实时计算）
[货值 + 运费 + 关税 + VAT/GST + 清关杂费]
          │
          ▼
渠道比价推荐（国际快递 / 小包 / 空运）
          │
          ▼
成本拆解报告（PDF 导出）
```

**核心功能模块**:

| 模块 | 功能点 | 优先级 |
|------|--------|--------|
| TLC 计算器 | 货值+运费+关税+VAT+杂费完整拆解、PDF导出 | P1 |
| 合规预诊断 | HS编码匹配、认证要求清单、禁限品识别、红/黄/绿风险标注 | P1 |
| HS 编码助手 | 品名描述→HS编码AI推断、税率查询、历史记录 | P2 |
| 渠道推荐 | 中小件进口渠道比价（含税后成本对比）| P2 |

#### 4.2.2 大宗采购物流（定制进口方案）

**目标用户**: 从中国整柜/批量进口的贸易商、零售商、工厂

**服务流程**:
```
录入采购计划（多供应商 / 多品类）
          │
          ▼
供应商地址汇总 → 集货方案规划
[多城市集货协调: 上海/广州/义乌/深圳...]
[LCL 拼柜 vs FCL 整柜 临界点计算]
          │
          ▼
大宗 TLC 测算（含海运/空运/铁路对比）
[货值 + 海运费 + 目的港杂费 + 关税 + VAT + 仓储]
          │
          ▼
贸易条款建议
[FOB / CIF / DDP / DAP 利弊对比]
          │
          ▼
合规深度诊断（大批量特殊要求）
[产品认证 / 装箱规范 / 熏蒸要求 / 原产地证]
          │
          ▼
定制进口方案（含时间轴 + 费用拆解 + 风险提示）
```

**核心功能模块**:

| 模块 | 功能点 | 优先级 |
|------|--------|--------|
| 大宗 TLC 测算 | 海运/空运/铁路完整到岸成本对比、费用拆解表 | P1 |
| 集货规划 | 多供应商地址汇总、集货时间轴、费用分摊计算 | P2 |
| 贸易条款建议 | FOB/CIF/DDP/DAP 场景分析、风险收益对比 | P2 |
| 合规深度诊断 | 批量进口特殊认证、熏蒸/植检要求、原产地证 | P3 |
| 保险推荐 | 货物险方案推荐（结合货值+风险等级）| P4 |

### 4.3 买家 Agent — TLC 计算逻辑

```
TLC = 货值(CIF) + 进口关税 + VAT/GST + 清关杂费 + 内陆运输

具体公式:

  进口关税    = 货值(CIF) × HS关税税率
  VAT        = (货值 + 进口关税) × VAT税率
  清关杂费    = AMS费 + ISF费 + 港杂费 + 报关费（按目的国估算）
  内陆运输    = 目的港 → 买家仓库（可选输入）

TLC 呈现方式:
  ┌─────────────────────────────────┐
  │  货值(FOB)        $10,000       │
  │  国际运费         $1,200        │
  │  保险费           $50           │
  │  ─────────────── CIF = $11,250  │
  │  进口关税 (5%)    $562.50       │
  │  VAT (20%)       $2,362.50     │
  │  清关杂费         $350          │
  │  内陆运输         $200          │
  │  ═════════════════════════════  │
  │  完整到岸成本     $14,725       │  ← 这才是真实成本
  └─────────────────────────────────┘
```

### 4.4 买家 Agent — ACCIO WORK 插件接入

```
触发场景:
  1. 采购询价页面 → 点击"计算到岸成本" → TLC 计算流程
  2. 新品录入页面 → 点击"合规检查" → 合规预诊断流程
  3. 多供应商订单页面 → 点击"集货规划" → 集货方案流程
  4. 大宗采购页面 → 点击"获取进口方案" → 定制方案流程

API Endpoints:
  POST /api/buyer-agent/tlc              # 中小件/大宗 TLC 计算
  POST /api/buyer-agent/compliance       # 合规预诊断
  POST /api/buyer-agent/hs-lookup        # HS 编码查询
  POST /api/buyer-agent/consolidate      # 集货方案规划
  POST /api/buyer-agent/bulk-plan        # 大宗定制方案

输入参数（TLC 计算）:
  cargo_description, hs_code, unit_value, quantity,
  origin_country, destination_country, destination_port,
  incoterms, freight_mode(air/sea/rail),
  include_vat, include_inland_delivery

输入参数（集货规划）:
  suppliers[]: { name, city, cargo_cbm, cargo_kg, ready_date }
  destination_port, target_delivery_date, preferred_mode
```

---

## 五、跨 Agent 共享能力

以下能力同时服务卖家和买家两个 Agent，作为共享基础设施：

| 共享模块 | 描述 | 服务 |
|---------|------|------|
| HS 编码知识库 | 品名→HS编码智能匹配、关税税率查询 | 卖家报关 + 买家TLC |
| 合规数据库 | 200+目的国认证/禁限品规则 | 卖家报关预警 + 买家预诊断 |
| 承运商能力矩阵 | 渠道支持特货/超重/目的地覆盖索引 | 卖家比价硬过滤 + 买家渠道推荐 |
| 历史价格数据库 | 渠道历史运价趋势（用于价格参考）| 卖家比价 + 买家TLC运费估算 |
| 反馈学习引擎 | 基于真实履约结果校准推荐模型 | 两端共用 |

---

## 六、技术实现架构

### 6.1 与现有技术栈对齐

基于现有 **TrackFlow Monorepo**（Next.js 16 + Fastify 5 + PostgreSQL 16 + Redis 7）扩展：

```
apps/
├── web/src/app/
│   ├── seller-agent/
│   │   ├── page.tsx                  # 卖家 Agent 入口（货物类型选择）
│   │   ├── standard/page.tsx         # 中小件比价流程
│   │   └── bulk/page.tsx             # 大宗询价流程
│   └── buyer-agent/
│       ├── page.tsx                  # 买家 Agent 入口（货物类型选择）
│       ├── standard/page.tsx         # 中小件 TLC + 合规
│       └── bulk/page.tsx             # 大宗进口方案
│
apps/api/src/
├── routes/
│   ├── seller-agent.ts               # 卖家 Agent 路由
│   └── buyer-agent.ts                # 买家 Agent 路由
├── services/
│   ├── quote-engine.ts               # 中小件比价引擎
│   ├── bulk-inquiry.ts               # 大宗询价管理
│   ├── tlc-calculator.ts             # TLC 落地成本计算
│   ├── exception-monitor.ts          # 异常监控（卖家）
│   ├── compliance-checker.ts         # 合规预诊断
│   ├── consolidation-planner.ts      # 集货方案规划
│   └── hs-code-service.ts            # HS 编码 + 关税服务
└── skills/
    ├── carriers/
    │   ├── base.ts                   # 标准 Skill 接口
    │   ├── mock-dhl.ts               # DHL（中小件快递）
    │   ├── mock-fedex.ts             # FedEx
    │   ├── mock-yanwen.ts            # 燕文（经济小包）
    │   └── mock-sea-freight.ts       # 海运（大宗）
    └── shared/
        ├── hs-code-matcher.ts        # HS 编码匹配
        ├── duty-calculator.ts        # 关税计算
        └── compliance-rules.ts       # 合规规则引擎
```

### 6.2 核心数据模型

```typescript
// 货物信息（统一基础模型）
interface CargoInfo {
  type: 'standard' | 'bulk';          // 中小件 / 大宗
  description: string;
  hs_code?: string;
  weight_kg: number;
  volume_cbm?: number;
  unit_value_usd: number;
  quantity: number;
  special_flags: {
    battery: boolean;
    liquid: boolean;
    dangerous_goods: boolean;
    temperature_controlled: boolean;
    oversized: boolean;               // 超重超长
  };
}

// 比价请求（中小件卖家）
interface QuoteRequest {
  cargo: CargoInfo;
  origin: { country: string; city: string };
  destination: { country: string; postal_code?: string };
  urgency: 'normal' | 'urgent' | 'very_urgent';
  seller_preferences?: { preferred_channels?: string[] };
}

// TLC 计算请求（买家）
interface TLCRequest {
  cargo: CargoInfo;
  origin_country: string;
  destination_country: string;
  destination_port?: string;
  incoterms: 'FOB' | 'CIF' | 'EXW' | 'DDP' | 'DAP';
  freight_mode: 'air' | 'sea' | 'rail' | 'express';
  include_inland_delivery: boolean;
}

// 大宗询价请求
interface BulkInquiryRequest {
  mode: 'seller_export' | 'buyer_import'; // 区分卖家出口 / 买家进口
  cargo: CargoInfo;
  origin_port: string;
  destination_port: string;
  incoterms: string;
  target_delivery_date?: string;
  special_requirements?: string[];
}
```

### 6.3 ACCIO WORK 插件接入协议

```
接入方式: iFrame Plugin / WebComponent / REST API Webhook

认证: JWT Bearer Token（沿用现有 auth 体系）

插件初始化参数:
{
  "agent_type": "seller" | "buyer",
  "cargo_type": "standard" | "bulk",   // 新增：货物类型预设
  "context": {                          // 来自 ACCIO WORK 的订单上下文
    "order_id": "string",
    "cargo_prefill": {}                 // 可选：预填货物信息
  },
  "locale": "zh-CN" | "en-US",
  "theme": "light" | "dark"
}

Webhook 回调（异步结果通知）:
POST {accio_work_callback_url}
{
  "event": "quote_ready" | "tlc_calculated" | "exception_detected",
  "session_id": "string",
  "payload": {}
}
```

---

## 七、UI/UX 设计规范

### 7.1 货物类型选择器（入口页）

```
┌─────────────────────────────────────────────────┐
│  请选择您的货物类型                                │
│                                                 │
│  ┌─────────────────────┐ ┌────────────────────┐  │
│  │   📦 中小件          │ │   🚢 大宗商品       │  │
│  │   快递 / 小包        │ │   整柜 / 拼柜       │  │
│  │   标准品，即时报价   │ │   定制方案，单票询价 │  │
│  │   ≤ 30kg / 票       │ │   > 30kg 或整批     │  │
│  └─────────────────────┘ └────────────────────┘  │
└─────────────────────────────────────────────────┘
```

### 7.2 卖家中小件比价卡片（三栏式）

```
┌──────────────┬──────────────┬──────────────┐
│  🏆 AI推荐   │  💰 最省钱   │  ⚡ 最快     │
│  云途小包    │  燕文经济    │  DHL Express │
│  $8.50       │  $6.20       │  $28.00      │
│  8-12天      │  12-15天     │  3-5天       │
│  准点率94%   │  准点率88%   │  准点率99%   │
│              │              │              │
│  [选择此渠道] │  [选择此渠道] │  [选择此渠道] │
└──────────────┴──────────────┴──────────────┘

AI推荐理由: "云途在时效与成本之间取得最佳平衡，
比 DHL 便宜 $19.50，比燕文快 3 天，
匹配您的普通时效需求，历史准点率稳定在 94% 以上。"
```

### 7.3 买家 TLC 成本拆解卡片

```
┌─────────────────────────────────────────────┐
│  完整落地成本（TLC）测算结果                  │
│                                             │
│  货值 (FOB)              $10,000.00         │
│  国际运费（空运估算）      + $1,200.00        │
│  保险费 (0.5%)           + $50.00           │
│  ──────────────── CIF    = $11,250.00       │
│                                             │
│  进口关税 (HS 8471.30, 5%) + $562.50        │
│  VAT (英国 20%)          + $2,362.50        │
│  清关费 + AMS/ISF        + $350.00          │
│  内陆配送（可选）          + $200.00         │
│  ══════════════════════════════════════     │
│  📊 完整到岸成本           $14,725.00       │
│                                             │
│  ⚠️ 合规提示: 此品类进入英国需提供 CE 认证    │
│                                             │
│  [导出 PDF]  [重新估算]  [咨询大宗方案]       │
└─────────────────────────────────────────────┘
```

### 7.4 大宗询价状态时间轴

```
● 需求提交    ──  2026-05-18 10:00
● AI初步方案  ──  2026-05-18 10:02  [已完成]
○ 货代确认报价 ──  预计 2026-05-18 12:00  [进行中]
○ 锁舱确认    ──  等待中
○ 订舱确认书  ──  等待中
○ 开船提醒    ──  2026-06-10 (预计)
```

---

## 八、开发优先级规划（Phase）

### Phase 1 — MVP（验证核心差异化价值）

| 功能 | Seller Agent | Buyer Agent |
|------|-------------|------------|
| 货物类型选择入口 | ✅ | ✅ |
| **中小件比价引擎**（Mock数据）| ✅ | — |
| **TLC 落地成本测算** | — | ✅ |
| AI 可解释推荐 | ✅ | — |
| 合规预诊断（基础）| — | ✅ |
| 大宗需求采集表单 | ✅ | ✅ |

### Phase 2 — 自动化流程

| 功能 | Seller Agent | Buyer Agent |
|------|-------------|------------|
| 一键建单 + 面单生成 | ✅ | — |
| HS 编码智能助手 | ✅ | ✅ |
| 集货方案规划 | — | ✅ |
| 贸易条款建议 | — | ✅ |
| 大宗询价状态管理 | ✅ | ✅ |

### Phase 3 — 智能化提升

| 功能 | Seller Agent | Buyer Agent |
|------|-------------|------------|
| 售后自愈监控系统 | ✅ | — |
| 合规深度诊断（大宗）| — | ✅ |
| 真实 API 对接（17track / DHL）| ✅ | — |
| 渠道历史价格数据库 | ✅ | ✅ |

### Phase 4 — 生态扩展

| 功能 | Seller Agent | Buyer Agent |
|------|-------------|------------|
| 反馈学习权重校准 | ✅ | — |
| 保险方案推荐 | — | ✅ |
| 支付集成 | ✅ | ✅ |
| 多语言支持（阿语/西语）| ✅ | ✅ |

---

## 九、确认关卡（Confirmation Gates）

按照 AGENTS.md 多 Agent 协作流程，本文档完成后需经过：

1. **[当前节点] Planner 规划确认** — 用户确认本业务设计文档后，流转给 Designer
2. **设计确认** — Designer 出设计稿后，Planner + 用户确认，方可进入开发
3. **测试确认** — Evaluator 输出测试报告后，Planner + 用户确认，方可交付

---

## 十、待确认事项

| # | 问题 | 影响范围 |
|---|------|---------|
| 1 | MVP 范围：P1 单独上线验证，还是 P1+P2 一起？ | 开发排期 |
| 2 | 大宗询价 P1 阶段是否需要对接真实货代网络，还是模拟流程？ | 后端架构 |
| 3 | ACCIO WORK 插件形式：iFrame / WebComponent / 纯 API？ | 前端实现 |
| 4 | 关税税率数据库：购买第三方数据服务，还是自建基础版？ | 数据成本 |
| 5 | 中小件 vs 大宗判断：系统自动识别 + 用户可手动切换，还是完全手动选择？ | 交互设计 |
