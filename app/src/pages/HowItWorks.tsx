import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, FileText, Users, HandshakeIcon, CheckCircle, ArrowRight, Shield, Zap, Headphones } from 'lucide-react'
import { Button } from '@/components/ui/button'

const steps = [
  {
    id: 1,
    icon: FileText,
    title: '发布需求',
    description: '填写视频要求、预算、交付时间，一键发布订单。您可以详细描述视频风格、参考案例、特殊要求等。',
    tips: ['越详细的需求描述，越能吸引合适的创作者', '上传参考视频或图片效果更好'],
  },
  {
    id: 2,
    icon: Users,
    title: '创作者竞标',
    description: '多位创作者查看您的需求后，会提交方案和报价。您可以查看他们的作品集、评价、经验等信息。',
    tips: ['对比多个方案，选择最适合的', '可以主动邀请心仪的创作者投标'],
  },
  {
    id: 3,
    icon: HandshakeIcon,
    title: '选择合作',
    description: '与创作者沟通确认细节后，选择最合适的方案开始合作。平台提供安全的资金托管服务。',
    tips: ['充分沟通后再确认合作', '明确交付时间和修改次数'],
  },
  {
    id: 4,
    icon: CheckCircle,
    title: '验收交付',
    description: '创作者按时交付作品，您验收满意后确认付款。如有问题可申请修改，直到满意为止。',
    tips: ['及时反馈修改意见', '确认满意后再释放款项'],
  },
]

const features = [
  {
    icon: Shield,
    title: '资金安全保障',
    description: '平台托管资金，验收满意后再付款，保障双方权益',
  },
  {
    icon: Zap,
    title: '高效匹配',
    description: '智能推荐合适的创作者，平均2小时内收到投标',
  },
  {
    icon: Headphones,
    title: '专属客服',
    description: '7x24小时客服支持，随时解决您的问题',
  },
]

const faqs = [
  {
    question: '发布订单需要收费吗？',
    answer: '发布订单完全免费。只有当您确认与创作者合作时，才需要支付订单金额，平台会托管资金直到您验收满意。',
  },
  {
    question: '如何选择合适的创作者？',
    answer: '您可以查看创作者的作品集、评价、完成订单数等信息。建议与多位创作者沟通，对比他们的方案和报价后再做决定。',
  },
  {
    question: '如果对作品不满意怎么办？',
    answer: '在订单确认前，您可以要求创作者修改。平台支持多次修改，直到您满意为止。如最终无法达成一致，可申请平台介入处理。',
  },
  {
    question: '创作者多久能交付作品？',
    answer: '交付时间根据项目复杂度而定，一般在订单中会明确约定。简单的短视频1-3天，复杂的宣传片可能需要1-2周。',
  },
]

export default function HowItWorks() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#74767e] hover:text-[#1dbf73] transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            返回
          </button>
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-r from-[#003912] to-[#0a4226] py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className={`text-3xl sm:text-4xl font-bold text-white mb-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            简单四步，轻松搞定视频需求
          </h1>
          <p className={`text-white/70 text-lg transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            从发布需求到验收成品，全程透明高效
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Steps */}
        <div className="space-y-8 mb-16">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div
                key={step.id}
                className={`bg-white rounded-xl p-6 md:p-8 shadow-sm transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                style={{ transitionDelay: `${200 + index * 100}ms` }}
              >
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-[#1dbf73]/10 rounded-2xl flex items-center justify-center">
                      <Icon className="w-8 h-8 text-[#1dbf73]" />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="w-8 h-8 bg-[#1dbf73] text-white rounded-full flex items-center justify-center text-sm font-bold">
                        {step.id}
                      </span>
                      <h2 className="text-xl font-bold text-[#404145]">{step.title}</h2>
                    </div>
                    <p className="text-[#74767e] mb-4 leading-relaxed">{step.description}</p>
                    <div className="bg-[#f7f7f7] rounded-lg p-4">
                      <p className="text-sm text-[#74767e] font-medium mb-2">小贴士：</p>
                      <ul className="space-y-1">
                        {step.tips.map((tip, i) => (
                          <li key={i} className="text-sm text-[#74767e] flex items-start gap-2">
                            <span className="text-[#1dbf73]">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Features */}
        <div className={`mb-16 transition-all duration-500 delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl font-bold text-[#404145] text-center mb-8">平台优势</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div key={index} className="bg-white rounded-xl p-6 shadow-sm text-center">
                  <div className="w-14 h-14 bg-[#1dbf73]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-[#1dbf73]" />
                  </div>
                  <h3 className="font-semibold text-[#404145] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[#74767e]">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* FAQ */}
        <div className={`mb-16 transition-all duration-500 delay-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl font-bold text-[#404145] text-center mb-8">常见问题</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-[#f7f7f7] transition-colors"
                >
                  <span className="font-medium text-[#404145]">{faq.question}</span>
                  <span className={`text-2xl text-[#74767e] transition-transform ${openFaq === index ? 'rotate-45' : ''}`}>
                    +
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-5 pb-5">
                    <p className="text-[#74767e] leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className={`text-center transition-all duration-500 delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-2xl font-bold text-[#404145] mb-4">准备好开始了吗？</h2>
          <p className="text-[#74767e] mb-6">立即发布您的第一个视频订单</p>
          <Button
            onClick={() => navigate('/post-order')}
            className="bg-[#1dbf73] hover:bg-[#19a463] text-white px-8 py-6 text-lg"
          >
            免费发布订单
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  )
}
