import { useRef, useState, useEffect } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.3 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      ref={sectionRef}
      className="py-24 bg-gradient-to-r from-[#003912] via-[#0a4226] to-[#1a5c37] relative overflow-hidden"
    >
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-[#1dbf73]/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-[#1dbf73]/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Headline */}
        <h2
          className={`text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 leading-tight transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          收入，触手可及
          <span className="mx-3 text-[#1dbf73] opacity-60">|</span>
          爆量，如此简单
        </h2>

        {/* Subheadline */}
        <p
          className={`text-lg text-white/70 mb-10 transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          加入热力豆平台，与 10,000+ 创作者一起，连接商业广告的无限可能
        </p>

        {/* CTA Button */}
        <div
          className={`flex flex-col sm:flex-row gap-4 justify-center transition-all duration-700 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
        >
          <button
            onClick={() => navigate('/register')}
            className="group inline-flex items-center justify-center gap-2 bg-[#1dbf73] hover:bg-[#19a463] text-white font-bold text-lg px-10 py-4 rounded-lg shadow-xl shadow-[#1dbf73]/30 hover:scale-105 transition-all duration-200"
          >
            加入热力豆
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  )
}
