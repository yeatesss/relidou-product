import { useRef, useState, useEffect } from 'react'

const brands = [
  { name: '阿里巴巴', logo: 'Alibaba' },
  { name: '字节跳动', logo: 'ByteDance' },
  { name: '美团', logo: 'Meituan' },
  { name: '拼多多', logo: 'PDD' },
  { name: '小红书', logo: 'XHS' },
  { name: '抖音', logo: 'Douyin' },
  { name: '快手', logo: 'Kuaishou' },
  { name: 'B站', logo: 'Bilibili' },
]

export default function TrustBadges() {
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
            受到众多品牌信赖
          </h2>
          <p
            className={`text-[#74767e] transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            已有超过 1000+ 品牌选择创影汇
          </p>
        </div>

        {/* Brand Logos */}
        <div className="grid grid-cols-4 md:grid-cols-8 gap-8 items-center">
          {brands.map((brand, index) => (
            <div
              key={brand.name}
              className={`flex items-center justify-center transition-all duration-500 ${
                isVisible
                  ? 'opacity-100 translate-y-0'
                  : 'opacity-0 translate-y-4'
              }`}
              style={{ transitionDelay: `${index * 80}ms` }}
            >
              <div className="w-full aspect-[3/1] bg-[#f7f7f7] rounded-lg flex items-center justify-center hover:bg-[#e4e5e7] transition-colors">
                <span className="text-[#74767e] font-semibold text-sm md:text-base">
                  {brand.logo}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
