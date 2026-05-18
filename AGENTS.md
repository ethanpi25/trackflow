# AGENTS.md - Multi-Agent Team Configuration

## Team Overview

本项目采用多 Agent 协作模式，团队由 5 个角色组成，遵循标准的软件开发流程进行协作。

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
| **Designer** | 设计师 | 页面设计、交互设计、营销页面设计 |
| **Frontend Coder** | 前端工程师 | 前端页面开发、组件实现、交互逻辑 |
| **Backend Coder** | 后端工程师 | 服务端开发、API 实现、数据库设计 |
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
┌──────────────────────────────┐
│ Frontend Coder + Backend Coder │ ← 并行开发
└────────────┬─────────────────┘
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

项目中有两个关键确认节点，必须通过后才能继续：

1. **设计确认** — Designer 产出设计稿后，必须经过 Planner + 用户确认，方可进入开发阶段
2. **测试确认** — Evaluator 输出测试报告后，必须经过 Planner + 用户确认，方可进行交付

---

## Skills Configuration (技能配置)

所有 Agent 默认加载：
- `karpathy-guidelines` — 编码行为规范

各 Agent 已安装的专项 Skill（共 14 个）：

| Skill | 来源 | 适用 Agent | 说明 |
|-------|------|-----------|------|
| `karpathy-guidelines` | Karpathy | 全部 | 编码行为规范（4 大原则） |
| `skill-creator` | Anthropic | Planner | 创建和管理新 Skill 的元技能 |
| `frontend-design` | Anthropic | Designer, Frontend Coder | 创建独特、生产级前端界面 |
| `web-design-guidelines` | Vercel | Designer | Web 设计准则和标准 |
| `figma-implement-design` | OpenAI | Designer, Frontend Coder | Figma 设计稿转化为生产代码 |
| `design-md` | Google Labs | Designer | 创建和管理 DESIGN.md 设计规范 |
| `react-best-practices` | Vercel | Frontend Coder | React/Next.js 性能优化（70 条规则） |
| `composition-patterns` | Vercel | Frontend Coder | React 组合模式与组件 API 设计 |
| `postgres-best-practices` | Supabase | Backend Coder | PostgreSQL 性能优化和最佳实践 |
| `security-best-practices` | OpenAI | Backend Coder, Evaluator | 安全编码审查（Python/JS/TS/Go） |
| `sentry-fix-issues` | Sentry | Backend Coder, Evaluator | 堆栈追踪定位和修复生产问题 |
| `testing-handbook-skills` | Trail of Bits | Evaluator | 覆盖率分析、Fuzzer、测试方法论 |
| `static-analysis` | Trail of Bits | Evaluator | CodeQL + Semgrep + SARIF 静态分析 |
| `playwright` | OpenAI | Evaluator | 浏览器自动化测试（UI 回归） |

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
└── playwright/                  # Evaluator
```

---

## File Structure (文件结构)

```
.qoder/agents/
├── planner.md          # 规划师配置
├── designer.md         # 设计师配置
├── frontend-coder.md   # 前端工程师配置
├── backend-coder.md    # 后端工程师配置
└── evaluator.md        # 测试工程师配置

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
└── playwright/
    └── SKILL.md        # OpenAI 浏览器自动化测试
```

---

## Usage (使用方式)

- 新需求提交给 **Planner** 进行分析和任务拆解
- **Planner** 根据任务性质分配给对应 Agent
- 各 Agent 按照各自 Workflow 执行，产出物逐级流转
- 关键节点（设计稿、测试报告）需用户确认
- 后续可通过在 `skills/` 目录添加新 Skill 来增强各 Agent 能力
