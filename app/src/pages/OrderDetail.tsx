import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ChevronRight,
  Star,
  Clock,
  Film,
  Mic,
  Monitor,
  AlertCircle,
  ChevronLeft,
  Bot,
  Maximize2,
} from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

// ─── Mock 数据 ────────────────────────────────────────────────
const SERVICE = {
  id: 1,
  title: '美妆抖音信息流 15s 起量短视频制作（含脚本+拍摄+剪辑）',
  rating: 4.9,
  reviewCount: 256,
  submissionsReceived: 180,
  submissionsAccepted: 162,

  advertiser: {
    name: 'glee Creative Studio',
    avatar: '创',
    acceptanceRate: 90,
    avgReviewTime: '3小时',
    totalOrders: 48,
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
    desc: '100字左右的简单用户生成内容视频，可以在家里或办公室拍摄',
    items: '4 条 15s 竖版信息流视频',
    duration: '72小时',
    acceptAI: '不接受',
    scene: '不限',
    style: '不限',
    dubbing: '普通话',
  },

  description: `**任务说明**
本任务面向有抖音信息流投放需求的广告主，创作者需根据品牌提供的产品资料和投放目标，独立完成脚本策划、拍摄和剪辑。

**交付规范**
- 视频尺寸：1080×1920（9:16 竖版）
- 时长：13-17 秒（平台推荐区间）
- 格式：MP4，不低于 1080P
- 不允许使用 AI 换脸、AI 配音

**协同方式**
接单后广告主将在 24 小时内发送产品资料与投放 Brief，创作者按约定时效提交初稿，广告主按盲盒机制审片验收。`,
}

export default function OrderDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isAuthenticated } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [activeImage, setActiveImage] = useState(0)
  const [ordered, setOrdered] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

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
    setShowConfirmModal(true)
  }

  const handleConfirmOrder = () => {
    setShowConfirmModal(false)
    setOrdered(true)
    // 跳转到创作者工作台
    setTimeout(() => {
      navigate('/creator-workspace')
    }, 500)
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
              左侧主内容：标题 / 广告主 / 主视觉 / 服务详情
          ═══════════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── 服务标题 ── */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <h1 className="text-xl sm:text-2xl font-bold text-[#1a1a1a] leading-snug">
                {SERVICE.title}
              </h1>
            </div>

            {/* ── 广告主信息区（含评分） ── */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-500 delay-75 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                {/* 头像 + 名称 + 评分 */}
                <div
                  className="flex items-center gap-3 cursor-pointer group"
                  onClick={() => navigate('/creators/1')}
                >
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1dbf73] to-[#003912] flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {SERVICE.advertiser.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-[#1a1a1a] group-hover:text-[#1dbf73] transition-colors">
                      {SERVICE.advertiser.name}
                    </div>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-[#ffb33e] text-[#ffb33e]" />
                      <span className="text-sm font-medium text-[#1a1a1a]">{SERVICE.rating}</span>
                      <span className="text-xs text-[#74767e]">（{SERVICE.reviewCount} 条评价）</span>
                    </div>
                  </div>
                </div>

                {/* 数据指标 */}
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#1a1a1a]">
                      {SERVICE.advertiser.acceptanceRate}%
                    </div>
                    <div className="text-xs text-[#74767e] mt-0.5">验收通过率</div>
                  </div>
                  <div className="w-px h-6 bg-[#e4e5e7]" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#1a1a1a]">
                      {SERVICE.advertiser.avgReviewTime}
                    </div>
                    <div className="text-xs text-[#74767e] mt-0.5">平均验收时间</div>
                  </div>
                  <div className="w-px h-6 bg-[#e4e5e7]" />
                  <div className="text-center">
                    <div className="text-lg font-bold text-[#1a1a1a]">
                      {SERVICE.advertiser.totalOrders}
                    </div>
                    <div className="text-xs text-[#74767e] mt-0.5">累计成交</div>
                  </div>
                </div>
              </div>
            </div>

            {/* ── 主视觉区 ── */}
            <div
              className={`bg-white rounded-xl overflow-hidden shadow-sm transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              {/* 主图 */}
              <div
                className={`relative w-full h-72 sm:h-96 bg-gradient-to-br ${SERVICE.coverImages[activeImage].bg} flex items-center justify-center`}
              >
                <div className="text-center text-white/80">
                  <Maximize2 className="w-10 h-10 mx-auto mb-2 opacity-40" />
                  <div className="text-sm opacity-60">{SERVICE.coverImages[activeImage].label}</div>
                  <div className="text-xs opacity-40 mt-1">素材封面预览</div>
                </div>
                {/* 角标 */}
                <div className="absolute top-4 left-4 bg-[#1dbf73] text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
                  起量素材
                </div>
                {/* 切换箭头 */}
                <button
                  onClick={() =>
                    setActiveImage((prev) => (prev - 1 + SERVICE.coverImages.length) % SERVICE.coverImages.length)
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setActiveImage((prev) => (prev + 1) % SERVICE.coverImages.length)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-black/30 hover:bg-black/50 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                {/* 进度指示 */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {SERVICE.coverImages.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      className={`rounded-full transition-all ${i === activeImage ? 'w-5 h-2 bg-white' : 'w-2 h-2 bg-white/50'
                        }`}
                    />
                  ))}
                </div>
              </div>
              {/* 缩略图轨道 */}
              <div className="flex gap-2 p-3 overflow-x-auto bg-[#fafafa]">
                {SERVICE.coverImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`flex-shrink-0 w-16 h-12 rounded-lg bg-gradient-to-br ${img.bg} border-2 transition-all ${activeImage === i
                        ? 'border-[#1dbf73] scale-105 shadow-sm'
                        : 'border-transparent opacity-55 hover:opacity-90'
                      }`}
                  />
                ))}
              </div>
            </div>

            {/* ── 服务详情描述 ── */}
            <div
              className={`bg-white rounded-xl p-6 shadow-sm transition-all duration-500 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <h2 className="text-base font-bold text-[#1a1a1a] mb-4">服务详情</h2>
              <div className="text-sm text-[#74767e] leading-relaxed whitespace-pre-line">
                {SERVICE.description}
              </div>
            </div>
          </div>

          {/* ═══════════════════════════════════
              右侧 sticky：任务信息区（当前任务）
          ═══════════════════════════════════ */}
          <div>
            <div
              className={`sticky top-24 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                }`}
            >
              <div className="bg-white rounded-xl shadow-sm border border-[#e4e5e7] overflow-hidden">

                {/* 区块标题 */}
                <div className="px-5 pt-5 pb-4 border-b border-[#f0f0f0]">
                  <div className="flex items-center justify-between mb-0.5">
                    <h2 className="font-bold text-[#1a1a1a] text-base">当前任务</h2>
                    <span className="text-xs text-[#74767e] bg-[#f5f5f5] px-2.5 py-1 rounded-full">
                      已投稿 {SERVICE.submissionsReceived} 单
                    </span>
                  </div>
                  <p className="text-xs text-[#74767e]">
                    已验收 {SERVICE.submissionsAccepted}/{SERVICE.submissionsReceived} 单
                  </p>
                </div>

                {/* 佣金价格区 */}
                <div className="px-5 pt-4 pb-4 bg-[#f0faf5] border-b border-[#d4f0e3]">
                  <div className="text-xs text-[#74767e] mb-1">佣金价格</div>
                  <div className="text-3xl font-bold text-[#1dbf73] mb-2">¥{SERVICE.task.price}</div>
                  <div className="flex gap-4 text-sm">
                    <div>
                      <span className="text-[#74767e] text-xs">第一次验收预估</span>
                      <div className="font-semibold text-[#1a1a1a]">¥{SERVICE.task.firstReviewPrice}</div>
                    </div>
                    <div className="w-px bg-[#c5e8d5]" />
                    <div>
                      <span className="text-[#74767e] text-xs">第二次验收预估</span>
                      <div className="font-semibold text-[#1a1a1a]">¥{SERVICE.task.secondReviewPrice}</div>
                    </div>
                  </div>
                </div>

                {/* 简要描述 */}
                <div className="px-5 py-4 border-b border-[#f0f0f0]">
                  <p className="text-sm text-[#74767e] leading-relaxed">{SERVICE.task.desc}</p>
                </div>

                {/* 任务参数列表 */}
                <div className="px-5 pt-4 pb-2 space-y-0">
                  {[
                    { icon: <Film className="w-4 h-4 text-[#1dbf73]" />, label: '素材条数', value: SERVICE.task.items },
                    { icon: <Clock className="w-4 h-4 text-[#1dbf73]" />, label: '出片时间', value: SERVICE.task.duration },
                    { icon: <Bot className="w-4 h-4 text-[#1dbf73]" />, label: 'AI 创作', value: SERVICE.task.acceptAI },
                    { icon: <Monitor className="w-4 h-4 text-[#1dbf73]" />, label: '场景要求', value: SERVICE.task.scene },
                    { icon: <AlertCircle className="w-4 h-4 text-[#1dbf73]" />, label: '视频风格', value: SERVICE.task.style },
                    { icon: <Mic className="w-4 h-4 text-[#1dbf73]" />, label: '配音要求', value: SERVICE.task.dubbing },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="flex items-center justify-between py-2.5 border-b border-[#f5f5f5] last:border-0"
                    >
                      <div className="flex items-center gap-2 text-[#74767e] text-sm">
                        {row.icon}
                        <span>{row.label}</span>
                      </div>
                      <span className="text-sm font-medium text-[#1a1a1a]">{row.value}</span>
                    </div>
                  ))}
                </div>

                {/* 立即下单按钮 */}
                <div className="px-5 pb-5 pt-3">
                  <button
                    onClick={handleOrderClick}
                    disabled={ordered}
                    className={`w-full py-3.5 rounded-xl font-bold text-base transition-all duration-200 ${ordered
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

      {/* 接单确认弹窗 */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#fff7ed] rounded-full flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-6 h-6 text-[#f97316]" />
              </div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">确认接单</h3>
            </div>
            <p className="text-[#74767e] text-sm leading-relaxed mb-6">
              每位创作者只能同时进行接单3个任务，确认接单吗？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
              >
                取消
              </button>
              <button
                onClick={handleConfirmOrder}
                className="flex-1 py-2.5 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] transition-colors font-medium"
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
