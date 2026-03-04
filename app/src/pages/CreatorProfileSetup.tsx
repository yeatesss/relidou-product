import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, User, Mail, Phone, MapPin, Briefcase, Link as LinkIcon, Camera, IdCard, CreditCard } from 'lucide-react'

export default function CreatorProfileSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState({
    realName: '',
    idCard: '',
    phone: '',
    city: '',
    bankName: '',
    bankAccount: '',
    bio: '',
    portfolio: '',
    tags: [] as string[],
  })
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 常用标签
  const availableTags = [
    '短视频制作', '宣传片', 'Vlog', '动画', '剪辑', '摄影',
    '口播', '电商', '美妆', '美食', '科技', '教育', '游戏',
    '旅行', '健身', '音乐', '舞蹈', '宠物', '汽车'
  ]

  useEffect(() => {
    setIsVisible(true)

    // 检查是否已登录且是创作者
    if (!user || user.role !== 'creator') {
      navigate('/login')
      return
    }

    // 从localStorage加载已保存的信息
    const savedProfile = localStorage.getItem('creatorProfile')
    if (savedProfile) {
      try {
        const profile = JSON.parse(savedProfile)
        setFormData(profile)
        if (profile.avatar) {
          setAvatarPreview(profile.avatar)
        }
      } catch (error) {
        console.error('加载个人信息失败:', error)
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 简单验证
    if (!formData.realName || !formData.idCard || !formData.phone || !formData.city) {
      alert('请填写必填字段：真实姓名、身份证号、联系电话、所在城市')
      setIsSubmitting(false)
      return
    }

    // 保存到localStorage
    const profileToSave = {
      ...formData,
      avatar: avatarPreview,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem('creatorProfile', JSON.stringify(profileToSave))

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    setIsSubmitting(false)
    navigate('/creator-workspace')
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag].slice(0, 5) // 最多选5个标签
    }))
  }

  const isRequired = (field: string) => {
    return ['realName', 'idCard', 'phone', 'city'].includes(field)
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      <div className="max-w-6xl mx-auto px-4 py-4">
        {/* 头部 - 紧凑 */}
        <div className={`mb-3 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate('/creator-workspace')}
                className="p-2 text-[#74767e] hover:text-[#1a1a1a] transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold text-[#1a1a1a]">完善个人信息</h1>
                <p className="text-sm text-[#74767e]">请补充以下信息以便接单和结算</p>
              </div>
            </div>
            <div className="w-10 h-10 bg-gradient-to-br from-[#1dbf73] to-[#003912] rounded-full flex items-center justify-center text-white font-bold">
              {user?.phone[0]}
            </div>
          </div>
        </div>

        {/* 表单 - 使用网格布局，一屏展示 */}
        <form onSubmit={handleSubmit} className={`grid grid-cols-3 gap-3 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>

          {/* 左侧列 - 基本信息 */}
          <div className="space-y-3">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-[#1dbf73]" />
                基本信息
              </h2>

              <div className="space-y-3">
                {/* 真实姓名 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    真实姓名 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.realName}
                    onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                    placeholder="请输入真实姓名"
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                  />
                </div>

                {/* 身份证号 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    身份证号 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.idCard}
                    onChange={(e) => setFormData({ ...formData, idCard: e.target.value })}
                    placeholder="请输入18位身份证号码"
                    maxLength={18}
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                  />
                </div>

                {/* 联系电话 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    联系电话 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="请输入联系电话"
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                  />
                </div>

                {/* 所在城市 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    所在城市 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="例如：北京市朝阳区"
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 中间列 - 收款信息和个人简介 */}
          <div className="space-y-3">
            {/* 收款信息 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-[#1dbf73]" />
                收款信息
              </h2>

              <div className="space-y-3">
                {/* 开户银行 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    开户银行
                  </label>
                  <input
                    type="text"
                    value={formData.bankName}
                    onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                    placeholder="例如：中国工商银行"
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                  />
                </div>

                {/* 银行卡号 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    银行卡号
                  </label>
                  <input
                    type="text"
                    value={formData.bankAccount}
                    onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                    placeholder="请输入银行卡号"
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                  />
                </div>
              </div>
            </div>

            {/* 个人简介 */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h2 className="text-base font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-[#1dbf73]" />
                个人简介
              </h2>

              <div className="space-y-3">
                {/* 简介 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    个人简介
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="简单介绍自己的专业领域和经验"
                    rows={2}
                    maxLength={200}
                    className="w-full px-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors resize-none"
                  />
                  <p className="text-xs text-[#74767e] mt-1 text-right">{formData.bio.length}/200</p>
                </div>

                {/* 作品集链接 */}
                <div>
                  <label className="block text-xs font-medium text-[#404145] mb-1">
                    作品集链接
                  </label>
                  <div className="relative">
                    <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e]" />
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                      placeholder="https://..."
                      className="w-full pl-10 pr-3 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧列 - 擅长领域和按钮 */}
          <div className="space-y-3">
            {/* 擅长领域 */}
            <div className="bg-white rounded-xl p-4 shadow-sm flex-1">
              <h2 className="text-base font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                <IdCard className="w-4 h-4 text-[#1dbf73]" />
                擅长领域 <span className="text-xs font-normal text-[#74767e]">（最多5个）</span>
              </h2>

              <div className="flex flex-wrap gap-1.5">
                {availableTags.map(tag => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      formData.tags.includes(tag)
                        ? 'bg-[#1dbf73] text-white'
                        : 'bg-[#f5f5f5] text-[#74767e] hover:bg-[#e4e5e7]'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* 提交按钮 */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => navigate('/creator-workspace')}
                  className="flex-1 py-2.5 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium text-sm"
                >
                  暂不补充
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`flex-1 py-2.5 rounded-lg font-medium transition-all text-sm ${
                    isSubmitting
                      ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                      : 'bg-[#1dbf73] hover:bg-[#19a463] text-white shadow-lg shadow-[#1dbf73]/25 hover:scale-[1.02]'
                  }`}
                >
                  {isSubmitting ? '保存中...' : '保存信息'}
                </button>
              </div>

              {/* 提示 */}
              <div className="bg-[#fff7ed] border-l-4 border-[#f97316] p-3 rounded-r-lg">
                <p className="text-xs text-[#9a7a69] leading-relaxed">
                  <strong>温馨提示：</strong>
                  标注 * 的字段为必填项。完善个人信息后，您才能正常接单和结算佣金。
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
