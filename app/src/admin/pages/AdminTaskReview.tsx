import { useState, useEffect } from 'react'
import {
  Eye,
  CheckCircle,
  X,
  AlertTriangle,
  FileText,
  Clock,
  Image as ImageIcon,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { taskReviews } from '../data/mockData'

// 任务审核类型
type TaskReview = {
  id: string
  taskId: string
  advertiserId: string
  advertiserName: string
  advertiserCompany: string
  title: string
  type: '爆款复刻' | '原创内容'
  budget: string
  basicRequirements: string
  mandatoryRequirements: string
  optionalRequirements: string
  supplementaryInfo: string
  items: string
  acceptAI: string
  scene: string
  style: string
  dubbing: string
  platform: string[]
  resolution: string
  taskTime: string
  coverImages: string[]
  startTime: string
  endTime: string
  submittedAt: string
  aiReviewScore?: number
  aiReviewStatus?: 'pass' | 'warning' | 'fail'
  aiReviewSuggestions?: Array<{
    type: string
    content: string
    priority: 'low' | 'medium' | 'high'
  }>
  aiReviewOverall?: string
  status: 'pending' | 'approved' | 'rejected' | 'modifying'
  reviewedAt?: string
  reviewedBy?: string
  rejectReason?: string
  modifySuggestions?: string[]
}

export default function AdminTaskReview() {
  const [isVisible, setIsVisible] = useState(false)
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'modifying'>('all')
  const [selectedTask, setSelectedTask] = useState<TaskReview | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredTasks = taskReviews.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus
    const matchesSearch =
      searchQuery === '' ||
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.advertiserName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.advertiserCompany.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700'
      case 'approved':
        return 'bg-green-100 text-green-700'
      case 'rejected':
        return 'bg-red-100 text-red-700'
      case 'modifying':
        return 'bg-orange-100 text-orange-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return '待审核'
      case 'approved':
        return '已通过'
      case 'rejected':
        return '已驳回'
      case 'modifying':
        return '要求修改'
      default:
        return status
    }
  }

  const getAIStatusColor = (status?: string) => {
    switch (status) {
      case 'pass':
        return 'bg-green-100 text-green-700'
      case 'warning':
        return 'bg-yellow-100 text-yellow-700'
      case 'fail':
        return 'bg-red-100 text-red-700'
      default:
        return 'bg-slate-100 text-slate-700'
    }
  }

  const handleApprove = (taskId: string) => {
    if (confirm('确认通过该任务的发布申请？')) {
      alert('任务已通过审核并发布！')
      setShowDetailModal(false)
    }
  }

  const handleReject = (taskId: string) => {
    const reason = prompt('请输入驳回原因：')
    if (reason) {
      alert(`任务已驳回！\n原因：${reason}`)
      setShowDetailModal(false)
    }
  }

  const handleRequestModify = (taskId: string) => {
    const suggestions = prompt('请输入修改建议（多条建议用换行分隔）：')
    if (suggestions) {
      const suggestionList = suggestions.split('\n').filter(s => s.trim())
      alert(`已要求修改！\n修改建议：\n${suggestionList.join('\n')}`)
      setShowDetailModal(false)
    }
  }

  const viewDetail = (task: TaskReview) => {
    setSelectedTask(task)
    setShowDetailModal(true)
  }

  return (
    <div className={`space-y-6 ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`}>
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">任务审核管理</h1>
          <p className="text-slate-500 mt-1">
            审核广告主发布的任务，共 {taskReviews.length} 个任务待处理
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">总任务数</p>
          <p className="text-2xl font-bold text-slate-800">{taskReviews.length}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">待审核</p>
          <p className="text-2xl font-bold text-yellow-600">
            {taskReviews.filter(t => t.status === 'pending').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">已通过</p>
          <p className="text-2xl font-bold text-green-600">
            {taskReviews.filter(t => t.status === 'approved').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
          <p className="text-slate-500 text-sm">要求修改</p>
          <p className="text-2xl font-bold text-orange-600">
            {taskReviews.filter(t => t.status === 'modifying').length}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="搜索任务标题、广告主名称..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'all'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              全部
            </button>
            <button
              onClick={() => setFilterStatus('pending')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'pending'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              待审核
            </button>
            <button
              onClick={() => setFilterStatus('modifying')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filterStatus === 'modifying'
                  ? 'bg-[#1dbf73] text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              待修改
            </button>
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-lg font-semibold text-slate-800">{task.title}</h3>
                  <Badge className={getStatusColor(task.status)}>{getStatusText(task.status)}</Badge>
                  {task.aiReviewStatus && (
                    <Badge className={getAIStatusColor(task.aiReviewStatus)}>
                      AI评分：{task.aiReviewScore}
                    </Badge>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                  <span>广告主：{task.advertiserName}</span>
                  <span>公司：{task.advertiserCompany}</span>
                  <span className="font-semibold text-[#1dbf73]">佣金：¥{task.budget}</span>
                  <span>类型：{task.type}</span>
                  <span>平台：{task.platform.join('、')}</span>
                  <span>时效：{task.taskTime}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="border-slate-200"
                onClick={() => viewDetail(task)}
              >
                <Eye className="w-4 h-4 mr-2" />
                查看详情
              </Button>
            </div>

            {/* AI Review Suggestions */}
            {task.aiReviewSuggestions && task.aiReviewSuggestions.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-yellow-800 mb-2">AI审核建议：</p>
                    <div className="space-y-1">
                      {task.aiReviewSuggestions.map((suggestion, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-yellow-700">
                          <Badge variant="outline" className="border-yellow-300 text-yellow-700 text-xs mt-0.5">
                            {suggestion.type}
                          </Badge>
                          <span>{suggestion.content}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Modify Suggestions (if modifying) */}
            {task.status === 'modifying' && task.modifySuggestions && (
              <div className="mt-3 bg-orange-50 border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-orange-800 mb-1">修改建议：</p>
                    <ul className="list-disc list-inside text-xs text-orange-700 space-y-1">
                      {task.modifySuggestions.map((suggestion, idx) => (
                        <li key={idx}>{suggestion}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <Clock className="w-4 h-4" />
                <span>提交时间：{task.submittedAt}</span>
              </div>
              {task.status === 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-200 text-red-600 hover:bg-red-50"
                    onClick={() => handleReject(task.taskId)}
                  >
                    <X className="w-3 h-3 mr-1" />
                    驳回
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    onClick={() => handleRequestModify(task.taskId)}
                  >
                    <FileText className="w-3 h-3 mr-1" />
                    要求修改
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#1dbf73] hover:bg-[#19a463]"
                    onClick={() => handleApprove(task.taskId)}
                  >
                    <CheckCircle className="w-3 h-3 mr-1" />
                    通过
                  </Button>
                </div>
              )}
              {task.status === 'modifying' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-slate-200"
                    onClick={() => alert('等待广告主修改后重新提交')}
                  >
                    <Clock className="w-3 h-3 mr-1" />
                    等待修改
                  </Button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedTask && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-4xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-800">任务详情</h2>
                <p className="text-sm text-slate-500 mt-1">任务ID：{selectedTask.taskId}</p>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* Content */}
            <div className="space-y-6">
              {/* Basic Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">基本信息</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">任务标题</p>
                    <p className="text-sm font-medium text-slate-800">{selectedTask.title}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">任务类型</p>
                    <p className="text-sm text-slate-800">{selectedTask.type}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">佣金价格</p>
                    <p className="text-sm font-semibold text-[#1dbf73]">¥{selectedTask.budget}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">任务时效</p>
                    <p className="text-sm text-slate-800">{selectedTask.taskTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">投放平台</p>
                    <p className="text-sm text-slate-800">{selectedTask.platform.join('、')}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">分辨率</p>
                    <p className="text-sm text-slate-800">{selectedTask.resolution}</p>
                  </div>
                </div>
              </div>

              {/* Advertiser Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">广告主信息</h3>
                <div className="bg-slate-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-slate-500 mb-1">广告主名称</p>
                      <p className="text-sm font-medium text-slate-800">{selectedTask.advertiserName}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 mb-1">公司名称</p>
                      <p className="text-sm text-slate-800">{selectedTask.advertiserCompany}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">任务要求</h3>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-2">基础要求</p>
                    <p className="text-sm text-slate-800">{selectedTask.basicRequirements || '无'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-2">硬性要求</p>
                    <p className="text-sm text-slate-800">{selectedTask.mandatoryRequirements || '无'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-2">非硬性要求</p>
                    <p className="text-sm text-slate-800">{selectedTask.optionalRequirements || '无'}</p>
                  </div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-xs text-slate-500 mb-2">补充说明</p>
                    <p className="text-sm text-slate-800">{selectedTask.supplementaryInfo || '无'}</p>
                  </div>
                </div>
              </div>

              {/* Task Parameters */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">任务参数</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">素材条数</p>
                    <p className="text-sm text-slate-800">{selectedTask.items} 条</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">AI创作</p>
                    <p className="text-sm text-slate-800">{selectedTask.acceptAI}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">场景要求</p>
                    <p className="text-sm text-slate-800">{selectedTask.scene}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">视频风格</p>
                    <p className="text-sm text-slate-800">{selectedTask.style}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">配音要求</p>
                    <p className="text-sm text-slate-800">{selectedTask.dubbing}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">素材条数</p>
                    <p className="text-sm text-slate-800">{selectedTask.items} 条</p>
                  </div>
                </div>
              </div>

              {/* Cover Images */}
              {selectedTask.coverImages && selectedTask.coverImages.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">参考素材</h3>
                  <div className="flex gap-3">
                    {selectedTask.coverImages.map((img, idx) => (
                      <div key={idx} className="w-24 h-24 bg-slate-100 rounded-lg flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-slate-400" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Review */}
              {selectedTask.aiReviewScore && (
                <div>
                  <h3 className="text-sm font-semibold text-slate-600 mb-3">AI预审结果</h3>
                  <div className={`rounded-lg p-4 ${
                    selectedTask.aiReviewStatus === 'pass' ? 'bg-green-50 border border-green-200' :
                    selectedTask.aiReviewStatus === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getAIStatusColor(selectedTask.aiReviewStatus)}>
                        {selectedTask.aiReviewScore === 'pass' ? '通过' :
                         selectedTask.aiReviewStatus === 'warning' ? '警告' : '不通过'}
                      </Badge>
                      <span className="text-sm font-semibold">{selectedTask.aiReviewScore} 分</span>
                    </div>
                    {selectedTask.aiReviewOverall && (
                      <p className="text-sm text-slate-700 mb-3">{selectedTask.aiReviewOverall}</p>
                    )}
                    {selectedTask.aiReviewSuggestions && selectedTask.aiReviewSuggestions.length > 0 && (
                      <div className="space-y-2">
                        {selectedTask.aiReviewSuggestions.map((suggestion, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs">
                            <Badge variant="outline" className="border-slate-300 text-xs mt-0.5">
                              {suggestion.type}
                            </Badge>
                            <span>{suggestion.content}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Time Info */}
              <div>
                <h3 className="text-sm font-semibold text-slate-600 mb-3">时间信息</h3>
                <div className="grid grid-cols-2 gap-4 bg-slate-50 rounded-lg p-4">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">任务开始时间</p>
                    <p className="text-sm text-slate-800">{selectedTask.startTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">任务结束时间</p>
                    <p className="text-sm text-slate-800">{selectedTask.endTime}</p>
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 mb-1">提交审核时间</p>
                    <p className="text-sm text-slate-800">{selectedTask.submittedAt}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedTask.status === 'pending' && (
              <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200"
                  onClick={() => setShowDetailModal(false)}
                >
                  取消
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                  onClick={() => {
                    handleReject(selectedTask.taskId)
                    setShowDetailModal(false)
                  }}
                >
                  <X className="w-4 h-4 mr-2" />
                  驳回
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-orange-200 text-orange-600 hover:bg-orange-50"
                  onClick={() => {
                    handleRequestModify(selectedTask.taskId)
                    setShowDetailModal(false)
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  要求修改
                </Button>
                <Button
                  className="flex-1 bg-[#1dbf73] hover:bg-[#19a463]"
                  onClick={() => {
                    handleApprove(selectedTask.taskId)
                    setShowDetailModal(false)
                  }}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  通过
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
