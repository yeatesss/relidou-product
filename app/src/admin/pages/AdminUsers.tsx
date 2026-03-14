import { useState } from 'react'
import {
  Search,
  Filter,
  MoreHorizontal,
  Mail,
  Phone,
  Calendar,
  ShoppingCart,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const users = [
  { id: 1, name: '张女士', email: 'zhang@example.com', phone: '138****8888', company: '花漾美妆', orders: 12, totalSpent: '¥15,800', status: '活跃', joinedAt: '2025-06-15', lastActive: '2小时前' },
  { id: 2, name: '李先生', email: 'li@example.com', phone: '139****6666', company: '优品家居', orders: 8, totalSpent: '¥22,500', status: '活跃', joinedAt: '2025-08-20', lastActive: '5分钟前' },
  { id: 3, name: '王总', email: 'wang@example.com', phone: '137****9999', company: '互联科技', orders: 25, totalSpent: '¥68,000', status: 'VIP', joinedAt: '2024-12-01', lastActive: '1天前' },
  { id: 4, name: '陈小姐', email: 'chen@example.com', phone: '136****7777', company: '个人', orders: 3, totalSpent: '¥3,200', status: '活跃', joinedAt: '2026-01-10', lastActive: '3天前' },
  { id: 5, name: '刘经理', email: 'liu@example.com', phone: '135****5555', company: '璀璨珠宝', orders: 6, totalSpent: '¥45,000', status: '活跃', joinedAt: '2025-09-05', lastActive: '1小时前' },
  { id: 6, name: '赵老板', email: 'zhao@example.com', phone: '134****4444', company: '味道餐厅', orders: 0, totalSpent: '¥0', status: '已禁用', joinedAt: '2026-02-01', lastActive: '7天前' },
  { id: 7, name: '孙女士', email: 'sun@example.com', phone: '133****3333', company: '潮流服饰', orders: 5, totalSpent: '¥8,500', status: '待审核', joinedAt: '2026-02-20', lastActive: '刚刚' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '活跃':
      return 'bg-green-100 text-green-700'
    case 'VIP':
      return 'bg-purple-100 text-purple-700'
    case '待审核':
      return 'bg-yellow-100 text-yellow-700'
    case '已禁用':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function AdminUsers() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部')

  const filteredUsers = users.filter(user => {
    if (statusFilter !== '全部' && user.status !== statusFilter) return false
    if (searchQuery && !user.name.includes(searchQuery) && !user.email.includes(searchQuery)) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">甲方用户管理</h1>
          <p className="text-slate-500 mt-1">管理平台所有甲方用户，共 {users.length} 位用户</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#1dbf73] hover:bg-[#19a463]">
            + 添加用户
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">总用户数</p>
          <p className="text-2xl font-bold text-slate-800">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">活跃用户</p>
          <p className="text-2xl font-bold text-green-600">{users.filter(u => u.status === '活跃').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">VIP用户</p>
          <p className="text-2xl font-bold text-purple-600">{users.filter(u => u.status === 'VIP').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">待审核</p>
          <p className="text-2xl font-bold text-yellow-600">{users.filter(u => u.status === '待审核').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索用户名、邮箱、公司..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
            >
              <option value="全部">全部状态</option>
              <option value="活跃">活跃</option>
              <option value="VIP">VIP</option>
              <option value="待审核">待审核</option>
              <option value="已禁用">已禁用</option>
            </select>
            <Button variant="outline" className="border-slate-200">
              <Filter className="w-4 h-4 mr-2" />
              更多筛选
            </Button>
          </div>
        </div>
      </div>

      {/* Users Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredUsers.map((user) => (
          <div key={user.id} className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            {/* 头像 + 名称 + 状态 */}
            <div className="flex items-start gap-3 mb-3">
              <Avatar className="w-14 h-14 bg-[#1dbf73]">
                <AvatarFallback className="text-white text-lg font-medium">{user.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-base font-bold text-slate-800 truncate">{user.name}</h3>
                  <Badge className={getStatusColor(user.status) + " shrink-0"}>{user.status}</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1 truncate">{user.company}</p>
              </div>
            </div>

            {/* 联系方式 */}
            <div className="space-y-1 mb-3">
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-3 h-3 shrink-0" />
                <span className="truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone className="w-3 h-3 shrink-0" />
                <span>{user.phone}</span>
              </div>
            </div>

            {/* 统计信息 */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <div className="flex items-center justify-center gap-1 text-slate-500 text-xs mb-1">
                  <ShoppingCart className="w-3 h-3" />
                  <span>订单数</span>
                </div>
                <p className="text-lg font-bold text-slate-800">{user.orders}</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-2 text-center">
                <p className="text-slate-500 text-xs mb-1">消费总额</p>
                <p className="text-lg font-bold text-[#1dbf73]">{user.totalSpent}</p>
              </div>
            </div>

            {/* 注册时间 */}
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-3">
              <Calendar className="w-3 h-3" />
              <span>注册于 {user.joinedAt}</span>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-medium rounded-lg transition-colors">
                查看详情
              </button>
              <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700 border border-slate-200" title="更多操作">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
