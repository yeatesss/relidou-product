import { useRef, useState, useEffect } from 'react'
import { Star, Quote } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const testimonials = [
  {
    id: 1,
    content: '发布订单后2小时就有10个创作者投标，最终选的视频非常满意！平台效率真的很高。',
    author: '张女士',
    role: '某美妆品牌负责人',
    avatar: '/images/creator-2.jpg',
    rating: 5,
    type: 'brand',
  },
  {
    id: 2,
    content: '平台订单质量高，结款快，已经在这里接了50多单了。作为创作者，这里是我主要的收入来源。',
    author: '小王',
    role: '视频剪辑师',
    avatar: '/images/creator-1.jpg',
    rating: 5,
    type: 'creator',
  },
  {
    id: 3,
    content: '比找广告公司便宜一半，效果还更好。创作者们都很专业，沟通也很顺畅。',
    author: '李先生',
    role: '某电商卖家',
    avatar: '/images/creator-3.jpg',
    rating: 5,
    type: 'brand',
  },
]

export default function Testimonials() {
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
    <section ref={sectionRef} className="py-16 bg-[#f7f7f7]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-[#404145] mb-3 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            用户真实评价
          </h2>
          <p
            className={`text-[#74767e] transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            听听他们怎么说
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.id}
              className={`transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-8'
              }`}
              style={{ transitionDelay: `${index * 150}ms` }}
            >
              <div className="bg-white rounded-xl p-6 h-full hover:shadow-lg transition-shadow">
                {/* Quote Icon */}
                <Quote className="w-8 h-8 text-[#1dbf73]/20 mb-4" />

                {/* Content */}
                <p className="text-[#404145] mb-6 leading-relaxed">
                  "{testimonial.content}"
                </p>

                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-[#ffb33e] text-[#ffb33e]"
                    />
                  ))}
                </div>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={testimonial.avatar} alt={testimonial.author} />
                    <AvatarFallback className="bg-[#f7f7f7] text-[#404145]">
                      {testimonial.author[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-[#404145]">
                      {testimonial.author}
                    </div>
                    <div className="text-sm text-[#74767e]">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
