import { useRef, useState, useEffect } from 'react'
import { ShieldCheck, Eye, Lock, LayoutGrid } from 'lucide-react'

const advantages = [
    {
        icon: ShieldCheck,
        title: '过审内容获取保底收益',
        desc: '稿件验收后必得稿费，还有消耗激励金',
    },
    {
        icon: Eye,
        title: '首创盲盒审片机制',
        desc: '沉浸式内容审核，聚焦优质内容',
    },
    {
        icon: Lock,
        title: '首创双段确权交易',
        desc: '杜绝"白嫖"可能，让创作者无后顾之忧',
    },
    {
        icon: LayoutGrid,
        title: '灵活的接单模式',
        desc: '按项目获取收益，多劳多得',
    },
]

export default function SolutionSection() {
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
            { threshold: 0.15 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} className="py-20 bg-[#f0faf5]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col lg:flex-row gap-12 items-center">
                    {/* Left: Text Content */}
                    <div className="flex-1">
                        {/* Tag */}
                        <div
                            className={`inline-flex items-center gap-1.5 mb-5 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                        >
                            <span className="bg-[#1dbf73] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wide">
                                限时0手续费
                            </span>
                        </div>

                        {/* Title */}
                        <h2
                            className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-[#003912] mb-3 leading-snug transition-all duration-700 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                }`}
                        >
                            面向创作者/OPC的
                            <br />
                            <span className="text-[#1dbf73]">一站式内容变现平台</span>
                        </h2>

                        {/* Separator */}
                        <div
                            className={`w-12 h-1 bg-[#1dbf73] rounded mb-8 transition-all duration-700 delay-150 ${isVisible ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
                                }`}
                            style={{ transformOrigin: 'left' }}
                        />

                        {/* Advantages */}
                        <div className="flex flex-col gap-6">
                            {advantages.map((item, index) => {
                                const Icon = item.icon
                                return (
                                    <div
                                        key={item.title}
                                        className={`flex items-start gap-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-6'
                                            }`}
                                        style={{ transitionDelay: `${200 + index * 100}ms` }}
                                    >
                                        <div className="w-11 h-11 flex-shrink-0 bg-[#1dbf73]/15 rounded-xl flex items-center justify-center">
                                            <Icon className="w-5 h-5 text-[#1dbf73]" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-[#003912] text-base mb-0.5">
                                                {item.title}
                                            </h3>
                                            <p className="text-[#74767e] text-sm leading-relaxed">{item.desc}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* Right: Visual Card */}
                    <div
                        className={`flex-1 flex justify-center transition-all duration-700 delay-300 ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-8 scale-95'
                            }`}
                    >
                        <div className="relative w-full max-w-md">
                            {/* Main Card */}
                            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#e4f5ec]">
                                <div className="bg-gradient-to-br from-[#003912] to-[#1a5c37] p-8 text-white">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-[#1dbf73] rounded-lg flex items-center justify-center">
                                            <span className="text-white font-bold text-lg">热</span>
                                        </div>
                                        <div>
                                            <div className="text-sm font-medium opacity-80">热力豆</div>
                                            <div className="text-xs opacity-60">创作者版</div>
                                        </div>
                                    </div>
                                    <p className="text-2xl font-bold leading-snug mb-2">
                                        创作即收益
                                        <br />
                                        <span className="text-[#1dbf73]">每单都有保障</span>
                                    </p>
                                    <p className="text-white/70 text-sm">加入 10,000+ 创作者，开始接单</p>
                                </div>
                                <div className="p-6 space-y-3">
                                    {[
                                        { label: '平均单条稿费', value: '¥ 800+' },
                                        { label: '消耗激励金', value: '额外 20%' },
                                        { label: '平均验收周期', value: '3 小时' },
                                    ].map((item) => (
                                        <div
                                            key={item.label}
                                            className="flex items-center justify-between py-2.5 border-b border-[#f0f0f0] last:border-0"
                                        >
                                            <span className="text-[#74767e] text-sm">{item.label}</span>
                                            <span className="text-[#003912] font-bold text-sm">{item.value}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Floating Badge */}
                            <div className="absolute -top-4 -right-4 bg-[#1dbf73] text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg">
                                0 手续费
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
