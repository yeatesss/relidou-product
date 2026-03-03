import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Star,
  CheckCircle,
  MapPin,
  Calendar,
  MessageCircle,
  Heart,
  Film,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

// ─── Mock 数据 ────────────────────────────────────────────────
const CREATOR = {
  id: 1,
  name: '艾莉森',
  avatar: '艾',
  avatarGradient: 'from-[#1dbf73] to-[#003912]',
  title: '专注电商与本地生活的信息流短视频素材，一站式脚本拍摄剪辑',
  location: '中国 · 广州',
  joinedYear: 2021,
  rating: 4.9,
  reviewCount: 256,
  completedTasks: 500,
  onTimeRate: 97,
  responseTime: '1小时内',
  isOnline: true,
  verified: true,

  about: `我是一名专注于抖音/快手信息流素材制作的独立创作者，深耕电商与本地生活赛道 3 年，累计服务 100+ 品牌客户。

我的内容方向：真人口播、实景探店、剧情种草、产品开箱，擅长以"人货场"拆解思路快速产出高 CTR 素材。

与品牌合作模式：广告主提供 Brief → 我独立完成脚本+拍摄+剪辑 → 72小时内提交初稿 → 按盲盒机制验收。`,

  skills: ['KOC 创作者', '视频剪辑专家', '脚本策划', '实景拍摄'],

  clients: ['抖音', '小红书', '快手', '巨量广告', '种草视频'],

  services: [
    {
      id: 1,
      title: '美妆抖音信息流起量短视频制作',
      platforms: ['抖音', '快手'],
      desc: '含脚本+拍摄+剪辑，4条15s竖版视频，支持2轮修改',
      startPrice: 36,
      rating: 4.9,
      reviewCount: 128,
      bgGradient: 'from-[#003912] to-[#1dbf73]',
    },
    {
      id: 2,
      title: '本地生活探店视频拍摄剪辑',
      platforms: ['小红书', '抖音'],
      desc: '实景出镜探店，适合餐饮/零售/酒店类广告主',
      startPrice: 80,
      rating: 4.8,
      reviewCount: 96,
      bgGradient: 'from-[#1a1a2e] to-[#16213e]',
    },
    {
      id: 3,
      title: '电商产品种草视频KOC真人出镜',
      platforms: ['抖音', '小红书'],
      desc: '真人出镜展示产品，适合电商新品测试投放',
      startPrice: 60,
      rating: 4.9,
      reviewCount: 215,
      bgGradient: 'from-[#2d1b69] to-[#11998e]',
    },
    {
      id: 4,
      title: '快手三农带货视频真人出镜',
      platforms: ['快手'],
      desc: '田园风格真人出镜，适合农产品/食品类投放',
      startPrice: 45,
      rating: 4.7,
      reviewCount: 54,
      bgGradient: 'from-[#c94b4b] to-[#4b134f]',
    },
  ],

  reviews: [
    {
      id: 1,
      author: '张 **',
      authorAvatar: '张',
      rating: 5,
      content:
        '非常专业！按时交付，视频效果超出预期，投放后 CTR 比之前高了40%。后续还会继续合作！',
      date: '2026-02-20',
      taskName: '美妆抖音信息流起量短视频',
    },
    {
      id: 2,
      author: '李 **',
      authorAvatar: '李',
      rating: 5,
      content:
        '沟通顺畅，脚本质量很高，拍摄效率也快。素材验收一次通过，省心省力，强烈推荐！',
      date: '2026-02-15',
      taskName: '本地生活探店视频拍摄',
    },
    {
      id: 3,
      author: '王 **',
      authorAvatar: '王',
      rating: 4,
      content: '整体质量不错，修改了一轮后达到满意效果。时效略慢了点，但最终结果很好。',
      date: '2026-02-10',
      taskName: '电商产品种草视频',
    },
  ],
}

const PLATFORM_COLOR: Record<string, string> = {
  抖音: 'bg-black text-white',
  快手: 'bg-[#FF4906] text-white',
  小红书: 'bg-[#FE2C55] text-white',
  视频号: 'bg-[#07C160] text-white',
  'B站': 'bg-[#00AEEC] text-white',
}

export default function CreatorProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [aboutExpanded, setAboutExpanded] = useState(false)
  const [followed, setFollowed] = useState(false)

  useEffect(() => {
    setIsVisible(true)
    window.scrollTo(0, 0)
    console.log('Creator ID:', id)
  }, [id])

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-20">

      {/* ── Cover Banner ── */}
      <div className="h-36 bg-gradient-to-r from-[#003912] via-[#0a5c2a] to-[#1dbf73] relative">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />
      </div>

      {/* ── 创作者头部信息 ── */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`relative flex flex-col sm:flex-row sm:items-end gap-4 pb-5 transition-all duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            {/* 大头像 */}
            <div className="absolute -top-14 left-0 sm:relative sm:top-auto sm:-mt-14 flex-shrink-0">
              <div className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-gradient-to-br ${CREATOR.avatarGradient} flex items-center justify-center text-white text-4xl font-bold border-4 border-white shadow-lg`}>
                {CREATOR.avatar}
              </div>
              {/* 在线状态 */}
              {CREATOR.isOnline && (
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-[#1dbf73] rounded-full border-2 border-white" />
              )}
            </div>

            {/* 姓名 + 简介 + 元数据 */}
            <div className="flex-1 mt-12 sm:mt-0 sm:ml-3 sm:pb-1">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl font-bold text-[#1a1a1a]">{CREATOR.name}</h1>
                    {CREATOR.verified && (
                      <CheckCircle className="w-5 h-5 text-[#1dbf73] flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-sm text-[#74767e] mb-2 leading-relaxed max-w-xl">{CREATOR.title}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-[#74767e]">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" /> {CREATOR.location}
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> 自 {CREATOR.joinedYear} 年加入
                    </span>
                    <span className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-[#ffb33e] text-[#ffb33e]" />
                      <span className="font-semibold text-[#1a1a1a]">{CREATOR.rating}</span>
                      <span>（{CREATOR.reviewCount} 条评价）</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <Film className="w-3.5 h-3.5" /> 完成 {CREATOR.completedTasks}+ 素材任务
                    </span>
                  </div>
                </div>

                {/* 操作按钮区 */}
                <div className="flex items-center gap-2 sm:flex-shrink-0">
                  <button
                    onClick={() => setFollowed(!followed)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${followed
                      ? 'bg-[#f0faf5] border-[#1dbf73] text-[#1dbf73]'
                      : 'bg-white border-[#e4e5e7] text-[#74767e] hover:border-[#1dbf73] hover:text-[#1dbf73]'
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${followed ? 'fill-[#1dbf73]' : ''}`} />
                    {followed ? '已关注' : '关注'}
                  </button>
                  <button
                    className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[#1dbf73] hover:bg-[#19a463] text-white text-sm font-semibold transition-colors shadow-sm"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageCircle className="w-4 h-4" />
                    联系 TA
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── 双栏主体 ── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* ══════════════════════════════
              左侧主内容
          ══════════════════════════════ */}
          <div className="lg:col-span-2 space-y-6">

            {/* ── 关于我 ── */}
            <Section title="关于我" delay="delay-[100ms]" isVisible={isVisible}>
              <div className={`text-sm text-[#74767e] leading-relaxed whitespace-pre-line overflow-hidden transition-all duration-300 ${aboutExpanded ? 'max-h-[1000px]' : 'max-h-20'}`}>
                {CREATOR.about}
              </div>
              <button
                onClick={() => setAboutExpanded(!aboutExpanded)}
                className="mt-2 flex items-center gap-1 text-sm text-[#1dbf73] font-medium hover:text-[#19a463] transition-colors"
              >
                {aboutExpanded ? <><ChevronUp className="w-4 h-4" />收起</> : <><ChevronDown className="w-4 h-4" />展开全部</>}
              </button>
            </Section>

            {/* ── 技能 ── */}
            <Section title="技能" delay="delay-[150ms]" isVisible={isVisible}>
              <div className="flex flex-wrap gap-2">
                {CREATOR.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 bg-[#f0faf5] text-[#1dbf73] text-sm font-medium rounded-full border border-[#c5e8d5]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </Section>

            {/* ── 我的客户 ── */}
            <Section title="我的客户" delay="delay-[200ms]" isVisible={isVisible}>
              <div className="flex flex-wrap gap-3">
                {CREATOR.clients.map((c) => (
                  <div key={c} className={`px-3 py-1.5 rounded-full text-xs font-semibold ${PLATFORM_COLOR[c] || 'bg-[#f5f5f5] text-[#74767e]'}`}>
                    {c}
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 我的素材任务 ── */}
            <Section title="我的素材任务" delay="delay-[250ms]" isVisible={isVisible}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {CREATOR.services.map((svc, idx) => (
                  <div
                    key={svc.id}
                    onClick={() => navigate(`/orders/${svc.id}`)}
                    className={`bg-white border border-[#e4e5e7] rounded-xl overflow-hidden cursor-pointer hover:border-[#1dbf73]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
                    style={{ transitionDelay: `${350 + idx * 60}ms` }}
                  >
                    {/* 封面 */}
                    <div className={`h-32 bg-gradient-to-br ${svc.bgGradient} flex items-center justify-center relative`}>
                      <div className="text-white/40 text-4xl">▶</div>
                      {/* 平台标签 */}
                      <div className="absolute top-2 left-2 flex gap-1">
                        {svc.platforms.map((p) => (
                          <span key={p} className={`text-xs px-2 py-0.5 rounded-full font-semibold ${PLATFORM_COLOR[p] || 'bg-gray-200 text-gray-700'}`}>
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                    {/* 内容 */}
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-[#1a1a1a] mb-1 line-clamp-2 leading-snug">{svc.title}</h3>
                      <p className="text-xs text-[#74767e] mb-3 line-clamp-2">{svc.desc}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-xs text-[#74767e]">
                          <Star className="w-3 h-3 fill-[#ffb33e] text-[#ffb33e]" />
                          <span className="font-semibold text-[#1a1a1a]">{svc.rating}</span>
                          <span>（{svc.reviewCount}）</span>
                        </div>
                        <div className="text-[#74767e] text-xs">
                          单条起价 <span className="font-bold text-[#1dbf73] text-sm">¥{svc.startPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* ── 来自客户的评价 ── */}
            <Section title={`来自客户的评价（${CREATOR.reviewCount} 条）`} delay="delay-[300ms]" isVisible={isVisible}>
              {/* 总评分展示 */}
              <div className="flex items-center gap-6 p-4 bg-[#f9f9f9] rounded-xl mb-4">
                <div className="text-center">
                  <div className="text-4xl font-bold text-[#1a1a1a]">{CREATOR.rating}</div>
                  <div className="flex gap-0.5 mt-1 justify-center">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className={`w-4 h-4 ${i <= Math.floor(CREATOR.rating) ? 'fill-[#ffb33e] text-[#ffb33e]' : 'text-[#e4e5e7]'}`} />
                    ))}
                  </div>
                  <div className="text-xs text-[#74767e] mt-1">满分 5.0</div>
                </div>
                <div className="flex-1 space-y-1.5">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const pct = star === 5 ? 72 : star === 4 ? 20 : star === 3 ? 6 : 2
                    return (
                      <div key={star} className="flex items-center gap-2 text-xs text-[#74767e]">
                        <span className="w-3">{star}</span>
                        <Star className="w-3 h-3 fill-[#ffb33e] text-[#ffb33e]" />
                        <div className="flex-1 h-1.5 bg-[#e4e5e7] rounded-full overflow-hidden">
                          <div className="h-full bg-[#ffb33e] rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <span className="w-6 text-right">{pct}%</span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* 评价列表 */}
              <div className="space-y-4">
                {CREATOR.reviews.map((review) => (
                  <div key={review.id} className="bg-white border border-[#f0f0f0] rounded-xl p-5">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#1dbf73] to-[#003912] flex items-center justify-center text-white text-sm font-bold">
                          {review.authorAvatar}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#1a1a1a]">{review.author}</div>
                          <div className="flex gap-0.5 mt-0.5">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-[#ffb33e] text-[#ffb33e]' : 'text-[#e4e5e7]'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <span className="text-xs text-[#9ca3af]">{review.date}</span>
                    </div>
                    <p className="text-sm text-[#74767e] leading-relaxed mb-3">{review.content}</p>
                    <span className="inline-block text-xs bg-[#f5f5f5] text-[#74767e] px-2.5 py-1 rounded-full">
                      {review.taskName}
                    </span>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* ══════════════════════════════
              右侧 Sticky 联系卡片
          ══════════════════════════════ */}
          <div>
            <div className={`sticky top-24 space-y-4 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

              {/* 联系卡片主体 */}
              <div className="bg-white rounded-xl border border-[#e4e5e7] shadow-sm overflow-hidden">
                <div className="px-5 pt-5 pb-4 border-b border-[#f0f0f0]">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${CREATOR.avatarGradient} flex items-center justify-center text-white font-bold text-sm`}>
                      {CREATOR.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-[#1a1a1a] text-sm">{CREATOR.name}</div>
                      <div className="flex items-center gap-1 text-xs text-[#74767e]">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#1dbf73] inline-block" />
                        在线中
                      </div>
                    </div>
                  </div>
                  <button
                    className="w-full py-2.5 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-lg font-semibold text-sm transition-colors shadow-sm"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageCircle className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                    联系 TA
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

// ─── Section 容器组件 ──────────────────────────────────────────
function Section({
  title,
  delay,
  isVisible,
  children,
}: {
  title: string
  delay: string
  isVisible: boolean
  children: React.ReactNode
}) {
  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-sm border border-[#e4e5e7] transition-all duration-500 ${delay} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
    >
      <h2 className="text-base font-bold text-[#1a1a1a] mb-4">{title}</h2>
      {children}
    </div>
  )
}
