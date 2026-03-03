import { Flame } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const categories = [
  { name: '爆款视频裂变', href: '/orders?q=爆款视频裂变' },
  { name: '电商KOC种草', href: '/orders?q=电商KOC种草' },
  { name: 'UGC优质原创', href: '/orders?q=UGC优质原创' },
  { name: '本地生活探店', href: '/orders?q=本地生活探店' },
  { name: '小说短剧发行', href: '/orders?q=小说短剧发行' },
]

const companyLinks = [
  { name: '关于热力豆', href: '#' },
]

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="bg-[#1a1a1a] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">

          {/* Brand Column */}
          <div>
            <div
              className="flex items-center gap-2 mb-4 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 bg-[#1dbf73] rounded-lg flex items-center justify-center">
                <Flame className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold tracking-tight">热力豆</span>
            </div>
            <p className="text-white/50 text-sm leading-relaxed">
              商业广告视频素材定制撮合服务平台，
              <br />
              连接广告主与专业短视频创作者。
            </p>
          </div>

          {/* Categories Column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">类别</h3>
            <ul className="space-y-2.5">
              {categories.map((cat) => (
                <li key={cat.name}>
                  <a
                    href={cat.href}
                    className="text-white/55 hover:text-[#1dbf73] transition-colors text-sm"
                  >
                    {cat.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Column */}
          <div>
            <h3 className="font-semibold text-white mb-4 text-sm uppercase tracking-wider">公司</h3>
            <ul className="space-y-2.5">
              {companyLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-white/55 hover:text-[#1dbf73] transition-colors text-sm"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-10 pt-8 border-t border-white/10">
          <div className="flex flex-col gap-1.5">
            <p className="text-white/35 text-xs">
              © 2026 加热豆® &nbsp;·&nbsp; 杭州快有量科技有限公司
            </p>
            <p className="text-white/30 text-xs">
              网站：浙ICP备2024139512号-3 &nbsp;·&nbsp; 小程序：浙ICP备2024139512号-1X
            </p>
            <p className="text-white/30 text-xs">
              增值电信业务经营许可证：浙B2-20250842
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
