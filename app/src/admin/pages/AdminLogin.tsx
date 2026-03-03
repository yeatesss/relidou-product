import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    navigate('/admin/dashboard')
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -left-1/2 w-full h-full bg-gradient-to-br from-[#1dbf73]/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -right-1/2 w-full h-full bg-gradient-to-tl from-[#1dbf73]/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-[#1dbf73] to-[#0a4226] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-[#1dbf73]/20">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">创影汇管理后台</h1>
          <p className="text-slate-400 mt-1">Admin Dashboard</p>
        </div>

        {/* Form */}
        <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                管理员账号
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="请输入管理员账号"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                密码
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-12 pr-12 py-3 bg-slate-900/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.remember}
                  onChange={(e) => setFormData({ ...formData, remember: e.target.checked })}
                  className="w-4 h-4 rounded border-slate-600 bg-slate-900 text-[#1dbf73] focus:ring-[#1dbf73]"
                />
                <span className="text-sm text-slate-400">记住我</span>
              </label>
              <a href="#" className="text-sm text-[#1dbf73] hover:text-[#19a463] transition-colors">
                忘记密码？
              </a>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1dbf73] hover:bg-[#19a463] text-white py-3 rounded-xl font-medium transition-all"
            >
              登录管理后台
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="text-center mt-6 text-slate-500 text-sm">
          © 2026 创影汇 · 管理后台系统
        </p>
      </div>
    </div>
  )
}
