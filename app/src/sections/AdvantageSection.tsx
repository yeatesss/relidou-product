import { useRef, useState, useEffect } from 'react'
import { Globe, Film, BadgeDollarSign, ClipboardCheck } from 'lucide-react'

const sellingPoints = [
    {
        icon: Globe,
        title: '覆盖主流投放平台与行业',
        desc: '汇聚电商、本地生活、游戏、金融等行业资深创作者，沉淀海量行业爆量案例与出片经验。',
    },
    {
        icon: Film,
        title: '海量风格样片极速对标',
        desc: '平台沉淀万级爆量素材库，支持按风格、按场景、按转化数据快速检索，看中哪个样片即刻开拍。',
    },
    {
        icon: BadgeDollarSign,
        title: '极具竞争力的规模化价格',
        desc: '依托海量创作者的集约化作业，剔除传统制作公司的溢价，用更优的价格获取更高频的素材产出。',
    },
    {
        icon: ClipboardCheck,
        title: '标准化交付与品质质检',
        desc: '建立分阶段验收机制与在线云审片，确保素材100%符合你的要求，只为有效产出负责。',
    },
]

export default function AdvantageSection() {
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
            { threshold: 0.1 }
        )
        if (sectionRef.current) observer.observe(sectionRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <section ref={sectionRef} className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div
                    className={`text-center mb-14 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                        }`}
                >
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#404145] leading-snug">
                        <span className="text-[#1dbf73]">热力豆</span>，为你增添无限火力
                    </h2>
                </div>

                {/* Selling Points Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {sellingPoints.map((item, index) => {
                        const Icon = item.icon
                        return (
                            <div
                                key={item.title}
                                className={`group p-6 rounded-2xl border border-[#e4e5e7] hover:border-[#1dbf73] hover:shadow-lg transition-all duration-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                                    }`}
                                style={{ transitionDelay: `${index * 120}ms` }}
                            >
                                {/* Icon */}
                                <div className="w-12 h-12 bg-[#f0faf5] group-hover:bg-[#1dbf73] rounded-xl flex items-center justify-center mb-4 transition-colors duration-300">
                                    <Icon className="w-6 h-6 text-[#1dbf73] group-hover:text-white transition-colors duration-300" />
                                </div>

                                {/* Title */}
                                <h3 className="font-bold text-[#003912] text-base mb-2 leading-snug">
                                    {item.title}
                                </h3>

                                {/* Desc */}
                                <p className="text-[#74767e] text-sm leading-relaxed">{item.desc}</p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
