import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { Clock, User, ArrowLeft, CheckCircle, MessageCircle, Phone } from 'lucide-react'

export default function AdvertiserPending() {
  const navigate = useNavigate()
  const { isAuthenticated, getAdvertiserCertificationStatus, user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [certificationData, setCertificationData] = useState<any>(null)

  useEffect(() => {
    setIsVisible(true)

    // 检查登录状态
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // 检查是否是广告主
    if (user?.role !== 'advertiser') {
      navigate('/login')
      return
    }

    // 检查认证状态
    const certificationStatus = getAdvertiserCertificationStatus()
    if (certificationStatus !== 'pending') {
      // 不是审核中状态，跳转到相应页面
      if (certificationStatus === 'not_submitted') {
        navigate('/advertiser-certification')
      } else if (certificationStatus === 'approved') {
        navigate('/client-workspace')
      } else if (certificationStatus === 'rejected') {
        navigate('/advertiser-certification')
      }
      return
    }

    // 加载认证数据
    const savedCertification = localStorage.getItem('advertiserCertification')
    if (savedCertification) {
      try {
        setCertificationData(JSON.parse(savedCertification))
      } catch (error) {
        console.error('加载认证信息失败:', error)
      }
    }
  }, [isAuthenticated, getAdvertiserCertificationStatus, user, navigate])

  const handleContactService = () => {
    // 跳转到消息页或打开客服链接
    alert('请联系客服：\n微信号：relidou_service\n工作时间：9:00-18:00')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f7f7] to-[#e8f5e9] pt-20">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* 头部 */}
        <div className={`mb-12 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <button
            onClick={() => navigate('/login')}
            className="p-2 text-[#74767e] hover:text-[#1a1a1a] transition-colors inline-block mb-6"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="text-center">
            <h1 className="text-4xl font-bold text-[#404145] mb-3">企业认证审核中</h1>
            <p className="text-lg text-[#74767e]">您的认证申请正在审核中，请耐心等待</p>
          </div>
        </div>

        {/* 主要内容卡片 */}
        <div className={`bg-white rounded-2xl shadow-lg p-8 mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {/* 审核进度 */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Clock className="w-10 h-10 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-[#404145]">审核中</h2>
          </div>

          {/* 企业信息预览 */}
          {certificationData && (
            <div className="bg-[#f7f7f7] rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-[#404145] mb-4">企业信息</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-[#74767e]">企业名称：</span>
                  <span className="text-[#404145]">{certificationData.legalPerson}</span>
                </div>
                <div>
                  <span className="text-[#74767e]">统一社会信用代码：</span>
                  <span className="text-[#404145]">{certificationData.creditCode}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-[#74767e]">注册地址：</span>
                  <span className="text-[#404145]">{certificationData.registeredAddress}</span>
                </div>
              </div>
            </div>
          )}

          {/* 审核说明 */}
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#1dbf73] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#404145]">我们会在 1-3 个工作日内完成审核</p>
                <p className="text-xs text-[#74767e] mt-1">审核通过后，您将收到微信和短信通知</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-[#1dbf73] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#404145]">审核通过后即可开始发布任务</p>
                <p className="text-xs text-[#74767e] mt-1">您可以先浏览平台功能，了解任务发布流程</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-[#404145]">如有疑问可联系客服</p>
                <p className="text-xs text-[#74767e] mt-1">微信号：relidou_service | 工作时间：9:00-18:00</p>
              </div>
            </div>
          </div>

          {/* 联系客服按钮 */}
          <div className="flex gap-3">
            <button
              onClick={() => navigate('/creators')}
              className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium"
            >
              浏览创作者
            </button>
            <button
              onClick={handleContactService}
              className="flex-1 py-3 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-lg transition-colors font-medium"
            >
              联系客服
            </button>
          </div>
        </div>

        {/* 温馨提示 */}
        <div className={`bg-blue-50 border-l-4 border-blue-500 rounded-r-xl p-6 transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-start gap-3 mb-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-base font-semibold text-blue-900">温馨提示</h3>
          </div>
          <ul className="ml-11 space-y-2 text-sm text-blue-800">
            <li>• 请保持手机畅通，我们可能需要联系您补充材料</li>
            <li>• 审核期间请耐心等待，无需重复提交</li>
            <li>• 您可以退出登录，审核通过后登录即可使用</li>
            <li>• 审核不通过时，您需要重新提交认证材料</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
