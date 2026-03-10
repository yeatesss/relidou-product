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

export default function PostOrder() {
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)
  const [showQRCode, setShowQRCode] = useState(false)
  const [showAIReviewModal, setShowAIReviewModal] = useState(false)
  const [isAIReviewing, setIsAIReviewing] = useState(false)
  const [aiReviewResult, setAiReviewResult] = useState<any>(null)

  // 表单数据更新
  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData({ ...formData, ...updates })
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
    orderCode: '', // 发单码
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

  // 确认发布（提交给运营审核）
  const confirmPublish = () => {
    // 验证发单码
    if (!formData.orderCode || formData.orderCode.trim() === '') {
      alert('请先填写发单码！扫描客服二维码获取发单码。')
      setShowConfirmModal(false)
      return
    }

    // 验证发单码格式（示例：6位数字或字母）
    const codeRegex = /^[A-Za-z0-9]{6}$/
    if (!codeRegex.test(formData.orderCode.trim())) {
      alert('发单码格式不正确，请检查后重新输入！')
      setShowConfirmModal(false)
      return
    }

    alert('任务已提交运营审核！')
    navigate('/client-workspace')
  }

  // AI预审
  const handleAIReview = async () => {
    // 验证发单码
    if (!formData.orderCode || formData.orderCode.trim() === '') {
      alert('请先填写发单码！扫描客服二维码获取发单码。')
      return
    }

    // 验证发单码格式
    const codeRegex = /^[A-Za-z0-9]{6}$/
    if (!codeRegex.test(formData.orderCode.trim())) {
      alert('发单码格式不正确，请检查后重新输入！')
      return
    }

    setShowAIReviewModal(true)
    setIsAIReviewing(true)

    // 模拟AI调用
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟AI返回结果
    const mockAIResult = {
      score: 75,
      status: 'warning', // pass, warning, fail
      suggestions: [
        {
          type: '基础要求',
          content: '任务描述较为简单，建议补充更多细节，例如：视频的具体应用场景、目标受众画像、品牌调性要求等',
          priority: 'medium'
        },
        {
          type: '硬性要求',
          content: '硬性要求部分填写较为完整，但建议明确禁止使用的内容类型，如：敏感词汇、争议话题等',
          priority: 'low'
        },
        {
          type: '任务参数',
          content: '素材条数建议根据实际需求调整，4条素材可能数量较多，可考虑分批发布',
          priority: 'medium'
        },
        {
          type: '发单码验证',
          content: '发单码已验证通过，可以正常发布任务',
          priority: 'low',
          isPass: true
        }
      ],
      overall: '任务基本信息完整，发单码验证通过。建议优化任务描述，补充更多细节要求，以获得更符合预期的作品。'
    }

    setIsAIReviewing(false)
    setAiReviewResult(mockAIResult)
  }

  // 确认发布（AI预审通过后）
  const confirmPublishAfterReview = () => {
    setShowAIReviewModal(false)
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

                  {/* 分隔线 */}
                  <div className="border-t border-[#e4e5e7] my-3" />

                  {/* 发单码 */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="text-xs text-[#74767e] w-20 flex-shrink-0">发单码</label>
                      <input
                        type="text"
                        placeholder="请输入6位发单码"
                        value={formData.orderCode}
                        onChange={(e) => updateFormData({ orderCode: e.target.value.toUpperCase() })}
                        maxLength={6}
                        className="flex-1 px-3 py-1.5 text-sm border border-[#e4e5e7] rounded focus:outline-none focus:border-[#1dbf73]"
                      />
                    </div>

                    {/* 客服二维码展开按钮 */}
                    <button
                      onClick={() => setShowQRCode(!showQRCode)}
                      className="w-full text-xs text-[#1dbf73] hover:text-[#19a463] font-medium flex items-center justify-center gap-1"
                    >
                      <Info className="w-3.5 h-3.5" />
                      {showQRCode ? '隐藏客服二维码' : '获取发单码：扫码添加客服'}
                    </button>

                    {/* 客服二维码 */}
                    {showQRCode && (
                      <div className="bg-[#f5f5f5] rounded-lg p-3">
                        <div className="flex flex-col items-center">
                          {/* 二维码图片 */}
                          <div className="w-32 h-32 bg-white rounded-lg overflow-hidden mb-2">
                            <img
                              src="customer-service-qrcode.png"
                              alt="客服二维码"
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* 提示文字 */}
                          <div className="text-center">
                            <p className="text-xs font-medium text-[#404145]">扫描二维码添加客服</p>
                            <p className="text-xs text-[#74767e] mt-0.5">微信号：relidou_service</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

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

            {/* 发单码提示 */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-3 rounded-r-lg mb-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-900">
                  <p className="font-medium mb-1">发布前请确认</p>
                  <ul className="space-y-0.5 text-blue-700">
                    <li>• 确保已填写发单码（6位字符）</li>
                    <li>• 如未获取发单码，请先扫码添加客服</li>
                    <li>• 任务提交后预计24小时内完成审核</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 发单码状态 */}
            {formData.orderCode ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-800">已填写发单码：{formData.orderCode}</span>
                </div>
              </div>
            ) : (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-800">未填写发单码</span>
                </div>
              </div>
            )}

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
              onClick={handleAIReview}
              className="bg-gradient-to-r from-[#1dbf73] to-[#19a463] hover:from-[#19a463] hover:to-[#158f57] text-white px-8 flex items-center gap-2"
            >
              <Bot className="w-4 h-4" />
              AI预审发布
            </Button>
          </div>
        </div>
      </div>

      {/* AI预审弹窗 */}
      {showAIReviewModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col">
            {/* 弹窗头部 */}
            <div className="px-6 py-4 border-b border-[#e4e5e7]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#1dbf73] to-[#19a463] rounded-xl flex items-center justify-center">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#1a1a1a]">AI智能预审</h3>
                    <p className="text-xs text-[#74767e]">基于大语言模型智能分析任务质量</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowAIReviewModal(false)
                    setAiReviewResult(null)
                  }}
                  className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
                >
                  <X className="w-4 h-4 text-slate-500" />
                </button>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {isAIReviewing ? (
                // AI分析中状态
                <div className="flex flex-col items-center justify-center py-12">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#1dbf73]/10 to-[#19a463]/10 rounded-full flex items-center justify-center mb-4 animate-pulse">
                    <Bot className="w-8 h-8 text-[#1dbf73]" />
                  </div>
                  <p className="text-base font-semibold text-[#404145] mb-2">AI正在分析您的任务...</p>
                  <p className="text-sm text-[#74767e]">这可能需要几秒钟</p>
                </div>
              ) : aiReviewResult ? (
                // AI分析结果
                <div className="space-y-4">
                  {/* 总体评分 */}
                  <div className="bg-gradient-to-r from-[#f0faf5] to-[#dcfce7] rounded-xl p-4 border border-[#1dbf73]/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-[#404145]">任务完整度评分</span>
                      <div className="flex items-center gap-2">
                        <span className="text-2xl font-bold text-[#1dbf73]">{aiReviewResult.score}</span>
                        <span className="text-sm text-[#74767e]">/100</span>
                      </div>
                    </div>
                    <div className="w-full bg-white/50 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-[#1dbf73] to-[#19a463] h-2 rounded-full transition-all"
                        style={{ width: `${aiReviewResult.score}%` }}
                      />
                    </div>
                    <p className="text-sm text-[#404145] mt-3 leading-relaxed">{aiReviewResult.overall}</p>
                  </div>

                  {/* 优化建议列表 */}
                  <div>
                    <h4 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                      <Info className="w-4 h-4 text-[#1dbf73]" />
                      优化建议
                    </h4>
                    <div className="space-y-3">
                      {aiReviewResult.suggestions.map((suggestion: any, index: number) => (
                        <div
                          key={index}
                          className={`border rounded-lg p-3 ${
                            suggestion.isPass
                              ? 'bg-green-50 border-green-200'
                              : suggestion.priority === 'high'
                              ? 'bg-red-50 border-red-200'
                              : suggestion.priority === 'medium'
                              ? 'bg-amber-50 border-amber-200'
                              : 'bg-blue-50 border-blue-200'
                          }`}
                        >
                          <div className="flex items-start gap-2">
                            {suggestion.isPass ? (
                              <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                            ) : (
                              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                            )}
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-medium text-[#404145]">{suggestion.type}</span>
                                {!suggestion.isPass && (
                                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                                    suggestion.priority === 'high'
                                      ? 'bg-red-100 text-red-700'
                                      : suggestion.priority === 'medium'
                                      ? 'bg-amber-100 text-amber-700'
                                      : 'bg-blue-100 text-blue-700'
                                  }`}>
                                    {suggestion.priority === 'high' ? '重要' : suggestion.priority === 'medium' ? '建议' : '提示'}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-[#404145] leading-relaxed">{suggestion.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            {/* 弹窗底部 */}
            <div className="px-6 py-4 border-t border-[#e4e5e7] bg-gray-50">
              {!isAIReviewing && aiReviewResult ? (
                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setShowAIReviewModal(false)
                      setAiReviewResult(null)
                    }}
                    className="flex-1 py-2.5 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-white transition-colors font-medium text-sm"
                  >
                    返回修改
                  </button>
                  <button
                    onClick={confirmPublishAfterReview}
                    className="flex-1 py-2.5 bg-gradient-to-r from-[#1dbf73] to-[#19a463] hover:from-[#19a463] hover:to-[#158f57] text-white rounded-lg transition-colors font-medium text-sm flex items-center justify-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" />
                    确认发布
                  </button>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
