import { useEffect, useState } from 'react'
import Hero from '../sections/Hero'
import SolutionSection from '../sections/SolutionSection'
import AdvantageSection from '../sections/AdvantageSection'
import CTASection from '../sections/CTASection'

export default function Home() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className={`transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {/* 模块 1: Hero 区（主视觉 + 搜索） */}
      <Hero />

      {/* 模块 2: 素材解决方案（面向创作者/OPC） */}
      <SolutionSection />

      {/* 模块 3: 广告主平台优势 */}
      <AdvantageSection />

      {/* 模块 4: 最终 CTA */}
      <CTASection />
    </div>
  )
}
