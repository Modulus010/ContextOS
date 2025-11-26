# Nexus Context OS - 生活上下文操作系统

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

**一个集成任务管理、深度专注、财务追踪和认知日志的人生管理系统**

</div>

## 📋 项目特性

Nexus OS 是一个全栈认知管理平台，帮助你在生活的多个维度保持清晰和专注：

- 🎯 **任务流** - 捕捉任务以减轻认知负担，支持 AI 拆解复杂任务
- ⏱️ **深度工作** - 使用番茄钟技术进行单任务处理，减少认知残留
- 💰 **现金流** - 追踪收支，理解消费与心理的联系
- 📔 **认知日志** - 外化思维，记录情绪，获得 AI 心理学洞察
- 🧠 **上下文概览** - 基于数据的 AI 洞察，理解任务、专注、消费和情绪的关联

## 🏗️ 项目结构

项目采用清晰的分层架构，便于维护和扩展：

```
src/
├── components/              # React 组件
│   ├── common/             # 可复用通用组件
│   ├── modules/            # 功能模块组件
│   │   ├── TaskModule.tsx
│   │   ├── FocusModule.tsx
│   │   ├── FinanceModule.tsx
│   │   └── JournalModule.tsx
│   ├── Dashboard.tsx        # 仪表板
│   ├── Icons.tsx            # 图标组件库
│   └── App.tsx              # 应用主组件
├── hooks/                   # 自定义 React Hooks
│   ├── useLocalStorage.ts   # localStorage 管理
│   ├── useGlobalState.ts    # 全局状态管理
│   ├── useDailyStats.ts     # 日统计数据
│   └── index.ts             # Hooks 导出
├── services/                # 业务逻辑和 API
│   └── aiService.ts         # AI 服务（DeepSeek）
├── utils/                   # 工具函数
│   ├── dateTime.ts          # 日期时间工具
│   ├── dataFilters.ts       # 数据过滤和计算
│   └── index.ts             # 工具导出
├── constants/               # 常量配置
│   ├── storage.ts           # localStorage 键常量
│   ├── api.ts               # API 配置
│   ├── ui.ts                # UI 常量
│   └── index.ts             # 常量导出
├── types/                   # TypeScript 类型定义
│   └── index.ts             # 全局类型
├── context/                 # React Context（状态管理）
│   ├── GlobalContext.tsx    # 全局状态 Context
│   └── index.ts             # Context 导出
├── index.tsx                # 应用入口
└── index.html               # HTML 模板
```

## 🚀 快速开始

### 前置条件
- Node.js 18+
- npm 或 yarn

### 安装依赖

```bash
npm install
```

### 配置环境变量

1. 创建 `.env.local` 文件在项目根目录
2. 添加你的 API 密钥：

```env
API_KEY=your_deepseek_api_key_here
```

获取 API 密钥：[DeepSeek API](https://platform.deepseek.com/)

### 开发模式

```bash
npm run dev
```

应用将在 `http://localhost:3000` 启动

### 构建生产版本

```bash
npm run build
```

输出文件在 `dist/` 目录

### 预览生产构建

```bash
npm run preview
```

## 📦 核心模块

### 任务流 (TaskModule)
- 创建、编辑、删除任务
- 设置优先级（高、中、低）
- AI 智能拆解复杂任务为子任务
- 按状态和优先级自动排序

### 深度工作 (FocusModule)
- 自定义专注时长（5-120 分钟）
- 预设快速选择（15、25、50、90 分钟）
- 实时进度显示
- 完成提醒通知
- 关联任务追踪

### 现金流 (FinanceModule)
- 记录收入和支出
- 实时余额计算
- 近期交易可视化图表
- 交易历史详细记录

### 认知日志 (JournalModule)
- 记录日记和心情（5 级情绪）
- 获得 AI 心理学反思
- 情绪趋势追踪
- 私密性反思空间

### 上下文概览 (Dashboard)
- 今日统计（完成任务、专注时间、支出）
- AI 生成的个性化洞察
- 实时活动流展示
- 多维度数据聚合

## 🔧 技术栈

- **前端框架**: React 19
- **构建工具**: Vite 6
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **数据可视化**: Recharts
- **AI 服务**: DeepSeek API
- **本地存储**: localStorage

## 🎯 架构设计理念

### 1. 清晰的分层结构
- **Components** - 展示逻辑
- **Hooks** - 状态和业务逻辑
- **Services** - 外部 API 调用
- **Utils** - 纯工具函数
- **Constants** - 配置和常量

### 2. 关注点分离
- 类型定义集中在 `types/`
- 常量管理在 `constants/`
- 通用工具在 `utils/`
- 业务逻辑在 `hooks/` 和 `services/`

### 3. 状态管理
- 使用自定义 `useLocalStorage` hook 持久化
- `useGlobalState` 统一管理全局状态
- `useDailyStats` 计算日统计数据
- Context API 避免 prop drilling

### 4. 代码复用
- Dashboard 中提取 `StatCard` 和 `ActivityItem` 组件
- TaskModule 中提取 `TaskItem` 组件
- 通用工具函数在 `utils/` 中集中管理

## 📝 数据模型

### Task（任务）
```typescript
{
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'high' | 'medium' | 'low';
  createdAt: number;
  tags: string[];
  subtasks?: Subtask[];
}
```

### FocusSession（专注会话）
```typescript
{
  id: string;
  durationSeconds: number;
  taskId?: string;
  timestamp: number;
  completed: boolean;
}
```

### Transaction（交易）
```typescript
{
  id: string;
  amount: number;
  description: string;
  type: 'income' | 'expense';
  category: string;
  timestamp: number;
}
```

### JournalEntry（日记条目）
```typescript
{
  id: string;
  content: string;
  mood: 'great' | 'good' | 'neutral' | 'bad' | 'terrible';
  timestamp: number;
  aiReflection?: string;
}
```

## 🔌 API 集成

项目使用 **DeepSeek API** 提供 AI 功能：

### 端点

1. **生成上下文洞察** (`generateContextualInsight`)
   - 分析用户今日数据
   - 生成个性化心理学建议

2. **分析日记** (`analyzeJournalEntry`)
   - 提供心理学反思
   - 加深自我认识

3. **智能拆解任务** (`generateSubtasks`)
   - 将复杂任务分解为子任务
   - 降低认知负荷

## 🌙 深色模式

应用原生支持系统深色模式，使用 Tailwind CSS 的 `dark:` 前缀。

## 📱 响应式设计

- 桌面：侧边栏导航 + 主内容区
- 移动：底部标签栏导航
- 平板：自适应布局

## 🔐 隐私和本地存储

- 所有数据默认存储在浏览器 localStorage
- 未来支持远程同步（可选）
- API 调用仅用于 AI 分析，不存储用户数据

## 🚧 路线图

- [ ] 用户认证系统
- [ ] 云端数据同步
- [ ] 导出报告功能
- [ ] 移动应用 (React Native)
- [ ] 实时协作
- [ ] 高级分析和预测

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📧 联系

如有问题或建议，请通过以下方式联系：
- 创建 Issue
- 提交讨论

---

**Nexus OS** - 让生活变得可量化、可优化、可反思 ✨
