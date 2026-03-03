import { useState } from 'react'
import {
  Search,
  Eye,
  CheckCircle,
  XCircle,
  FileText,
  Image,
  MessageSquare,
  User,
  Flag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const contentItems = [
  { id: 1, type: '订单', title: '美妆品牌抖音短视频拍摄', author: '花漾美妆', createdAt: '2026-02-23 14:30', status: '待审核', reason: '新发布订单' },
  { id: 2, type: '创作者申请', title: '新手创作者认证申请', author: '新手创作者', createdAt: '2026-02-23 10:15', status: '待审核', reason: '创作者认证' },
  { id: 3, type: '评价', title: '对新手创作者的评价', author: '赵老板', createdAt: '2026-02-22 16:45', status: '被举报', reason: '内容不当' },
  { id: 4, type: '作品', title: '企业宣传片作品', author: '动画工坊', createdAt: '2026-02-22 09:20', status: '已通过', reason: '作品审核' },
  { id: 5, type: '用户举报', title: '用户投诉：订单纠纷', author: '张女士', createdAt: '2026-02-21 11:30', status: '待处理', reason: '订单纠纷' },
  { id: 6, type: '订单', title: '3D产品渲染视频制作', author: '璀璨珠宝', createdAt: '2026-02-21 08:00', status: '已通过', reason: '新发布订单' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '已通过':
      return 'bg-green-100 text-green-700'
    case '待审核':
      return 'bg-yellow-100 text-yellow-700'
    case '被举报':
    case '待处理':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case '订单':
      return <FileText className="w-5 h-5" />
    case '作品':
      return <Image className="w-5 h-5" />
    case '评价':
      return <MessageSquare className="w-5 h-5" />
    case '创作者申请':
    case '用户举报':
      return <User className="w-5 h-5" />
    default:
      return <FileText className="w-5 h-5" />
  }
}

const getTypeColor = (type: string) => {
  switch (type) {
    case '订单':
      return 'bg-blue-100 text-blue-600'
    case '作品':
      return 'bg-purple-100 text-purple-600'
    case '评价':
      return 'bg-green-100 text-green-600'
    case '创作者申请':
      return 'bg-amber-100 text-amber-600'
    case '用户举报':
      return 'bg-red-100 text-red-600'
    default:
      return 'bg-slate-100 text-slate-600'
  }
}

export default function AdminContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('全部')
  const [statusFilter, setStatusFilter] = useState('全部')

  const filteredItems = contentItems.filter(item => {
    if (typeFilter !== '全部' && item.type !== typeFilter) return false
    if (statusFilter !== '全部' && item.status !== statusFilter) return false
    if (searchQuery && !item.title.includes(searchQuery)) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">内容审核</h1>
          <p className="text-slate-500 mt-1">审核平台各类内容，确保合规安全</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">待审核</p>
          <p className="text-2xl font-bold text-yellow-600">{contentItems.filter(i => i.status === '待审核').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">被举报</p>
          <p className="text-2xl font-bold text-red-600">{contentItems.filter(i => i.status === '被举报').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">今日已通过</p>
          <p className="text-2xl font-bold text-green-600">{contentItems.filter(i => i.status === '已通过').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">待处理投诉</p>
          <p className="text-2xl font-bold text-orange-600">{contentItems.filter(i => i.status === '待处理').length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索内容标题..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
            >
              <option value="全部">全部类型</option>
              <option value="订单">订单</option>
              <option value="作品">作品</option>
              <option value="评价">评价</option>
              <option value="创作者申请">创作者申请</option>
              <option value="用户举报">用户举报</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
            >
              <option value="全部">全部状态</option>
              <option value="待审核">待审核</option>
              <option value="被举报">被举报</option>
              <option value="待处理">待处理</option>
              <option value="已通过">已通过</option>
            </select>
          </div>
        </div>
      </div>

      {/* Content List */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">类型</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">内容标题</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">发布者</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">审核原因</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">提交时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-lg ${getTypeColor(item.type)}`}>
                      {getTypeIcon(item.type)}
                      <span className="text-sm font-medium">{item.type}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">{item.title}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{item.author}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.reason}</td>
                  <td className="px-4 py-4 text-sm text-slate-500">{item.createdAt}</td>
                  <td className="px-4 py-4">
                    <Badge className={getStatusColor(item.status)}>
                      {item.status === '被举报' && <Flag className="w-3 h-3 mr-1" />}
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex gap-1">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg text-slate-500 hover:text-green-600" title="通过">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600" title="拒绝">
                        <XCircle className="w-4 h-4" />
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
