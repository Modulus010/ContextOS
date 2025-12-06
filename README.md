# Nexus Context OS - Next.js Version

这是一个基于 Next.js 的个人上下文操作系统，用于管理任务、专注、财务和日记。

## 项目迁移说明

本项目已从 Vite + React 迁移到 Next.js，主要改进包括：

1. **API 路由**: 所有 AI API 调用现在通过 Next.js API 路由转发，提高安全性
2. **服务器端渲染**: 支持 SSR/SSG，提升性能和 SEO
3. **环境变量管理**: API Key 等敏感信息在服务器端安全存储
4. **为云存储等后端功能预留扩展空间**

## 文件结构变化

### 新增文件
- `app/` - Next.js App Router 目录
  - `layout.tsx` - 根布局
  - `page.tsx` - 主页面（原 App.tsx）
  - `globals.css` - 全局样式
  - `api/` - API 路由
    - `ai/chat/route.ts` - 通用聊天 API
    - `ai/insight/route.ts` - 上下文洞察 API
    - `ai/journal/route.ts` - 日记分析 API
    - `ai/subtasks/route.ts` - 子任务生成 API
- `next.config.js` - Next.js 配置
- `tailwind.config.ts` - Tailwind CSS 配置
- `postcss.config.js` - PostCSS 配置
- `.eslintrc.json` - ESLint 配置
- `.env.local.example` - 环境变量示例

### 修改文件
- `package.json` - 更新依赖和脚本
- `tsconfig.json` - Next.js TypeScript 配置
- `.gitignore` - Next.js 忽略文件
- `src/services/aiService.ts` - 使用 API 路由替代直接调用

### 可删除的旧文件
- `src/index.html` - Next.js 不需要
- `src/index.tsx` - 替换为 app/page.tsx
- `src/App.tsx` - 替换为 app/page.tsx
- `vite.config.ts` - 替换为 next.config.js

## 安装和运行

### 1. 安装依赖

```powershell
npm install
```

### 2. 配置环境变量

复制 `.env.local.example` 为 `.env.local` 并填入你的 API Key：

```powershell
Copy-Item .env.local.example .env.local
```

然后编辑 `.env.local`:

```env
API_KEY=your_actual_api_key_here
API_BASE_URL=https://api.deepseek.com/v1
```

### 3. 运行开发服务器

```powershell
npm run dev
```

打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 4. 构建生产版本

```powershell
npm run build
npm start
```

## API 路由说明

### 1. `/api/ai/chat` - 通用聊天接口
用于通用 AI 对话功能。

**请求**:
```json
{
  "messages": [
    { "role": "user", "content": "你好" }
  ],
  "model": "deepseek-chat",
  "max_tokens": 500
}
```

### 2. `/api/ai/insight` - 上下文洞察
基于用户的任务、专注、财务和日记数据生成洞察。

**请求**:
```json
{
  "state": {
    "tasks": [...],
    "focusSessions": [...],
    "transactions": [...],
    "journalEntries": [...]
  }
}
```

### 3. `/api/ai/journal` - 日记分析
分析日记条目并提供心理学反馈。

**请求**:
```json
{
  "entry": "今天完成了很多工作",
  "mood": "高兴"
}
```

### 4. `/api/ai/subtasks` - 子任务生成
将大任务拆解为小任务。

**请求**:
```json
{
  "taskTitle": "准备项目演示"
}
```

## 后续可扩展功能

有了 Next.js API 路由，你可以轻松添加：

1. **云存储 API**: 在 `app/api/storage/` 中添加路由
2. **用户认证**: 集成 NextAuth.js
3. **数据同步**: 实现跨设备数据同步
4. **Webhook**: 接收外部服务通知
5. **定时任务**: 使用 Next.js API 路由实现 cron jobs

## 技术栈

- **框架**: Next.js 14 (App Router)
- **UI**: React 18 + Tailwind CSS
- **语言**: TypeScript
- **图表**: Recharts
- **AI**: OpenAI SDK + DeepSeek API
- **部署**: Vercel / 自托管

## 开发注意事项

1. 所有客户端组件需要添加 `'use client'` 指令
2. API 路由自动处理服务器端逻辑，无需担心浏览器安全问题
3. 环境变量只在服务器端可用，不会暴露给客户端
4. 使用 `src/` 目录别名 `@/` 导入模块

## License

Private
