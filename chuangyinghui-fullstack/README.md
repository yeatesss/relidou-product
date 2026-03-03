# 创影汇 - 视频广告定制平台

一个类似 Fiverr 但模式相反的视频广告定制平台，甲方发布订单，创作者竞标接单。

## 项目结构

```
chuangyinghui-fullstack/
├── frontend/                 # 前端项目
│   ├── src/
│   │   ├── admin/           # 管理后台
│   │   ├── components/      # 公共组件
│   │   ├── hooks/           # 自定义Hooks
│   │   ├── lib/             # 工具函数
│   │   ├── pages/           # 页面组件
│   │   ├── App.tsx          # 主应用
│   │   └── main.tsx         # 入口文件
│   ├── package.json
│   └── vite.config.ts
├── backend/                  # 后端项目
│   ├── controllers/         # 控制器
│   ├── middleware/          # 中间件
│   ├── models/              # 数据模型
│   ├── routes/              # 路由
│   ├── server.js            # 服务器入口
│   └── package.json
├── database/                 # 数据库文件
│   ├── schema.sql           # 数据库结构
│   └── seed.sql             # 种子数据
└── docs/                     # 文档
    └── api.md               # API文档
```

## 技术栈

### 前端
- React 18
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- React Router
- Lucide React

### 后端
- Node.js
- Express
- Sequelize ORM
- MySQL
- JWT 认证
- bcryptjs

## 快速开始

### 1. 环境要求
- Node.js >= 18
- MySQL >= 8.0
- npm 或 yarn

### 2. 安装依赖

```bash
# 前端
cd frontend
npm install

# 后端
cd backend
npm install
```

### 3. 配置环境变量

#### 后端 (.env)
```env
PORT=5000
NODE_ENV=development

# 数据库配置
DB_HOST=localhost
DB_PORT=3306
DB_NAME=chuangyinghui
DB_USER=root
DB_PASSWORD=your_password

# JWT配置
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

# 其他配置
PLATFORM_FEE_RATE=10
```

### 4. 初始化数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库并导入结构
source database/schema.sql
source database/seed.sql
```

### 5. 启动服务

```bash
# 启动后端（端口5000）
cd backend
npm run dev

# 启动前端（端口5173）
cd frontend
npm run dev
```

### 6. 访问

- 前端: http://localhost:5173
- 后端API: http://localhost:5000/api
- 管理后台: http://localhost:5173/#/admin/login

## 默认账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 管理员 | admin@chuangyinghui.com | admin123 |
| 广告主 | zhangsan@example.com | 123456 |
| 创作者 | creator1@example.com | 123456 |

## 功能模块

### 前台
- [x] 首页展示
- [x] 订单浏览与搜索
- [x] 订单详情
- [x] 创作者列表
- [x] 创作者详情
- [x] 发布订单
- [x] 用户登录/注册
- [x] 用户中心
- [x] 消息系统
- [x] 广告主工作台
- [x] 创作者工作台

### 管理后台
- [x] 数据仪表盘
- [x] 订单管理
- [x] 用户管理
- [x] 创作者管理
- [x] 评价管理
- [x] 内容审核
- [x] 系统设置

## API 文档

详见 [docs/api.md](docs/api.md)

## 部署

### 前端构建
```bash
cd frontend
npm run build
```

### 后端部署
```bash
cd backend
npm start
```

## 贡献

欢迎提交 Issue 和 Pull Request。

## 许可证

MIT License
