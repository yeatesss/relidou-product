import { useRef, useState, useEffect } from 'react'
import { Star, CheckCircle } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const creators = [
  {
    id: 1,
    name: '小明影视',
    avatar: '/images/creator-1.jpg',
    title: '视频剪辑师',
    rating: 4.9,
    orders: 328,
    startingPrice: 300,
    skills: ['剪辑', '调色', '特效'],
    verified: true,
  },
  {
    id: 2,
    name: 'Lisa出镜',
    avatar: '/images/creator-2.jpg',
    title: 'UGC创作者',
    rating: 4.8,
    orders: 156,
    startingPrice: 200,
    skills: ['口播', '测评', '种草'],
    verified: true,
  },
  {
    id: 3,
    name: '动画工坊',
    avatar: '/images/creator-3.jpg',
    title: 'MG动画师',
    rating: 5.0,
    orders: 89,
    startingPrice: 800,
    skills: ['MG动画', '动效', '3D'],
    verified: true,
  },
]

export default function TopCreators() {
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

  return (
    <section ref={sectionRef} className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-[#404145] mb-3 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            优秀创作者
          </h2>
          <p
            className={`text-[#74767e] max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            平台认证的专业创作者，为您提供高质量的视频服务
          </p>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {creators.map((creator, index) => (
            <div
              key={creator.id}
              className={`group cursor-pointer transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-white rounded-xl p-6 border border-[#e4e5e7] hover:border-[#1dbf73]/30 hover:shadow-lg transition-all duration-300">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <Avatar className="w-16 h-16 border-2 border-[#1dbf73]/20">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback className="bg-[#f7f7f7] text-[#404145]">
                      {creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-semibold text-[#404145] group-hover:text-[#1dbf73] transition-colors">
                        {creator.name}
                      </h3>
                      {creator.verified && (
                        <CheckCircle className="w-4 h-4 text-[#1dbf73]" />
                      )}
                    </div>
                    <p className="text-sm text-[#74767e]">{creator.title}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 fill-[#ffb33e] text-[#ffb33e]" />
                      <span className="font-semibold text-[#404145]">{creator.rating}</span>
                      <span className="text-sm text-[#74767e]">({creator.orders}单)</span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {creator.skills.map((skill) => (
                    <Badge
                      key={skill}
                      variant="secondary"
                      className="bg-[#f7f7f7] text-[#74767e]"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Footer */}
                <div className="pt-4 border-t border-[#e4e5e7] flex items-center justify-between">
                  <div>
                    <span className="text-sm text-[#74767e]">起步价</span>
                    <div className="text-xl font-bold text-[#1dbf73]">
                      ¥{creator.startingPrice}
                    </div>
                  </div>
                  <button className="px-4 py-2 bg-[#1dbf73] text-white rounded-md text-sm font-medium hover:bg-[#19a463] transition-colors">
                    查看主页
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All */}
        <div className="text-center mt-10">
          <a
            href="#"
            className={`inline-flex items-center gap-2 text-[#1dbf73] font-medium hover:underline transition-all duration-700 delay-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            发现更多创作者
            <span className="text-lg">→</span>
          </a>
        </div>
      </div>
    </section>
  )
}
