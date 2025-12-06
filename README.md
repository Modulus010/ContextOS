# Nexus Context OS

一个集成任务管理、专注追踪、财务记录和情绪日记的个人上下文操作系统，通过 AI 帮助你理解生活各维度的关联模式。

## ✨ 特性

- **📋 任务管理** - 智能任务拆解，减轻认知负担
- **⏱️ 专注追踪** - 番茄钟计时器，记录专注时光
- **💰 财务记录** - 追踪收支，可视化现金流
- **📔 情绪日记** - AI 分析你的心情和思考
- **🤖 AI 洞察** - 基于多维度数据生成个性化建议

## 🚀 快速开始

### 前置要求

- Node.js 18+ 
- npm 或 pnpm

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

编辑 `.env.local` 并填入你的 DeepSeek API Key：
```env
API_KEY=your-deepseek-api-key-here
API_BASE_URL=https://api.deepseek.com
```

> 💡 获取 API Key：访问 [DeepSeek Platform](https://platform.deepseek.com/) 注册并获取

4. **启动开发服务器**
```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看应用。

## 📦 构建生产版本

```bash
npm run build
npm start
```

## 🛠️ 技术栈

- **框架**: Next.js 16 + React 19
- **语言**: TypeScript
- **样式**: Tailwind CSS 4
- **AI**: OpenAI SDK (DeepSeek API)
- **图表**: Recharts

## 🏗️ 项目结构

```
ContextOS/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (AI 服务)
│   ├── page.tsx           # 主页面
│   └── layout.tsx         # 根布局
├── src/
│   ├── components/        # React 组件
│   │   ├── modules/      # 功能模块组件
│   │   └── Dashboard.tsx # 仪表盘
│   ├── hooks/            # 自定义 Hooks
│   ├── services/         # API 服务层
│   ├── types/            # TypeScript 类型
│   ├── utils/            # 工具函数
│   └── constants/        # 常量配置
└── .env.local            # 环境变量 (需自行创建)
```

## 🔒 隐私说明

- 所有数据存储在浏览器本地（localStorage）
- 仅在生成 AI 洞察时将数据发送到 DeepSeek API
- 不使用云端数据库，完全控制你的数据

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📄 许可证

MIT License

## ⚠️ 注意事项

- 确保 `.env.local` 文件不要提交到 Git（已在 `.gitignore` 中）
- API Key 仅在服务端使用，不会暴露到客户端
- 建议定期导出数据备份（功能开发中）
