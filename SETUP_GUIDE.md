# Supabase + React Query 快速设置指南

## 完成的迁移

✅ 已安装 React Query  
✅ 已创建 Supabase 数据库架构  
✅ 已配置 QueryClientProvider  
✅ 已创建数据服务层  
✅ 已创建 React Query hooks  
✅ 已更新所有组件  

## 下一步操作

### 1. 在 Supabase 中运行迁移

1. 访问 [https://supabase.com](https://supabase.com) 并登录
2. 选择或创建你的项目
3. 进入 SQL Editor
4. 复制并执行 `supabase/migrations/20241215_initial_schema.sql` 的内容

### 2. 配置环境变量

确保 `.env.local` 文件包含：

```env
NEXT_PUBLIC_SUPABASE_URL=你的_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=你的_anon_key
```

### 3. 测试应用

```bash
npm run dev
```

访问 http://localhost:3000 并：
1. 注册/登录
2. 尝试创建任务
3. 尝试记录专注会话
4. 尝试添加交易
5. 尝试记录日志

## 主要变更

### 数据流

**之前**: 组件 → localStorage  
**现在**: 组件 → React Query → Supabase

### Hook 用法

```tsx
// 之前
const { state, setTasks } = useGlobalState();

// 现在
const { data: tasks = [], isLoading } = useTasks();
const createTask = useCreateTask();

await createTask.mutateAsync({
  title: "新任务",
  status: TaskStatus.TODO,
  // ...
});
```

### 自动功能

- ✨ 自动缓存
- 🔄 自动重新获取
- 📡 乐观更新
- 🔐 行级安全性（RLS）
- 👤 多用户支持

## 故障排除

### 问题：数据未加载

**解决方案**:
1. 检查 Supabase 项目是否运行正常
2. 验证环境变量
3. 确保已运行迁移
4. 检查用户是否已登录

### 问题：权限错误

**解决方案**:
1. 确保已在 Supabase SQL Editor 中运行完整的迁移脚本
2. 检查 RLS 策略是否已创建
3. 验证用户已通过身份验证

### 问题：类型错误

**解决方案**:
1. 运行 `npm install` 确保所有依赖已安装
2. 重启 TypeScript 服务器

## 数据库架构

### tasks 表
- `id` (UUID)
- `user_id` (UUID) - 外键到 auth.users
- `title` (TEXT)
- `status` (TEXT)
- `priority` (TEXT)
- `created_at` (BIGINT)
- `completed_at` (BIGINT)
- `tags` (JSONB)
- `subtasks` (JSONB)

### focus_sessions 表
- `id` (UUID)
- `user_id` (UUID)
- `duration_seconds` (INTEGER)
- `task_id` (UUID) - 可选外键到 tasks
- `timestamp` (BIGINT)
- `completed` (BOOLEAN)

### transactions 表
- `id` (UUID)
- `user_id` (UUID)
- `amount` (NUMERIC)
- `description` (TEXT)
- `type` (TEXT)
- `category` (TEXT)
- `timestamp` (BIGINT)

### journal_entries 表
- `id` (UUID)
- `user_id` (UUID)
- `content` (TEXT)
- `mood` (TEXT)
- `timestamp` (BIGINT)
- `ai_reflection` (TEXT)

## 有用的命令

```bash
# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start
```

## 额外资源

- [Supabase 文档](https://supabase.com/docs)
- [React Query 文档](https://tanstack.com/query/latest)
- [Next.js 文档](https://nextjs.org/docs)

## 支持

如有问题，请查看：
1. `SUPABASE_MIGRATION.md` - 详细的迁移文档
2. Supabase 项目日志
3. 浏览器控制台错误
