import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Clock, Users, Banknote } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

const orders = [
  {
    id: 1,
    title: '美妆品牌抖音短视频拍摄',
    budget: '¥800-1500',
    duration: '3天',
    bids: 12,
    tags: ['短视频', '美妆'],
    postedAt: '2小时前',
  },
  {
    id: 2,
    title: '电子产品开箱测评视频',
    budget: '¥1000-2000',
    duration: '5天',
    bids: 8,
    tags: ['测评', '3C数码'],
    postedAt: '4小时前',
  },
  {
    id: 3,
    title: '餐饮品牌宣传片剪辑',
    budget: '¥2000-5000',
    duration: '7天',
    bids: 15,
    tags: ['宣传片', '餐饮'],
    postedAt: '6小时前',
  },
  {
    id: 4,
    title: '服装品牌UGC真人出镜',
    budget: '¥500-1000',
    duration: '2天',
    bids: 20,
    tags: ['UGC', '服装'],
    postedAt: '8小时前',
  },
  {
    id: 5,
    title: 'APP功能演示动画视频',
    budget: '¥3000-8000',
    duration: '10天',
    bids: 6,
    tags: ['MG动画', 'APP'],
    postedAt: '12小时前',
  },
  {
    id: 6,
    title: '家居产品360度展示视频',
    budget: '¥1500-3000',
    duration: '5天',
    bids: 9,
    tags: ['产品展示', '家居'],
    postedAt: '1天前',
  },
]

export default function LatestOrders() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setCanScrollLeft(scrollLeft > 0)
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 360
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  useEffect(() => {
    const scrollEl = scrollRef.current
    if (scrollEl) {
      scrollEl.addEventListener('scroll', checkScroll)
      checkScroll()
      return () => scrollEl.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-16 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2
              className={`text-2xl sm:text-3xl font-bold text-[#404145] mb-2 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              最新订单
            </h2>
            <p
              className={`text-[#74767e] transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              发现优质视频需求，创作者主动竞标
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-[#e4e5e7] bg-white hover:border-[#1dbf73] hover:text-[#1dbf73]'
                  : 'border-[#e4e5e7] text-[#e4e5e7] cursor-not-allowed'
              }`}
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollRight
                  ? 'border-[#e4e5e7] bg-white hover:border-[#1dbf73] hover:text-[#1dbf73]'
                  : 'border-[#e4e5e7] text-[#e4e5e7] cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Orders Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-5 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {orders.map((order, index) => (
            <div
              key={order.id}
              className={`flex-shrink-0 w-80 group cursor-pointer transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-[#1dbf73]/20">
                {/* Tags */}
                <div className="flex gap-2 mb-4">
                  {order.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-[#f7f7f7] text-[#74767e] hover:bg-[#e4e5e7]"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-[#404145] mb-4 line-clamp-2 group-hover:text-[#1dbf73] transition-colors">
                  {order.title}
                </h3>

                {/* Details */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#74767e]">
                      <Banknote className="w-4 h-4" />
                      <span className="text-sm">预算</span>
                    </div>
                    <span className="font-semibold text-[#1dbf73]">{order.budget}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#74767e]">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm">周期</span>
                    </div>
                    <span className="font-medium text-[#404145]">{order.duration}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[#74767e]">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">已投标</span>
                    </div>
                    <span className="font-medium text-[#404145]">{order.bids}人</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#e4e5e7] flex items-center justify-between">
                  <span className="text-sm text-[#74767e]">{order.postedAt}</span>
                  <button className="text-[#1dbf73] text-sm font-medium hover:underline">
                    立即投标
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <a
            href="#"
            className={`inline-flex items-center gap-2 text-[#1dbf73] font-medium hover:underline transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            查看全部订单
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
