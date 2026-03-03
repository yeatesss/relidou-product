import { useRef, useState, useEffect } from 'react'
import { FileText, Users, HandshakeIcon, CheckCircle, ArrowRight } from 'lucide-react'

const steps = [
  {
    id: 1,
    icon: FileText,
    title: '发布需求',
    description: '填写视频要求、预算、交付时间，一键发布订单',
  },
  {
    id: 2,
    icon: Users,
    title: '创作者竞标',
    description: '多位创作者提交方案和报价，供您选择',
  },
  {
    id: 3,
    icon: HandshakeIcon,
    title: '选择合作',
    description: '对比方案，查看作品，选择最适合的创作者',
  },
  {
    id: 4,
    icon: CheckCircle,
    title: '验收交付',
    description: '确认成品满意后，安全支付，交易完成',
  },
]

export default function HowItWorks() {
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
    <section ref={sectionRef} className="py-20 bg-[#003912]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className={`text-2xl sm:text-3xl font-bold text-white mb-3 transition-all duration-700 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            简单四步，轻松搞定视频需求
          </h2>
          <p
            className={`text-white/70 max-w-2xl mx-auto transition-all duration-700 delay-100 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            从发布需求到验收成品，全程透明高效
          </p>
        </div>

        {/* Steps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className={`relative transition-all duration-500 ${
                  isVisible
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-8'
                }`}
                style={{ transitionDelay: `${index * 150}ms` }}
              >
                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%]">
                    <ArrowRight className="w-6 h-6 text-white/30" />
                  </div>
                )}

                <div className="text-center">
                  {/* Icon */}
                  <div className="w-24 h-24 mx-auto mb-6 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-[#1dbf73] transition-colors">
                    <Icon className="w-10 h-10 text-[#1dbf73]" />
                  </div>

                  {/* Step Number */}
                  <div className="w-8 h-8 mx-auto mb-4 bg-[#1dbf73] rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {step.id}
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {step.title}
                  </h3>
                  <p className="text-white/70 text-sm leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
