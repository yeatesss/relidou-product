import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, Phone, Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function Register() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'client', // 'client' or 'creator'
    agree: false,
    code: '',
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.userType === 'client') {
      // 广告主提交后显示二维码
      setShowSuccessModal(true)
    } else {
      // 创作者直接注册成功
      alert('注册成功！')
      navigate('/login')
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'image/jpg']
      if (!validTypes.includes(file.type)) {
        alert('请上传 PNG、JPG 或 JPEG 格式的图片')
        return
      }
      setUploadedFile(file)
    }
  }

  const removeFile = () => {
    setUploadedFile(null)
  }

  const sendCode = () => {
    alert('验证码已发送！')
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20 flex items-center justify-center py-12 px-4">
      <div className={`w-full max-w-md transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#1dbf73] rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl">热</span>
          </div>
          <h1 className="text-2xl font-bold text-[#404145]">创建账号</h1>
          <p className="text-[#74767e] mt-1">加入热力豆，开启视频创作之旅</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-xl p-8 shadow-sm">
          {/* User Type Tabs */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setFormData({ ...formData, userType: 'client' })}
              className={`flex-1 py-2.5 rounded-lg border transition-all ${
                formData.userType === 'client'
                  ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                  : 'border-[#e4e5e7] text-[#404145] hover:border-[#1dbf73]'
              }`}
            >
              我是广告主
            </button>
            <button
              onClick={() => setFormData({ ...formData, userType: 'creator' })}
              className={`flex-1 py-2.5 rounded-lg border transition-all ${
                formData.userType === 'creator'
                  ? 'bg-[#1dbf73] text-white border-[#1dbf73]'
                  : 'border-[#e4e5e7] text-[#404145] hover:border-[#1dbf73]'
              }`}
            >
              我是创作者
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 广告主显示完整表单 */}
            {formData.userType === 'client' ? (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#404145] mb-2">
                    姓名
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#74767e]" />
                    <input
                      type="text"
                      placeholder="请输入您的姓名"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20"
                    />
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
                      onClick={sendCode}
                      variant="outline"
                      className="border-[#1dbf73] text-[#1dbf73] hover:bg-[#1dbf73] hover:text-white"
                    >
                      获取验证码
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#404145] mb-2">
                    广告主证明
                  </label>
                  <div className="border-2 border-dashed border-[#e4e5e7] rounded-lg p-6 hover:border-[#1dbf73] transition-colors">
                    {uploadedFile ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-[#f7f7f7] rounded-lg flex items-center justify-center">
                            <Upload className="w-6 h-6 text-[#1dbf73]" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-[#404145]">{uploadedFile.name}</p>
                            <p className="text-xs text-[#74767e]">{(uploadedFile.size / 1024).toFixed(2)} KB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={removeFile}
                          className="text-[#74767e] hover:text-[#404145]"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>
                    ) : (
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept=".png,.jpg,.jpeg,image/png,image/jpeg,image/jpg"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="text-center">
                          <Upload className="w-12 h-12 text-[#74767e] mx-auto mb-3" />
                          <p className="text-sm font-medium text-[#404145] mb-1">
                            点击上传或拖拽文件到此处
                          </p>
                          <p className="text-xs text-[#74767e]">
                            支持 PNG、JPG、JPEG 格式
                          </p>
                        </div>
                      </label>
                    )}
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded border-[#e4e5e7] text-[#1dbf73] focus:ring-[#1dbf73]"
                  />
                  <span className="text-sm text-[#74767e]">
                    我已阅读并同意{' '}
                    <a href="#" className="text-[#1dbf73] hover:underline">用户协议</a>
                    {' '}和{' '}
                    <a href="#" className="text-[#1dbf73] hover:underline">隐私政策</a>
                  </span>
                </label>
              </>
            ) : (
              /* 创作者只显示手机号和验证码 */
              <>
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
                      onClick={sendCode}
                      variant="outline"
                      className="border-[#1dbf73] text-[#1dbf73] hover:bg-[#1dbf73] hover:text-white"
                    >
                      获取验证码
                    </Button>
                  </div>
                </div>

                <label className="flex items-start gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agree}
                    onChange={(e) => setFormData({ ...formData, agree: e.target.checked })}
                    className="w-4 h-4 mt-0.5 rounded border-[#e4e5e7] text-[#1dbf73] focus:ring-[#1dbf73]"
                  />
                  <span className="text-sm text-[#74767e]">
                    我已阅读并同意{' '}
                    <a href="#" className="text-[#1dbf73] hover:underline">用户协议</a>
                    {' '}和{' '}
                    <a href="#" className="text-[#1dbf73] hover:underline">隐私政策</a>
                  </span>
                </label>
              </>
            )}

            <Button
              type="submit"
              className="w-full bg-[#1dbf73] hover:bg-[#19a463] text-white py-3"
            >
              注册
            </Button>
          </form>
        </div>

        {/* Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl p-8 max-w-sm w-full text-center">
              <div className="w-20 h-20 mx-auto mb-4 bg-[#1dbf73] rounded-xl flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#404145] mb-2">提交成功</h3>
              <p className="text-[#74767e] mb-6">请等待客服为您开通</p>

              {/* 客服二维码 */}
              <div className="w-48 h-48 mx-auto mb-6 bg-[#f7f7f7] rounded-lg flex items-center justify-center overflow-hidden">
                <img
                  src="customer-service-qrcode.png"
                  alt="客服二维码"
                  className="w-full h-full object-cover"
                />
              </div>

              <Button
                onClick={() => {
                  setShowSuccessModal(false)
                  navigate('/login')
                }}
                className="w-full bg-[#1dbf73] hover:bg-[#19a463] text-white py-3"
              >
                确定
              </Button>
            </div>
          </div>
        )}

        {/* Login Link */}
        <p className="text-center mt-6 text-[#74767e]">
          已有账号？{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-[#1dbf73] font-medium hover:underline"
          >
            立即登录
          </button>
        </p>
      </div>
    </div>
  )
}
