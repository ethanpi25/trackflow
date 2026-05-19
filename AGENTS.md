# AGENTS.md - Multi-Agent Team Configuration

## Team Overview

本项目采用多 Agent 协作模式，团队由 8 个角色组成，遵循标准的软件开发流程进行协作。

所有 Agent 共同遵循 **Karpathy Guidelines** 编码规范：
1. **Think Before Coding** — 编码前先思考，表明假设，不确定就问
2. **Simplicity First** — 简洁优先，最少代码解决问题
3. **Surgical Changes** — 外科手术式修改，只动必须动的
4. **Goal-Driven Execution** — 目标驱动，定义可验证的成功标准

---

## Agent Roles

| Agent | 角色 | 职责概述 |
|-------|------|----------|
| **Planner** | 规划师 | 需求分析、目标定义、任务拆解、项目管理 |
| **Designer** | 设计师 | 页面设计、交互设计、参考图规范提取、营销页面设计 |
| **Frontend Coder** | 前端工程师 | 前端页面开发、组件实现、交互逻辑 |
| **Frontend Coder (Agent UI)** | 前端工程师（Agent UI） | Agent 对话式界面开发、卡片组件、可视化 |
| **Backend Coder** | 后端工程师 | 服务端开发、API 实现、数据库设计 |
| **Backend Coder (Integration)** | 后端工程师（集成） | 承运商适配器、第三方 API 对接、Mock 数据 |
| **Fullstack Coder** | 全栈工程师 | 独立小功能端到端快速交付 |
| **Evaluator** | 测试工程师 | 回归测试、功能测试、质量保障 |

---

## Workflow (协作流程)

```
用户需求
   │
   ▼
┌─────────┐
│ Planner │ ← 需求分析、目标定义、任务拆解
└────┬────┘
     │ 分配设计任务
     ▼
┌──────────┐
│ Designer │ ← 设计稿产出
└────┬─────┘
     │ 设计稿确认（Planner + 用户）
     ▼
┌──────────────────────────────────────────────┐
│ API 规范审查                                  │
│ Backend Coder 起草 → Frontend Coder 审查      │
│ → Planner 批准                                │
└────────────────────┬─────────────────────────┘
     │ API 规范确认（Planner 批准）
     ▼
┌──────────────────────────────────────────────┐
│ 并行开发                                      │
│  • Frontend Coder (Core)                      │
│  • Frontend Coder (Agent UI)                  │
│  • Backend Coder (Core)                       │
│  • Backend Coder (Integration)                │
│  • Fullstack Coder                            │
└────────────────────┬─────────────────────────┘
     │ 开发完成、自测通过
     ▼
┌───────────┐
│ Evaluator │ ← 回归测试 + 功能测试
└────┬──────┘
     │ 测试报告确认（Planner + 用户）
     ▼
  交付验收
```

---

## Confirmation Gates (确认关卡)

项目中有三个关键确认节点，必须通过后才能继续：

1. **设计确认** — Designer 产出设计稿后，必须经过 Planner + 用户确认，方可进入 API 规范审查阶段
2. **API 规范确认** — Backend Coder 起草 API 规范后，须由 Frontend Coder 审查、Planner 批准，方可进入并行开发阶段
3. **测试确认** — Evaluator 输出测试报告后，必须经过 Planner + 用户确认，方可进行交付

---

## Confirmation Gate SLA（确认关卡 SLA）

为避免确认关卡阻塞项目推进，约定以下响应时限和处置机制：

### 响应时限

| 确认关卡 | 响应方 | 时限 |
|----------|--------|------|
| 设计确认 | Planner + 用户 | 24 小时 |
| API 规范确认 | Frontend Coder + Planner | 12 小时 |
| 测试确认 | Planner + 用户 | 24 小时 |

### 超时升级

- **用户超时未响应**：Planner 基于已有信息和项目目标自行决策，并将决策结论同步通知用户，用户事后可提出修订意见
- **角色 Agent 超时未响应**：Planner 直接介入推进，必要时跳过该角色的确认环节
- 所有超时决策须在评审记录中明确标注，便于追溯

### 分歧处理

- **Planner 与用户意见不一致**：以用户最终决策为准；若用户决策与项目目标存在明显冲突，Planner 须以书面形式提示风险后再执行
- **角色 Agent 之间意见不一致**（如 Frontend Coder 对 API 规范有异议）：由 Planner 召集相关方对齐，30 分钟内未达成一致则由 Planner 裁决
- 重大分歧（影响交付范围或里程碑）必须升级至用户确认

---

## Skills Configuration (技能配置)

所有 Agent 默认加载：
- `karpathy-guidelines` — 编码行为规范

各 Agent 已安装的专项 Skill（共 15 个）：

| Skill | 来源 | 适用 Agent | 说明 |
|-------|------|-----------|------|
| `karpathy-guidelines` | Karpathy | 全部 | 编码行为规范（4 大原则） |
| `skill-creator` | Anthropic | Planner | 创建和管理新 Skill 的元技能 |
| `frontend-design` | Anthropic | Designer, Frontend Coder, Frontend Coder (Agent UI) | 创建独特、生产级前端界面 |
| `web-design-guidelines` | Vercel | Designer | Web 设计准则和标准 |
| `figma-implement-design` | OpenAI | Designer, Frontend Coder | Figma 设计稿转化为生产代码 |
| `design-md` | Google Labs | Designer | 创建和管理 DESIGN.md 设计规范 |
| `react-best-practices` | Vercel | Frontend Coder, Frontend Coder (Agent UI), Fullstack Coder | React/Next.js 性能优化（70 条规则） |
| `composition-patterns` | Vercel | Frontend Coder, Frontend Coder (Agent UI) | React 组合模式与组件 API 设计 |
| `postgres-best-practices` | Supabase | Backend Coder | PostgreSQL 性能优化和最佳实践 |
| `security-best-practices` | OpenAI | Backend Coder, Backend Coder (Integration), Fullstack Coder, Evaluator | 安全编码审查（Python/JS/TS/Go） |
| `sentry-fix-issues` | Sentry | Backend Coder, Backend Coder (Integration), Evaluator | 堆栈追踪定位和修复生产问题 |
| `testing-handbook-skills` | Trail of Bits | Evaluator | 覆盖率分析、Fuzzer、测试方法论 |
| `static-analysis` | Trail of Bits | Evaluator | CodeQL + Semgrep + SARIF 静态分析 |
| `playwright` | OpenAI | Evaluator | 浏览器自动化测试（UI 回归） |
| `mock-data-patterns` | Custom | Backend Coder, Backend Coder (Integration), Evaluator | Mock 数据设计与维护规范 |

```
skills/
├── karpathy-guidelines/         # 全局 - 编码行为规范
├── skill-creator/               # Planner
├── frontend-design/             # Designer + Frontend Coder
├── web-design-guidelines/       # Designer
├── figma-implement-design/      # Designer + Frontend Coder
├── design-md/                   # Designer
├── react-best-practices/        # Frontend Coder
├── composition-patterns/        # Frontend Coder
├── postgres-best-practices/     # Backend Coder
├── security-best-practices/     # Backend Coder + Evaluator
├── sentry-fix-issues/           # Backend Coder + Evaluator
├── testing-handbook-skills/     # Evaluator
├── static-analysis/             # Evaluator
│   ├── codeql/
│   ├── semgrep/
│   └── sarif-parsing/
├── playwright/                  # Evaluator
└── mock-data-patterns/          # Backend Coder + Evaluator
```

---

## File Structure (文件结构)

```
.qoder/agents/
├── planner.md                   # 规划师配置
├── designer.md                  # 设计师配置
├── frontend-coder.md            # 前端工程师配置
├── frontend-coder-agent-ui.md   # 前端工程师（Agent UI）配置
├── backend-coder.md             # 后端工程师配置
├── backend-coder-integration.md # 后端工程师（集成）配置
├── fullstack-coder.md           # 全栈工程师配置
└── evaluator.md                 # 测试工程师配置

skills/
├── karpathy-guidelines/
│   └── SKILL.md        # Karpathy 编码规范
├── skill-creator/
│   └── SKILL.md        # Anthropic Skill 创建器
├── frontend-design/
│   └── SKILL.md        # Anthropic 前端设计
├── web-design-guidelines/
│   └── SKILL.md        # Vercel Web 设计准则
├── figma-implement-design/
│   └── SKILL.md        # OpenAI Figma 设计转代码
├── design-md/
│   └── SKILL.md        # Google Labs 设计规范文档
├── react-best-practices/
│   └── SKILL.md        # Vercel React 最佳实践
├── composition-patterns/
│   └── SKILL.md        # Vercel React 组合模式
├── postgres-best-practices/
│   └── SKILL.md        # Supabase PostgreSQL 最佳实践
├── security-best-practices/
│   └── SKILL.md        # OpenAI 安全编码审查
├── sentry-fix-issues/
│   └── SKILL.md        # Sentry 问题定位修复
├── testing-handbook-skills/
│   └── SKILL.md        # Trail of Bits 测试手册
├── static-analysis/
│   ├── codeql/
│   │   └── SKILL.md    # CodeQL 漏洞扫描
│   ├── semgrep/
│   │   └── SKILL.md    # Semgrep 静态分析
│   └── sarif-parsing/
│       └── SKILL.md    # SARIF 结果解析
├── playwright/
│   └── SKILL.md        # OpenAI 浏览器自动化测试
└── mock-data-patterns/
    └── SKILL.md        # Mock 数据设计与维护规范
```

---

## Usage (使用方式)

- 新需求提交给 **Planner** 进行分析和任务拆解
- **Planner** 根据任务性质分配给对应 Agent
- 各 Agent 按照各自 Workflow 执行，产出物逐级流转
- 关键节点（设计稿、测试报告）需用户确认
- 后续可通过在 `skills/` 目录添加新 Skill 来增强各 Agent 能力
