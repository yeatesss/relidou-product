import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const hotKeywords = [
  '爆款视频裂变',
  '电商KOC种草',
  'UGC优质原创',
  '本地生活探店',
  '小说短剧发行',
]

const trustPlatforms = [
  '抖音',
  '小红书',
  '快手',
  '巨量广告',
  '种草视频',
]

export default function Hero() {
  const [isVisible, setIsVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSearch = (query?: string) => {
    const q = query || searchQuery
    if (q.trim()) {
      navigate(`/orders?q=${encodeURIComponent(q.trim())}`)
    } else {
      navigate('/orders')
    }
  }

  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/hero-bg.jpg"
          alt="Video creator workspace"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#003912]/95 via-[#003912]/88 to-[#0a4226]/75" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
        <div className="max-w-2xl">
          {/* Main Headline */}
          <h1
            className={`text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            释放每一个创意的
            <br />
            <span className="text-[#1dbf73]">商业引力</span>
          </h1>

          {/* Subheadline */}
          <p
            className={`text-lg sm:text-xl text-white/80 mb-8 transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            商业广告视频素材定制撮合服务平台
          </p>

          {/* Search Bar */}
          <div
            className={`mb-5 transition-all duration-700 delay-200 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-xl">
              <input
                type="text"
                placeholder="搜索任何素材要求"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="flex-1 px-5 py-4 text-[#404145] text-base focus:outline-none placeholder-[#b5b6ba]"
              />
              <button
                onClick={() => handleSearch()}
                className="bg-[#1dbf73] hover:bg-[#19a463] transition-colors px-7 py-4 flex items-center gap-2 text-white font-semibold text-base"
              >
                <Search className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Hot Keywords */}
          <div
            className={`flex flex-wrap items-center gap-2 mb-12 transition-all duration-700 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <span className="text-white/60 text-sm font-medium">热门:</span>
            {hotKeywords.map((kw) => (
              <button
                key={kw}
                onClick={() => handleSearch(kw)}
                className="px-3 py-1 rounded-full border border-white/30 text-white/80 text-sm hover:bg-white/15 hover:border-white/60 hover:text-white transition-all"
              >
                {kw}
              </button>
            ))}
          </div>

          {/* Trust Badges */}
          <div
            className={`transition-all duration-700 delay-400 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
          >
            <p className="text-white/50 text-xs mb-3 uppercase tracking-wider">受以下机构信赖</p>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {trustPlatforms.map((platform) => (
                <span
                  key={platform}
                  className="text-white/70 font-semibold text-sm hover:text-white transition-colors"
                >
                  {platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </div>
      </div>
    </section>
  )
}
