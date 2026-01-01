# ContextOS (Nexus)

<div align="center">

**您的个人上下文操作系统**

一个集成任务管理、专注追踪、财务记录和日志记录的现代化生产力平台

[功能特性](#功能特性) • [技术栈](#技术栈) • [快速开始](#快速开始) • [项目结构](#项目结构) • [开发指南](#开发指南)

</div>

---

## 📋 功能特性

### 🎯 任务管理
- **智能任务追踪**：创建、更新和管理待办事项
- **优先级分类**：支持高、中、低优先级
- **子任务支持**：将复杂任务分解为可管理的子任务
- **状态管理**：待办、进行中、已完成状态追踪

### ⏱️ 专注会话
- **番茄工作法**：使用计时器进行专注工作
- **上下文模式**：工作、学习、个人等不同场景
- **会话统计**：追踪专注时长和效率

### 💰 财务管理
- **收支记录**：记录收入和支出
- **分类管理**：自定义交易分类
- **数据可视化**：通过图表查看财务趋势

### 📝 日志记录
- **每日日志**：记录每日想法和心情
- **心情追踪**：使用 emoji 记录情绪状态
- **Markdown 支持**：使用 Markdown 格式编写内容

### 📊 仪表板
- **统一视图**：在一个页面查看所有数据
- **实时更新**：数据自动同步和刷新
- **响应式设计**：适配桌面和移动设备

---

## 🛠️ 技术栈

### 前端框架
- **[Next.js 16](https://nextjs.org/)** - React 全栈框架
- **[React 19](https://react.dev/)** - UI 组件库
- **[TypeScript](https://www.typescriptlang.org/)** - 类型安全

### UI 组件
- **[shadcn/ui](https://ui.shadcn.com/)** - 可复用组件库
- **[Radix UI](https://www.radix-ui.com/)** - 无障碍原语组件
- **[Lucide React](https://lucide.dev/)** - 图标库
- **[Tailwind CSS 4](https://tailwindcss.com/)** - 样式框架

### 数据管理
- **[Supabase](https://supabase.com/)** - 后端即服务（BaaS）
- **[TanStack Query](https://tanstack.com/query)** - 数据获取和缓存
- **[Zod](https://zod.dev/)** - Schema 验证

### 其他工具
- **[OpenAI](https://openai.com/)** - AI 功能集成
- **[date-fns](https://date-fns.org/)** - 日期处理
- **[Recharts](https://recharts.org/)** - 数据可视化

---

## 🚀 快速开始

### 前置要求

- Node.js 18.17 或更高版本
- npm、yarn 或 pnpm
- Supabase 账户（用于数据库）

### 安装步骤

1. **克隆仓库**
```bash
git clone <repository-url>
cd ContextOS
```

2. **安装依赖**
```bash
npm install
# 或
yarn install
# 或
pnpm install
```

3. **配置环境变量**

创建 `.env.local` 文件并添加以下配置：

```env
# Supabase 配置
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI 配置（可选）
OPENAI_API_KEY=your_openai_api_key
```

4. **运行开发服务器**
```bash
npm run dev
```

5. **访问应用**

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

---

## 📁 项目结构

```
ContextOS/
├── app/                      # Next.js App Router
│   ├── actions/             # Server Actions
│   ├── api/                 # API 路由
│   ├── auth/                # 认证相关页面
│   ├── finance/             # 财务管理页面
│   ├── focus/               # 专注会话页面
│   ├── journal/             # 日志页面
│   ├── tasks/               # 任务管理页面
│   ├── layout.tsx           # 根布局
│   └── page.tsx             # 首页（仪表板）
├── components/              # React 组件
├── constants/               # 常量定义
├── hooks/                   # 自定义 Hooks
├── lib/                     # 工具库和验证
│   └── validation/          # Zod schemas
├── services/                # 数据服务层
├── supabase/                # Supabase 配置
├── types/                   # TypeScript 类型定义
├── utils/                   # 工具函数
└── package.json             # 项目配置
```

---

## 💻 开发指南

### 可用脚本

```bash
# 开发模式
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

### 代码规范

- 使用 TypeScript 进行类型检查
- 遵循 ESLint 配置规则
- 使用 Zod 进行运行时验证
- 组件使用 PascalCase 命名
- 工具函数使用 camelCase 命名

### 数据流

1. **客户端** → 使用 TanStack Query 发起请求
2. **Server Actions/API** → 处理业务逻辑
3. **Services** → 与 Supabase 交互
4. **Supabase** → 数据持久化

### 类型系统

所有类型定义集中在 `types/index.ts`，使用 Zod schema 进行验证：

```typescript
import { Task, TaskStatus, CreateTaskSchema } from '@/types';

// 使用类型
const task: Task = { ... };

// 使用常量
const status = TaskStatus.TODO; // 'todo'

// 验证数据
const validated = CreateTaskSchema.parse(data);
```

---

## 🔐 认证

本项目使用 Supabase Auth 进行用户认证：

- 支持邮箱密码登录
- 会话管理
- 受保护的路由
- SSR 友好的认证流程

---

## 🎨 UI 组件

使用 shadcn/ui 组件库，所有组件位于 `components/` 目录：

- 可自定义和扩展
- 基于 Radix UI
- Tailwind CSS 样式
- 完全类型安全

---

## 📊 数据库结构

主要数据表：

- **tasks** - 任务和子任务
- **focus_sessions** - 专注会话记录
- **transactions** - 财务交易
- **journal_entries** - 日志条目

详细 schema 定义请参考 `supabase/` 目录。

---

## 🤝 贡献

欢迎贡献！请遵循以下步骤：

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

---

## 📄 许可证

本项目为私有项目。

---

## 📮 联系方式

如有问题或建议，请通过以下方式联系：

- 提交 Issue
- 发起 Discussion

---

<div align="center">

**使用 ❤️ 和 TypeScript 构建**

</div>
