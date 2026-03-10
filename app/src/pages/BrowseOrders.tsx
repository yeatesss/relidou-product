import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

// ─── 平台 Tabs ────────────────────────────────────────────────
const platformTabs = ['全部', '抖音', '快手', '小红书', '视频号']

const platformColors: Record<string, string> = {
  抖音: 'bg-black text-white',
  快手: 'bg-[#FF4906] text-white',
  小红书: 'bg-[#FE2C55] text-white',
  视频号: 'bg-[#07C160] text-white',
}

const platformDot: Record<string, string> = {
  抖音: 'bg-black',
  快手: 'bg-[#FF4906]',
  小红书: 'bg-[#FE2C55]',
  视频号: 'bg-[#07C160]',
}

// ─── Mock 数据 ────────────────────────────────────────────────
const ALL_TASKS = [
  {
    id: 1,
    title: '美妆抖音信息流视频素材制作',
    platforms: ['抖音', '快手'],
    creator: { name: '小鱼工作室', avatar: '鱼', rating: 4.9, reviews: 128 },
    price: 200,
    duration: '普通72小时',
    isUrgent: false,
  },
  {
    id: 2,
    title: '本地生活探店视频拍摄剪辑',
    platforms: ['小红书', '抖音'],
    creator: { name: '探店达人小王', avatar: '王', rating: 4.8, reviews: 96 },
    price: 300,
    duration: '普通72小时',
    isUrgent: false,
  },
  {
    id: 3,
    title: '电商产品种草视频KOC真人出镜',
    platforms: ['抖音', '小红书'],
    creator: { name: '种草女王', avatar: '草', rating: 4.9, reviews: 215 },
    price: 150,
    duration: '加急48小时',
    isUrgent: true,
  },
  {
    id: 4,
    title: '小说短剧情演绎视频制作',
    platforms: ['抖音', '快手'],
    creator: { name: '短剧工厂', avatar: '剧', rating: 4.7, reviews: 73 },
    price: 500,
    duration: '普通72小时',
    isUrgent: false,
  },
  {
    id: 5,
    title: '品牌宣传片创意视频拍摄',
    platforms: ['抖音', '视频号'],
    creator: { name: '创意视觉', avatar: '创', rating: 4.8, reviews: 187 },
    price: 800,
    duration: '普通72小时',
    isUrgent: false,
  },
  {
    id: 6,
    title: '快手三农带货视频真人出镜',
    platforms: ['快手'],
    creator: { name: '乡村小哥', avatar: '哥', rating: 4.6, reviews: 54 },
    price: 120,
    duration: '加急48小时',
    isUrgent: true,
  },
  {
    id: 7,
    title: '小红书种草图文+视频全套',
    platforms: ['小红书'],
    creator: { name: '小红书达人', avatar: '红', rating: 4.9, reviews: 302 },
    price: 250,
    duration: '普通72小时',
    isUrgent: false,
  },
  {
    id: 9,
    title: '游戏类信息流竖屏素材制作',
    platforms: ['抖音', '快手'],
    creator: { name: '游戏工作室', avatar: '游', rating: 4.8, reviews: 89 },
    price: 180,
    duration: '特急24小时',
    isUrgent: true,
  },
  {
    id: 10,
    title: '金融行业合规口播视频',
    platforms: ['抖音', '视频号'],
    creator: { name: '财经达人', avatar: '财', rating: 5.0, reviews: 67 },
    price: 600,
    duration: '普通72小时',
    isUrgent: false,
  },
  {
    id: 11,
    title: '美食商家探店种草短视频',
    platforms: ['抖音', '小红书'],
    creator: { name: '美食达人', avatar: '食', rating: 4.9, reviews: 241 },
    price: 280,
    duration: '加急48小时',
    isUrgent: true,
  },
  {
    id: 12,
    title: '服装穿搭视频UGC素材采集',
    platforms: ['小红书', '抖音'],
    creator: { name: '时尚博主', avatar: '尚', rating: 4.6, reviews: 112 },
    price: 90,
    duration: '普通72小时',
    isUrgent: false,
  },
]

const PAGE_SIZE = 8

// 排序选项
const sortOptions = ['成交最多', '佣金从低到高', '佣金从高到低', '最新上架']

// 服务选项
const serviceOptions = ['不限', '爆款复刻', '原创内容']

// 佣金范围
const commissionRanges = ['不限', '¥100以下', '¥100-300', '¥300-600', '¥600以上']

// 交付时间
const deliveryOptions = ['不限', '普通（72小时）', '加急（48小时）', '特急（24小时）']

export default function BrowseOrders() {
  const navigate = useNavigate()

  const [selectedPlatform, setSelectedPlatform] = useState('全部')
  const [serviceType, setServiceType] = useState('不限')
  const [commissionRange, setCommissionRange] = useState('不限')
  const [deliveryTime, setDeliveryTime] = useState('不限')
  const [sortBy, setSortBy] = useState('成交最多')
  const [currentPage, setCurrentPage] = useState(1)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // 筛选逻辑
  const filtered = ALL_TASKS.filter((task) => {
    if (selectedPlatform !== '全部' && !task.platforms.includes(selectedPlatform)) return false
    if (deliveryTime !== '不限') {
      if (deliveryTime === '特急（24小时）' && !task.duration.includes('特急')) return false
      if (deliveryTime === '加急（48小时）' && !task.duration.includes('加急')) return false
      if (deliveryTime === '普通（72小时）' && !task.duration.includes('普通')) return false
    }
    if (commissionRange !== '不限') {
      if (commissionRange === '¥100以下' && task.price >= 100) return false
      if (commissionRange === '¥100-300' && (task.price < 100 || task.price > 300)) return false
      if (commissionRange === '¥300-600' && (task.price < 300 || task.price > 600)) return false
      if (commissionRange === '¥600以上' && task.price <= 600) return false
    }
    return true
  })

  // 排序
  const sorted = [...filtered].sort((a, b) => {
    if (sortBy === '佣金从低到高') return a.price - b.price
    if (sortBy === '佣金从高到低') return b.price - a.price
    if (sortBy === '最新上架') return b.id - a.id
    return b.creator.reviews - a.creator.reviews // 成交最多
  })

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  const handlePlatformChange = (p: string) => {
    setSelectedPlatform(p)
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* ── 平台 Tabs ── */}
        <div
          className={`flex flex-wrap gap-2 mb-4 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          {platformTabs.map((p) => (
            <button
              key={p}
              onClick={() => handlePlatformChange(p)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-all duration-200 ${selectedPlatform === p
                  ? 'bg-[#1dbf73] text-white border-[#1dbf73] shadow-sm'
                  : 'bg-white text-[#404145] border-[#e4e5e7] hover:border-[#1dbf73] hover:text-[#1dbf73]'
                }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* ── 筛选条 ── */}
        <div
          className={`bg-white rounded-xl px-5 py-3 mb-4 flex flex-wrap items-center gap-3 border border-[#e4e5e7] transition-all duration-500 delay-150 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          {/* 服务选项 */}
          <DropdownFilter
            label="服务选项"
            options={serviceOptions}
            value={serviceType}
            onChange={(v) => { setServiceType(v); setCurrentPage(1) }}
          />

          {/* 佣金范围 */}
          <DropdownFilter
            label="佣金范围"
            options={commissionRanges}
            value={commissionRange}
            onChange={(v) => { setCommissionRange(v); setCurrentPage(1) }}
          />

          {/* 交付时间 */}
          <DropdownFilter
            label="交付时间"
            options={deliveryOptions}
            value={deliveryTime}
            onChange={(v) => { setDeliveryTime(v); setCurrentPage(1) }}
          />
        </div>

        {/* ── 结果数 + 排序 ── */}
        <div
          className={`flex items-center justify-between mb-4 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100' : 'opacity-0'
            }`}
        >
          <span className="text-sm text-[#74767e]">
            共 <span className="font-semibold text-[#1a1a1a]">{sorted.length.toLocaleString()}</span> 条结果
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-[#74767e]">排序：</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-1.5 text-sm border border-[#e4e5e7] rounded-lg bg-white text-[#404145] focus:outline-none focus:border-[#1dbf73] cursor-pointer"
              >
                {sortOptions.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#74767e] pointer-events-none" />
            </div>
          </div>
        </div>

        {/* ── 任务卡片列表 ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {paginated.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              isVisible={isVisible}
              onClick={() => navigate(`/orders/${task.id}`)}
            />
          ))}
        </div>

        {/* 空状态 */}
        {sorted.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-[#f0faf5] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-7 h-7 text-[#1dbf73]" />
            </div>
            <h3 className="text-base font-semibold text-[#404145] mb-1">没有找到匹配的任务</h3>
            <p className="text-sm text-[#74767e]">尝试调整筛选条件或搜索关键词</p>
          </div>
        )}

        {/* ── 分页 ── */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  )
}

// ─── 下拉筛选组件 ────────────────────────────────────────────
function DropdownFilter({
  label,
  options,
  value,
  onChange,
}: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none pl-3 pr-7 py-2 text-sm border border-[#e4e5e7] rounded-lg bg-white text-[#404145] focus:outline-none focus:border-[#1dbf73] cursor-pointer hover:border-[#1dbf73] transition-colors"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o === '不限' ? `${label}` : o}
          </option>
        ))}
      </select>
      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9ca3af] pointer-events-none" />
    </div>
  )
}

// ─── 任务卡片组件 ────────────────────────────────────────────
function TaskCard({
  task,
  index,
  isVisible,
  onClick,
}: {
  task: (typeof ALL_TASKS)[0]
  index: number
  isVisible: boolean
  onClick: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#e4e5e7] hover:border-[#1dbf73]/40 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 cursor-pointer flex flex-col overflow-hidden ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      style={{ transitionDelay: `${250 + index * 60}ms` }}
    >
      {/* 卡片主体 */}
      <div className="p-4 flex-1">
        {/* 服务标题 */}
        <h3 className="font-semibold text-[#1a1a1a] text-sm leading-snug mb-3 line-clamp-2 group-hover:text-[#1dbf73]">
          {task.title}
        </h3>

        {/* 发布平台 */}
        <div className="flex items-center gap-1.5 flex-wrap mb-3">
          <span className="text-xs text-[#74767e]">发布平台：</span>
          {task.platforms.map((p) => (
            <span
              key={p}
              className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${platformColors[p] || 'bg-gray-100 text-gray-600'}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${platformDot[p] || 'bg-gray-400'} opacity-70`} />
              {p}
            </span>
          ))}
        </div>

        {/* 价格 + 时效 */}
        <div className="flex items-end justify-between mt-auto">
          <div>
            <div className="text-xs text-[#9ca3af] mb-0.5">佣金价格</div>
            <div className="text-lg font-bold text-[#1dbf73]">¥{task.price}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-[#9ca3af] mb-0.5">时效</div>
            <div className="flex items-center gap-1 text-xs text-[#74767e]">
              {task.isUrgent && (
                <span className="w-1.5 h-1.5 rounded-full bg-[#ef4444] inline-block" />
              )}
              {task.duration}
            </div>
          </div>
        </div>
      </div>

      {/* 按钮 */}
      <div className="px-4 pb-4">
        <button
          onClick={(e) => { e.stopPropagation(); onClick() }}
          className="w-full py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white text-sm font-semibold rounded-lg transition-colors"
        >
          立即查看
        </button>
      </div>
    </div>
  )
}

// ─── 分页组件 ────────────────────────────────────────────────
function Pagination({
  currentPage,
  totalPages,
  onChange,
}: {
  currentPage: number
  totalPages: number
  onChange: (p: number) => void
}) {
  const getPages = () => {
    const pages: (number | '...')[] = []
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      pages.push(1)
      if (currentPage > 3) pages.push('...')
      for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
        pages.push(i)
      }
      if (currentPage < totalPages - 2) pages.push('...')
      pages.push(totalPages)
    }
    return pages
  }

  return (
    <div className="flex items-center justify-center gap-1.5">
      {/* 上一页 */}
      <button
        onClick={() => onChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm border border-[#e4e5e7] rounded-lg text-[#404145] hover:border-[#1dbf73] hover:text-[#1dbf73] disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
      >
        <ChevronLeft className="w-4 h-4" />
        上一页
      </button>

      {/* 页码 */}
      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`dots-${i}`} className="px-3 py-2 text-sm text-[#74767e]">
            …
          </span>
        ) : (
          <button
            key={page}
            onClick={() => onChange(page as number)}
            className={`w-9 h-9 text-sm rounded-lg border transition-colors font-medium ${currentPage === page
                ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                : 'bg-white text-[#404145] border-[#e4e5e7] hover:border-[#1dbf73] hover:text-[#1dbf73]'
              }`}
          >
            {page}
          </button>
        )
      )}

      {/* 下一页 */}
      <button
        onClick={() => onChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm border border-[#e4e5e7] rounded-lg text-[#404145] hover:border-[#1dbf73] hover:text-[#1dbf73] disabled:opacity-40 disabled:cursor-not-allowed transition-colors bg-white"
      >
        下一页
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
