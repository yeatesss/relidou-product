import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, CheckCircle, Upload, X, Bot, AlertCircle, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Navbar from '../sections/Navbar'
import { useAuth } from '../contexts/AuthContext'

const videoTypes = [
  '爆款复刻',
  '原创内容',
]

const durations = [
  '1-3天',
  '3-7天',
  '7-15天',
  '15-30天',
  '1个月以上',
]

const dubbingOptions = ['普通话', '方言', '英语', '不限']

const platformOptions = ['抖音', '快手', '小红书', '腾讯广告', '其他信息流']

const sceneOptions = ['不限', '实景', '外景', '特殊']

const styleOptions = ['不限', '正式', '幽默', '特殊']

type AiFeedback = {
  status: 'success' | 'warning' | 'info'
  title: string
  content?: string
  issues?: string[]
  suggestions?: string[]
  tips?: string[]
}

export default function PostOrder() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [aiFeedback, setAiFeedback] = useState<AiFeedback | null>(null)
  const [isLoadingAi, setIsLoadingAi] = useState(false)
  const [hasAiReviewed, setHasAiReviewed] = useState(false) // 是否已AI预审

  // 表单数据更新时重置AI预审状态
  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates })
    // 如果已经AI预审过，但用户修改了内容，则重置预审状态
    if (hasAiReviewed) {
      setHasAiReviewed(false)
      setAiFeedback(null)
    }
  }

  const [formData, setFormData] = useState({
    title: '', // 任务标题
    type: '', // 任务类型（爆款复刻、原创内容）
    budget: '', // 佣金价格
    basicRequirements: '', // 基础要求
    mandatoryRequirements: '', // 硬性要求
    optionalRequirements: '', // 非硬性要求
    supplementaryInfo: '', // 补充说明
    items: '', // 素材条数
    acceptAI: '不接受', // AI创作（接受、不接受）
    scene: '不限', // 场景要求（不限、实景、外景、特殊）
    style: '不限', // 视频风格（不限、正式、幽默、特殊）
    dubbing: '普通话', // 配音要求（不限、普通话、方言）
    platform: '', // 投放平台（全平台、抖音、小红书、视频号）
    resolution: '9:16', // 分辨率（9:16、4:3、1:1）
    taskTime: '72小时', // 任务时效（72小时、48小时、24小时）
    coverImages: [] as string[], // 参考视频/图片
    startTime: '', // 任务开始时间
    endTime: '', // 任务结束时间
  })

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setIsVisible(true)
  }, [isAuthenticated, navigate])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // AI预审
  const handleAiReview = async () => {
    if (!formData.title || !formData.type || !formData.budget || !formData.mandatoryRequirements) {
      alert('请填写必填项（任务标题、视频类型、佣金价格、硬性要求）')
      return
    }
    if (!formData.startTime || !formData.endTime) {
      alert('请选择开始时间和结束时间')
      return
    }
    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      alert('结束时间必须晚于开始时间')
      return
    }

    // 调用AI预审
    setIsLoadingAi(true)
    setAiFeedback(null)

    // 模拟AI分析
    setTimeout(() => {
      const feedback = generateMockAiFeedback(formData)
      setAiFeedback(feedback)
      setIsLoadingAi(false)
      setHasAiReviewed(true)
    }, 1500)
  }

  // 确认发布（提交给运营审核）
  const confirmPublish = () => {
    alert('任务已提交运营审核！')
    navigate('/client-workspace')
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files) {
      const newImages = Array.from(files).slice(0, 4).map(file => URL.createObjectURL(file))
      updateFormData({ coverImages: [...formData.coverImages, ...newImages].slice(0, 4) })
    }
  }

  const removeImage = (index: number) => {
    updateFormData({
      coverImages: formData.coverImages.filter((_, i) => i !== index)
    })
  }

  // 计算价格（简化逻辑）
  const calculatePrice = () => {
    const budgetNum = parseInt(formData.budget) || 0
    const firstReview = Math.round(budgetNum * 0.3)
    const secondReview = budgetNum - firstReview
    return { total: budgetNum, firstReview, secondReview }
  }

  const price = calculatePrice()

  // 生成模拟AI反馈
  const generateMockAiFeedback = (data: typeof formData): AiFeedback => {
    const issues = []
    const suggestions = []

    // 检查标题
    if (!data.title || data.title.length < 5) {
      issues.push('任务标题过短，建议至少10个字符以更清晰地描述任务需求')
    }

    // 检查预算
    const budget = parseInt(data.budget) || 0
    if (budget === 0) {
      issues.push('未设置预算金额，请设置合理的预算以吸引优质创作者')
    } else if (budget < 100) {
      issues.push('预算金额偏低，可能难以吸引有经验的创作者')
    }

    // 检查描述内容
    const totalDescLength = (data.basicRequirements?.length || 0) +
                            (data.mandatoryRequirements?.length || 0) +
                            (data.optionalRequirements?.length || 0) +
                            (data.supplementaryInfo?.length || 0)

    if (totalDescLength < 20) {
      issues.push('任务描述过于简单，建议详细说明基础要求、硬性要求等内容')
    }

    if (!data.basicRequirements) {
      suggestions.push('建议填写基础要求，说明视频的基本信息和目标')
    }

    if (!data.mandatoryRequirements) {
      suggestions.push('建议填写硬性要求，明确必须满足的条件')
    }

    // 检查必要信息
    if (!data.type) {
      issues.push('未选择视频类型，请明确是爆款复刻还是原创内容')
    }

    if (!data.platform) {
      suggestions.push('建议指定投放平台，以便创作者制作符合平台风格的内容')
    }

    if (data.taskTime === '72小时') {
      suggestions.push('当前任务时效为72小时，如需加急可选择48小时或24小时')
    }

    // 根据视频类型给出建议
    if (data.type === '爆款复刻') {
      suggestions.push('爆款复刻类任务建议提供参考视频链接或详细描述参考内容')
    } else if (data.type === '原创内容') {
      suggestions.push('原创内容建议说明品牌调性、目标受众和核心卖点')
    }

    // 如果没有任何问题
    if (issues.length === 0 && suggestions.length === 0) {
      return {
        status: 'success',
        title: '任务描述很棒！',
        content: '您的任务描述清晰完整，包含了所有必要信息。这样的描述能够帮助创作者快速理解需求，提高任务匹配效率。',
        tips: ['保持这样的详细程度', '可以考虑添加参考图片或视频', '明确交付标准和验收要求']
      }
    }

    return {
      status: issues.length > 0 ? 'warning' : 'info',
      title: issues.length > 0 ? '发现一些需要改进的地方' : '优化建议',
      issues,
      suggestions,
      tips: [
        '详细的需求描述能吸引更优质的创作者',
        '明确的预算范围有助于快速匹配',
        '提供参考案例可以减少沟通成本'
      ]
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]">
      <Navbar scrolled={scrolled} />

      {/* Header */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#74767e] hover:text-[#1dbf73] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ═══════════════════════════════════
              左侧编辑区域
          ═══════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* 标题 */}
            <div className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h1 className="text-2xl font-bold text-[#1a1a1a] mb-6">发布视频任务</h1>

              {/* 任务标题 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#404145] mb-2">
                  任务标题 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="例如：美妆品牌抖音短视频拍摄"
                  value={formData.title}
                  onChange={(e) => updateFormData({ title: e.target.value })}
                  className="w-full p-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73]"
                />
              </div>

              {/* 视频类型 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#404145] mb-2">
                  视频类型 <span className="text-red-500">*</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {videoTypes.map((type) => (
                    <button
                      key={type}
                      onClick={() => updateFormData({ type })}
                      className={`px-4 py-2 rounded-lg border transition-all text-sm ${
                        formData.type === type
                          ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                          : 'border-[#e4e5e7] text-[#404145] hover:border-[#1dbf73]'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* 参考视频/图片 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#404145] mb-2">
                  参考视频/图片（最多4个）
                </label>
                <div className="grid grid-cols-4 gap-3">
                  {formData.coverImages.map((img, i) => (
                    <div key={i} className="relative aspect-video rounded-lg overflow-hidden border border-[#e4e5e7]">
                      <img src={img} alt={`参考${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        onClick={() => removeImage(i)}
                        className="absolute top-1 right-1 w-6 h-6 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {formData.coverImages.length < 4 && (
                    <label className="aspect-video border-2 border-dashed border-[#e4e5e7] rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-[#1dbf73] transition-colors">
                      <Upload className="w-6 h-6 text-[#74767e] mb-1" />
                      <span className="text-xs text-[#74767e]">上传</span>
                      <input
                        type="file"
                        accept="image/*,video/*"
                        multiple
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              {/* 任务时间 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#404145] mb-2">
                    开始时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.startTime}
                    onChange={(e) => updateFormData({ startTime: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#404145] mb-2">
                    结束时间 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.endTime}
                    onChange={(e) => updateFormData({ endTime: e.target.value })}
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>
              </div>
            </div>

            {/* 任务详情 */}
            <div className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-500 delay-75 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <h2 className="text-base font-bold text-[#1a1a1a] mb-4">任务详情</h2>

              {/* 统一的大输入框 */}
              <div className="border border-[#e4e5e7] rounded-lg overflow-hidden focus-within:border-[#1dbf73] focus-within:ring-1 focus-within:ring-[#1dbf73] transition-all">
                {/* 基础要求 */}
                <div className="border-b border-[#e4e5e7] last:border-b-0">
                  <div className="bg-gray-50 px-3 py-1.5 border-b border-[#e4e5e7]">
                    <span className="text-xs font-medium text-[#1a1a1a]">基础要求</span>
                  </div>
                  <textarea
                    placeholder="说明视频的基本信息，例如：视频时长、投放平台、目标受众、品牌调性等"
                    value={formData.basicRequirements}
                    onChange={(e) => updateFormData({ basicRequirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 resize-none bg-white"
                  />
                </div>

                {/* 硬性要求 */}
                <div className="border-b border-[#e4e5e7] last:border-b-0">
                  <div className="bg-gray-50 px-3 py-1.5 border-b border-[#e4e5e7]">
                    <span className="text-xs font-medium text-[#1a1a1a]">硬性要求 <span className="text-red-500">*</span></span>
                  </div>
                  <textarea
                    placeholder="必须满足的条件，例如：必须出现的元素、禁止使用的内容、合规要求等"
                    value={formData.mandatoryRequirements}
                    onChange={(e) => updateFormData({ mandatoryRequirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 resize-none bg-white"
                  />
                </div>

                {/* 非硬性要求 */}
                <div className="border-b border-[#e4e5e7] last:border-b-0">
                  <div className="bg-gray-50 px-3 py-1.5 border-b border-[#e4e5e7]">
                    <span className="text-xs font-medium text-[#1a1a1a]">非硬性要求</span>
                  </div>
                  <textarea
                    placeholder="建议性的内容，例如：风格偏好、参考案例、创意方向等"
                    value={formData.optionalRequirements}
                    onChange={(e) => updateFormData({ optionalRequirements: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 resize-none bg-white"
                  />
                </div>

                {/* 补充说明 */}
                <div>
                  <div className="bg-gray-50 px-3 py-1.5 border-b border-[#e4e5e7]">
                    <span className="text-xs font-medium text-[#1a1a1a]">补充说明</span>
                  </div>
                  <textarea
                    placeholder="其他需要说明的内容，例如：交付格式、联系方式等"
                    value={formData.supplementaryInfo}
                    onChange={(e) => updateFormData({ supplementaryInfo: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm border-0 focus:outline-none focus:ring-0 resize-none bg-white"
                  />
                </div>
              </div>

              {/* 字数统计 */}
              <div className="text-right text-xs text-[#74767e] mt-2">
                总字数：{
                  (formData.basicRequirements.length +
                   formData.mandatoryRequirements.length +
                   formData.optionalRequirements.length +
                   formData.supplementaryInfo.length)
                }/2000 字
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════
              右侧预览卡片
          ═══════════════════════════════════ */}
          <div>
            <div className={`sticky top-24 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
              <div className="bg-white rounded-xl shadow-sm border border-[#e4e5e7] overflow-hidden">

                {/* 区块标题 */}
                <div className="px-5 pt-5 pb-4 border-b border-[#f0f0f0]">
                  <h2 className="font-bold text-[#1a1a1a] text-base mb-0.5">任务信息</h2>
                  <p className="text-xs text-[#74767e]">
                    {formData.type || '未选择视频类型'}
                  </p>
                </div>

                {/* 参考预览 */}
                {formData.coverImages.length > 0 && (
                  <div className="relative w-full h-48 bg-gray-100">
                    <img
                      src={formData.coverImages[0]}
                      alt="参考预览"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* 佣金价格区 */}
                <div className="px-5 pt-4 pb-4 bg-[#f0faf5] border-b border-[#d4f0e3]">
                  <div className="text-xs text-[#74767e] mb-1">佣金价格 <span className="text-red-500">*</span></div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-2xl font-bold text-[#1dbf73]">¥</span>
                    <input
                      type="number"
                      placeholder="输入金额"
                      value={formData.budget}
                      onChange={(e) => updateFormData({ budget: e.target.value })}
                      className="flex-1 text-3xl font-bold text-[#1dbf73] bg-transparent border-0 border-b-2 border-[#1dbf73]/30 focus:border-[#1dbf73] focus:outline-none px-0 py-1"
                    />
                  </div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-[#74767e] text-xs">第一次验收预估</span>
                      <div className="font-semibold text-[#1a1a1a]">
                        {formData.budget ? `¥${price.firstReview}` : '-'}
                      </div>
                    </div>
                    <div className="w-px bg-[#c5e8d5]" />
                    <div>
                      <span className="text-[#74767e] text-xs">第二次验收预估</span>
                      <div className="font-semibold text-[#1a1a1a]">
                        {formData.budget ? `¥${price.secondReview}` : '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 任务参数列表 */}
                <div className="px-5 pt-4 pb-4 space-y-2.5">
                  {/* 素材条数 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">素材条数</label>
                    <input
                      type="number"
                      placeholder="例如：4"
                      value={formData.items}
                      onChange={(e) => updateFormData({ items: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>

                  {/* AI创作 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">AI创作</label>
                    <select
                      value={formData.acceptAI}
                      onChange={(e) => updateFormData({ acceptAI: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73]"
                    >
                      <option value="不接受">不接受</option>
                      <option value="接受">接受</option>
                    </select>
                  </div>

                  {/* 场景要求 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">场景要求</label>
                    <select
                      value={formData.scene}
                      onChange={(e) => updateFormData({ scene: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73] bg-white"
                    >
                      {sceneOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* 视频风格 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">视频风格</label>
                    <select
                      value={formData.style}
                      onChange={(e) => updateFormData({ style: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73] bg-white"
                    >
                      {styleOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* 配音要求 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">配音要求</label>
                    <select
                      value={formData.dubbing}
                      onChange={(e) => updateFormData({ dubbing: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73]"
                    >
                      {dubbingOptions.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </div>

                  {/* 投放平台 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">投放平台</label>
                    <select
                      value={formData.platform}
                      onChange={(e) => updateFormData({ platform: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73]"
                    >
                      <option value="">请选择平台</option>
                      {platformOptions.map((platform) => (
                        <option key={platform} value={platform}>{platform}</option>
                      ))}
                    </select>
                  </div>

                  {/* 分辨率 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">分辨率</label>
                    <select
                      value={formData.resolution}
                      onChange={(e) => updateFormData({ resolution: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73]"
                    >
                      <option value="9:16">9:16（竖版）</option>
                      <option value="4:3">4:3（横版）</option>
                      <option value="1:1">1:1（方形）</option>
                    </select>
                  </div>

                  {/* 任务时效 */}
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-[#74767e] w-20 flex-shrink-0">任务时效</label>
                    <select
                      value={formData.taskTime}
                      onChange={(e) => updateFormData({ taskTime: e.target.value })}
                      className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73]"
                    >
                      <option value="72小时">72小时（普通）</option>
                      <option value="48小时">48小时（加急）</option>
                      <option value="24小时">24小时（特急）</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* AI预审结果弹窗 */}
      {aiFeedback && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* 弹窗标题 */}
            <div className="px-6 py-4 border-b border-[#e4e5e7] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#1a1a1a]">AI预审结果</h3>
                  <p className="text-xs text-[#74767e]">智能分析任务信息，提供优化建议</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setAiFeedback(null)
                  setHasAiReviewed(false)
                }}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#f5f5f5] transition-colors"
              >
                <X className="w-5 h-5 text-[#74767e]" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {aiFeedback.status === 'success' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-green-800 mb-1">{aiFeedback.title}</h4>
                      <p className="text-sm text-green-700 mb-3">{aiFeedback.content}</p>
                      <div className="text-xs text-green-600">
                        <span className="font-medium">小贴士：</span>
                        {aiFeedback.tips?.join('、')}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {(aiFeedback.status === 'warning' || aiFeedback.status === 'info') && (
                <div className={`rounded-lg p-4 ${aiFeedback.status === 'warning' ? 'bg-amber-50 border border-amber-200' : 'bg-blue-50 border border-blue-200'}`}>
                  <div className="flex items-start gap-3 mb-3">
                    {aiFeedback.status === 'warning' ? (
                      <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                    ) : (
                      <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    )}
                    <div>
                      <h4 className={`font-semibold mb-1 ${aiFeedback.status === 'warning' ? 'text-amber-800' : 'text-blue-800'}`}>
                        {aiFeedback.title}
                      </h4>
                    </div>
                  </div>

                  {/* 问题列表 */}
                  {aiFeedback.issues && aiFeedback.issues.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-amber-700 mb-2">需要改进：</p>
                      <ul className="space-y-1">
                        {aiFeedback.issues.map((issue, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-amber-800">
                            <span className="text-amber-600 mt-0.5">•</span>
                            <span>{issue}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 建议列表 */}
                  {aiFeedback.suggestions && aiFeedback.suggestions.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-medium text-blue-700 mb-2">优化建议：</p>
                      <ul className="space-y-1">
                        {aiFeedback.suggestions.map((suggestion, index) => (
                          <li key={index} className="flex items-start gap-2 text-sm text-blue-800">
                            <span className="text-blue-600 mt-0.5">•</span>
                            <span>{suggestion}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* 小贴士 */}
                  {aiFeedback.tips && (
                    <div className={`text-xs p-3 rounded-md ${aiFeedback.status === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                      <span className="font-medium">💡 小贴士：</span>
                      {aiFeedback.tips.join('、')}
                    </div>
                  )}
                </div>
              )}

              {/* 提示信息 */}
              <div className="mt-4 p-3 bg-[#f0faf5] border border-[#1dbf73]/30 rounded-lg">
                <p className="text-xs text-[#74767e]">
                  您可以根据AI建议继续优化任务信息，或直接点击下方按钮提交运营审核
                </p>
              </div>
            </div>

            {/* 弹窗底部按钮 */}
            <div className="px-6 py-4 border-t border-[#e4e5e7] bg-gray-50 flex gap-3">
              <button
                onClick={() => {
                  setAiFeedback(null)
                  setHasAiReviewed(false)
                }}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
              >
                继续修改
              </button>
              <button
                onClick={() => {
                  setAiFeedback(null)
                  setShowConfirmModal(true)
                }}
                className="flex-1 py-3 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] transition-colors font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle className="w-4 h-4" />
                确认发布
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 确认发布弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1dbf73]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#1dbf73]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">确认提交审核</h3>
            </div>
            <p className="text-[#74767e] text-sm leading-relaxed mb-6">
              确认后将提交给运营审核，预计24小时内完成审核，确认提交吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={confirmPublish}
                className="flex-1 py-2.5 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] transition-colors font-medium"
              >
                确认提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 固定底部按钮栏 */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#e4e5e7] shadow-lg z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="border-[#e4e5e7] px-8"
            >
              取消
            </Button>
            <Button
              onClick={handleAiReview}
              disabled={isLoadingAi}
              className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-8"
            >
              {isLoadingAi ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                  AI预审中...
                </>
              ) : (
                <>
                  <Bot className="w-4 h-4 mr-2" />
                  AI预审
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
