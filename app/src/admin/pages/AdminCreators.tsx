import { useState } from 'react'
import {
  Search,
  Filter,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  Star,
  Video,
  DollarSign,
  Award,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const creators = [
  { id: 1, name: '小明影视', avatar: '/images/creator-1.jpg', title: '资深视频剪辑师', skills: ['剪辑', '调色', '特效'], rating: 4.9, orders: 328, earnings: '¥98,400', status: '认证', joinedAt: '2023-03-15', verified: true },
  { id: 2, name: 'Lisa出镜', avatar: '/images/creator-2.jpg', title: 'UGC内容创作者', skills: ['口播', '测评', '种草'], rating: 4.8, orders: 156, earnings: '¥46,800', status: '认证', joinedAt: '2023-06-20', verified: true },
  { id: 3, name: '动画工坊', avatar: '/images/creator-3.jpg', title: 'MG动画设计师', skills: ['MG动画', '动效', '3D'], rating: 5.0, orders: 89, earnings: '¥71,200', status: '认证', joinedAt: '2023-08-10', verified: true },
  { id: 4, name: '摄影达人', avatar: '/images/creator-1.jpg', title: '产品摄影师', skills: ['产品摄影', '灯光', '后期'], rating: 4.7, orders: 234, earnings: '¥117,000', status: '认证', joinedAt: '2023-01-05', verified: true },
  { id: 5, name: '直播小助手', avatar: '/images/creator-2.jpg', title: '直播运营专家', skills: ['直播', '切片', '运营'], rating: 4.6, orders: 178, earnings: '¥71,200', status: '待审核', joinedAt: '2024-12-01', verified: false },
  { id: 6, name: '三维视界', avatar: '/images/creator-3.jpg', title: '3D设计师', skills: ['3D建模', '渲染', '动画'], rating: 4.9, orders: 67, earnings: '¥67,000', status: '认证', joinedAt: '2023-11-15', verified: true },
  { id: 7, name: '新手创作者', avatar: '/images/creator-1.jpg', title: '视频剪辑师', skills: ['剪辑'], rating: 0, orders: 0, earnings: '¥0', status: '待审核', joinedAt: '2026-02-20', verified: false },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '认证':
      return 'bg-green-100 text-green-700'
    case '待审核':
      return 'bg-yellow-100 text-yellow-700'
    case '已拒绝':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function AdminCreators() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部')

  const filteredCreators = creators.filter(creator => {
    if (statusFilter !== '全部' && creator.status !== statusFilter) return false
    if (searchQuery && !creator.name.includes(searchQuery)) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">创作者管理</h1>
          <p className="text-slate-500 mt-1">管理平台所有创作者，共 {creators.length} 位创作者</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-slate-200">
            导出数据
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">总创作者数</p>
          <p className="text-2xl font-bold text-slate-800">{creators.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">认证创作者</p>
          <p className="text-2xl font-bold text-green-600">{creators.filter(c => c.status === '认证').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">待审核</p>
          <p className="text-2xl font-bold text-yellow-600">{creators.filter(c => c.status === '待审核').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">平台总收益</p>
          <p className="text-2xl font-bold text-[#1dbf73]">¥471,600</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索创作者姓名、技能..."
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
              <option value="认证">已认证</option>
              <option value="待审核">待审核</option>
              <option value="已拒绝">已拒绝</option>
            </select>
            <Button variant="outline" className="border-slate-200">
              <Filter className="w-4 h-4 mr-2" />
              更多筛选
            </Button>
          </div>
        </div>
      </div>

      {/* Creators Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCreators.map((creator) => (
          <div key={creator.id} className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="h-20 bg-gradient-to-r from-[#003912] to-[#0a4226]" />
            
            {/* Content */}
            <div className="px-6 pb-6">
              {/* Avatar */}
              <div className="relative -mt-10 mb-4 flex items-end justify-between">
                <Avatar className="w-20 h-20 border-4 border-white">
                  <AvatarImage src={creator.avatar} alt={creator.name} />
                  <AvatarFallback className="bg-[#1dbf73] text-white text-xl">{creator.name[0]}</AvatarFallback>
                </Avatar>
                {creator.verified && (
                  <Badge className="bg-[#1dbf73] text-white">
                    <Award className="w-3 h-3 mr-1" />
                    已认证
                  </Badge>
                )}
              </div>

              {/* Info */}
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-slate-800">{creator.name}</h3>
                <p className="text-sm text-slate-500">{creator.title}</p>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-amber-500">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{creator.rating}</span>
                  </div>
                  <p className="text-xs text-slate-400">评分</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-slate-700">
                    <Video className="w-4 h-4" />
                    <span className="font-semibold">{creator.orders}</span>
                  </div>
                  <p className="text-xs text-slate-400">订单</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-[#1dbf73]">
                    <DollarSign className="w-4 h-4" />
                    <span className="font-semibold text-sm">{creator.earnings}</span>
                  </div>
                  <p className="text-xs text-slate-400">收入</p>
                </div>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-4">
                {creator.skills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-slate-100 text-slate-600">
                    {skill}
                  </Badge>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div>
                  <Badge className={getStatusColor(creator.status)}>{creator.status}</Badge>
                </div>
                <div className="flex gap-1">
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-slate-700" title="查看详情">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-green-50 rounded-lg text-slate-500 hover:text-green-600" title="通过认证">
                    <CheckCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-red-50 rounded-lg text-slate-500 hover:text-red-600" title="拒绝">
                    <XCircle className="w-4 h-4" />
                  </button>
                  <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
