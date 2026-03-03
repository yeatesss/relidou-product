import { useState } from 'react'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  Download,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

const orders = [
  { id: 'ORD-2026-001', title: '美妆品牌抖音短视频', client: '花漾美妆', creator: '小明影视', budget: '¥800-1500', finalPrice: '¥1,200', status: '进行中', createdAt: '2026-02-23', deadline: '2026-02-26' },
  { id: 'ORD-2026-002', title: '产品展示视频拍摄', client: '优品家居', creator: '摄影达人', budget: '¥1,500-3,000', finalPrice: '¥2,500', status: '待确认', createdAt: '2026-02-22', deadline: '2026-02-27' },
  { id: 'ORD-2026-003', title: '企业宣传片剪辑', client: '互联科技', creator: '动画工坊', budget: '¥3,000-8,000', finalPrice: '¥5,000', status: '已完成', createdAt: '2026-02-20', deadline: '2026-02-25' },
  { id: 'ORD-2026-004', title: 'APP演示动画', client: '智慧生活', creator: '三维视界', budget: '¥5,000-10,000', finalPrice: '¥8,000', status: '进行中', createdAt: '2026-02-19', deadline: '2026-03-01' },
  { id: 'ORD-2026-005', title: '直播切片制作', client: '电竞俱乐部', creator: '直播小助手', budget: '¥500-1,000', finalPrice: '¥800', status: '待付款', createdAt: '2026-02-18', deadline: '2026-02-21' },
  { id: 'ORD-2026-006', title: 'UGC真人出镜视频', client: '美妆品牌', creator: 'Lisa出镜', budget: '¥500-1,000', finalPrice: '¥900', status: '已取消', createdAt: '2026-02-17', deadline: '2026-02-20' },
  { id: 'ORD-2026-007', title: '3D产品渲染', client: '璀璨珠宝', creator: '三维视界', budget: '¥4,000-10,000', finalPrice: '¥7,500', status: '进行中', createdAt: '2026-02-16', deadline: '2026-03-05' },
  { id: 'ORD-2026-008', title: '口播视频制作', client: '学而教育', creator: '小明影视', budget: '¥800-1,500', finalPrice: '¥1,200', status: '已完成', createdAt: '2026-02-15', deadline: '2026-02-18' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '进行中':
      return 'bg-blue-100 text-blue-700'
    case '待确认':
    case '待付款':
      return 'bg-yellow-100 text-yellow-700'
    case '已完成':
      return 'bg-green-100 text-green-700'
    case '已取消':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function AdminOrders() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部')
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])

  const filteredOrders = orders.filter(order => {
    if (statusFilter !== '全部' && order.status !== statusFilter) return false
    if (searchQuery && !order.title.includes(searchQuery) && !order.id.includes(searchQuery)) return false
    return true
  })

  const toggleSelectAll = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map(o => o.id))
    }
  }

  const toggleSelect = (id: string) => {
    if (selectedOrders.includes(id)) {
      setSelectedOrders(selectedOrders.filter(o => o !== id))
    } else {
      setSelectedOrders([...selectedOrders, id])
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">订单管理</h1>
          <p className="text-slate-500 mt-1">管理平台所有订单，共 {orders.length} 个订单</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-200">
            <Download className="w-4 h-4 mr-2" />
            导出数据
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索订单号、标题..."
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
              <option value="进行中">进行中</option>
              <option value="待确认">待确认</option>
              <option value="待付款">待付款</option>
              <option value="已完成">已完成</option>
              <option value="已取消">已取消</option>
            </select>
            <Button variant="outline" className="border-slate-200">
              <Filter className="w-4 h-4 mr-2" />
              更多筛选
            </Button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]"
                  />
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">订单号</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">订单标题</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">甲方</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">创作者</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">预算/成交价</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">创建时间</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-slate-50">
                  <td className="px-4 py-4">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleSelect(order.id)}
                      className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]"
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600 font-mono">{order.id}</td>
                  <td className="px-4 py-4">
                    <p className="text-sm font-medium text-slate-800">{order.title}</p>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-600">{order.client}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{order.creator}</td>
                  <td className="px-4 py-4">
                    <div className="text-sm">
                      <span className="text-slate-400 line-through">{order.budget}</span>
                      <span className="text-[#1dbf73] font-medium ml-2">{order.finalPrice}</span>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                  </td>
                  <td className="px-4 py-4 text-sm text-slate-500">{order.createdAt}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-1">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700" title="查看详情">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-green-50 rounded-lg text-slate-500 hover:text-green-600" title="通过">
                        <CheckCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600" title="拒绝">
                        <XCircle className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-blue-50 rounded-lg text-slate-500 hover:text-blue-600" title="联系双方">
                        <MessageSquare className="w-4 h-4" />
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

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <p className="text-sm text-slate-500">
            显示 {filteredOrders.length} 条，共 {orders.length} 条
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-slate-200" disabled>
              上一页
            </Button>
            <Button variant="outline" size="sm" className="border-slate-200 bg-[#1dbf73] text-white hover:bg-[#19a463]">
              1
            </Button>
            <Button variant="outline" size="sm" className="border-slate-200">
              2
            </Button>
            <Button variant="outline" size="sm" className="border-slate-200">
              3
            </Button>
            <Button variant="outline" size="sm" className="border-slate-200">
              下一页
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
