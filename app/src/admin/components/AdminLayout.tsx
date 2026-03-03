import { useState } from 'react'
import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  ShoppingCart,
  Users,
  Video,
  Star,
  FileText,
  Settings,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
} from 'lucide-react'
// Button component not used in this file
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const sidebarItems = [
  { path: '/admin/dashboard', icon: LayoutDashboard, label: '数据概览' },
  { path: '/admin/orders', icon: ShoppingCart, label: '订单管理' },
  { path: '/admin/users', icon: Users, label: '甲方用户' },
  { path: '/admin/creators', icon: Video, label: '创作者管理' },
  { path: '/admin/reviews', icon: Star, label: '评价管理' },
  { path: '/admin/content', icon: FileText, label: '内容审核' },
  { path: '/admin/settings', icon: Settings, label: '系统设置' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#f1f5f9]">
      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-40 h-screen bg-[#0f172a] transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-center border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#1dbf73] to-[#0a4226] rounded-xl flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">创</span>
            </div>
            {sidebarOpen && (
              <div>
                <span className="text-white font-semibold">创影汇</span>
                <span className="text-xs text-slate-400 block">管理后台</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-[#1dbf73] text-white'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                  }`
                }
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </NavLink>
            )
          })}
        </nav>

        {/* Toggle Button */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute bottom-4 right-4 w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
        </button>
      </aside>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarOpen ? 'ml-64' : 'ml-20'
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
          {/* Search */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="搜索订单、用户、创作者..."
                className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#1dbf73]/20"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            </button>

            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-3 p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <Avatar className="w-8 h-8 bg-[#1dbf73]">
                  <AvatarFallback className="text-white text-sm">管</AvatarFallback>
                </Avatar>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-slate-700">管理员</p>
                  <p className="text-xs text-slate-500">admin@chuangyinghui.com</p>
                </div>
                <ChevronDown className="w-4 h-4 text-slate-400" />
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  <button className="w-full px-4 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    账号设置
                  </button>
                  <button
                    onClick={() => navigate('/admin/login')}
                    className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    退出登录
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
