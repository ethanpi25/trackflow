---
name: mock-data-patterns
description: |
  当需要设计、创建或维护 Mock 数据时触发。适用于 API Mock 响应设计、
  测试数据 Fixture 编写、演示场景数据构建、Mock Adapter 实现等场景。
  只要任务涉及"假数据 / 演示数据 / Demo 场景 / 占位响应 / Fixture / Stub"，
  即使用户没有明确说"Mock"二字，也应该使用本技能，避免数据结构与真实
  API 漂移、跨模块字段不一致、场景与需求文档脱节等典型问题。
---

# Mock Data Patterns — 物流业务 Mock 数据设计与维护规范

本技能用于在 TrackFlow / Seller Agent 这类物流副驾驶产品中，建立一致、可
追溯、贴近真实业务的 Mock 数据。它解决的核心风险是：**"前后端各自捏造
Mock 数据，字段语义漂移，演示场景与需求文档脱节"**。

## 一、核心原则

Mock 不是"随便写点假数据"，它是真实 API 的契约影子。请把每一份 Mock
当作未来真接入时的迁移基线来设计。

1. **真实性（Realism）**
   - 数值落在真实业务值域内：运费 $6–$35、跨境时效 3–22 天、准点率 85–
     99%。避免出现"$1 / 100 天 / 0% 准点"这类一眼假的占位值。
   - 时间字段使用 `ISO 8601`，时区统一 UTC（`new Date().toISOString()`）。
   - 文案至少同时给出中英两版（参考 [mock-adapter.ts](file:///Users/pi/Documents/LOGISTIC/apps/api/src/adapters/mock-adapter.ts)
     的 `descriptionZh` / `descriptionEn`）。

2. **一致性（Consistency）**
   - 同一实体在前端 fixture、后端 adapter、shared 类型三处必须共用同一
     套 type，源头是 `@logistic/shared` 的 `Shipment / TrackingEvent /
     TrackingStatus`，禁止在某一侧偷偷扩字段。
   - 状态枚举只能取自 `TrackingStatus`，不允许字符串自由发挥
     （如不要写 `"shipping"`，应该用 `TrackingStatus.IN_TRANSIT`）。

3. **可复用性（Reusability）**
   - 把"渠道列表 / 承运商 / 默认运单"等高频共享数据抽成具名 fixture
     （如 [quoteChannels](file:///Users/pi/Documents/LOGISTIC/apps/web/src/app/(fullscreen)/seller-agent/demo/scenario-data.ts)），
     不要在每个场景内重复声明。
   - 单个 fixture 通过 spread / override 派生变体，比如 `allQuoteChannels =
     [...quoteChannels, ...extraChannels]`。

4. **可追溯性（Traceability）**
   - 每个场景 Mock 必须能映射到需求文档章节：
     - SELLER_AGENT_SPEC §六「Mock 场景库」→ `scenario-data.ts` 中的 5 个
       `Scenario` 条目。
     - BUSINESS_DESIGN.md 的运单状态流 → `MockAdapter.track()` 返回的事件
       序列。
   - 场景 id（`quote / special / bulk / exception / insight`）与 SPEC 中
     的「场景一/二/三/四/五」一一对齐，重命名时两侧同步。

## 二、数据建模模式

### 2.1 实体关系映射

物流领域核心实体及其关系（请把它当成 Mock 设计时的脑图）：

```
Shipment（运单）
  ├── Carrier（承运商：DHL / 云途 / 燕文 / 4PX / 递四方 / EMS）
  ├── Origin / Destination（地点：city + country + countryCode）
  ├── currentStatus  ← TrackingStatus 枚举
  ├── events: TrackingEvent[]   ← 时间线（按 timestamp 升序）
  └── metadata: { dataSource, lastSynced, confidence }

QuoteChannel（报价渠道）
  ├── price / days / onTimeRate
  ├── scoreDims: { cost, time, stability, service, risk }   ← 5维评分
  └── tier: economy | standard | premium

Scenario（演示对话）
  ├── id / tab / title / valueTag
  └── steps: ChatMessage[][]   ← 多轮交替，user / agent
        └── ChatMessage { card?: CardType, quickReplies?: string[] }
```

设计 Mock 时，先画出实体关系，再决定哪一层做 fixture，哪一层做派生。

### 2.2 状态机模拟

运单状态必须按合法流转生成事件，不能跳跃倒退。参考
[TrackingStatus](file:///Users/pi/Documents/LOGISTIC/packages/shared/src/types/index.ts)：

```
PENDING → PICKED_UP → EXPORT_CUSTOMS → IN_TRANSIT
       → IMPORT_CUSTOMS → OUT_FOR_DELIVERY → DELIVERED

异常分支：
  IN_TRANSIT → EXCEPTION（卡关 / 海关扣留）
  IN_TRANSIT → RETURNED（拒收 / 退回）
  任意态     → LOST（丢件）
```

**示例：构造一条"清关延误中"运单**
```ts
events: [
  { timestamp: t-3d, statusCode: PICKED_UP,       location: Shanghai },
  { timestamp: t-2d, statusCode: EXPORT_CUSTOMS,  location: Shanghai },
  { timestamp: t-1d, statusCode: IN_TRANSIT,      location: Anchorage },
  { timestamp: t-0.5d, statusCode: IMPORT_CUSTOMS, location: LA },  // 当前停滞
],
currentStatus: IMPORT_CUSTOMS,
```

时间戳之间的 **delta 必须随状态合理**：揽收→出口清关 ≥ 数小时；干线运输
≥ 1 天；清关停滞建议 ≥ 48h 才触发"异常"语义。

### 2.3 边界值覆盖

为 QA 留出覆盖路径，每类实体至少准备一条边界 fixture：

| 边界类别 | 示例 |
|---------|------|
| 空集合   | `events: []`（刚下单未揽收）|
| 长字段   | 货物描述 200+ 字符；多语言混排 |
| 极值数字 | `price: 0.01` / `price: 9999.99` / `weight: 0.001` |
| 异常状态 | `EXCEPTION / LOST / RETURNED` 各一条 |
| 特殊字符 | 包含 emoji、中英混排、`<script>`（用于检验 XSS 防御）|
| 超时时间 | `estimatedDelivery` 早于今天（已超期未签收）|

## 三、物流领域 Mock 模板

下列模板均与现有代码字段命名一致，可直接复制再微调。

### 3.1 运单（Shipment）

```ts
{
  trackingNumber: 'YT2026051801234',
  carrierCode: 'yuntu',
  carrierName: '云途小包',
  origin:      { city: 'Shanghai',     country: 'China',         countryCode: 'CN' },
  destination: { city: 'Los Angeles',  country: 'United States', countryCode: 'US' },
  currentStatus: TrackingStatus.IN_TRANSIT,
  estimatedDelivery: iso(now + 5d),
  events: [/* TrackingEvent[]，见 §2.2 */],
  metadata: { dataSource: '17track', lastSynced: iso(now), confidence: 100 },
  createdAt: iso(now - 3d),
  updatedAt: iso(now),
}
```

### 3.2 承运商（Carrier）

最小集来自 SPEC §五的 Mock 渠道表：

| code   | name      | scoreDims（cost/time/stability/service/risk）|
|--------|-----------|---------------------------------------------|
| dhl    | DHL Express | 3.5 / 9.5 / 9.8 / 9.0 / 9.5 |
| yuntu  | 云途小包    | 7.8 / 7.5 / 9.4 / 8.2 / 8.8 |
| 4px    | 4PX 标快    | 8.2 / 7.2 / 9.1 / 8.5 / 8.6 |
| yanwen | 燕文经济    | 9.5 / 5.5 / 8.8 / 7.5 / 8.0 |
| difang | 递四方小包  | 8.8 / 6.8 / 8.5 / 7.8 / 8.2 |
| ems    | EMS 国际    | 5.5 / 8.8 / 9.2 / 7.0 / 7.8 |

新增渠道时，必须同时给出 5 个维度评分，禁止半残。

### 3.3 报价 / 价格

```ts
{
  id: 'yuntu',
  name: '云途小包',
  badge: 'AI 推荐',          // 可选: 'AI 推荐' | '最省钱' | '最快' | ''
  price: 8.5,                // USD，保留 2 位小数
  days: '8-12 天',           // 区间字符串
  onTimeRate: 94,            // 0-100 整数
  score: 8.2,                // 综合评分，0-10
  scoreDims: { cost, time, stability, service, risk },
  tier: 'standard',          // economy | standard | premium
  highlight: true,           // UI 高亮位
  provider: 'Alibaba.com Logistics',
}
```

### 3.4 时间线事件（TrackingEvent）

```ts
{
  timestamp: iso(now - 2d),
  location:  { city: 'Shanghai', country: 'China', countryCode: 'CN' },
  statusCode: TrackingStatus.EXPORT_CUSTOMS,
  descriptionZh: '快件已通过上海海关出口清关',
  descriptionEn: 'Cleared export customs in Shanghai',
  rawStatus: 'CUSTOMS_CLEARED',   // 承运商原始状态码（用于回溯）
}
```

### 3.5 异常场景模板

异常 fixture 至少要覆盖 SPEC §四「售后自愈」中提到的 3 类：

- **清关延误**：`currentStatus = IMPORT_CUSTOMS`，最近 event 已停滞
  ≥ 72h，metadata 加 `riskLevel: 'medium'` / `delayHours: 72`。
- **丢件**：`currentStatus = LOST`，事件链中有 `IN_TRANSIT` 之后突然
  `EXCEPTION`，文案「无更新超过 X 天」。
- **退回**：`currentStatus = RETURNED`，destination 与 origin 倒置，
  events 末尾出现"地址不可达 / 拒收"。
- **海关扣留**：`statusCode = EXCEPTION`，`rawStatus: 'CUSTOMS_HOLD'`，
  描述需要补充"缺少 ISF/AMS 单证"等实务原因。

## 四、文件组织规范

```
apps/api/src/adapters/
  └── mock-adapter.ts         # 后端 Mock：实现 CarrierAdapter 契约
apps/web/src/app/(fullscreen)/seller-agent/demo/
  ├── scenario-data.ts        # 演示场景：5 个 Scenario + 渠道 fixture
  └── cards.tsx               # 卡片组件，仅消费 fixture，不再造数据
packages/shared/src/types/
  └── index.ts                # 单一事实源：Shipment / TrackingStatus
```

**命名约定**

- 共享 fixture：复数名词 + 实体类型，如 `quoteChannels`、`mockShipments`。
- 单条 fixture：动词 + 状态形容词，如 `buildPendingShipment()`、
  `buildDelayedShipment()`。
- 场景脚本：`scenario-<id>.ts` 或合并到 `scenario-data.ts`，与 SPEC 场景
  id 对齐（`quote / special / bulk / exception / insight`）。

**Scenario 数据的组织方式**（参考现有 `scenario-data.ts`）

```ts
export interface Scenario {
  id: string;            // 与 SPEC §六场景 id 完全一致
  tab: string;           // 「场景一」…「场景五」
  title: string;
  subtitle: string;
  icon: string;          // emoji
  valueTag: string;      // 一句话核心价值，对齐 SPEC valueTag
  steps: ChatMessage[][];// 每个 step 是同一时刻的消息批
}
```

每个 `step` 推荐只包含 1 条消息，方便前端按节奏渐进渲染。`quickReplies`
里的文案要在下一个 user step 中**精确出现**，否则上下文断裂。

## 五、Mock Adapter 实现模式

后端 Mock 通过实现 `CarrierAdapter` 契约接入正式管线，便于将来无缝替换
为真实承运商。模式参考 [MockAdapter](file:///Users/pi/Documents/LOGISTIC/apps/api/src/adapters/mock-adapter.ts)：

```ts
export class MockAdapter implements CarrierAdapter {
  readonly name = 'Mock (Dev)';
  readonly code = 'mock';
  supports(_: string) { return true; }    // 兜底所有 carrier

  async track(trackingNumber: string, carrierCode?: string) {
    await delay(200);                      // 见 §六：模拟网络延迟
    return buildShipment({ trackingNumber, carrierCode });
  }
}
```

要点：
- `supports()` 返回 `true` 只在 dev/test 环境兜底，不要带进生产构建。
- 所有"假数据生成"集中在 `buildShipment` 一类工厂函数中，`track()` 只
  做编排，便于单测。
- 不要在 adapter 里写死单条数据；用工厂 + 入参派生，至少支持按
  `trackingNumber` 后缀切换状态（如 `*X` → 异常、`*L` → 丢件）。

## 六、API Mock 响应标准

Mock 响应必须复刻真实 API 的成功 / 失败两条路径，否则前端在切到真接口
时会出现"只调过 happy path"的事故。

### 6.1 响应结构与真实 API 一致

成功响应直接返回领域对象（`Shipment`），失败用 HTTP 状态码 + JSON：

```jsonc
// 200 OK
{ "trackingNumber": "...", "currentStatus": "IN_TRANSIT", "events": [...] }

// 404 Not Found
{ "error": "TRACKING_NOT_FOUND", "message": "运单号不存在", "trackingNumber": "X" }

// 429 Too Many Requests
{ "error": "RATE_LIMITED", "retryAfterSeconds": 60 }
```

错误码使用大写蛇形（`TRACKING_NOT_FOUND`），与
[apps/api/src/routes/track.ts](file:///Users/pi/Documents/LOGISTIC/apps/api/src/routes/track.ts) 保持一致。

### 6.2 错误响应模拟

至少为每个 Mock 接口预留下列触发器：

| 触发条件                     | 模拟响应 |
|----------------------------|---------|
| `trackingNumber === '404'` | 404 + `TRACKING_NOT_FOUND` |
| `trackingNumber === '500'` | 500 + `INTERNAL_ERROR` |
| 短时间内 > N 次             | 429 + `RATE_LIMITED` |
| `trackingNumber` 含 `BAD`  | 400 + `INVALID_FORMAT` |

### 6.3 延迟与超时模拟

- 默认延迟 `150–300ms`（参考 `mock-adapter.ts` 的 `setTimeout 200`），
  让加载态有机会渲染。
- 提供"慢速通道"用于压力 / 加载态视觉验证：根据 query / header
  （`?mockDelay=5000`）注入 5s 延迟。
- 超时模拟：直接 `await new Promise(() => {})` 永不 resolve，让前端的
  超时兜底逻辑被真正触发，而不是依赖人工 console。

## 七、Checklist（提交前自检）

- [ ] 新增字段已同步到 `@logistic/shared` 的 type，前后端共用。
- [ ] 状态字段使用 `TrackingStatus` 枚举，没有裸字符串。
- [ ] 时间字段是 ISO 8601，事件按时间升序。
- [ ] 渠道 fixture 五维评分齐全，数值在 0–10 范围。
- [ ] Scenario id 与 SELLER_AGENT_SPEC §六编号一致，`quickReplies` 与
  下一步 user 文案对齐。
- [ ] 至少覆盖 1 条异常 fixture（卡关 / 丢件 / 退回 / 扣留任选）。
- [ ] Mock Adapter 同时实现成功路径和至少 1 类错误路径。
- [ ] 文档 / 注释中引用了来源 SPEC 章节，便于回溯。
