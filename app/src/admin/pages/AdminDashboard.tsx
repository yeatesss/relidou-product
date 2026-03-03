import { useState, useEffect } from 'react'
import {
  Users,
  ShoppingCart,
  Video,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const stats = [
  {
    title: '今日订单',
    value: '128',
    change: '+12.5%',
    trend: 'up',
    icon: ShoppingCart,
    color: 'bg-blue-500',
  },
  {
    title: '新增用户',
    value: '86',
    change: '+8.2%',
    trend: 'up',
    icon: Users,
    color: 'bg-green-500',
  },
  {
    title: '新增创作者',
    value: '24',
    change: '-2.1%',
    trend: 'down',
    icon: Video,
    color: 'bg-purple-500',
  },
  {
    title: '平台收入',
    value: '¥45,280',
    change: '+18.3%',
    trend: 'up',
    icon: DollarSign,
    color: 'bg-[#1dbf73]',
  },
]

const recentOrders = [
  { id: 'ORD-2026-001', title: '美妆品牌抖音短视频', client: '花漾美妆', creator: '小明影视', amount: '¥1,200', status: '进行中' },
  { id: 'ORD-2026-002', title: '产品展示视频拍摄', client: '优品家居', creator: '摄影达人', amount: '¥2,500', status: '待确认' },
  { id: 'ORD-2026-003', title: '企业宣传片剪辑', client: '互联科技', creator: '动画工坊', amount: '¥5,000', status: '已完成' },
  { id: 'ORD-2026-004', title: 'APP演示动画', client: '智慧生活', creator: '三维视界', amount: '¥8,000', status: '进行中' },
  { id: 'ORD-2026-005', title: '直播切片制作', client: '电竞俱乐部', creator: '直播小助手', amount: '¥800', status: '待付款' },
]

const recentUsers = [
  { name: '张女士', type: '甲方', email: 'zhang@example.com', joined: '10分钟前', status: '活跃' },
  { name: '李明', type: '创作者', email: 'liming@example.com', joined: '25分钟前', status: '审核中' },
  { name: '王小花', type: '甲方', email: 'wang@example.com', joined: '1小时前', status: '活跃' },
  { name: '陈大伟', type: '创作者', email: 'chen@example.com', joined: '2小时前', status: '活跃' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '进行中':
    case '活跃':
      return 'bg-green-100 text-green-700'
    case '待确认':
    case '待付款':
    case '审核中':
      return 'bg-yellow-100 text-yellow-700'
    case '已完成':
      return 'bg-blue-100 text-blue-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">数据概览</h1>
          <p className="text-slate-500 mt-1">欢迎回来，管理员。今日平台运营数据如下：</p>
        </div>
        <div className="flex gap-2">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]">
            <option>今日</option>
            <option>昨日</option>
            <option>本周</option>
            <option>本月</option>
          </select>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? ArrowUpRight : ArrowDownRight
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-slate-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                <span className={`flex items-center text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  <TrendIcon className="w-4 h-4 mr-1" />
                  {stat.change}
                </span>
                <span className="text-slate-400 text-sm">较昨日</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Charts & Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Activity Chart Placeholder */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">平台活跃度</h2>
            <div className="flex gap-2">
              <Badge variant="secondary" className="bg-[#1dbf73]/10 text-[#1dbf73]">订单</Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-600">用户</Badge>
            </div>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <Activity className="w-12 h-12 text-slate-300 mx-auto mb-2" />
              <p className="text-slate-400">数据图表区域</p>
              <p className="text-slate-300 text-sm">（可接入 ECharts 等图表库）</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <h2 className="text-lg font-semibold text-slate-800 mb-6">待处理事项</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">待审核订单</p>
                  <p className="text-sm text-slate-500">需要审核的订单</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-yellow-600">12</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">待审核创作者</p>
                  <p className="text-sm text-slate-500">新申请的创作者</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-blue-600">8</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl border border-red-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-500 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-medium text-slate-800">投诉举报</p>
                  <p className="text-sm text-slate-500">需要处理的投诉</p>
                </div>
              </div>
              <span className="text-2xl font-bold text-red-600">3</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">最近订单</h2>
            <button className="text-[#1dbf73] text-sm hover:underline">查看全部</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">订单号</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">标题</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">金额</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm text-slate-600">{order.id}</td>
                    <td className="px-6 py-4 text-sm text-slate-800 font-medium">{order.title}</td>
                    <td className="px-6 py-4 text-sm text-[#1dbf73] font-medium">{order.amount}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">最新用户</h2>
            <button className="text-[#1dbf73] text-sm hover:underline">查看全部</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">用户</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">类型</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">注册时间</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-slate-50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm font-medium text-slate-800">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary" className={user.type === '甲方' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}>
                        {user.type}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{user.joined}</td>
                    <td className="px-6 py-4">
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
