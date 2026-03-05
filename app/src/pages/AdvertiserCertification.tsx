import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, Upload, FileText, MapPin, User, Calendar, Camera, CheckCircle, AlertCircle } from 'lucide-react'

interface CertificationData {
  businessLicense: string | null
  creditCode: string
  validUntil: string
  legalPerson: string
  registeredAddress: string
  faceVerified: boolean
}

export default function AdvertiserCertification() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [formData, setFormData] = useState<CertificationData>({
    businessLicense: null,
    creditCode: '',
    validUntil: '',
    legalPerson: '',
    registeredAddress: '',
    faceVerified: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showFaceVerification, setShowFaceVerification] = useState(false)
  const [isVerifyingFace, setIsVerifyingFace] = useState(false)

  useEffect(() => {
    setIsVisible(true)

    // 检查是否已登录且是广告主
    if (!user || user.role !== 'advertiser') {
      navigate('/login')
      return
    }

    // 从localStorage加载已保存的认证信息
    const savedCertification = localStorage.getItem('advertiserCertification')
    if (savedCertification) {
      try {
        const certification = JSON.parse(savedCertification)
        // 如果已经提交过且状态不是rejected，直接显示成功页面
        if (certification.status && certification.status !== 'rejected') {
          setIsSuccess(true)
        }
        setFormData(certification)
      } catch (error) {
        console.error('加载认证信息失败:', error)
      }
    }
  }, [user, navigate])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // 验证文件类型
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png']
      if (!validTypes.includes(file.type)) {
        alert('请上传 JPG 或 PNG 格式的图片')
        return
      }

      // 验证文件大小（不超过 5MB）
      if (file.size > 5 * 1024 * 1024) {
        alert('图片大小不能超过 5MB')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setFormData({ ...formData, businessLicense: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleFaceVerification = () => {
    setIsVerifyingFace(true)

    // 模拟人脸识别过程
    setTimeout(() => {
      setIsVerifyingFace(false)
      setFormData({ ...formData, faceVerified: true })
      setShowFaceVerification(false)
      alert('人脸识别验证成功！')
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 验证必填字段
    if (!formData.businessLicense || !formData.creditCode || !formData.validUntil ||
        !formData.legalPerson || !formData.registeredAddress) {
      alert('请填写所有必填字段')
      setIsSubmitting(false)
      return
    }

    // 验证人脸识别
    if (!formData.faceVerified) {
      alert('请先完成法定代表人人脸识别验证')
      setIsSubmitting(false)
      return
    }

    // 验证统一社会信用代码格式（18位）
    const creditCodeRegex = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/
    if (!creditCodeRegex.test(formData.creditCode)) {
      alert('请输入正确的统一社会信用代码（18位）')
      setIsSubmitting(false)
      return
    }

    // 保存到localStorage
    const certificationToSave = {
      ...formData,
      submittedAt: new Date().toISOString(),
      status: 'pending', // 待审核
    }
    localStorage.setItem('advertiserCertification', JSON.stringify(certificationToSave))

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    setIsSubmitting(false)
    setIsSuccess(true)
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-[#f7f7f7] pt-20">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* 成功图标和标题 */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-[#1dbf73] rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-[#1a1a1a] mb-1">提交成功！</h1>
              <p className="text-sm text-[#74767e]">您的企业认证信息已成功提交</p>
            </div>

            {/* 主内容区域 - 两栏布局 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              {/* 左侧：成功提示 + 温馨提示 */}
              <div className="space-y-4">
                {/* 成功提示卡片 */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-[#1dbf73] flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[#404145]">认证信息已提交</p>
                        <p className="text-xs text-[#74767e] mt-0.5">我们将在1-3个工作日内完成审核</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[#404145]">请添加客服微信</p>
                        <p className="text-xs text-[#74767e] mt-0.5">审核结果将通过微信第一时间通知您</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <FileText className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-[#404145]">请保持手机畅通</p>
                        <p className="text-xs text-[#74767e] mt-0.5">审核期间如需补充材料，我们会电话联系您</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 温馨提示 */}
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">温馨提示</p>
                      <ul className="space-y-0.5 text-blue-700 text-xs">
                        <li>• 审核通过后，您将收到微信和短信通知</li>
                        <li>• 如有疑问，可随时联系客服咨询</li>
                        <li>• 审核期间请耐心等待，无需重复提交</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右侧：客服二维码 */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="text-base font-bold text-[#404145] mb-4 text-center">扫码添加客服微信</h3>
                <div className="flex flex-col items-center">
                  {/* 二维码占位图 */}
                  <div className="w-40 h-40 bg-[#f5f5f5] rounded-lg flex items-center justify-center mb-3 border-2 border-dashed border-[#e4e5e7]">
                    <div className="text-center">
                      <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center mx-auto mb-1.5 shadow-sm">
                        <User className="w-7 h-7 text-[#1dbf73]" />
                      </div>
                      <p className="text-xs text-[#74767e]">客服二维码</p>
                    </div>
                  </div>

                  {/* 客服信息 */}
                  <div className="text-center space-y-1">
                    <p className="text-sm font-medium text-[#404145]">热力豆企业客服</p>
                    <p className="text-xs text-[#74767e]">微信号：relidou_service</p>
                    <p className="text-xs text-[#74767e]">工作时间：9:00-18:00</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 返回按钮 */}
            <div className="text-center">
              <button
                onClick={() => navigate('/login')}
                className="px-8 py-2.5 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] transition-colors font-medium"
              >
                返回登录页
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 头部 */}
        <div className={`mb-6 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="p-2 text-[#74767e] hover:text-[#1a1a1a] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-[#1a1a1a]">企业认证</h1>
              <p className="text-sm text-[#74767e] mt-1">请完成企业认证后使用广告主功能</p>
            </div>
          </div>
        </div>

        {/* 表单 */}
        <form onSubmit={handleSubmit} className={`bg-white rounded-xl shadow-sm p-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* 提示信息 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-8">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-900">
                <p className="font-medium mb-1">认证说明</p>
                <ul className="space-y-1 text-blue-700">
                  <li>• 请上传清晰的营业执照照片</li>
                  <li>• 统一社会信用代码必须与营业执照一致</li>
                  <li>• 法定代表人需完成人脸识别验证</li>
                  <li>• 提交后由运营端审核，审核通过后方可使用平台功能</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* 营业执照照片 */}
            <div>
              <label className="block text-sm font-medium text-[#404145] mb-2">
                营业执照照片 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-[#e4e5e7] rounded-lg p-8 hover:border-[#1dbf73] transition-colors">
                <div className="flex flex-col items-center">
                  {formData.businessLicense ? (
                    <div className="relative">
                      <img
                        src={formData.businessLicense}
                        alt="营业执照"
                        className="max-w-full max-h-64 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, businessLicense: null })}
                        className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                        <div className="flex flex-col items-center gap-3">
                          <div className="w-16 h-16 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                            <Upload className="w-8 h-8 text-[#74767e]" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-[#404145]">点击上传营业执照</p>
                            <p className="text-xs text-[#74767e] mt-1">支持 JPG、PNG 格式，不超过 5MB</p>
                          </div>
                        </div>
                      </label>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {/* 统一社会信用代码 */}
              <div>
                <label className="block text-sm font-medium text-[#404145] mb-2">
                  统一社会信用代码 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.creditCode}
                  onChange={(e) => setFormData({ ...formData, creditCode: e.target.value.toUpperCase() })}
                  placeholder="请输入18位统一社会信用代码"
                  maxLength={18}
                  className="w-full px-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                />
              </div>

              {/* 营业期限至 */}
              <div>
                <label className="block text-sm font-medium text-[#404145] mb-2">
                  营业期限至 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={formData.validUntil}
                  onChange={(e) => setFormData({ ...formData, validUntil: e.target.value })}
                  className="w-full px-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                />
              </div>
            </div>

            {/* 法定代表人/经营者 */}
            <div>
              <label className="block text-sm font-medium text-[#404145] mb-2">
                法定代表人/经营者 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.legalPerson}
                onChange={(e) => setFormData({ ...formData, legalPerson: e.target.value })}
                placeholder="请输入法定代表人或经营者姓名"
                className="w-full px-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
              />
            </div>

            {/* 注册地 */}
            <div>
              <label className="block text-sm font-medium text-[#404145] mb-2">
                注册地 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.registeredAddress}
                onChange={(e) => setFormData({ ...formData, registeredAddress: e.target.value })}
                placeholder="请输入营业执照注册地址"
                className="w-full px-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
              />
            </div>

            {/* 人脸识别验证 */}
            <div>
              <label className="block text-sm font-medium text-[#404145] mb-2">
                法定代表人人脸识别验证 <span className="text-red-500">*</span>
              </label>
              <div className={`border-2 rounded-lg p-6 transition-colors ${
                formData.faceVerified
                  ? 'border-green-500 bg-green-50'
                  : 'border-[#e4e5e7] bg-white'
              }`}>
                {formData.faceVerified ? (
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-green-800">验证通过</p>
                      <p className="text-xs text-green-600">法定代表人身份已验证</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, faceVerified: false })}
                      className="text-sm text-green-600 hover:text-green-700"
                    >
                      重新验证
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                        <Camera className="w-6 h-6 text-[#74767e]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-[#404145]">需要验证</p>
                        <p className="text-xs text-[#74767e]">请法定代表人完成人脸识别</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowFaceVerification(true)}
                      className="px-6 py-2.5 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] transition-colors font-medium text-sm"
                    >
                      开始验证
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="flex gap-3 pt-4 border-t border-[#e4e5e7]">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
              >
                取消
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                  isSubmitting
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-[#1dbf73] hover:bg-[#19a463] text-white shadow-lg shadow-[#1dbf73]/25 hover:scale-[1.02]'
                }`}
              >
                {isSubmitting ? '提交中...' : '提交认证'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* 人脸识别弹窗 */}
      {showFaceVerification && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full shadow-2xl overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-[#404145]">人脸识别验证</h3>
              <button
                onClick={() => setShowFaceVerification(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6">
              {isVerifyingFace ? (
                <div className="flex flex-col items-center py-8">
                  <div className="w-20 h-20 border-4 border-[#1dbf73] border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-sm text-[#74767e]">正在验证中...</p>
                </div>
              ) : (
                <>
                  <div className="aspect-square bg-gradient-to-br from-[#003912] to-[#0a4226] rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                    <Camera className="w-16 h-16 text-white/50" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-48 h-48 border-2 border-white/30 rounded-full"></div>
                    </div>
                  </div>
                  <div className="space-y-3 text-sm text-[#74767e]">
                    <p>• 请确保光线充足</p>
                    <p>• 正面面对摄像头</p>
                    <p>• 保持表情自然</p>
                    <p>• 摘除眼镜和帽子</p>
                  </div>
                </>
              )}
            </div>

            {/* 弹窗底部 */}
            {!isVerifyingFace && (
              <div className="p-4 border-t border-slate-100">
                <button
                  onClick={handleFaceVerification}
                  className="w-full py-3 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] transition-colors font-medium"
                >
                  开始识别
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
