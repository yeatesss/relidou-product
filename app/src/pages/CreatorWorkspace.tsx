import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ShoppingCart,
  MessageSquare,
  Wallet,
  Video,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  Star,
  Award,
  X,
  AlertCircle,
  User,
  Settings,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const stats = [
  { title: '我的任务', value: '28', icon: ShoppingCart, color: 'bg-blue-500' },
  { title: '进行中', value: '5', icon: Clock, color: 'bg-yellow-500' },
  { title: '已完成', value: '23', icon: CheckCircle, color: 'bg-green-500' },
  { title: '总收入', value: '¥98,400', icon: DollarSign, color: 'bg-[#1dbf73]' },
]

const myOrders = [
  { id: 'ORD-2026-001', title: '美妆品牌抖音短视频', client: '花漾美妆', price: '¥1,200', status: '待上传视频', deadline: '2026-02-26', progress: 0 },
  { id: 'ORD-2026-005', title: '直播切片制作', client: '电竞俱乐部', price: '¥800', status: '待审核', deadline: '2026-02-21', progress: 100 },
  { id: 'ORD-2026-003', title: '企业宣传片剪辑', client: '互联科技', price: '¥5,000', status: '待交付', deadline: '2026-02-25', progress: 100 },
  { id: 'ORD-2026-008', title: '口播视频制作', client: '学而教育', price: '¥1,200', status: '已完成', deadline: '2026-02-18', progress: 100 },
  { id: 'ORD-2026-010', title: '产品展示视频', client: '优品家居', price: '¥2,500', status: '审核未通过', deadline: '2026-02-20', progress: 100 },
  { id: 'ORD-2026-012', title: '美食探店视频', client: '味道餐厅', price: '¥3,800', status: '订单冻结', deadline: '2026-02-22', progress: 50 },
  { id: 'ORD-2026-015', title: '电商产品展示视频', client: '时尚服饰', price: '¥1,800', status: '待交付', deadline: '2026-02-28', progress: 100 },
]

const myWorks = [
  { id: 1, title: '美妆品牌抖音视频', description: '为花漾美妆品牌打造的抖音爆款短视频，突出产品卖点', rating: 4.8, createdAt: '2026-02-20', isPinned: true },
  { id: 2, title: '科技企业宣传片', description: '互联科技企业形象宣传片，展现公司技术实力', rating: 4.9, createdAt: '2026-02-15', isPinned: true },
  { id: 3, title: '产品开箱测评', description: '优品家居最新产品开箱测评视频，真实体验分享', rating: 4.7, createdAt: '2026-02-10', isPinned: true },
  { id: 4, title: '旅行Vlog剪辑', description: '东南亚旅行记录vlog，记录美好时光', rating: 4.6, createdAt: '2026-02-05', isPinned: true },
  { id: 5, title: '美食探店视频', description: '为味道餐厅制作的探店视频，展示菜品和环境', rating: 4.5, createdAt: '2026-01-28', isPinned: false },
  { id: 6, title: '健身教程合集', description: '专业健身指导视频，包含多种训练动作演示', rating: 4.7, createdAt: '2026-01-20', isPinned: false },
  { id: 7, title: '游戏精彩集锦', description: '电竞俱乐部游戏精彩操作集锦剪辑', rating: 4.8, createdAt: '2026-01-15', isPinned: false },
  { id: 8, title: '教育课程片头', description: '学而教育在线课程片头动画制作', rating: 4.6, createdAt: '2026-01-08', isPinned: false },
]

const messages = [
  {
    id: 1,
    type: 'system',
    category: 'signup',
    title: '报名通知',
    content: '您已成功报名任务"美妆品牌抖音短视频"，请及时上传视频',
    time: '10分钟前',
    unread: true
  },
  {
    id: 2,
    type: 'system',
    category: 'review',
    title: '审核通知',
    content: '任务"直播切片制作"视频已提交，等待广告主审核',
    time: '30分钟前',
    unread: true
  },
  {
    id: 3,
    type: 'system',
    category: 'review',
    title: '审核通知',
    content: '任务"企业宣传片剪辑"审核已通过，等待您确认交付',
    time: '1小时前',
    unread: true
  },
  {
    id: 4,
    type: 'system',
    category: 'review',
    title: '审核通知',
    content: '任务"口播视频制作"审核未通过，请查看修改意见并重新上传',
    time: '2小时前',
    unread: false
  },
  {
    id: 5,
    type: 'system',
    category: 'review',
    title: '审核通知',
    content: '任务"产品展示视频"需要修改，请查看广告主的修改意见',
    time: '3小时前',
    unread: false
  },
  {
    id: 6,
    type: 'system',
    category: 'review',
    title: '审核通知',
    content: '任务"美食探店视频"已完成，佣金¥3,800已到账',
    time: '5小时前',
    unread: false
  },
]

// 分类对应的样式配置
const getCategoryConfig = (category: string) => {
  switch (category) {
    case 'signup':
      return {
        bgColor: 'bg-green-50',
        iconColor: 'text-green-600',
        iconBg: 'bg-green-100',
        icon: '✓',
        badgeColor: 'bg-green-100 text-green-700'
      }
    case 'review':
      return {
        bgColor: 'bg-blue-50',
        iconColor: 'text-blue-600',
        iconBg: 'bg-blue-100',
        icon: '◉',
        badgeColor: 'bg-blue-100 text-blue-700'
      }
    default:
      return {
        bgColor: 'bg-gray-50',
        iconColor: 'text-gray-600',
        iconBg: 'bg-gray-100',
        icon: '•',
        badgeColor: 'bg-gray-100 text-gray-700'
      }
  }
}

const getCategoryLabel = (category: string) => {
  const labels: Record<string, string> = {
    signup: '报名通知',
    review: '审核通知'
  }
  return labels[category] || '系统通知'
}

const incomeDetails = [
  { id: 1, type: 'commission', task: '企业宣传片剪辑', advertiser: '互联科技', amount: 5000, date: '2026-02-20 14:30' },
  { id: 2, type: 'commission', task: '美妆短视频拍摄', advertiser: '花漾美妆', amount: 1200, date: '2026-02-18 10:15' },
  { id: 3, type: 'withdraw', task: '提现到银行卡', advertiser: '-', amount: -3000, date: '2026-02-15 09:20' },
  { id: 4, type: 'commission', task: '美食探店视频', advertiser: '味道餐厅', amount: 3800, date: '2026-02-12 16:45' },
  { id: 5, type: 'withdraw', task: '提现到支付宝', advertiser: '-', amount: -2000, date: '2026-02-08 11:30' },
  { id: 6, type: 'commission', task: '健身教程合集', advertiser: '健身俱乐部', amount: 2500, date: '2026-01-28 15:20' },
  { id: 7, type: 'commission', task: '产品开箱测评', advertiser: '优品家居', amount: 1800, date: '2026-01-20 09:45' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '待上传视频':
      return 'bg-slate-100 text-slate-700'
    case '待审核':
      return 'bg-blue-100 text-blue-700'
    case '待交付':
      return 'bg-yellow-100 text-yellow-700'
    case '已完成':
      return 'bg-green-100 text-green-700'
    case '审核未通过':
      return 'bg-red-100 text-red-700'
    case '订单冻结':
      return 'bg-gray-200 text-gray-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function CreatorWorkspace() {
  const navigate = useNavigate()
  const { isAuthenticated, isCreatorProfileComplete, user } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')
  const [isVisible, setIsVisible] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof myOrders[0] | null>(null)
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [uploadedVideos, setUploadedVideos] = useState({
    highlight: null as File | null,
    watermarked: null as File | null,
    fullQuality: null as File | null,
  })
  const [works, setWorks] = useState(myWorks)
  const [selectedWork, setSelectedWork] = useState<typeof myWorks[0] | null>(null)
  const [showWorkVideoModal, setShowWorkVideoModal] = useState(false)
  const [incomeFilterType, setIncomeFilterType] = useState<'all' | 'commission' | 'withdraw'>('all')
  const [incomeStartDate, setIncomeStartDate] = useState('')
  const [incomeEndDate, setIncomeEndDate] = useState('')
  const [creatorProfile, setCreatorProfile] = useState<any>(null)
  const [orderStatusFilter, setOrderStatusFilter] = useState<'全部' | '待上传视频' | '待审核' | '待交付' | '已完成' | '审核未通过' | '订单冻结'>('全部')

  // 提现功能相关状态
  const [showWithdrawModal, setShowWithdrawModal] = useState(false)
  const [withdrawAccountType, setWithdrawAccountType] = useState<'alipay' | 'bank'>('alipay')
  const [withdrawAmount, setWithdrawAmount] = useState('')
  const [savedAccounts, setSavedAccounts] = useState<any[]>([])
  const [selectedAccountId, setSelectedAccountId] = useState<string>('')
  const [showAddAccountForm, setShowAddAccountForm] = useState(false)
  const [newAccount, setNewAccount] = useState({
    type: 'alipay' as 'alipay' | 'bank',
    alipay: { account: '', name: '', phone: '', idCard: '' },
    bank: { account: '', name: '', phone: '', idCard: '' }
  })
  const [verificationCode, setVerificationCode] = useState('')
  const [countdown, setCountdown] = useState(0)

  // 根据选择的账户类型过滤账户
  const getFilteredAccounts = () => {
    return savedAccounts.filter(acc => acc.type === withdrawAccountType)
  }

  // 切换账户类型时，自动选中该类型的第一个账户
  const handleAccountTypeChange = (type: 'alipay' | 'bank') => {
    setWithdrawAccountType(type)
    const filteredAccounts = savedAccounts.filter(acc => acc.type === type)
    if (filteredAccounts.length > 0) {
      setSelectedAccountId(filteredAccounts[0].id)
    } else {
      setSelectedAccountId('')
    }
  }

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // 检查创作者个人信息是否完整
    if (!isCreatorProfileComplete()) {
      navigate('/creator-profile-setup')
      return
    }

    // 加载创作者个人信息
    const savedProfile = localStorage.getItem('creatorProfile')
    if (savedProfile) {
      try {
        setCreatorProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error('加载个人信息失败:', error)
      }
    }

    // 加载保存的提现账户
    const accounts = localStorage.getItem('withdrawAccounts')
    if (accounts) {
      try {
        const parsedAccounts = JSON.parse(accounts)
        setSavedAccounts(parsedAccounts)
        // 默认选择第一个支付宝账户，如果没有则选择第一个账户
        const alipayAccounts = parsedAccounts.filter((acc: any) => acc.type === 'alipay')
        if (alipayAccounts.length > 0) {
          setSelectedAccountId(alipayAccounts[0].id)
        } else if (parsedAccounts.length > 0) {
          setSelectedAccountId(parsedAccounts[0].id)
        }
      } catch (error) {
        console.error('加载提现账户失败:', error)
      }
    }

    setIsVisible(true)
  }, [isAuthenticated, isCreatorProfileComplete, navigate])

  const handleFileUpload = (type: 'highlight' | 'watermarked' | 'fullQuality', file: File | null) => {
    if (file) {
      const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/x-matroska']
      if (!validTypes.includes(file.type)) {
        alert('请上传 MP4、MOV、AVI 或 MKV 格式的视频文件')
        return
      }
      setUploadedVideos(prev => ({ ...prev, [type]: file }))
    }
  }

  const handleUploadSubmit = () => {
    const isPendingDelivery = selectedOrder?.status === '待交付'

    // 根据订单状态验证需要上传的视频
    if (isPendingDelivery) {
      // 待交付状态只需要上传水印低质量版和高清完整版
      if (!uploadedVideos.watermarked || !uploadedVideos.fullQuality) {
        alert('请上传水印低质量版和高清完整版视频')
        return
      }
    } else {
      // 其他状态需要上传全部3个视频
      if (!uploadedVideos.highlight || !uploadedVideos.watermarked || !uploadedVideos.fullQuality) {
        alert('请上传所有3个视频文件')
        return
      }
    }

    // 更新订单状态
    if (selectedOrder) {
      const orderIndex = myOrders.findIndex(o => o.id === selectedOrder.id)
      if (orderIndex !== -1) {
        if (isPendingDelivery) {
          // 待交付状态重新上传后，状态保持不变
          setSelectedOrder(myOrders[orderIndex])
        } else {
          // 其他状态上传后变为"待审核"
          myOrders[orderIndex].status = '待审核'
          setSelectedOrder(myOrders[orderIndex])
        }
      }
    }

    // 关闭上传弹窗和详情弹窗
    setShowUploadModal(false)
    setShowOrderDetailModal(false)

    // 重置上传状态
    setUploadedVideos({
      highlight: null,
      watermarked: null,
      fullQuality: null,
    })

    if (isPendingDelivery) {
      alert('视频重新上传成功！')
    } else {
      alert('视频上传成功！订单状态已变更为"待审核"')
    }
  }

  const handleTogglePin = (workId: number) => {
    const work = works.find(w => w.id === workId)
    if (!work) return

    if (work.isPinned) {
      // 取消置顶
      setWorks(works.map(w => w.id === workId ? { ...w, isPinned: false } : w))
    } else {
      // 置顶：检查是否已达到4个限制
      const pinnedCount = works.filter(w => w.isPinned).length
      if (pinnedCount >= 4) {
        alert('最多只能置顶4个作品')
        return
      }
      setWorks(works.map(w => w.id === workId ? { ...w, isPinned: true } : w))
    }
  }

  // 按置顶状态排序：置顶的在前，未置顶的在后
  const sortedWorks = [...works].sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1
    if (!a.isPinned && b.isPinned) return 1
    return 0
  })

  // 过滤收入明细
  const filteredIncomeDetails = incomeDetails.filter((item) => {
    // 类型过滤
    if (incomeFilterType === 'commission' && item.type !== 'commission') return false
    if (incomeFilterType === 'withdraw' && item.type !== 'withdraw') return false

    // 时间过滤
    if (incomeStartDate || incomeEndDate) {
      const itemDate = new Date(item.date)

      if (incomeStartDate && itemDate < new Date(incomeStartDate)) return false
      if (incomeEndDate && itemDate > new Date(incomeEndDate + 'T23:59:59')) return false
    }

    return true
  })

  // 提现处理函数
  const handleWithdraw = () => {
    const amount = parseFloat(withdrawAmount)

    // 验证提现金额
    if (!amount || amount <= 0) {
      alert('请输入有效的提现金额')
      return
    }

    if (amount < 10) {
      alert('单笔提现金额不得低于10元')
      return
    }

    if (amount > 9200) {
      alert('提现金额不能超过账户余额')
      return
    }

    // 验证是否选择了账户
    if (!selectedAccountId) {
      alert('请选择或添加提现账户')
      return
    }

    const selectedAccount = savedAccounts.find(acc => acc.id === selectedAccountId)
    if (!selectedAccount) {
      alert('请选择或添加提现账户')
      return
    }

    // 模拟提现成功
    const accountInfo = selectedAccount.type === 'alipay'
      ? `支付宝 ${selectedAccount.alipay.account}`
      : `银行卡 ${selectedAccount.bank.account}`

    alert(`提现申请已提交！\n提现金额：¥${amount.toFixed(2)}\n到账账户：${accountInfo}\n预计1-3个工作日到账`)
    setShowWithdrawModal(false)
    setShowAddAccountForm(false)
    setWithdrawAmount('')
  }

  // 添加新账户
  const handleAddAccount = () => {
    const accountType = newAccount.type

    if (accountType === 'alipay') {
      if (!newAccount.alipay.account || !newAccount.alipay.name || !newAccount.alipay.phone || !newAccount.alipay.idCard) {
        alert('请完善所有必填信息')
        return
      }
      if (!verificationCode) {
        alert('请输入验证码')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(newAccount.alipay.phone)) {
        alert('请输入正确的手机号码')
        return
      }
      if (!/^\d{15}$|^\d{18}$/.test(newAccount.alipay.idCard)) {
        alert('请输入正确的身份证号码（15位或18位）')
        return
      }
    } else {
      if (!newAccount.bank.account || !newAccount.bank.name || !newAccount.bank.phone || !newAccount.bank.idCard) {
        alert('请完善所有必填信息')
        return
      }
      if (!verificationCode) {
        alert('请输入验证码')
        return
      }
      if (!/^1[3-9]\d{9}$/.test(newAccount.bank.phone)) {
        alert('请输入正确的手机号码')
        return
      }
      if (!/^\d{15}$|^\d{18}$/.test(newAccount.bank.idCard)) {
        alert('请输入正确的身份证号码（15位或18位）')
        return
      }
    }

    // 创建新账户
    const account = {
      id: Date.now().toString(),
      type: accountType,
      alipay: accountType === 'alipay' ? newAccount.alipay : { account: '', name: '', phone: '', idCard: '' },
      bank: accountType === 'bank' ? newAccount.bank : { account: '', name: '', phone: '', idCard: '' },
      isDefault: savedAccounts.length === 0
    }

    // 保存到列表
    const updatedAccounts = [...savedAccounts, account]
    setSavedAccounts(updatedAccounts)
    localStorage.setItem('withdrawAccounts', JSON.stringify(updatedAccounts))

    // 选中新添加的账户，并切换到对应的账户类型
    setSelectedAccountId(account.id)
    setWithdrawAccountType(accountType)

    // 重置表单
    setNewAccount({
      type: accountType,
      alipay: { account: '', name: '', phone: '', idCard: '' },
      bank: { account: '', name: '', phone: '', idCard: '' }
    })
    setVerificationCode('')
    setShowAddAccountForm(false)
  }

  // 删除账户
  const handleDeleteAccount = (accountId: string) => {
    if (savedAccounts.length === 1) {
      alert('至少需要保留一个提现账户')
      return
    }

    if (!confirm('确定要删除这个账户吗？')) {
      return
    }

    const updatedAccounts = savedAccounts.filter(acc => acc.id !== accountId)
    setSavedAccounts(updatedAccounts)
    localStorage.setItem('withdrawAccounts', JSON.stringify(updatedAccounts))

    // 如果删除的是当前选中的账户，选中第一个
    if (selectedAccountId === accountId) {
      setSelectedAccountId(updatedAccounts[0].id)
    }
  }

  // 设置默认账户
  const handleSetDefaultAccount = (accountId: string) => {
    const updatedAccounts = savedAccounts.map(acc => ({
      ...acc,
      isDefault: acc.id === accountId
    }))
    setSavedAccounts(updatedAccounts)
    localStorage.setItem('withdrawAccounts', JSON.stringify(updatedAccounts))
  }

  // 发送验证码
  const handleSendCode = () => {
    const phone = newAccount.type === 'alipay' ? newAccount.alipay.phone : newAccount.bank.phone

    if (!phone || !/^1[3-9]\d{9}$/.test(phone)) {
      alert('请输入正确的手机号码')
      return
    }

    // 模拟发送验证码
    alert(`验证码已发送至 ${phone}`)
    setCountdown(60)

    // 倒计时
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div>
            <h1 className="text-2xl font-bold text-[#404145]">创作者工作台</h1>
            <p className="text-[#74767e] mt-1">管理您的任务、作品和收入</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/orders')}
              className="bg-[#1dbf73] hover:bg-[#19a463] text-white"
            >
              <Search className="w-4 h-4 mr-2" />
              找任务
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className={`grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.title} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[#74767e] text-sm">{stat.title}</p>
                    <p className="text-2xl font-bold text-[#404145] mt-1">{stat.value}</p>
                  </div>
                  <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-white mb-6 p-1 rounded-xl flex-wrap">
              <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                我的任务
              </TabsTrigger>
              <TabsTrigger value="works" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <Video className="w-4 h-4 mr-2" />
                作品集
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                消息
                {messages.filter(m => m.unread).length > 0 && (
                  <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {messages.filter(m => m.unread).length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="income" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <Wallet className="w-4 h-4 mr-2" />
                收入
              </TabsTrigger>
            </TabsList>

            {/* Orders */}
            <TabsContent value="orders">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    {/* 任务状态Tab切换 */}
                    <div className="p-3 border-b border-slate-100">
                      <div className="flex gap-2 overflow-x-auto pb-1">
                        <button
                          onClick={() => setOrderStatusFilter('全部')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            orderStatusFilter === '全部'
                              ? 'bg-[#1dbf73] text-white'
                              : 'text-[#74767e] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          全部
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter('待上传视频')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            orderStatusFilter === '待上传视频'
                              ? 'bg-[#1dbf73] text-white'
                              : 'text-[#74767e] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          待上传
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter('待审核')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            orderStatusFilter === '待审核'
                              ? 'bg-[#1dbf73] text-white'
                              : 'text-[#74767e] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          待审核
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter('待交付')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            orderStatusFilter === '待交付'
                              ? 'bg-[#1dbf73] text-white'
                              : 'text-[#74767e] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          待交付
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter('已完成')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            orderStatusFilter === '已完成'
                              ? 'bg-[#1dbf73] text-white'
                              : 'text-[#74767e] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          已完成
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter('审核未通过')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            orderStatusFilter === '审核未通过'
                              ? 'bg-[#1dbf73] text-white'
                              : 'text-[#74767e] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          未通过
                        </button>
                        <button
                          onClick={() => setOrderStatusFilter('订单冻结')}
                          className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                            orderStatusFilter === '订单冻结'
                              ? 'bg-[#1dbf73] text-white'
                              : 'text-[#74767e] hover:bg-[#f5f5f5]'
                          }`}
                        >
                          已冻结
                        </button>
                      </div>
                    </div>
                    <div className="divide-y divide-slate-100">
                      {myOrders.filter((order) => orderStatusFilter === '全部' || order.status === orderStatusFilter).map((order) => (
                        <div key={order.id} className="p-5 hover:bg-slate-50 cursor-pointer" onClick={() => { setSelectedOrder(order); setShowOrderDetailModal(true) }}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium text-[#404145]">{order.title}</p>
                              <p className="text-sm text-[#74767e] mt-1">截止投稿：{order.deadline}</p>
                            </div>
                            <div className="text-right flex flex-col items-end gap-2">
                              <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                              <p className="text-[#1dbf73] font-medium text-lg">{order.price}</p>
                            </div>
                          </div>
                          {order.status === '待上传视频' && (
                            <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setShowUploadModal(true)
                                }}
                                className="bg-[#1dbf73] hover:bg-[#19a463]"
                              >
                                上传视频
                              </Button>
                            </div>
                          )}
                          {order.status === '待交付' && (
                            <div className="mt-4 flex gap-2" onClick={(e) => e.stopPropagation()}>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setShowUploadModal(true)
                                }}
                                className="bg-[#1dbf73] hover:bg-[#19a463]"
                              >
                                重新上传
                              </Button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right Sidebar - 账户余额 + 创作者等级 */}
                <div className="space-y-4">
                  {/* 账户余额 */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <p className="text-[#74767e] text-sm">账户余额</p>
                    <p className="text-3xl font-bold text-[#1dbf73] mt-2">¥9,200</p>
                    <div className="space-y-2 mt-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#74767e]">待结算</span>
                        <span className="font-medium text-[#404145]">¥3,200</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#74767e]">本月收入</span>
                        <span className="font-medium text-[#1dbf73]">¥12,400</span>
                      </div>
                    </div>
                    <Button
                      className="w-full mt-4 bg-[#1dbf73] hover:bg-[#19a463]"
                      onClick={() => {
                        setShowWithdrawModal(true)
                        // 重置为支付宝，并选中第一个支付宝账户
                        setWithdrawAccountType('alipay')
                        const alipayAccounts = savedAccounts.filter(acc => acc.type === 'alipay')
                        if (alipayAccounts.length > 0) {
                          setSelectedAccountId(alipayAccounts[0].id)
                        }
                      }}
                    >
                      申请提现
                    </Button>
                  </div>

                  {/* 创作者等级 */}
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <h4 className="font-semibold text-[#404145] mb-3">创作者等级</h4>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center">
                        <Award className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-medium text-[#404145]">金牌创作者</p>
                        <p className="text-sm text-[#74767e]">已完成 23 单</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-[#74767e]">距离铂金还需</span>
                        <span className="text-[#1dbf73]">7单</span>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500 rounded-full" style={{ width: '77%' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Works */}
            <TabsContent value="works">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-[#404145]">我的作品 ({myWorks.length})</h3>
                  <span className="text-sm text-[#74767e]">已置顶 {works.filter(w => w.isPinned).length}/4</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {sortedWorks.map((work) => (
                    <div
                      key={work.id}
                      className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-100 hover:shadow-md transition-shadow relative cursor-pointer"
                      onClick={() => {
                        setSelectedWork(work)
                        setShowWorkVideoModal(true)
                      }}
                    >
                      {work.isPinned && (
                        <div className="absolute top-2 left-2 z-10 bg-[#1dbf73] text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                          置顶
                        </div>
                      )}
                      <div className="aspect-video bg-gradient-to-br from-[#003912] to-[#0a4226] flex items-center justify-center relative">
                        <Video className="w-12 h-12 text-white/50" />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center">
                            <Video className="w-6 h-6 text-[#1dbf73]" />
                          </div>
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-medium text-[#404145] truncate">{work.title}</h4>
                        <p className="text-sm text-[#74767e] mt-2 line-clamp-2">{work.description}</p>
                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center gap-1">
                            <Star className="w-4 h-4 fill-[#ffb33e] text-[#ffb33e]" />
                            <span className="text-sm font-medium text-[#404145]">{work.rating}</span>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleTogglePin(work.id)
                            }}
                            className="text-xs px-2 py-1 rounded border transition-colors flex items-center gap-1"
                            style={{
                              borderColor: work.isPinned ? '#1dbf73' : '#e4e5e7',
                              color: work.isPinned ? '#1dbf73' : '#74767e',
                            }}
                          >
                            {work.isPinned ? '取消置顶' : '置顶'}
                          </button>
                        </div>
                        <div className="text-xs text-[#74767e] mt-2">{work.createdAt}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {messages.map((msg) => {
                    const config = getCategoryConfig((msg as any).category)
                    return (
                      <div
                        key={msg.id}
                        className={`p-4 hover:bg-slate-50 cursor-pointer transition-colors ${msg.unread ? config.bgColor : ''}`}
                      >
                        <div className="flex items-start gap-4">
                          {/* 图标 */}
                          <div className={`w-10 h-10 ${config.iconBg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <span className={`text-lg ${config.iconColor}`}>{config.icon}</span>
                          </div>

                          {/* 内容 */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <p className="font-medium text-[#404145]">{(msg as any).title}</p>
                              <span className="text-sm text-[#74767e] flex-shrink-0 whitespace-nowrap">{msg.time}</span>
                            </div>
                            <p className="text-sm text-[#74767e] line-clamp-2">{(msg as any).content}</p>
                          </div>

                          {/* 未读标识 */}
                          {msg.unread && <span className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2" />}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </TabsContent>

            {/* Income */}
            <TabsContent value="income">
              {/* Recent Income */}
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <h3 className="font-semibold text-[#404145] mb-4">收入明细</h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#74767e]">类型：</span>
                      <select
                        value={incomeFilterType}
                        onChange={(e) => setIncomeFilterType(e.target.value as 'all' | 'commission' | 'withdraw')}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                      >
                        <option value="all">全部类型</option>
                        <option value="commission">佣金收入</option>
                        <option value="withdraw">提现</option>
                      </select>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-[#74767e]">操作时间：</span>
                      <input
                        type="date"
                        value={incomeStartDate}
                        onChange={(e) => setIncomeStartDate(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                      />
                      <span className="text-sm text-[#74767e]">至</span>
                      <input
                        type="date"
                        value={incomeEndDate}
                        onChange={(e) => setIncomeEndDate(e.target.value)}
                        className="px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                      />
                      {(incomeStartDate || incomeEndDate) && (
                        <button
                          onClick={() => {
                            setIncomeStartDate('')
                            setIncomeEndDate('')
                          }}
                          className="text-xs px-2 py-1 text-slate-500 hover:text-slate-700 border border-slate-200 rounded hover:bg-slate-50 transition-colors"
                        >
                          清空
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">任务</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">广告主</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">类型</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">金额</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">日期</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredIncomeDetails.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 text-sm text-[#404145]">{item.task}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{item.advertiser}</td>
                        <td className="px-6 py-4 text-sm">
                          <Badge className={item.type === 'commission' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                            {item.type === 'commission' ? '佣金收入' : '提现'}
                          </Badge>
                        </td>
                        <td className={`px-6 py-4 font-medium ${item.amount > 0 ? 'text-[#1dbf73]' : 'text-orange-600'}`}>
                          {item.amount > 0 ? `+¥${item.amount.toLocaleString()}` : `¥${item.amount.toLocaleString()}`}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                      </tr>
                    ))}
                    {filteredIncomeDetails.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                          暂无符合条件的记录
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 任务详情弹窗 */}
      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-6xl w-full max-h-[85vh] overflow-hidden shadow-2xl flex flex-col">
            {/* 弹窗头部 */}
            <div className="flex-shrink-0 bg-white border-b border-slate-100 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#404145]">{selectedOrder.title}</h3>
                  <p className="text-sm text-[#74767e] mt-1">{selectedOrder.id}</p>
                </div>
                <div className="flex items-center gap-3">
                  {selectedOrder.status === '待上传视频' && (
                    <Button
                      onClick={() => {
                        setShowUploadModal(true)
                      }}
                      className="bg-[#1dbf73] hover:bg-[#19a463]"
                    >
                      上传视频
                    </Button>
                  )}
                  {selectedOrder.status === '审核未通过' && (
                    <>
                      <Button
                        onClick={() => {
                          setShowUploadModal(true)
                        }}
                        className="bg-[#1dbf73] hover:bg-[#19a463]"
                      >
                        重新上传
                      </Button>
                      <Button variant="outline">
                        查看审核意见
                      </Button>
                    </>
                  )}
                  {selectedOrder.status === '待交付' && (
                    <Button className="bg-[#1dbf73] hover:bg-[#19a463]">
                      确认交付
                    </Button>
                  )}
                  <button
                    onClick={() => setShowOrderDetailModal(false)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            {/* 弹窗内容 */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* 任务要求 */}
              <div className="bg-slate-50 rounded-lg p-4">
                <p className="text-sm font-medium text-[#404145] mb-3">任务要求</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">视频尺寸</p>
                    <p className="text-sm font-medium text-[#404145]">1080×1920（9:16 竖版）</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">视频时长</p>
                    <p className="text-sm font-medium text-[#404145]">15-30 秒</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">视频格式</p>
                    <p className="text-sm font-medium text-[#404145]">MP4，不低于 1080P</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">场景要求</p>
                    <p className="text-sm font-medium text-[#404145]">实景拍摄，光线充足</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">视频风格</p>
                    <p className="text-sm font-medium text-[#404145]">自然、生活化</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">配音要求</p>
                    <p className="text-sm font-medium text-[#404145]">普通话，语速适中</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">是否接受 AI</p>
                    <p className="text-sm font-medium text-[#404145]">不接受</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#74767e] mb-1">交付数量</p>
                    <p className="text-sm font-medium text-[#404145]">1 条</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧：基本信息 */}
                <div>
                  <div className="bg-slate-50 rounded-lg p-4">
                    <p className="text-sm font-medium text-[#404145] mb-3">基本信息</p>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#74767e]">广告主</span>
                        <span className="text-sm font-medium text-[#404145]">{selectedOrder.client}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#74767e]">任务金额</span>
                        <span className="text-sm font-bold text-[#1dbf73]">{selectedOrder.price}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#74767e]">截止投稿</span>
                        <span className="text-sm font-medium text-[#404145]">{selectedOrder.deadline}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-[#74767e]">当前状态</span>
                        <Badge className={getStatusColor(selectedOrder.status)}>{selectedOrder.status}</Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 中间：服务详情 */}
                <div className="lg:col-span-2">
                  <div className="bg-slate-50 rounded-lg p-4 h-full">
                    <p className="text-sm font-medium text-[#404145] mb-3">服务详情</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#74767e]">
                      {/* 任务说明 */}
                      <div>
                        <p className="font-medium text-[#404145] mb-1">任务说明</p>
                        <p>本任务需要{selectedOrder.title}，请按照甲方要求制作高质量的短视频内容。视频内容需符合品牌调性，突出产品特点，吸引用户关注。</p>
                      </div>

                      {/* 制作流程 */}
                      <div>
                        <p className="font-medium text-[#404145] mb-1">制作流程</p>
                        <ol className="list-decimal list-inside space-y-1">
                          <li>接收任务 Brief 和产品资料</li>
                          <li>创意构思并撰写脚本</li>
                          <li>脚本确认后进行拍摄制作</li>
                          <li>提交初稿等待审核</li>
                          <li>根据反馈进行修改（如需要）</li>
                          <li>最终成片交付</li>
                        </ol>
                      </div>

                      {/* 注意事项 */}
                      <div>
                        <p className="font-medium text-[#404145] mb-1">注意事项</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>视频不得出现违法、违规内容</li>
                          <li>不得使用未经授权的图片、音乐素材</li>
                          <li>视频画面需清晰稳定，声音清楚</li>
                          <li>提交前请自查视频质量</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 上传视频弹窗 */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-[#404145]">上传视频</h3>
                <p className="text-sm text-[#74767e] mt-1">请上传以下3个视频文件</p>
              </div>
              <button
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadedVideos({
                    highlight: null,
                    watermarked: null,
                    fullQuality: null,
                  })
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {/* 高光时刻 - 仅在非"待交付"状态显示 */}
              {selectedOrder?.status !== '待交付' && (
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-[#1dbf73] transition-colors">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Video className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <p className="font-medium text-[#404145]">高光时刻</p>
                          <p className="text-xs text-[#74767e]">5-10秒精彩片段</p>
                        </div>
                        <label className="cursor-pointer">
                          <input
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => handleFileUpload('highlight', e.target.files?.[0] || null)}
                          />
                          <div className="px-4 py-2 bg-[#1dbf73] text-white text-sm rounded-lg hover:bg-[#19a463] transition-colors text-center">
                            选择文件
                          </div>
                        </label>
                      </div>
                      {uploadedVideos.highlight && (
                        <div className="flex items-center gap-2 text-sm text-[#1dbf73] bg-green-50 rounded-lg p-2">
                          <CheckCircle className="w-4 h-4" />
                          <span className="flex-1 truncate">{uploadedVideos.highlight.name}</span>
                          <button
                            onClick={() => handleFileUpload('highlight', null)}
                            className="text-slate-400 hover:text-slate-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 水印低质量版 */}
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-[#1dbf73] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#404145]">水印低质量版</p>
                        <p className="text-xs text-[#74767e]">请添加自己昵称水印，用于预览审核</p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload('watermarked', e.target.files?.[0] || null)}
                        />
                        <div className="px-4 py-2 bg-[#1dbf73] text-white text-sm rounded-lg hover:bg-[#19a463] transition-colors text-center">
                          选择文件
                        </div>
                      </label>
                    </div>
                    {uploadedVideos.watermarked && (
                      <div className="flex items-center gap-2 text-sm text-[#1dbf73] bg-green-50 rounded-lg p-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="flex-1 truncate">{uploadedVideos.watermarked.name}</span>
                        <button
                          onClick={() => handleFileUpload('watermarked', null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 高清完整版 */}
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 hover:border-[#1dbf73] transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <p className="font-medium text-[#404145]">高清完整版</p>
                        <p className="text-xs text-[#74767e]">无水印高质量版本</p>
                      </div>
                      <label className="cursor-pointer">
                        <input
                          type="file"
                          accept="video/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload('fullQuality', e.target.files?.[0] || null)}
                        />
                        <div className="px-4 py-2 bg-[#1dbf73] text-white text-sm rounded-lg hover:bg-[#19a463] transition-colors text-center">
                          选择文件
                        </div>
                      </label>
                    </div>
                    {uploadedVideos.fullQuality && (
                      <div className="flex items-center gap-2 text-sm text-[#1dbf73] bg-green-50 rounded-lg p-2">
                        <CheckCircle className="w-4 h-4" />
                        <span className="flex-1 truncate">{uploadedVideos.fullQuality.name}</span>
                        <button
                          onClick={() => handleFileUpload('fullQuality', null)}
                          className="text-slate-400 hover:text-slate-600"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* 提示信息 */}
              <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="font-medium mb-1">上传说明</p>
                  <ul className="space-y-1 text-blue-700">
                    <li>• 支持格式：MP4、MOV、AVI、MKV</li>
                    {selectedOrder?.status !== '待交付' && <li>• 高光时刻：5-10秒精彩片段</li>}
                    <li>• 水印版：添加平台水印用于预览审核</li>
                    <li>• 高清版：最终交付的无水印高质量版本</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <Button
                variant="outline"
                onClick={() => {
                  setShowUploadModal(false)
                  setUploadedVideos({
                    highlight: null,
                    watermarked: null,
                    fullQuality: null,
                  })
                }}
              >
                取消
              </Button>
              <Button
                onClick={handleUploadSubmit}
                disabled={
                  selectedOrder?.status === '待交付'
                    ? !uploadedVideos.watermarked || !uploadedVideos.fullQuality
                    : !uploadedVideos.highlight || !uploadedVideos.watermarked || !uploadedVideos.fullQuality
                }
                className="bg-[#1dbf73] hover:bg-[#19a463] disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                确认上传
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 作品视频播放弹窗 */}
      {showWorkVideoModal && selectedWork && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full shadow-2xl overflow-hidden">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-[#404145]">{selectedWork.title}</h3>
                <p className="text-sm text-[#74767e] mt-1">{selectedWork.description}</p>
              </div>
              <button
                onClick={() => {
                  setShowWorkVideoModal(false)
                  setSelectedWork(null)
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 视频播放区域 */}
            <div className="aspect-video bg-black flex items-center justify-center">
              <video
                className="w-full h-full"
                controls
                autoPlay
                poster=""
              >
                <source src="" type="video/mp4" />
                您的浏览器不支持视频播放
              </video>
            </div>

            {/* 视频信息 */}
            <div className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-[#ffb33e] text-[#ffb33e]" />
                  <span className="text-sm font-medium text-[#404145]">{selectedWork.rating}</span>
                </div>
                <span className="text-sm text-[#74767e]">{selectedWork.createdAt}</span>
              </div>
              {selectedWork.isPinned && (
                <div className="bg-[#1dbf73] text-white text-xs font-bold px-3 py-1 rounded-full">
                  置顶作品
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 申请提现弹窗 */}
      {showWithdrawModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="text-xl font-bold text-[#404145]">申请提现</h3>
                <p className="text-sm text-[#74767e] mt-1">可提现余额：¥9,200</p>
              </div>
              <button
                onClick={() => {
                  setShowWithdrawModal(false)
                  setShowAddAccountForm(false)
                }}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {!showAddAccountForm ? (
                <>
                  {/* 账户类型选择 */}
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-2">提现方式</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleAccountTypeChange('alipay')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          withdrawAccountType === 'alipay'
                            ? 'border-[#1dbf73] bg-[#f0faf5] text-[#1dbf73]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">💰</span>
                          <span className="font-medium">支付宝</span>
                        </div>
                      </button>
                      <button
                        onClick={() => handleAccountTypeChange('bank')}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          withdrawAccountType === 'bank'
                            ? 'border-[#1dbf73] bg-[#f0faf5] text-[#1dbf73]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">💳</span>
                          <span className="font-medium">银行卡</span>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* 具体账户选择 */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-[#404145]">
                        选择{withdrawAccountType === 'alipay' ? '支付宝' : '银行卡'}账户
                      </label>
                      <button
                        onClick={() => setShowAddAccountForm(true)}
                        className="text-sm text-[#1dbf73] hover:underline flex items-center gap-1"
                      >
                        <span>+</span> 添加新账户
                      </button>
                    </div>

                    {getFilteredAccounts().length === 0 ? (
                      <div className="text-center py-6 bg-slate-50 rounded-lg">
                        <p className="text-[#74767e] mb-3 text-sm">
                          暂无{withdrawAccountType === 'alipay' ? '支付宝' : '银行卡'}账户
                        </p>
                        <Button
                          onClick={() => setShowAddAccountForm(true)}
                          size="sm"
                          className="bg-[#1dbf73] hover:bg-[#19a463]"
                        >
                          添加{withdrawAccountType === 'alipay' ? '支付宝' : '银行卡'}账户
                        </Button>
                      </div>
                    ) : (
                      <select
                        value={selectedAccountId}
                        onChange={(e) => setSelectedAccountId(e.target.value)}
                        className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                      >
                        {getFilteredAccounts().map((account) => (
                          <option key={account.id} value={account.id}>
                            {withdrawAccountType === 'alipay'
                              ? account.alipay.account
                              : account.bank.account}
                            {account.isDefault ? ' (默认)' : ''}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* 添加新账户表单 */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <label className="block text-sm font-medium text-[#404145]">添加提现账户</label>
                      <button
                        onClick={() => setShowAddAccountForm(false)}
                        className="text-sm text-[#74767e] hover:underline"
                      >
                        返回
                      </button>
                    </div>

                    {/* 账户类型选择 */}
                    <div className="flex gap-3 mb-4">
                      <button
                        onClick={() => setNewAccount({ ...newAccount, type: 'alipay' })}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          newAccount.type === 'alipay'
                            ? 'border-[#1dbf73] bg-[#f0faf5] text-[#1dbf73]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">💰</span>
                          <span className="font-medium">支付宝</span>
                        </div>
                      </button>
                      <button
                        onClick={() => setNewAccount({ ...newAccount, type: 'bank' })}
                        className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all ${
                          newAccount.type === 'bank'
                            ? 'border-[#1dbf73] bg-[#f0faf5] text-[#1dbf73]'
                            : 'border-slate-200 text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <span className="text-lg">💳</span>
                          <span className="font-medium">银行卡</span>
                        </div>
                      </button>
                    </div>

                    {/* 支付宝表单 */}
                    {newAccount.type === 'alipay' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">支付宝账号</label>
                          <input
                            type="text"
                            placeholder="请输入支付宝账号"
                            value={newAccount.alipay.account}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              alipay: { ...newAccount.alipay, account: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">真实姓名</label>
                          <input
                            type="text"
                            placeholder="请输入真实姓名"
                            value={newAccount.alipay.name}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              alipay: { ...newAccount.alipay, name: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">身份证号</label>
                          <input
                            type="text"
                            placeholder="请输入身份证号"
                            maxLength={18}
                            value={newAccount.alipay.idCard}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              alipay: { ...newAccount.alipay, idCard: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">手机号</label>
                          <input
                            type="tel"
                            placeholder="请输入手机号"
                            maxLength={11}
                            value={newAccount.alipay.phone}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              alipay: { ...newAccount.alipay, phone: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">验证码</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="请输入验证码"
                              maxLength={6}
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                            />
                            <button
                              onClick={handleSendCode}
                              disabled={countdown > 0}
                              className="px-4 py-2.5 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] disabled:bg-slate-300 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                            >
                              {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 银行卡表单 */}
                    {newAccount.type === 'bank' && (
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">真实姓名</label>
                          <input
                            type="text"
                            placeholder="请输入开户姓名"
                            value={newAccount.bank.name}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              bank: { ...newAccount.bank, name: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">身份证号</label>
                          <input
                            type="text"
                            placeholder="请输入身份证号"
                            maxLength={18}
                            value={newAccount.bank.idCard}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              bank: { ...newAccount.bank, idCard: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">银行卡号</label>
                          <input
                            type="text"
                            placeholder="请输入银行卡号"
                            value={newAccount.bank.account}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              bank: { ...newAccount.bank, account: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">手机号</label>
                          <input
                            type="tel"
                            placeholder="请输入手机号"
                            maxLength={11}
                            value={newAccount.bank.phone}
                            onChange={(e) => setNewAccount({
                              ...newAccount,
                              bank: { ...newAccount.bank, phone: e.target.value }
                            })}
                            className="w-full px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">验证码</label>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="请输入验证码"
                              maxLength={6}
                              value={verificationCode}
                              onChange={(e) => setVerificationCode(e.target.value)}
                              className="flex-1 px-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                            />
                            <button
                              onClick={handleSendCode}
                              disabled={countdown > 0}
                              className="px-4 py-2.5 bg-[#1dbf73] text-white rounded-lg hover:bg-[#19a463] disabled:bg-slate-300 disabled:cursor-not-allowed whitespace-nowrap text-sm"
                            >
                              {countdown > 0 ? `${countdown}秒` : '发送验证码'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <Button
                      onClick={handleAddAccount}
                      className="w-full mt-4 bg-[#1dbf73] hover:bg-[#19a463]"
                    >
                      保存账户
                    </Button>
                  </div>
                </>
              )}

              {/* 提现金额（只在非添加账户模式下且已选择账户时显示） */}
              {!showAddAccountForm && selectedAccountId && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-[#404145] mb-2">提现金额</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#74767e] font-medium">¥</span>
                      <input
                        type="number"
                        placeholder="请输入提现金额"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        className="w-full pl-8 pr-4 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] transition-colors"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs">
                      <span className="text-[#74767e]">可提现余额：¥9,200</span>
                      <button
                        onClick={() => setWithdrawAmount('9200')}
                        className="text-[#1dbf73] hover:underline"
                      >
                        全部提现
                      </button>
                    </div>
                  </div>

                  {/* 提示信息 */}
                  <div className="bg-blue-50 rounded-lg p-4 flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-blue-900">
                      <p className="font-medium mb-1">温馨提示</p>
                      <ul className="space-y-1 text-blue-700">
                        <li>• 单笔提现金额不得低于10元</li>
                        <li>• 提现手续费全免</li>
                        <li>• 预计1-2小时内到账</li>
                        <li>• 请确保账户信息准确无误</li>
                      </ul>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* 弹窗底部 */}
            {!showAddAccountForm && selectedAccountId && (
              <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowWithdrawModal(false)
                    setShowAddAccountForm(false)
                  }}
                >
                  取消
                </Button>
                <Button
                  onClick={handleWithdraw}
                  className="bg-[#1dbf73] hover:bg-[#19a463]"
                >
                  确认提现
                </Button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
