import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Phone } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '../contexts/AuthContext'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [formData, setFormData] = useState({
    phone: '',
    code: '',
    role: 'creator' as 'advertiser' | 'creator',
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [countdown])

  const handleSendCode = () => {
    if (!formData.phone) {
      alert('请先输入手机号')
      return
    }
    // 模拟发送验证码
    setCountdown(60)
    alert('验证码已发送')
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.phone || !formData.code) {
      alert('请填写完整信息')
      return
    }
    // 登录成功，保存用户信息
    login(formData.phone, formData.role)
    alert('登录成功！')
    // 根据角色跳转到不同的页面
    if (formData.role === 'advertiser') {
      navigate('/client-workspace')
    } else {
      navigate('/orders')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20 flex items-center justify-center py-12 px-4">
      <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1dbf73] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">热</span>
          </div>
          <h1 className="text-2xl font-bold text-[#404145]">欢迎回来</h1>
          <p className="text-[#74767e] mt-1">登录你的热力豆账号</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#404145] mb-2">
                我是
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'advertiser' })}
                  className={`py-3 px-4 rounded-lg border transition-all text-sm font-medium ${
                    formData.role === 'advertiser'
                      ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                      : 'border-[#e4e5e7] text-[#404145] hover:border-[#1dbf73]'
                  }`}
                >
                  广告主
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: 'creator' })}
                  className={`py-3 px-4 rounded-lg border transition-all text-sm font-medium ${
                    formData.role === 'creator'
                      ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                      : 'border-[#e4e5e7] text-[#404145] hover:border-[#1dbf73]'
                  }`}
                >
                  创作者
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#404145] mb-2">
                手机号
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#74767e]" />
                <input
                  type="tel"
                  placeholder="请输入手机号"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#404145] mb-2">
                验证码
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  placeholder="请输入验证码"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="flex-1 px-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20"
                />
                <Button
                  type="button"
                  onClick={handleSendCode}
                  disabled={countdown > 0}
                  variant="outline"
                  className="px-6 whitespace-nowrap border-[#e4e5e7] text-[#404145] hover:bg-[#f7f7f7] disabled:opacity-50"
                >
                  {countdown > 0 ? `${countdown}秒` : '获取验证码'}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-[#1dbf73] hover:bg-[#19a463] text-white py-3"
            >
              登录
            </Button>
          </form>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-[#74767e]">
          还没有账号？{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-[#1dbf73] font-medium hover:underline"
          >
            立即注册
          </button>
        </p>
      </div>
    </div>
  )
}
