# ContextOS (Nexus)

一个基于 AI 的个人上下文操作系统，集成任务管理、专注追踪、财务记录和情绪日记，帮助你理解生活各维度的关联模式。

![Version](https://img.shields.io/badge/version-0.1.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![React](https://img.shields.io/badge/React-19.2-61dafb)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178c6)

## ✨ 核心特性

- **📋 智能任务管理** - AI 驱动的任务拆解，支持子任务、优先级和截止日期
- **⏱️ 专注追踪** - 番茄钟计时器，记录并可视化专注时光
- **💰 财务追踪** - 收支记录与可视化现金流分析
- **📔 情绪日记** - AI 分析心情和思考，提供心理学反思
- **🤖 上下文洞察** - 基于多维度数据生成个性化 AI 建议
- **🎨 现代 UI** - Dark mode 支持，响应式设计
- **⚡ 实时同步** - 基于 Supabase 的实时数据库

## 🏗️ 技术栈

### 核心框架
- **[Next.js 16](https://nextjs.org/)** - React 服务端渲染框架 (App Router)
- **[React 19](https://react.dev/)** - UI 库（最新版本）
- **[TypeScript 5.8](https://www.typescriptlang.org/)** - 类型安全

### 数据层
- **[Supabase](https://supabase.com/)** - PostgreSQL 数据库 + 身份认证
- **[TanStack Query](https://tanstack.com/query)** - 服务端状态管理与缓存
- **[Zod 4](https://zod.dev/)** - 运行时类型验证

### UI/样式
- **[Tailwind CSS 4](https://tailwindcss.com/)** - 原子化 CSS 框架
- **[shadcn/ui](https://ui.shadcn.com/)** - 可组合的 UI 组件库
- **[Radix UI](https://www.radix-ui.com/)** - 无样式可访问组件
- **[Recharts](https://recharts.org/)** - 数据可视化图表
- **[Lucide Icons](https://lucide.dev/)** - 图标库

### AI 集成
- **[OpenAI SDK](https://platform.openai.com/)** - AI API 客户端 (兼容 DeepSeek)

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm / pnpm / yarn
- Supabase 账号

### 安装步骤

1. **克隆项目**
```bash
git clone https://github.com/Modulus010/ContextOS.git
cd ContextOS
```

2. **安装依赖**
```bash
npm install
# 或
pnpm install
```

3. **配置环境变量**

复制 `.env.example` 到 `.env.local`:
```bash
cp .env.example .env.local
```

编辑 `.env.local` 并填入以下配置:
```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key

# AI 配置 (DeepSeek 或 OpenAI)
API_KEY=your-deepseek-api-key
API_BASE_URL=https://api.deepseek.com/v1
```

> 💡 **获取 API Key:**
> - Supabase: [https://supabase.com/dashboard](https://supabase.com/dashboard)
> - DeepSeek: [https://platform.deepseek.com/](https://platform.deepseek.com/)

4. **初始化数据库**

在 Supabase SQL Editor 中执行迁移文件:
```bash
# 按顺序执行 supabase/migrations/ 下的 SQL 文件
```

5. **启动开发服务器**
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 🎉

## 📦 构建生产版本

```bash
npm run build
npm start
```

## 📁 项目结构

```
ContextOS/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes
│   │   └── ai/                  # AI 服务端点
│   │       ├── chat/            # 聊天接口
│   │       ├── insight/         # 上下文洞察
│   │       ├── journal/         # 日记分析
│   │       └── subtasks/        # 任务拆解
│   ├── auth/                    # 认证页面
│   ├── protected/               # 受保护路由
│   ├── layout.tsx               # 根布局
│   └── page.tsx                 # 首页
│
├── components/                   # React 组件
│   ├── modules/                 # 功能模块
│   │   ├── TaskModule.tsx       # 任务管理
│   │   ├── FocusModule.tsx      # 专注追踪
│   │   ├── FinanceModule.tsx    # 财务管理
│   │   └── JournalModule.tsx    # 日记模块
│   ├── ui/                      # shadcn/ui 组件
│   ├── common/                  # 通用组件
│   └── Dashboard.tsx            # 仪表盘
│
├── hooks/                        # 自定义 Hooks
│   ├── useSupabaseData.ts       # 数据查询/变更
│   ├── useBusinessLogic.ts      # 业务逻辑
│   └── useDailyStats.ts         # 统计数据
│
├── services/                     # 服务层
│   ├── dataService.ts           # 数据库服务
│   └── aiService.ts             # AI 服务
│
├── lib/                          # 工具库
│   ├── supabase/                # Supabase 客户端
│   ├── errors/                  # 错误处理
│   ├── mapping/                 # 数据映射
│   └── validation/              # Zod Schemas
│
├── types/                        # TypeScript 类型
├── constants/                    # 常量定义
├── utils/                        # 工具函数
└── supabase/                     # Supabase 配置
    └── migrations/              # 数据库迁移
```

## 🏛️ 架构设计

### 分层架构

```
┌─────────────────────────────────────┐
│         UI Layer (Components)       │
│   - React Components                │
│   - shadcn/ui, Tailwind CSS        │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│      Hook Layer (Custom Hooks)      │
│   - TanStack Query Hooks            │
│   - Business Logic Hooks            │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│       Service Layer (Services)      │
│   - Data Service (CRUD)             │
│   - AI Service (API Calls)          │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│   Infrastructure Layer (lib/)       │
│   - Error Handling                  │
│   - Data Mapping (snake/camel)      │
│   - Validation (Zod)                │
│   - Supabase Client                 │
└─────────────────────────────────────┘
```

### 核心设计模式

#### 1. **统一错误处理**
```typescript
// lib/errors/index.ts
export class ErrorHandler {
  static database(message: string, details?: any): AppError
  static validation(message: string, details?: any): AppError
  static aiService(message: string, details?: any): AppError
}
```

#### 2. **数据映射层**
```typescript
// lib/mapping/index.ts
export const TaskMapper = {
  fromDb(row): Task,      // snake_case → camelCase
  toDb(task): DbTask,     // camelCase → snake_case
  toDbInsert(task): DbTask
}
```

#### 3. **Zod 验证**
```typescript
// lib/validation/schemas.ts
export const TaskSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  // ...
})

export type Task = z.infer<typeof TaskSchema>
```

#### 4. **乐观更新**
```typescript
// hooks/useSupabaseData.ts
export function useCreateTask() {
  return useMutation({
    onMutate: async (newTask) => {
      // 立即更新 UI
      queryClient.setQueryData(...)
    },
    onError: (_, __, context) => {
      // 回滚
      queryClient.setQueryData(...)
    }
  })
}
```

## 🔐 安全性

- ✅ Supabase Row Level Security (RLS) 策略
- ✅ 服务端环境变量保护
- ✅ API Key 仅在服务端使用
- ✅ Zod 运行时验证防止注入
- ✅ CSRF 保护（Next.js 内置）

## 🧪 测试

```bash
# 运行单元测试 (待实现)
npm run test

# 运行 E2E 测试 (待实现)
npm run test:e2e

# 类型检查
npm run type-check

# Lint
npm run lint
```

## 📝 开发指南

### 添加新功能模块

1. **创建 Zod Schema**
```typescript
// lib/validation/schemas.ts
export const NewFeatureSchema = z.object({ ... })
```

2. **创建 Mapper**
```typescript
// lib/mapping/index.ts
export const NewFeatureMapper = { fromDb, toDb, toDbInsert }
```

3. **创建 Service**
```typescript
// services/dataService.ts
export const newFeatureService = {
  async getAll() { ... }
}
```

4. **创建 Hooks**
```typescript
// hooks/useSupabaseData.ts
export function useNewFeature() { ... }
```

5. **创建组件**
```typescript
// components/modules/NewFeatureModule.tsx
export const NewFeatureModule = () => { ... }
```

### 代码规范

- 使用 TypeScript strict 模式
- 遵循 ESLint 规则
- 组件使用函数式组件 + Hooks
- 使用 `async/await` 而非 Promise chains
- 错误统一通过 `ErrorHandler` 处理

## 🎯 路线图

- [ ] 单元测试覆盖
- [ ] E2E 测试
- [ ] PWA 支持
- [ ] 离线模式
- [ ] 数据导出/导入
- [ ] 多语言支持
- [ ] 移动端原生应用
- [ ] 团队协作功能

## 🤝 贡献

欢迎 PR！请遵循以下步骤：

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 🙏 致谢

- [Next.js](https://nextjs.org/) - 强大的 React 框架
- [Supabase](https://supabase.com/) - 开源的 Firebase 替代品
- [shadcn/ui](https://ui.shadcn.com/) - 优雅的组件库
- [DeepSeek](https://www.deepseek.com/) - 高性价比 AI 服务

## 📧 联系方式

- GitHub: [@Modulus010](https://github.com/Modulus010)
- 项目链接: [https://github.com/Modulus010/ContextOS](https://github.com/Modulus010/ContextOS)

---

⭐ 如果这个项目对你有帮助，请给个 Star！
