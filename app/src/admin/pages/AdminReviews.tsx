import { useState } from 'react'
import {
  Search,
  Star,
  MoreHorizontal,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
  ThumbsUp,
  Flag,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const reviews = [
  { id: 1, author: '张女士', authorType: '甲方', target: '小明影视', targetType: '创作者', order: '美妆品牌抖音短视频', rating: 5, content: '非常专业的剪辑师，交付速度快，质量也很高，强烈推荐！', createdAt: '2026-02-20', status: '已通过', likes: 12 },
  { id: 2, author: '李先生', authorType: '甲方', target: '动画工坊', targetType: '创作者', order: '企业宣传片', rating: 5, content: '合作很愉快，沟通顺畅，视频效果超出预期。', createdAt: '2026-02-19', status: '已通过', likes: 8 },
  { id: 3, author: '王小姐', authorType: '甲方', target: '摄影达人', targetType: '创作者', order: '产品展示视频', rating: 4, content: '整体不错，修改了几次后达到满意效果。', createdAt: '2026-02-18', status: '已通过', likes: 5 },
  { id: 4, author: '小明影视', authorType: '创作者', target: '张女士', targetType: '甲方', order: '美妆品牌抖音短视频', rating: 5, content: '甲方沟通很清晰，付款及时，期待下次合作！', createdAt: '2026-02-20', status: '已通过', likes: 3 },
  { id: 5, author: '赵老板', authorType: '甲方', target: '新手创作者', targetType: '创作者', order: '短视频剪辑', rating: 2, content: '质量不太满意，沟通也有问题，不推荐。', createdAt: '2026-02-17', status: '待审核', likes: 0, flagged: true },
  { id: 6, author: '陈大伟', authorType: '创作者', target: '王总', targetType: '甲方', order: 'APP演示动画', rating: 5, content: '非常专业的甲方，需求明确，合作愉快！', createdAt: '2026-02-16', status: '已通过', likes: 7 },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '已通过':
      return 'bg-green-100 text-green-700'
    case '待审核':
      return 'bg-yellow-100 text-yellow-700'
    case '已拒绝':
      return 'bg-red-100 text-red-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function AdminReviews() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('全部')

  const filteredReviews = reviews.filter(review => {
    if (statusFilter !== '全部' && review.status !== statusFilter) return false
    if (searchQuery && !review.content.includes(searchQuery)) return false
    return true
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">评价管理</h1>
          <p className="text-slate-500 mt-1">管理平台所有用户评价，共 {reviews.length} 条评价</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">总评价数</p>
          <p className="text-2xl font-bold text-slate-800">{reviews.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">平均评分</p>
          <div className="flex items-center gap-1">
            <p className="text-2xl font-bold text-amber-500">4.3</p>
            <Star className="w-5 h-5 fill-amber-500 text-amber-500" />
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">待审核</p>
          <p className="text-2xl font-bold text-yellow-600">{reviews.filter(r => r.status === '待审核').length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">被举报</p>
          <p className="text-2xl font-bold text-red-600">{reviews.filter(r => r.flagged).length}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="搜索评价内容..."
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
              <option value="已通过">已通过</option>
              <option value="待审核">待审核</option>
              <option value="已拒绝">已拒绝</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm border border-slate-100">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <Avatar className="w-12 h-12 bg-[#1dbf73]">
                <AvatarFallback className="text-white">{review.author[0]}</AvatarFallback>
              </Avatar>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-800">{review.author}</span>
                    <Badge variant="secondary" className={review.authorType === '甲方' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}>
                      {review.authorType}
                    </Badge>
                    <span className="text-slate-400">评价了</span>
                    <span className="font-medium text-slate-700">{review.target}</span>
                    <Badge variant="secondary" className={review.targetType === '甲方' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}>
                      {review.targetType}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {review.flagged && (
                      <Badge className="bg-red-100 text-red-600">
                        <Flag className="w-3 h-3 mr-1" />
                        被举报
                      </Badge>
                    )}
                    <Badge className={getStatusColor(review.status)}>{review.status}</Badge>
                  </div>
                </div>

                {/* Rating & Order */}
                <div className="flex items-center gap-4 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-amber-500 text-amber-500' : 'text-slate-200'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500">订单：{review.order}</span>
                  <span className="text-sm text-slate-400">{review.createdAt}</span>
                </div>

                {/* Review Content */}
                <p className="text-slate-700 mb-4">{review.content}</p>

                {/* Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <button className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
                      <ThumbsUp className="w-4 h-4" />
                      <span className="text-sm">{review.likes}</span>
                    </button>
                    <button className="flex items-center gap-1 text-slate-500 hover:text-slate-700">
                      <MessageSquare className="w-4 h-4" />
                      <span className="text-sm">回复</span>
                    </button>
                  </div>
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
                    <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-500">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
