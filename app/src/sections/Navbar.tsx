import { Search, Menu, X, Flame, LogOut } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'

interface NavbarProps {
  scrolled: boolean
}

export default function Navbar({ scrolled }: NavbarProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const { user, logout, isAuthenticated } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  // 判断是否在首页
  const isHomePage = location.pathname === '/' || location.pathname === ''

  const isActive = (path: string) => location.pathname === path

  const handleSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/orders?q=${encodeURIComponent(searchQuery.trim())}`)
    } else {
      navigate('/orders')
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  // 格式化手机号，中间四位显示****
  const formatPhone = (phone: string) => {
    if (!phone) return ''
    if (phone.length === 11) {
      return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    }
    return phone
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
          ? 'bg-white shadow-md py-3'
          : 'bg-white/95 backdrop-blur-sm py-4'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex items-center gap-2 cursor-pointer flex-shrink-0"
            onClick={() => navigate('/')}
          >
            <div className="w-8 h-8 bg-[#1dbf73] rounded-lg flex items-center justify-center">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-[#003912] tracking-tight">热力豆</span>
          </div>

          {/* Search Bar - Desktop */}
          {(!isActive('/login') && !isActive('/register') && !isActive('/client-workspace') && (!isHomePage || scrolled)) && (
            <div className="hidden md:flex flex-1 max-w-xl mx-8">
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="搜索任何素材要求"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="w-full pl-10 pr-20 py-2.5 border border-[#e4e5e7] rounded-full text-sm focus:outline-none focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 transition-all"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e]" />
                <button
                  onClick={handleSearch}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-[#1dbf73] text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-[#19a463] transition-colors"
                >
                  搜索
                </button>
              </div>
            </div>
          )}

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex items-center gap-6">
            {(!isAuthenticated || user?.role === 'creator') && (
              <button
                onClick={() => navigate('/orders')}
                className={`transition-colors text-sm font-medium ${isActive('/orders') ? 'text-[#1dbf73]' : 'text-[#74767e] hover:text-[#1dbf73]'
                  }`}
              >
                探索
              </button>
            )}
            {isAuthenticated && (
              <button
                onClick={() => {
                  if (user?.role === 'creator') {
                    navigate('/creator-workspace')
                  } else if (user?.role === 'advertiser') {
                    navigate('/client-workspace')
                  }
                }}
                className={`transition-colors text-sm font-medium ${
                  (user?.role === 'creator' && isActive('/creator-workspace')) ||
                  (user?.role === 'advertiser' && isActive('/client-workspace'))
                    ? 'text-[#1dbf73]'
                    : 'text-[#74767e] hover:text-[#1dbf73]'
                }`}
              >
                工作台
              </button>
            )}
            {isAuthenticated ? (
              <>
                <span className="text-sm text-[#404145]">{formatPhone(user?.phone || '')}</span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-slate-200 text-slate-700 hover:bg-slate-50"
                  size="sm"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  退出
                </Button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-[#74767e] hover:text-[#1dbf73] transition-colors text-sm font-medium"
                >
                  登录
                </button>
                <Button
                  onClick={() => navigate('/register')}
                  className="bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-md px-5"
                >
                  注册
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6 text-[#404145]" />
            ) : (
              <Menu className="w-6 h-6 text-[#404145]" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-[#e4e5e7] pt-4">
            <div className="flex flex-col gap-4">
              {(!isActive('/login') && !isActive('/register') && !isActive('/client-workspace') && (!isHomePage || scrolled)) && (
                <div className="relative">
                  <input
                    type="text"
                    placeholder="搜索任何素材要求"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2.5 border border-[#e4e5e7] rounded-full text-sm focus:outline-none focus:border-[#1dbf73]"
                  />
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e]" />
                </div>
              )}
              {(!isAuthenticated || user?.role === 'creator') && (
                <button
                  onClick={() => { navigate('/orders'); setMobileMenuOpen(false) }}
                  className={`text-left py-2 text-sm font-medium ${isActive('/orders') ? 'text-[#1dbf73]' : 'text-[#74767e]'
                    }`}
                >
                  探索
                </button>
              )}
              {isAuthenticated && (
                <button
                  onClick={() => {
                    if (user?.role === 'creator') {
                      navigate('/creator-workspace')
                    } else if (user?.role === 'advertiser') {
                      navigate('/client-workspace')
                    }
                    setMobileMenuOpen(false)
                  }}
                  className={`text-left py-2 text-sm font-medium ${
                    (user?.role === 'creator' && isActive('/creator-workspace')) ||
                    (user?.role === 'advertiser' && isActive('/client-workspace'))
                      ? 'text-[#1dbf73]'
                      : 'text-[#74767e]'
                  }`}
                >
                  工作台
                </button>
              )}
              {isAuthenticated ? (
                <>
                  <div className="py-2 text-sm text-[#404145] border-t border-[#e4e5e7] pt-3">
                    {formatPhone(user?.phone || '')}
                  </div>
                  <Button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false) }}
                    variant="outline"
                    className="border-slate-200 text-slate-700 hover:bg-slate-50 w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    退出
                  </Button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => { navigate('/login'); setMobileMenuOpen(false) }}
                    className="text-left py-2 text-[#74767e] text-sm font-medium"
                  >
                    登录
                  </button>
                  <Button
                    onClick={() => { navigate('/register'); setMobileMenuOpen(false) }}
                    className="bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-md w-full"
                  >
                    注册
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
