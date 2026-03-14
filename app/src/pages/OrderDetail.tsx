import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Clock,
  Film,
  Mic,
  Monitor,
  AlertCircle,
  Bot,
  Maximize2,
  Award,
  TrendingUp,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

// ─── Mock 数据 ────────────────────────────────────────────────
const SERVICE = {
  id: 1,
  title: '美妆抖音信息流 15s 起量短视频制作（含脚本+拍摄+剪辑）',
  publishTime: '2026-02-20T10:30:00',
  rating: 4.9,
  reviewCount: 256,
  submissionsReceived: 180,
  submissionsAccepted: 162,

  advertiser: {
    name: 'glee Creative Studio',
    avatar: '创',
    acceptanceRate: 90,
    avgReviewTime: '3小时',
    cumulativeAccepted: '500单',
    cumulativePayout: '10000元',
  },

  coverImages: [
    { label: '主封面', bg: 'from-[#003912] to-[#1dbf73]' },
    { label: '样片 2', bg: 'from-[#1a1a2e] to-[#16213e]' },
    { label: '样片 3', bg: 'from-[#2d1b69] to-[#11998e]' },
    { label: '样片 4', bg: 'from-[#c94b4b] to-[#4b134f]' },
  ],

  task: {
    name: '抖音电商放量包',
    price: 36,
    firstReviewPrice: 12,
    secondReviewPrice: 24,
    items: '4条',
    acceptAI: '不接受',
    scene: '不限',
    style: '不限',
    dubbing: '普通话',
    platform: '抖音',
    resolution: '9:16',
    taskTime: '72小时',
    startTime: '2026-02-23T10:00',
    endTime: '2026-02-26T18:00',
  },

  description: {
    basic: '本任务面向有抖音信息流投放需求的广告主，创作者需根据品牌提供的产品资料和投放目标，独立完成脚本策划、拍摄和剪辑。视频时长13-17秒，格式为MP4，不低于1080P。',
    mandatory: '1. 视频尺寸：1080×1920（9:16 竖版）\n2. 时长：13-17秒（平台推荐区间）\n3. 不允许使用AI换脸、AI配音\n4. 必须包含产品特写镜头',
    optional: '风格偏好：年轻活力、快节奏剪辑\n参考案例：可参考抖音同类产品爆款视频\n创意方向：突出产品核心卖点，前3秒抓住用户注意力',
    reference: '已上传3个参考视频，展示期望的视频风格和剪辑节奏',
    supplementary: '接单后广告主将在24小时内发送产品资料与投放Brief，创作者按约定时效提交初稿，广告主按盲盒机制审片验收。',
  },
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [ordered, setOrdered] = useState(false)
  const [showCodeModal, setShowCodeModal] = useState(false)
  const [orderCode, setOrderCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [showImageModal, setShowImageModal] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  useEffect(() => {
    setIsVisible(true)
    window.scrollTo(0, 0)
    console.log('Service ID:', id)
  }, [id])

  const handleOrderClick = () => {
    if (!isAuthenticated) {
      navigate('/login')
      return
    }
    setShowCodeModal(true)
    setOrderCode('')
    setCodeError('')
  }

  // 验证抢单码
  const validateCode = (code: string): boolean => {
    const validCodes = ['TEST001', 'TEST002', 'TEST003', 'SN20240301']
    return validCodes.includes(code.toUpperCase().trim())
  }

  const handleCodeSubmit = () => {
    if (!orderCode.trim()) {
      setCodeError('请输入抢单码')
      return
    }

    if (validateCode(orderCode)) {
      setShowCodeModal(false)
      setOrdered(true)
      // 跳转到创作者工作台
      setTimeout(() => {
        navigate('/creator-workspace')
      }, 500)
    } else {
      setCodeError('抢单码无效，请联系客服重新获取')
    }
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-20">

      {/* ── 面包屑 ── */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <nav className="flex items-center gap-1.5 text-sm text-[#74767e]">
            <button onClick={() => navigate('/')} className="hover:text-[#1dbf73] transition-colors">
              首页
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <button onClick={() => navigate('/orders')} className="hover:text-[#1dbf73] transition-colors">
              素材大厅
            </button>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-[#1a1a1a] font-medium line-clamp-1 max-w-xs">
              {SERVICE.title}
            </span>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ═══════════════════════════════════
              左侧主内容：标题+发布信息 / 服务详情
          ═══════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── 任务标题 + 服务详情 ── */}
            <div
              className={`bg-white rounded-xl shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <div className="p-6">
                {/* 标题 */}
                <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] leading-snug mb-4">
                  {SERVICE.title}
                </h1>

                {/* 分段式详情展示 */}
                <div className="border border-[#e4e5e7] rounded-lg overflow-hidden">
                  {/* 基础要求 */}
                  <div className="border-b border-[#e4e5e7] last:border-b-0">
                    <div className="bg-gray-50 px-4 py-2 border-b border-[#e4e5e7]">
                      <span className="text-sm font-medium text-[#1a1a1a]">基础要求</span>
                    </div>
                    <div className="px-4 py-3 text-sm text-[#74767e] leading-relaxed">
                      {SERVICE.description.basic}
                    </div>
                  </div>

                  {/* 硬性要求 */}
                  <div className="border-b border-[#e4e5e7] last:border-b-0">
                    <div className="bg-gray-50 px-4 py-2 border-b border-[#e4e5e7]">
                      <span className="text-sm font-medium text-[#1a1a1a]">硬性要求</span>
                    </div>
                    <div className="px-4 py-3 text-sm text-[#74767e] leading-relaxed whitespace-pre-line">
                      {SERVICE.description.mandatory}
                    </div>
                  </div>

                  {/* 非硬性要求 */}
                  <div className="border-b border-[#e4e5e7] last:border-b-0">
                    <div className="bg-gray-50 px-4 py-2 border-b border-[#e4e5e7]">
                      <span className="text-sm font-medium text-[#1a1a1a]">非硬性要求</span>
                    </div>
                    <div className="px-4 py-3 text-sm text-[#74767e] leading-relaxed whitespace-pre-line">
                      {SERVICE.description.optional}
                    </div>
                  </div>

                  {/* 素材参考 */}
                  <div className="border-b border-[#e4e5e7] last:border-b-0">
                    <div className="bg-gray-50 px-4 py-2 border-b border-[#e4e5e7]">
                      <span className="text-sm font-medium text-[#1a1a1a]">素材参考</span>
                    </div>
                    <div className="px-4 py-3">
                      <p className="text-sm text-[#74767e] leading-relaxed mb-3">
                        {SERVICE.description.reference}
                      </p>
                      {/* 素材缩略图网格 */}
                      <div className="w-1/2">
                        <div className="grid grid-cols-4 gap-2">
                          {SERVICE.coverImages.map((img, i) => (
                            <div
                              key={i}
                              onClick={() => {
                                setSelectedImageIndex(i)
                                setShowImageModal(true)
                              }}
                              className={`aspect-video rounded-lg bg-gradient-to-br ${img.bg} border-2 border-[#e4e5e7] overflow-hidden relative group cursor-pointer`}
                            >
                              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                                <span className="text-xs text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                                  {img.label}
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 补充说明 */}
                  <div>
                    <div className="bg-gray-50 px-4 py-2 border-b border-[#e4e5e7]">
                      <span className="text-sm font-medium text-[#1a1a1a]">补充说明</span>
                    </div>
                    <div className="px-4 py-3 text-sm text-[#74767e] leading-relaxed">
                      {SERVICE.description.supplementary}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════
              右侧 sticky：任务信息区
          ═══════════════════════════════════ */}
          <div>
            <div
              className={`sticky top-24 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-[#e4e5e7] overflow-hidden">

                {/* 广告主信息区块 */}
                <div className="px-4 pt-3 pb-3 border-b border-[#f0f0f0]">
                  {/* 头像 + 名称 */}
                  <div className="flex items-center gap-2.5 mb-3">
                    <Avatar className="w-10 h-10 bg-[#1dbf73]">
                      <AvatarFallback className="text-white text-sm font-medium">{SERVICE.advertiser.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-bold text-[#1a1a1a] truncate">{SERVICE.advertiser.name}</h3>
                      <p className="text-xs text-[#74767e] mt-0.5">累计验收3000单</p>
                    </div>
                  </div>

                  {/* 统计信息卡片 */}
                  <div className="grid grid-cols-3 gap-1.5">
                    {/* 验收通过率 */}
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 text-[#74767e] text-[10px] mb-1">
                        <Award className="w-3 h-3" />
                        <span>验收通过率</span>
                      </div>
                      <p className="text-sm font-bold text-[#1dbf73]">{SERVICE.advertiser.acceptanceRate}%</p>
                    </div>

                    {/* 平均验收时间 */}
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 text-[#74767e] text-[10px] mb-1">
                        <Clock className="w-3 h-3" />
                        <span>平均验收时间</span>
                      </div>
                      <p className="text-sm font-bold text-[#1a1a1a]">{SERVICE.advertiser.avgReviewTime}</p>
                    </div>

                    {/* 累计支出 */}
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="flex items-center gap-1 text-[#74767e] text-[10px] mb-1">
                        <TrendingUp className="w-3 h-3" />
                        <span>累计支出</span>
                      </div>
                      <p className="text-sm font-bold text-[#1a1a1a]">{SERVICE.advertiser.cumulativePayout}</p>
                    </div>
                  </div>
                </div>

                {/* 任务信息区块 */}
                <div className="px-4">
                  {/* 任务信息大卡片 */}
                  <div className="rounded-lg p-3 mb-3">
                    {/* 时间统计 */}
                    <div className="mb-3 pb-3 border-b border-slate-200">
                      <div className="flex items-center justify-between">
                        {/* 截止时间 - 居左 */}
                        <div className="flex-1">
                          <div className="flex items-center gap-1 text-[#74767e] text-[10px] mb-1">
                            <Clock className="w-3 h-3" />
                            <span>截止时间</span>
                          </div>
                          <p className="text-xs font-medium text-[#1a1a1a]">
                            {new Date(SERVICE.task.endTime).toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>

                        {/* 已验收/已投稿 - 居右 */}
                        <div className="text-right">
                          <p className="text-[#74767e] text-[10px] mb-1">已验收/已投稿</p>
                          <p className="text-base font-bold text-[#1a1a1a]">{SERVICE.submissionsAccepted}/{SERVICE.submissionsReceived}</p>
                        </div>
                      </div>
                    </div>

                    {/* 任务参数 */}
                    <div className="mb-3 pb-3 border-b border-slate-200">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        {[
                          { icon: <Clock className="w-3.5 h-3.5 text-[#1dbf73]" />, label: '任务时效', value: SERVICE.task.taskTime },
                          { icon: <Film className="w-3.5 h-3.5 text-[#1dbf73]" />, label: '素材条数', value: SERVICE.task.items },
                          { icon: <Bot className="w-3.5 h-3.5 text-[#1dbf73]" />, label: 'AI 创作', value: SERVICE.task.acceptAI },
                          { icon: <Monitor className="w-3.5 h-3.5 text-[#1dbf73]" />, label: '场景要求', value: SERVICE.task.scene },
                          { icon: <AlertCircle className="w-3.5 h-3.5 text-[#1dbf73]" />, label: '视频风格', value: SERVICE.task.style },
                          { icon: <Mic className="w-3.5 h-3.5 text-[#1dbf73]" />, label: '配音要求', value: SERVICE.task.dubbing },
                          { icon: <Monitor className="w-3.5 h-3.5 text-[#1dbf73]" />, label: '投放平台', value: SERVICE.task.platform },
                          { icon: <Maximize2 className="w-3.5 h-3.5 text-[#1dbf73]" />, label: '分辨率', value: SERVICE.task.resolution },
                        ].map((row) => (
                          <div key={row.label}>
                            <div className="flex items-center gap-1 text-[#74767e] text-[10px] mb-1">
                              {row.icon}
                              <span>{row.label}</span>
                            </div>
                            <p className="text-xs font-medium text-[#1a1a1a]">{row.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* 佣金价格 */}
                    <div>
                      <div className="text-xs text-[#74767e] mb-2">佣金价格</div>
                      <div className="flex items-center gap-3">
                        <div className="text-2xl font-bold text-[#1dbf73]">¥{SERVICE.task.price}</div>
                        <div className="w-px bg-[#1dbf73]/30 h-6"></div>
                        <div className="flex gap-3 text-xs flex-1">
                          <div>
                            <span className="text-[#74767e] text-[10px]">第一次验收</span>
                            <div className="font-semibold text-[#1a1a1a]">¥{SERVICE.task.firstReviewPrice}</div>
                          </div>
                          <div className="w-px bg-[#1dbf73]/30"></div>
                          <div>
                            <span className="text-[#74767e] text-[10px]">第二次验收</span>
                            <div className="font-semibold text-[#1a1a1a]">¥{SERVICE.task.secondReviewPrice}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 立即下单按钮 */}
                <div className="px-4 pb-4">
                  <button
                    onClick={handleOrderClick}
                    disabled={ordered}
                    className={`w-full py-3 rounded-lg font-bold text-sm transition-all duration-200 ${ordered
                        ? 'bg-[#e4e5e7] text-[#74767e] cursor-not-allowed'
                        : 'bg-[#1dbf73] hover:bg-[#19a463] text-white shadow-lg shadow-[#1dbf73]/25 hover:scale-[1.02]'
                      }`}
                  >
                    {ordered ? '任务进行中' : '立即抢单'}
                  </button>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* 图片查看弹窗 */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4" onClick={() => setShowImageModal(false)}>
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 图片 */}
            <div className={`aspect-video rounded-xl bg-gradient-to-br ${SERVICE.coverImages[selectedImageIndex].bg} flex items-center justify-center`}>
              <span className="text-white/60 text-lg">{SERVICE.coverImages[selectedImageIndex].label}</span>
            </div>

            {/* 图片信息 */}
            <div className="text-center mt-4">
              <p className="text-white text-sm">{SERVICE.coverImages[selectedImageIndex].label}</p>
              <p className="text-white/60 text-xs mt-1">
                {selectedImageIndex + 1} / {SERVICE.coverImages.length}
              </p>
            </div>

            {/* 左右切换按钮 */}
            {SERVICE.coverImages.length > 1 && (
              <>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === 0 ? SERVICE.coverImages.length - 1 : prev - 1))}
                  className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-16 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setSelectedImageIndex((prev) => (prev === SERVICE.coverImages.length - 1 ? 0 : prev + 1))}
                  className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-16 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 抢单码验证弹窗 */}
      {showCodeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            {/* 标题 */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-12 h-12 bg-[#f0faf5] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-[#1dbf73]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">获取抢单码</h3>
            </div>

            {/* 二维码区域 */}
            <div className="bg-[#f5f5f5] rounded-lg p-5 mb-5">
              <div className="w-[200px] h-[200px] mx-auto bg-white rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="customer-service-qrcode.png"
                  alt="客服二维码"
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-center text-sm text-[#1a1a1a] font-medium mt-3">扫码添加客服微信获取抢单码</p>
            </div>

            {/* 输入框 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#1a1a1a] mb-2">
                请输入抢单码
              </label>
              <input
                type="text"
                value={orderCode}
                onChange={(e) => {
                  setOrderCode(e.target.value)
                  setCodeError('')
                }}
                placeholder="例如：TEST001"
                className={`w-full px-4 py-3 rounded-lg border ${codeError ? 'border-red-500' : 'border-[#e4e5e7]'} focus:outline-none focus:ring-2 focus:ring-[#1dbf73] focus:border-transparent transition-all`}
                autoFocus
              />
              {codeError && (
                <p className="text-red-500 text-xs mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {codeError}
                </p>
              )}
            </div>

            {/* 提示信息 */}
            <div className="bg-[#fff7ed] rounded-lg p-3 mb-5 space-y-2">
              <p className="text-xs text-[#74767e] leading-relaxed">
                💡 添加客服后，发送"我要抢单"，客服会提供专属抢单码
              </p>
              <p className="text-xs text-[#f97316] leading-relaxed">
                ⚠️ 每位创作者最多只能同时进行接单3个任务
              </p>
            </div>

            {/* 按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => setShowCodeModal(false)}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleCodeSubmit}
                className="flex-1 py-3 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] transition-colors font-medium"
              >
                确认接单
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
