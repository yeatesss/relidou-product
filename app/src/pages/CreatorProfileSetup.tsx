import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { ArrowLeft, User, Phone, MapPin, Briefcase, Calendar, Globe, Shield, CheckCircle, Loader2, Camera, Upload } from 'lucide-react'

interface BankVerification {
  bankName: string
  bankAccount: string
  isVerified: boolean
}

export default function CreatorProfileSetup() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isVerifyingBank, setIsVerifyingBank] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState({
    nickname: '',
    avatar: '',
    realName: '',
    idCard: '',
    phone: '',
    city: '',
    birthday: '',
    languages: [] as string[],
    bio: '',
    skills: [] as string[],
  })

  // 打款信息
  const [bankInfo, setBankInfo] = useState<BankVerification>({
    bankName: '',
    bankAccount: '',
    isVerified: false,
  })

  // 擅长类型选项
  const availableSkills = [
    '干货讲解', '口播分享', '好物测评', '剪辑混剪', '搞笑创意', '即时访谈', '电商', '好物种草'
  ]

  // 语言选项
  const languageOptions = [
    '普通话', '英语', '日语', '韩语', '法语', '德语', '西班牙语', '粤语', '四川话', '东北话'
  ]

  // 常用城市
  const popularCities = [
    '北京', '上海', '广州', '深圳', '杭州', '成都', '重庆', '武汉', '西安', '南京'
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
      } catch (error) {
        console.error('加载个人信息失败:', error)
      }
    }

    // 加载打款信息
    const savedBankInfo = localStorage.getItem('creatorBankInfo')
    if (savedBankInfo) {
      try {
        setBankInfo(JSON.parse(savedBankInfo))
      } catch (error) {
        console.error('加载打款信息失败:', error)
      }
    }
  }, [user, navigate])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // 验证必填字段
    if (!formData.realName || !formData.idCard || !formData.phone || !formData.city || !formData.birthday || formData.languages.length === 0 || formData.skills.length === 0) {
      alert('请填写所有必填字段')
      setIsSubmitting(false)
      return
    }

    // 验证身份证号
    const idCardRegex = /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/
    if (!idCardRegex.test(formData.idCard)) {
      alert('请输入正确的身份证号')
      setIsSubmitting(false)
      return
    }

    // 验证手机号
    const phoneRegex = /^1[3-9]\d{9}$/
    if (!phoneRegex.test(formData.phone)) {
      alert('请输入正确的手机号')
      setIsSubmitting(false)
      return
    }

    // 验证银行卡是否已验证
    if (!bankInfo.isVerified) {
      alert('请先验证打款信息')
      setIsSubmitting(false)
      return
    }

    // 保存到localStorage
    const profileToSave = {
      ...formData,
      completedAt: new Date().toISOString(),
    }
    localStorage.setItem('creatorProfile', JSON.stringify(profileToSave))

    // 保存打款信息
    localStorage.setItem('creatorBankInfo', JSON.stringify(bankInfo))

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))

    setIsSubmitting(false)
    navigate('/orders')
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill].slice(0, 8), // 最多选8个技能
    }))
  }

  const toggleLanguage = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language].slice(0, 3), // 最多选3个语言
    }))
  }

  // 处理头像上传
  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件')
      return
    }

    // 验证文件大小（限制2MB）
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过2MB')
      return
    }

    // 读取文件并预览
    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setFormData(prev => ({ ...prev, avatar: result }))
    }
    reader.readAsDataURL(file)
  }

  // 移除头像
  const handleRemoveAvatar = () => {
    setFormData(prev => ({ ...prev, avatar: '' }))
  }

  // 验证银行卡
  const handleVerifyBank = async () => {
    if (!bankInfo.bankAccount) {
      alert('请输入银行卡号')
      return
    }

    // 验证银行卡号（基本格式验证）
    const accountRegex = /^\d{16,19}$/
    if (!accountRegex.test(bankInfo.bankAccount)) {
      alert('请输入正确的银行卡号（16-19位数字）')
      return
    }

    setIsVerifyingBank(true)

    // 模拟API验证
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 模拟验证成功（实际应该调用真实API）
    setBankInfo({
      ...bankInfo,
      isVerified: true,
    })

    setIsVerifyingBank(false)
    alert('银行卡验证成功！')
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-16">
      <div className="max-w-6xl mx-auto px-4 py-2">
        {/* 头部 - 紧凑 */}
        <div className={`mb-2 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-1.5 text-[#74767e] hover:text-[#1a1a1a] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 表单 - 使用两栏布局 */}
        <form onSubmit={handleSubmit} className={`transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">

            {/* 左侧列 */}
            <div className="space-y-3">
              {/* 基本信息 */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-bold text-[#1a1a1a] mb-3 flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-[#1dbf73]" />
                  基本信息
                </h2>

                <div className="space-y-2.5">
                  {/* 头像上传 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-2">
                      头像
                    </label>
                    <div className="flex items-start gap-4">
                      {/* 头像预览 */}
                      <div className="relative group">
                        {formData.avatar ? (
                          <div className="relative">
                            <img
                              src={formData.avatar}
                              alt="头像预览"
                              className="w-20 h-20 rounded-full object-cover border-2 border-[#e4e5e7] group-hover:border-[#1dbf73] transition-colors"
                            />
                            <button
                              type="button"
                              onClick={handleRemoveAvatar}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                              title="移除头像"
                            >
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-[#f5f5f5] border-2 border-dashed border-[#e4e5e7] flex items-center justify-center">
                            <User className="w-8 h-8 text-[#74767e]" />
                          </div>
                        )}
                      </div>

                      {/* 上传按钮 */}
                      <div className="flex-1">
                        <input
                          type="file"
                          id="avatar-upload"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <label
                          htmlFor="avatar-upload"
                          className="flex items-center gap-2 px-4 py-2 border border-[#e4e5e7] rounded-lg hover:border-[#1dbf73] hover:bg-[#f0fdf4] transition-all cursor-pointer text-sm"
                        >
                          <Camera className="w-4 h-4 text-[#74767e]" />
                          <span className="text-[#404145]">点击上传头像</span>
                        </label>
                        <p className="text-xs text-[#74767e] mt-1">
                          支持 JPG、PNG 格式，文件大小不超过 2MB
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* 昵称 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-1">
                      昵称 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.nickname}
                      onChange={(e) => setFormData({ ...formData, nickname: e.target.value })}
                      placeholder="请输入昵称，将在作品中显示"
                      maxLength={20}
                      className="w-full px-2.5 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                  </div>

                  {/* 真实姓名 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-1">
                      真实姓名 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.realName}
                      onChange={(e) => setFormData({ ...formData, realName: e.target.value })}
                      placeholder="请输入真实姓名"
                      className="w-full px-2.5 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                  </div>

                  {/* 身份证号 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-1">
                      身份证号 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.idCard}
                      onChange={(e) => setFormData({ ...formData, idCard: e.target.value.toUpperCase() })}
                      placeholder="请输入18位身份证号"
                      maxLength={18}
                      className="w-full px-2.5 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                  </div>

                  {/* 联系电话 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-1">
                      联系电话 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="请输入11位手机号"
                      maxLength={11}
                      className="w-full px-2.5 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                  </div>

                  {/* 出生日期 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-1">
                      出生日期 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.birthday}
                      onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full px-2.5 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                  </div>

                  {/* 所在城市 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-1">
                      所在城市 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      placeholder="例如：北京市朝阳区"
                      className="w-full px-2.5 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                    />
                    {/* 热门城市快捷选择 */}
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {popularCities.map(city => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => setFormData({ ...formData, city })}
                          className="px-2 py-0.5 text-xs border border-[#e4e5e7] rounded hover:border-[#1dbf73] hover:text-[#1dbf73] transition-colors text-[#74767e]"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 掌握语言 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-1">
                      掌握语言 <span className="text-red-500">*</span> <span className="text-xs text-[#74767e]">（最多3个）</span>
                    </label>
                    <div className="flex flex-wrap gap-1.5">
                      {languageOptions.map(lang => (
                        <button
                          key={lang}
                          type="button"
                          onClick={() => toggleLanguage(lang)}
                          className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all ${
                            formData.languages.includes(lang)
                              ? 'bg-[#1dbf73] text-white'
                              : 'bg-[#f5f5f5] text-[#74767e] hover:bg-[#e4e5e7]'
                          }`}
                        >
                          {lang}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* 自我描述 */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-bold text-[#1a1a1a] mb-2.5 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#1dbf73]" />
                  自我描述
                </h2>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="简单介绍自己的专业领域、工作经验和擅长方向..."
                  rows={3}
                  maxLength={500}
                  className="w-full px-2.5 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors resize-none"
                />
                <p className="text-xs text-[#74767e] mt-1 text-right">{formData.bio.length}/500</p>
              </div>
            </div>

            {/* 右侧列 */}
            <div className="space-y-3">
              {/* 擅长类型 */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-bold text-[#1a1a1a] mb-2.5 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-[#1dbf73]" />
                  擅长类型 <span className="text-xs font-normal text-[#74767e]">（最多8个）</span>
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {availableSkills.map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggleSkill(skill)}
                      className={`px-2.5 py-1 rounded-lg text-sm font-medium transition-all ${
                        formData.skills.includes(skill)
                          ? 'bg-[#1dbf73] text-white'
                          : 'bg-[#f5f5f5] text-[#74767e] hover:bg-[#e4e5e7]'
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
                <div className="mt-1.5 text-xs text-[#74767e]">
                  已选择 {formData.skills.length}/8 个技能
                </div>
              </div>

              {/* 打款信息 */}
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <h2 className="text-sm font-bold text-[#1a1a1a] mb-2.5 flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-[#1dbf73]" />
                  打款信息 <span className="text-red-500">*</span>
                </h2>

                {bankInfo.isVerified ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 mb-1.5">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <span className="font-medium text-green-800 text-sm">已验证</span>
                    </div>
                    <div className="text-sm text-green-700">
                      <p>银行卡号：{bankInfo.bankAccount.replace(/(\d{4})\d*(\d{4})/, '$1 **** $2')}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setBankInfo({ bankName: '', bankAccount: '', isVerified: false })}
                      className="mt-1.5 text-xs text-[#1dbf73] hover:underline"
                    >
                      重新绑定
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={bankInfo.bankAccount}
                        onChange={(e) => setBankInfo({ ...bankInfo, bankAccount: e.target.value.replace(/\D/g, '') })}
                        placeholder="请输入银行卡号"
                        maxLength={19}
                        className="flex-1 px-2 py-1.5 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73] transition-colors"
                      />
                      <button
                        type="button"
                        onClick={handleVerifyBank}
                        disabled={isVerifyingBank}
                        className={`px-3 py-1.5 rounded-lg font-medium transition-all text-xs whitespace-nowrap ${
                          isVerifyingBank
                            ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                            : 'bg-[#1dbf73] hover:bg-[#19a463] text-white'
                        }`}
                      >
                        {isVerifyingBank ? (
                          <>
                            <Loader2 className="w-3 h-3 mr-1 animate-spin inline" />
                            验证中
                          </>
                        ) : (
                          '验证'
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* 提交按钮 */}
              <div className="space-y-2.5">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => navigate('/orders')}
                    className="flex-1 py-2 border border-[#e4e5e7] text-[#404145] rounded-lg hover:bg-[#f5f5f5] transition-colors font-medium text-sm"
                  >
                    暂不补充
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`flex-1 py-2 rounded-lg font-medium transition-all text-sm ${
                      isSubmitting
                        ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                        : 'bg-[#1dbf73] hover:bg-[#19a463] text-white shadow-lg shadow-[#1dbf73]/25 hover:scale-[1.02]'
                    }`}
                  >
                    {isSubmitting ? '保存中...' : '保存信息'}
                  </button>
                </div>

                {/* 提示 */}
                <div className="bg-[#fff7ed] border-l-4 border-[#f97316] p-2.5 rounded-r-lg">
                  <p className="text-xs text-[#9a7a69] leading-relaxed">
                    <strong>温馨提示：</strong>
                    标注 * 的字段为必填项。完善个人信息和验证打款信息后，您才能正常接单和结算佣金。
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
