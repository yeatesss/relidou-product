import { useRef, useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, ShoppingBag, Sparkles, UserCircle, Smartphone, Package, Play, Radio, Mic, Box } from 'lucide-react'

const categories = [
  {
    id: 1,
    name: '产品展示视频',
    icon: ShoppingBag,
    image: '/images/category-product.jpg',
  },
  {
    id: 2,
    name: '品牌宣传视频',
    icon: Sparkles,
    image: '/images/category-brand.jpg',
  },
  {
    id: 3,
    name: 'UGC真人出镜',
    icon: UserCircle,
    image: '/images/category-ugc.jpg',
  },
  {
    id: 4,
    name: '短视频广告',
    icon: Smartphone,
    image: '/images/category-short.jpg',
  },
  {
    id: 5,
    name: '电商主图视频',
    icon: Package,
    image: '/images/category-ecommerce.jpg',
  },
  {
    id: 6,
    name: '动画/MG视频',
    icon: Play,
    image: '/images/category-animation.jpg',
  },
  {
    id: 7,
    name: '直播切片',
    icon: Radio,
    image: '/images/category-live.jpg',
  },
  {
    id: 8,
    name: '口播视频',
    icon: Mic,
    image: '/images/category-koubo.jpg',
  },
  {
    id: 9,
    name: '3D产品渲染',
    icon: Box,
    image: '/images/category-3d.jpg',
  },
]

export default function Categories() {
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
      const scrollAmount = 280
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
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-[#404145] transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            热门视频类型
          </h2>
          <div className="flex gap-2">
            <button
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`w-10 h-10 rounded-full border flex items-center justify-center transition-all ${
                canScrollLeft
                  ? 'border-[#e4e5e7] hover:border-[#1dbf73] hover:text-[#1dbf73]'
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
                  ? 'border-[#e4e5e7] hover:border-[#1dbf73] hover:text-[#1dbf73]'
                  : 'border-[#e4e5e7] text-[#e4e5e7] cursor-not-allowed'
              }`}
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Categories Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4 sm:-mx-0 sm:px-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categories.map((category, index) => {
            const Icon = category.icon
            return (
              <div
                key={category.id}
                className={`flex-shrink-0 w-64 group cursor-pointer transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div className="relative h-80 rounded-2xl overflow-hidden bg-[#003912]">
                  {/* Background Image */}
                  <img
                    src={category.image}
                    alt={category.name}
                    className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-110 transition-all duration-500"
                  />
                  
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#003912] via-[#003912]/50 to-transparent" />
                  
                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-between">
                    <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-[#1dbf73] transition-colors">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-[#1dbf73] transition-colors">
                        {category.name}
                      </h3>
                      <div className="flex items-center text-white/60 text-sm group-hover:text-white/80 transition-colors">
                        <span>浏览订单</span>
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
