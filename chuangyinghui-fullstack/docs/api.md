# 创影汇 API 文档

## 基础信息

- 基础URL: `http://localhost:5000/api`
- 认证方式: Bearer Token
- 数据格式: JSON

## 认证相关

### 注册
```http
POST /auth/register
```

**请求体:**
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456",
  "role": "client"
}
```

**响应:**
```json
{
  "success": true,
  "message": "注册成功",
  "data": {
    "user": { ... },
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

### 登录
```http
POST /auth/login
```

**请求体:**
```json
{
  "email": "test@example.com",
  "password": "123456"
}
```

### 获取当前用户
```http
GET /auth/me
Authorization: Bearer <token>
```

### 更新资料
```http
PUT /auth/profile
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "username": "newname",
  "phone": "13800138000",
  "bio": "个人简介"
}
```

## 订单相关

### 获取订单列表
```http
GET /orders?page=1&limit=10&category=brand&status=open
```

**查询参数:**
- `page`: 页码 (默认: 1)
- `limit`: 每页数量 (默认: 10)
- `category`: 分类筛选
- `budget_min`: 最小预算
- `budget_max`: 最大预算
- `status`: 状态筛选
- `search`: 搜索关键词
- `sort_by`: 排序字段
- `sort_order`: 排序方向 (ASC/DESC)

### 获取订单详情
```http
GET /orders/:id
```

### 创建订单
```http
POST /orders
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "title": "品牌宣传片制作",
  "description": "详细描述...",
  "category": "brand",
  "budget": 8000,
  "duration": 15,
  "requirements": ["3分钟时长", "4K画质"],
  "tags": ["品牌", "宣传片"]
}
```

### 更新订单
```http
PUT /orders/:id
Authorization: Bearer <token>
```

### 删除订单
```http
DELETE /orders/:id
Authorization: Bearer <token>
```

### 分配订单
```http
POST /orders/:id/assign
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "creatorId": 6
}
```

### 更新订单状态
```http
PUT /orders/:id/status
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "status": "in_progress"
}
```

### 获取我的订单（广告主）
```http
GET /orders/my/orders
Authorization: Bearer <token>
```

### 获取我接的订单（创作者）
```http
GET /orders/my/assigned
Authorization: Bearer <token>
```

## 投标相关

### 获取订单的投标列表
```http
GET /bids/order/:orderId
Authorization: Bearer <token>
```

### 创建投标
```http
POST /bids/order/:orderId
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "price": 7500,
  "duration": 14,
  "proposal": "详细提案...",
  "milestones": []
}
```

### 我的投标
```http
GET /bids/my/bids
Authorization: Bearer <token>
```

### 接受投标
```http
PUT /bids/:id/accept
Authorization: Bearer <token>
```

### 拒绝投标
```http
PUT /bids/:id/reject
Authorization: Bearer <token>
```

### 撤销投标
```http
PUT /bids/:id/cancel
Authorization: Bearer <token>
```

## 创作者相关

### 获取创作者列表
```http
GET /creators?page=1&limit=12&category=brand&min_rating=4.5
```

### 获取创作者详情
```http
GET /creators/:id
```

### 更新创作者资料
```http
PUT /creators/profile
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "bio": "简介",
  "skills": ["剪辑", "调色"],
  "hourlyRate": 200,
  "location": "北京"
}
```

### 获取创作者统计
```http
GET /creators/stats/overview
Authorization: Bearer <token>
```

### 获取收入趋势
```http
GET /creators/stats/earnings?months=6
Authorization: Bearer <token>
```

## 评价相关

### 获取评价列表
```http
GET /reviews?creatorId=6&page=1&limit=10
```

### 获取评价详情
```http
GET /reviews/:id
```

### 创建评价
```http
POST /reviews
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "orderId": 1,
  "creatorId": 6,
  "rating": 5,
  "content": "评价内容...",
  "tags": ["质量好", "准时"]
}
```

### 获取创作者评价统计
```http
GET /reviews/creator/:creatorId/stats
```

## 消息相关

### 获取消息列表
```http
GET /messages?page=1&limit=20
Authorization: Bearer <token>
```

### 获取对话
```http
GET /messages/conversation/:userId
Authorization: Bearer <token>
```

### 发送消息
```http
POST /messages
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "receiverId": 6,
  "content": "消息内容",
  "orderId": 1
}
```

### 获取未读消息数
```http
GET /messages/unread-count
Authorization: Bearer <token>
```

### 标记已读
```http
PUT /messages/:id/read
Authorization: Bearer <token>
```

### 标记全部已读
```http
PUT /messages/read-all
Authorization: Bearer <token>
```

### 获取联系人列表
```http
GET /messages/contacts
Authorization: Bearer <token>
```

## 用户相关

### 获取仪表盘数据
```http
GET /users/dashboard
Authorization: Bearer <token>
```

### 获取用户列表（管理员）
```http
GET /users?page=1&limit=10
Authorization: Bearer <token>
```

### 获取用户详情（管理员）
```http
GET /users/:id
Authorization: Bearer <token>
```

### 更新用户（管理员）
```http
PUT /users/:id
Authorization: Bearer <token>
```

### 删除用户（管理员）
```http
DELETE /users/:id
Authorization: Bearer <token>
```

### 切换用户状态（管理员）
```http
PUT /users/:id/status
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "status": "banned"
}
```

## 管理后台相关

### 获取仪表盘统计
```http
GET /admin/dashboard/stats
Authorization: Bearer <token>
```

### 获取收入趋势
```http
GET /admin/dashboard/revenue-trend?months=12
Authorization: Bearer <token>
```

### 获取用户增长趋势
```http
GET /admin/dashboard/user-growth?months=12
Authorization: Bearer <token>
```

### 获取分类统计
```http
GET /admin/dashboard/categories
Authorization: Bearer <token>
```

### 获取待审核内容
```http
GET /admin/pending-content?type=all
Authorization: Bearer <token>
```

### 审核评价
```http
PUT /admin/reviews/:id/approval
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "status": "approved",
  "reason": "审核通过"
}
```

### 审核创作者认证
```http
PUT /admin/creators/:id/verify
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "isVerified": true,
  "reason": "认证通过"
}
```

## 交易相关

### 获取交易列表（管理员）
```http
GET /transactions?page=1&limit=10
Authorization: Bearer <token>
```

### 获取我的交易
```http
GET /transactions/my
Authorization: Bearer <token>
```

### 获取交易统计
```http
GET /transactions/stats/overview
Authorization: Bearer <token>
```

### 创建交易（管理员）
```http
POST /transactions
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "orderId": 1,
  "fromUserId": 2,
  "toUserId": 6,
  "type": "payment",
  "amount": 8000,
  "description": "订单付款"
}
```

### 更新交易状态
```http
PUT /transactions/:id/status
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "status": "completed"
}
```

## 作品集相关

### 获取作品集列表
```http
GET /portfolios?page=1&limit=12&userId=6
```

### 获取作品集详情
```http
GET /portfolios/:id
```

### 获取我的作品集
```http
GET /portfolios/my/portfolios
Authorization: Bearer <token>
```

### 创建作品
```http
POST /portfolios
Authorization: Bearer <token>
```

**请求体:**
```json
{
  "title": "作品标题",
  "description": "作品描述",
  "category": "brand",
  "thumbnail": "https://example.com/image.jpg",
  "videoUrl": "https://example.com/video.mp4",
  "tags": ["品牌", "宣传片"]
}
```

### 更新作品
```http
PUT /portfolios/:id
Authorization: Bearer <token>
```

### 删除作品
```http
DELETE /portfolios/:id
Authorization: Bearer <token>
```

## 响应格式

### 成功响应
```json
{
  "success": true,
  "message": "操作成功",
  "data": { ... }
}
```

### 错误响应
```json
{
  "success": false,
  "message": "错误信息",
  "error": "详细错误"
}
```

### 分页响应
```json
{
  "success": true,
  "data": {
    "items": [ ... ],
    "pagination": {
      "total": 100,
      "page": 1,
      "limit": 10,
      "totalPages": 10
    }
  }
}
```

## 状态码

| 状态码 | 含义 |
|--------|------|
| 200 | 成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未认证 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 资源冲突 |
| 500 | 服务器错误 |
