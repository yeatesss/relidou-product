import { useState } from 'react'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  Ban,
  CheckCircle,
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

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">用户信息</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">联系方式</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">公司</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">订单数</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">消费总额</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">注册时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10 bg-[#1dbf73]">
                        <AvatarFallback className="text-white">{user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.lastActive}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <p className="flex items-center gap-1 text-slate-600">
                        <Mail className="w-3 h-3" />
                        {user.email}
                      </p>
                      <p className="flex items-center gap-1 text-slate-500 mt-1">
                        <Phone className="w-3 h-3" />
                        {user.phone}
                      </p>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{user.company}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1 text-sm text-slate-600">
                      <ShoppingCart className="w-4 h-4" />
                      {user.orders}
                    </div>
                  </td>
                  <td className="px-4 py-4 text-sm font-medium text-[#1dbf73]">{user.totalSpent}</td>
                  <td className="px-4 py-4">
                    <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {user.joinedAt}
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg text-slate-500 hover:text-green-600" title="通过审核">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600" title="禁用">
                        <Ban className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                        <MoreHorizontal className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
