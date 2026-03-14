import { useState, useEffect } from 'react'
import {
  Users,
  ShoppingCart,
  Briefcase,
  CheckCircle,
  Clock,
  DollarSign,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { dashboardStats } from '../data/mockData'

export default function AdminDashboard() {
  const [isVisible, setIsVisible] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const statsCards = [
    {
      title: '总用户数',
      value: dashboardStats.totalUsers.toLocaleString(),
      change: `+${dashboardStats.newUsersToday}`,
      trend: 'up' as const,
      icon: Users,
      color: 'bg-blue-500',
      desc: '今日新增',
    },
    {
      title: '广告主',
      value: dashboardStats.totalAdvertisers.toLocaleString(),
      change: `${dashboardStats.pendingAdvertiserCertifications} 待审核`,
      trend: 'neutral' as const,
      icon: Briefcase,
      color: 'bg-purple-500',
      desc: '企业认证',
      link: '/admin/advertiser-cert',
    },
    {
      title: '创作者',
      value: dashboardStats.totalCreators.toLocaleString(),
      change: `${dashboardStats.pendingCreatorVerifications} 待审核`,
      trend: 'neutral' as const,
      icon: CheckCircle,
      color: 'bg-green-500',
      desc: '资料审核',
      link: '/admin/creators',
    },
    {
      title: '平台收入',
      value: dashboardStats.totalRevenue,
      change: `今日 ${dashboardStats.todayRevenue}`,
      trend: 'up' as const,
      icon: DollarSign,
      color: 'bg-[#1dbf73]',
      desc: '累计收入',
    },
  ]

  const taskStats = [
    {
      title: '待审核任务',
      value: dashboardStats.pendingTasks,
      color: 'bg-yellow-500',
      icon: Clock,
      link: '/admin/task-review',
    },
    {
      title: '进行中任务',
      value: dashboardStats.activeTasks,
      color: 'bg-blue-500',
      icon: Activity,
    },
    {
      title: '已完成任务',
      value: dashboardStats.completedTasks,
      color: 'bg-green-500',
      icon: CheckCircle,
    },
  ]

  const orderStats = [
    {
      title: '待接单',
      value: dashboardStats.pendingOrders,
      color: 'bg-orange-500',
      icon: Clock,
    },
    {
      title: '进行中',
      value: dashboardStats.inProgressOrders,
      color: 'bg-blue-500',
      icon: Activity,
      link: '/admin/orders',
    },
    {
      title: '已完成',
      value: dashboardStats.completedOrders,
      color: 'bg-green-500',
      icon: CheckCircle,
    },
    {
      title: '已冻结',
      value: dashboardStats.frozenOrders,
      color: 'bg-red-500',
      icon: AlertCircle,
    },
  ]

  return (
    <div className={`space-y-6 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">数据概览</h1>
          <p className="text-slate-500 mt-1">欢迎回来，管理员。今日平台运营数据如下：</p>
        </div>
        <div className="text-sm text-slate-500">
          最后更新：{new Date().toLocaleString('zh-CN', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => stat.link && navigate(stat.link)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="text-slate-500 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-slate-800 mt-1">{stat.value}</p>
                  <p className="text-xs text-slate-400 mt-1">{stat.desc}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`flex items-center text-sm ${
                  stat.trend === 'up' ? 'text-green-600' :
                  stat.trend === 'down' ? 'text-red-600' :
                  'text-yellow-600'
                }`}>
                  {stat.trend === 'up' && <ArrowUpRight className="w-4 h-4 mr-1" />}
                  {stat.change}
                </span>
                {stat.link && (
                  <span className="text-xs text-[#1dbf73] ml-auto">查看详情 →</span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task & Order Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">任务统计</h2>
            <span className="text-sm text-slate-500">共 {dashboardStats.totalTasks.toLocaleString()} 个任务</span>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {taskStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.title}
                  className="text-center p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => stat.link && navigate(stat.link)}
                >
                  <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-xl font-bold text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.title}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Statistics */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-slate-800">订单统计</h2>
            <span className="text-sm text-slate-500">共 {dashboardStats.totalOrders.toLocaleString()} 个订单</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {orderStats.map((stat) => {
              const Icon = stat.icon
              return (
                <div
                  key={stat.title}
                  className="text-center p-3 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
                  onClick={() => stat.link && navigate(stat.link)}
                >
                  <div className={`w-8 h-8 ${stat.color} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <p className="text-lg font-bold text-slate-800">{stat.value}</p>
                  <p className="text-xs text-slate-500 mt-1">{stat.title}</p>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">财务概览</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-[#1dbf73]/5 to-[#1dbf73]/10 rounded-xl p-5 border border-[#1dbf73]/20">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">平台总收入</span>
              <DollarSign className="w-5 h-5 text-[#1dbf73]" />
            </div>
            <p className="text-3xl font-bold text-[#1dbf73]">{dashboardStats.totalRevenue}</p>
            <p className="text-xs text-slate-500 mt-2">累计所有任务收入</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">本月收入</span>
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-blue-600">{dashboardStats.monthRevenue}</p>
            <p className="text-xs text-slate-500 mt-2">本月截至今日收入</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-5 border border-orange-200">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-slate-600">待结算金额</span>
              <Clock className="w-5 h-5 text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-orange-600">{dashboardStats.pendingPayments}</p>
            <p className="text-xs text-slate-500 mt-2">等待结算给创作者</p>
          </div>
        </div>
      </div>

      {/* Pending Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">待处理事项</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div
            className="flex items-center gap-4 p-4 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors cursor-pointer"
            onClick={() => navigate('/admin/advertiser-cert')}
          >
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Briefcase className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">广告主认证审核</p>
              <p className="text-sm text-slate-500">{dashboardStats.pendingAdvertiserCertifications} 家待审核</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-yellow-600" />
          </div>

          <div
            className="flex items-center gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors cursor-pointer"
            onClick={() => navigate('/admin/task-review')}
          >
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <ShoppingCart className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">任务发布审核</p>
              <p className="text-sm text-slate-500">{dashboardStats.pendingTasks} 个待审核</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-blue-600" />
          </div>

          <div
            className="flex items-center gap-4 p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors cursor-pointer"
            onClick={() => navigate('/admin/creators')}
          >
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="font-semibold text-slate-800">创作者资料审核</p>
              <p className="text-sm text-slate-500">{dashboardStats.pendingCreatorVerifications} 人待审核</p>
            </div>
            <ArrowUpRight className="w-5 h-5 text-purple-600" />
          </div>
        </div>
      </div>
    </div>
  )
}
