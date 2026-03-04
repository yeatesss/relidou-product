import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import {
  ShoppingCart,
  Users,
  MessageSquare,
  Wallet,
  Star,
  Plus,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  X,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const stats = [
  { title: '我的任务', value: '12', icon: ShoppingCart, color: 'bg-blue-500' },
  { title: '进行中', value: '3', icon: Clock, color: 'bg-yellow-500' },
  { title: '已完成', value: '8', icon: CheckCircle, color: 'bg-green-500' },
  { title: '总支出', value: '¥45,800', icon: DollarSign, color: 'bg-[#1dbf73]' },
]

const myOrders = [
  {
    id: 'ORD-2026-001',
    title: '美妆品牌抖音短视频',
    type: '爆款复刻',
    budget: '¥1,200',
    status: '进行中',
    bids: 5,
    acceptedCount: 2,
    submissionsReceived: 2,
    likedCount: 1,
    creator: '小明影视',
    deadline: '2026-02-26',
    createdAt: '2026-02-23',
    // 任务详细信息
    description: '面向短视频创作者的信息流广告视频制作任务',
    items: 4,
    price: 36,
    platform: '抖音',
    resolution: '9:16',
    taskTime: '48小时',
    acceptAI: '不接受',
    scene: '实景',
    style: '正式',
    dubbing: '普通话',
    startTime: '2026-02-23T10:00',
    endTime: '2026-02-26T18:00',
    coverImages: ['美妆样片1.jpg', '美妆样片2.jpg'],
  },
  {
    id: 'ORD-2026-002',
    title: '产品展示视频拍摄',
    type: '原创内容',
    budget: '¥2,500',
    status: '审核中',
    bids: 3,
    acceptedCount: 0,
    submissionsReceived: 0,
    likedCount: 0,
    creator: null,
    deadline: '2026-02-27',
    createdAt: '2026-02-22',
    description: '产品信息流广告视频拍摄制作',
    items: 5,
    price: 48,
    platform: '小红书',
    resolution: '9:16',
    taskTime: '48小时',
    acceptAI: '不接受',
    scene: '不限',
    style: '幽默',
    dubbing: '普通话',
    startTime: '2026-02-22T09:00',
    endTime: '2026-02-27T18:00',
    coverImages: ['产品样片1.jpg'],
  },
  {
    id: 'ORD-2026-003',
    title: '企业宣传片剪辑',
    type: '爆款复刻',
    budget: '¥5,000',
    status: '审核通过',
    bids: 8,
    acceptedCount: 8,
    submissionsReceived: 8,
    likedCount: 5,
    creator: '动画工坊',
    deadline: '2026-02-25',
    createdAt: '2026-02-20',
    description: '企业宣传短视频剪辑与后期制作',
    items: 3,
    price: 60,
    platform: '全平台',
    resolution: '4:3',
    taskTime: '24小时',
    acceptAI: '接受',
    scene: '外景',
    style: '正式',
    dubbing: '不限',
    startTime: '2026-02-20T08:00',
    endTime: '2026-02-25T20:00',
    coverImages: ['企业样片1.jpg', '企业样片2.jpg', '企业样片3.jpg'],
  },
  {
    id: 'ORD-2026-004',
    title: 'APP演示动画',
    type: '原创内容',
    budget: '¥8,000',
    status: '审核驳回',
    bids: 6,
    acceptedCount: 3,
    submissionsReceived: 3,
    likedCount: 2,
    creator: '三维视界',
    deadline: '2026-03-01',
    createdAt: '2026-02-19',
    description: '移动应用功能演示动画视频',
    items: 6,
    price: 72,
    platform: '抖音',
    resolution: '1:1',
    taskTime: '48小时',
    acceptAI: '不接受',
    scene: '特殊',
    style: '正式',
    dubbing: '方言',
    startTime: '2026-02-19T10:00',
    endTime: '2026-03-01T18:00',
    coverImages: ['APP样片1.jpg', 'APP样片2.jpg'],
  },
  {
    id: 'ORD-2026-005',
    title: '美食探店视频',
    type: '爆款复刻',
    budget: '¥3,800',
    status: '已下架',
    bids: 4,
    acceptedCount: 4,
    submissionsReceived: 4,
    likedCount: 3,
    creator: '味蕾视频',
    deadline: '2026-02-18',
    createdAt: '2026-02-15',
    description: '餐饮探店信息流短视频制作',
    items: 4,
    price: 42,
    platform: '视频号',
    resolution: '9:16',
    taskTime: '48小时',
    acceptAI: '不接受',
    scene: '实景',
    style: '正式',
    dubbing: '普通话',
    startTime: '2026-02-15T10:00',
    endTime: '2026-02-18T20:00',
    coverImages: ['美食样片1.jpg', '美食样片2.jpg'],
  },
  {
    id: 'ORD-2026-006',
    title: '健身教程合集',
    type: '原创内容',
    budget: '¥2,200',
    status: '已结束',
    bids: 7,
    acceptedCount: 7,
    submissionsReceived: 7,
    likedCount: 6,
    creator: '运动达人',
    deadline: '2026-02-10',
    createdAt: '2026-02-08',
    description: '健身运动类短视频教程制作',
    items: 10,
    price: 22,
    platform: '抖音',
    resolution: '9:16',
    taskTime: '72小时',
    acceptAI: '不接受',
    scene: '不限',
    style: '幽默',
    dubbing: '普通话',
    startTime: '2026-02-08T10:00',
    endTime: '2026-02-10T18:00',
    coverImages: ['健身样片1.jpg', '健身样片2.jpg'],
  },
]

const myBids = [
  {
    id: 1,
    creator: '小明影视',
    avatar: '/images/creator-1.jpg',
    order: '美妆品牌抖音短视频',
    price: '¥1,200',
    highlightVideo: '美妆高光.mp4',
    watermarkVideo: '美妆水印.mp4',
    status: '预审已通过',
    creatorId: 1,
  },
  {
    id: 2,
    creator: '视频达人',
    avatar: '/images/creator-1.jpg',
    order: '产品展示视频拍摄',
    price: '¥2,200',
    highlightVideo: '产品高光.mp4',
    watermarkVideo: '产品水印.mp4',
    status: '预审已通过',
    creatorId: 2,
  },
  {
    id: 3,
    creator: '创意工作室',
    avatar: '/images/creator-3.jpg',
    order: '产品展示视频拍摄',
    price: '¥2,800',
    highlightVideo: '创意高光.mp4',
    watermarkVideo: '创意水印.mp4',
    status: '已完成',
    creatorId: 3,
  },
]

const myCreators = [
  { id: 1, name: '小明影视', avatar: '/images/creator-1.jpg', title: '资深视频剪辑师', rating: 4.9, orders: 328, cooperations: 3, lastCooperation: '2026-02-20' },
  { id: 2, name: '动画工坊', avatar: '/images/creator-3.jpg', title: 'MG动画设计师', rating: 5.0, orders: 89, cooperations: 2, lastCooperation: '2026-02-15' },
  { id: 3, name: '三维视界', avatar: '/images/creator-3.jpg', title: '3D设计师', rating: 4.9, orders: 67, cooperations: 1, lastCooperation: '2026-01-28' },
]

const messages = [
  { id: 1, from: '小明影视', avatar: '/images/creator-1.jpg', content: '我已重新提交视频，请确认', time: '10:30', unread: true },
  { id: 2, from: '动画工坊', avatar: '/images/creator-3.jpg', content: '初稿已经发给您了，请查收', time: '昨天', unread: false },
]

const transactions = [
  { id: 1, type: '支出', title: '企业宣传片剪辑', amount: '-¥5,000', date: '2026-02-20', status: '已完成' },
  { id: 2, type: '支出', title: '美妆短视频拍摄', amount: '-¥1,200', date: '2026-02-18', status: '已完成' },
  { id: 3, type: '充值', title: '账户充值', amount: '+¥10,000', date: '2026-02-15', status: '已完成' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case '审核中':
      return 'bg-purple-100 text-purple-700'
    case '审核通过':
      return 'bg-green-100 text-green-700'
    case '审核驳回':
      return 'bg-red-100 text-red-700'
    case '进行中':
      return 'bg-blue-100 text-blue-700'
    case '已下架':
      return 'bg-gray-200 text-gray-700'
    case '已结束':
      return 'bg-slate-100 text-slate-700'
    case '预审已通过':
      return 'bg-green-100 text-green-700'
    case '已完成':
      return 'bg-blue-100 text-blue-700'
    case '订单冻结':
      return 'bg-orange-100 text-orange-700'
    default:
      return 'bg-slate-100 text-slate-700'
  }
}

export default function ClientWorkspace() {
  const navigate = useNavigate()
  const { isAuthenticated, isAdvertiserCertified, getAdvertiserCertificationStatus } = useAuth()
  const [activeTab, setActiveTab] = useState('orders')
  const [isVisible, setIsVisible] = useState(false)
  const [bidSearchKeyword, setBidSearchKeyword] = useState('')
  const [hasNewSubmission, setHasNewSubmission] = useState(true)
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [currentVideo, setCurrentVideo] = useState<{ title: string, type: string } | null>(null)
  const [frozenBids, setFrozenBids] = useState<Set<number>>(new Set())
  const [approvedBids, setApprovedBids] = useState<Set<number>>(new Set())
  const [showApproveModal, setShowApproveModal] = useState(false)
  const [pendingApproveId, setPendingApproveId] = useState<number | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [currentAuthBid, setCurrentAuthBid] = useState<any>(null)
  const [showModifyModal, setShowModifyModal] = useState(false)
  const [pendingModifyId, setPendingModifyId] = useState<number | null>(null)
  const [modifyComments, setModifyComments] = useState<Map<number, { id: number, content: string, time: string, bid: any }[]>>(new Map())
  const [currentModifyInput, setCurrentModifyInput] = useState('')
  const [showOrderDetailModal, setShowOrderDetailModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<typeof myOrders[0] | null>(null)
  const [orderStatusFilter, setOrderStatusFilter] = useState('全部')
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [currentReviewOrder, setCurrentReviewOrder] = useState<typeof myOrders[0] | null>(null)
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0)
  const [touchStart, setTouchStart] = useState<{ x: number; y: number } | null>(null)
  const [swipeDirection, setSwipeDirection] = useState<'left' | 'right' | 'up' | 'down' | null>(null)
  const [dragOffset, setDragOffset] = useState(0)
  const [isVerticalSwipe, setIsVerticalSwipe] = useState(false)
  const [showDislikeConfirm, setShowDislikeConfirm] = useState(false)
  const [showLikeConfirm, setShowLikeConfirm] = useState(false)
  const [bidStatusFilter, setBidStatusFilter] = useState('全部')

  useEffect(() => {
    // 检查登录状态
    if (!isAuthenticated) {
      navigate('/login')
      return
    }

    // 检查广告主认证状态
    if (!isAdvertiserCertified()) {
      const certificationStatus = getAdvertiserCertificationStatus()
      if (certificationStatus === 'not_submitted' || certificationStatus === 'rejected') {
        navigate('/advertiser-certification')
        return
      } else if (certificationStatus === 'pending') {
        // 显示审核中提示，阻止进入工作台
        alert('您的企业认证正在审核中，请耐心等待')
        navigate('/login')
        return
      }
    }

    setIsVisible(true)
  }, [isAuthenticated, isAdvertiserCertified, getAdvertiserCertificationStatus, navigate])

  // 防止在审片弹窗中滑动时触发页面滚动
  useEffect(() => {
    if (showReviewModal) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [showReviewModal])

  const handleReviewClick = (orderId: string) => {
    const order = myOrders.find(o => o.id === orderId)
    if (order) {
      setCurrentReviewOrder(order)
      setCurrentVideoIndex(0)
      setShowReviewModal(true)
    }
  }

  const handleSwipeLeft = () => {
    // 不喜欢 - 显示确认弹窗
    setShowDislikeConfirm(true)
  }

  const confirmDislike = () => {
    // 确认不喜欢 - 滑到下一个视频
    setShowDislikeConfirm(false)
    if (currentVideoIndex < 4) {
      setSwipeDirection('left')
      setDragOffset(0)
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev + 1)
        setSwipeDirection(null)
      }, 300)
    }
  }

  const handleSwipeRight = () => {
    // 喜欢 - 显示确认弹窗
    setShowLikeConfirm(true)
  }

  const confirmLike = () => {
    // 确认喜欢 - 滑到下一个视频
    setShowLikeConfirm(false)
    if (currentVideoIndex < 4) {
      setSwipeDirection('right')
      setDragOffset(0)
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev + 1)
        setSwipeDirection(null)
      }, 300)
    }
  }

  const handleSwipeUp = () => {
    // 向上滑动 - 直接切换到下一个视频（无需确认）
    if (currentVideoIndex < 4) {
      setSwipeDirection('up')
      setDragOffset(0)
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev + 1)
        setSwipeDirection(null)
      }, 300)
    }
  }

  const handleSwipeDown = () => {
    // 向下滑动 - 直接切换到下一个视频（无需确认）
    if (currentVideoIndex < 4) {
      setSwipeDirection('down')
      setDragOffset(0)
      setTimeout(() => {
        setCurrentVideoIndex(prev => prev + 1)
        setSwipeDirection(null)
      }, 300)
    }
  }

  // 处理滑动开始
  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    setTouchStart({ x: clientX, y: clientY })
  }

  // 处理滑动移动
  const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart) return

    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY
    const deltaX = clientX - touchStart.x
    const deltaY = clientY - touchStart.y

    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // 判断主要滑动方向（在移动超过10px后确定方向）
    if (absDeltaX > 10 || absDeltaY > 10) {
      if (absDeltaX > absDeltaY) {
        // 水平滑动
        setIsVerticalSwipe(false)
        const maxOffset = 150
        const clampedDelta = Math.max(-maxOffset, Math.min(maxOffset, deltaX))
        setDragOffset(clampedDelta)

        // 根据拖动方向设置提示
        if (clampedDelta < -20) {
          setSwipeDirection('left')
        } else if (clampedDelta > 20) {
          setSwipeDirection('right')
        } else {
          setSwipeDirection(null)
        }
      } else {
        // 垂直滑动
        setIsVerticalSwipe(true)
        const maxOffset = 150
        const clampedDelta = Math.max(-maxOffset, Math.min(maxOffset, deltaY))
        setDragOffset(-clampedDelta)

        // 根据拖动方向设置提示
        if (clampedDelta < -20) {
          setSwipeDirection('up')
        } else if (clampedDelta > 20) {
          setSwipeDirection('down')
        } else {
          setSwipeDirection(null)
        }
      }
    }
  }

  // 处理滑动结束
  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    if (!touchStart) return

    const clientX = 'changedTouches' in e ? e.changedTouches[0].clientX : e.clientX
    const clientY = 'changedTouches' in e ? e.changedTouches[0].clientY : e.clientY

    const deltaX = clientX - touchStart.x
    const deltaY = clientY - touchStart.y
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    const threshold = 50

    if (absDeltaX > threshold || absDeltaY > threshold) {
      if (absDeltaX > absDeltaY) {
        // 水平滑动占主导
        if (deltaX > 0) {
          // 向右滑动 - 喜欢
          handleSwipeRight()
        } else {
          // 向左滑动 - 不喜欢
          handleSwipeLeft()
        }
      } else {
        // 垂直滑动占主导 - 只切换视频
        if (deltaY < 0) {
          // 向上滑动
          handleSwipeUp()
        } else {
          // 向下滑动
          handleSwipeDown()
        }
      }
    } else {
      // 没有达到阈值，复位
      setDragOffset(0)
      setSwipeDirection(null)
    }

    setTouchStart(null)
    setIsVerticalSwipe(false)
  }

  const handleVideoClick = (videoTitle: string, videoType: string) => {
    setCurrentVideo({ title: videoTitle, type: videoType })
    setShowVideoModal(true)
  }

  const handleFreezeOrder = (bidId: number) => {
    setFrozenBids(prev => new Set(prev).add(bidId))
  }

  const handleApproveOrder = (bidId: number) => {
    setPendingApproveId(bidId)
    setShowApproveModal(true)
  }

  const confirmApproveOrder = () => {
    if (pendingApproveId !== null) {
      setApprovedBids(prev => new Set(prev).add(pendingApproveId))
      setShowApproveModal(false)
      setPendingApproveId(null)
    }
  }

  const handleDownloadVideo = (bid: any) => {
    // 下载水印完整版视频
    const link = document.createElement('a')
    link.href = bid.watermarkVideo
    link.download = bid.watermarkVideo
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleViewAuth = (bid: any) => {
    setCurrentAuthBid(bid)
    setShowAuthModal(true)
  }

  const handleModifyOrder = (bidId: number) => {
    setPendingModifyId(bidId)
    setCurrentModifyInput('')
    setShowModifyModal(true)
  }

  const confirmModify = () => {
    if (pendingModifyId !== null && currentModifyInput.trim()) {
      const bid = myBids.find(b => b.id === pendingModifyId)
      if (bid) {
        setModifyComments(prev => {
          const newMap = new Map(prev)
          const existing = newMap.get(pendingModifyId) || []
          const newComment = {
            id: Date.now(),
            content: currentModifyInput.trim(),
            time: new Date().toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
            bid: bid
          }
          newMap.set(pendingModifyId, [...existing, newComment])
          return newMap
        })
        setShowModifyModal(false)
        setPendingModifyId(null)
        setCurrentModifyInput('')
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`flex items-center justify-between mb-8 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div>
            <h1 className="text-2xl font-bold text-[#404145]">我的工作台</h1>
            <p className="text-[#74767e] mt-1">欢迎回来，管理您的任务和创作者</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => navigate('/post-order')}
              className="bg-[#1dbf73] hover:bg-[#19a463] text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              发布任务
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate('/creators')}
              className="border-[#e4e5e7]"
            >
              <Search className="w-4 h-4 mr-2" />
              找创作者
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
            <TabsList className="bg-white mb-6 p-1 rounded-xl">
              <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <ShoppingCart className="w-4 h-4 mr-2" />
                我的任务
              </TabsTrigger>
              <TabsTrigger value="bids" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <TrendingUp className="w-4 h-4 mr-2" />
                投标管理
              </TabsTrigger>
              <TabsTrigger value="creators" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <Users className="w-4 h-4 mr-2" />
                我的创作者
              </TabsTrigger>
              <TabsTrigger value="messages" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <MessageSquare className="w-4 h-4 mr-2" />
                消息
              </TabsTrigger>
              <TabsTrigger value="finance" className="rounded-lg data-[state=active]:bg-[#1dbf73] data-[state=active]:text-white">
                <Wallet className="w-4 h-4 mr-2" />
                财务
              </TabsTrigger>
            </TabsList>

            {/* Orders */}
            <TabsContent value="orders">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                {/* 搜索和状态筛选区域 */}
                <div className="p-5 border-b border-slate-100">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="搜索任务..."
                      className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  {/* 状态筛选 Tab */}
                  <div className="flex gap-2 flex-wrap">
                    {['全部', '审核中', '审核通过', '审核驳回', '进行中', '已下架', '已结束'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setOrderStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          orderStatusFilter === status
                            ? 'bg-[#1dbf73] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">任务信息</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">采购数量</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">已收到</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">已喜欢</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">已验收</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">状态</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">截止日</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myOrders
                      .filter((order) => orderStatusFilter === '全部' || order.status === orderStatusFilter)
                      .map((order) => (
                        <tr key={order.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4">
                            <p className="font-medium text-[#404145]">{order.title}</p>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setActiveTab('bids')}
                              className="text-sm font-medium text-[#1dbf73] hover:underline"
                            >
                              {order.bids}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setActiveTab('bids')}
                              className={`text-sm font-medium ${order.submissionsReceived > 0 ? 'text-[#1dbf73] hover:underline' : 'text-slate-400'}`}
                            >
                              {order.submissionsReceived}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setActiveTab('bids')}
                              className={`text-sm font-medium ${order.likedCount > 0 ? 'text-[#1dbf73] hover:underline' : 'text-slate-400'}`}
                            >
                              {order.likedCount}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => setActiveTab('bids')}
                              className={`text-sm font-medium ${order.acceptedCount > 0 ? 'text-[#1dbf73] hover:underline' : 'text-slate-400'}`}
                            >
                              {order.acceptedCount}
                            </button>
                          </td>
                          <td className="px-6 py-4">
                            <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{order.deadline}</td>
                          <td className="px-6 py-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  setSelectedOrder(order)
                                  setShowOrderDetailModal(true)
                                }}
                                className="px-3 py-1.5 text-sm text-[#74767e] hover:bg-slate-100 rounded-lg transition-colors"
                              >
                                查看详情
                              </button>
                              {order.status === '进行中' && (
                                <button
                                  onClick={() => handleReviewClick(order.id)}
                                  className="px-3 py-1.5 text-sm bg-[#1dbf73] text-white hover:bg-[#19a463] rounded-lg transition-colors"
                                >
                                  审片
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            {/* Bids */}
            <TabsContent value="bids">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="p-5 border-b border-slate-100">
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="搜索投标任务..."
                      value={bidSearchKeyword}
                      onChange={(e) => setBidSearchKeyword(e.target.value)}
                      className="w-full max-w-md px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  {/* 状态筛选 Tab */}
                  <div className="flex gap-2 flex-wrap">
                    {['全部', '预审已通过', '已完成', '订单冻结'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setBidStatusFilter(status)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          bidStatusFilter === status
                            ? 'bg-[#1dbf73] text-white'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {myBids
                    .filter((bid) => {
                      const matchesSearch = bid.order.toLowerCase().includes(bidSearchKeyword.toLowerCase())
                      const bidStatus = frozenBids.has(bid.id) ? '订单冻结' : approvedBids.has(bid.id) ? '已完成' : bid.status
                      const matchesStatus = bidStatusFilter === '全部' || bidStatus === bidStatusFilter
                      return matchesSearch && matchesStatus
                    })
                    .map((bid) => (
                      <div key={bid.id} className="p-5 hover:bg-slate-50">
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar className="w-14 h-14">
                            <AvatarImage src={bid.avatar} />
                            <AvatarFallback>{bid.creator[0]}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <p className="font-semibold text-[#404145] text-sm">{bid.creator}</p>
                              <Badge className={getStatusColor(frozenBids.has(bid.id) ? '订单冻结' : approvedBids.has(bid.id) ? '已完成' : bid.status)}>
                                {frozenBids.has(bid.id) ? '订单冻结' : approvedBids.has(bid.id) ? '已完成' : bid.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-xs text-[#74767e]">{bid.order}</span>
                              <span className="text-sm font-bold text-[#1dbf73]">{bid.price}</span>
                            </div>
                          </div>
                        </div>

                        {/* 视频展示区域 */}
                        <div className="flex gap-2 mb-3">
                          {/* 高光视频 */}
                          <div
                            className="bg-slate-50 rounded-lg p-1.5 cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0"
                            style={{ width: '140px' }}
                            onClick={() => handleVideoClick(bid.highlightVideo, '高光视频')}
                          >
                            <p className="text-xs text-[#74767e] mb-1">高光</p>
                            <div className="aspect-video bg-gradient-to-br from-[#003912] to-[#1dbf73] rounded flex items-center justify-center text-white/60">
                              <div className="text-center">
                                <div className="text-xs mb-0.5">▶️</div>
                                <div className="text-xs">{bid.highlightVideo}</div>
                              </div>
                            </div>
                          </div>

                          {/* 打水印视频 */}
                          <div
                            className="bg-slate-50 rounded-lg p-1.5 cursor-pointer hover:bg-slate-100 transition-colors flex-shrink-0"
                            style={{ width: '140px' }}
                            onClick={() => handleVideoClick(bid.watermarkVideo, '水印完整版')}
                          >
                            <p className="text-xs text-[#74767e] mb-1">水印完整版</p>
                            <div className="aspect-video bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded flex items-center justify-center text-white/60">
                              <div className="text-center">
                                <div className="text-xs mb-0.5">▶️</div>
                                <div className="text-xs">{bid.watermarkVideo}</div>
                              </div>
                            </div>
                          </div>

                          {/* 操作按钮 */}
                          <div className="flex gap-2 ml-auto items-start">
                            {frozenBids.has(bid.id) ? (
                              <Badge className={getStatusColor('订单冻结')}>订单冻结</Badge>
                            ) : approvedBids.has(bid.id) || bid.status === '已完成' ? (
                              <>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-xs"
                                  onClick={() => handleDownloadVideo(bid)}
                                >
                                  下载视频
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-xs"
                                  onClick={() => handleViewAuth(bid)}
                                >
                                  查看授权书
                                </Button>
                              </>
                            ) : bid.status === '预审已通过' ? (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-[#1dbf73] hover:bg-[#19a463] text-xs"
                                  onClick={() => handleApproveOrder(bid.id)}
                                >
                                  确认通过
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-xs"
                                  onClick={() => handleFreezeOrder(bid.id)}
                                >
                                  订单冻结
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-xs"
                                  onClick={() => handleModifyOrder(bid.id)}
                                >
                                  修改
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-xs"
                                  onClick={() => navigate(`/creators/${bid.creatorId}`)}
                                >
                                  查看创作者
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  size="sm"
                                  className="bg-[#1dbf73] hover:bg-[#19a463] text-xs"
                                  onClick={() => handleApproveOrder(bid.id)}
                                >
                                  确认通过
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-xs"
                                  onClick={() => handleFreezeOrder(bid.id)}
                                >
                                  订单冻结
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="border-slate-200 text-xs"
                                  onClick={() => handleModifyOrder(bid.id)}
                                >
                                  修改
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </TabsContent>

            {/* Creators */}
            <TabsContent value="creators">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {myCreators.map((creator) => (
                  <div key={creator.id} className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <div className="flex items-center gap-4">
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-[#404145]">{creator.name}</p>
                        <p className="text-sm text-[#74767e]">{creator.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                          <span className="text-sm font-medium">{creator.rating}</span>
                          <span className="text-sm text-[#74767e]">· {creator.orders}单</span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-100">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-[#74767e]">合作次数</span>
                        <span className="font-medium text-[#404145]">{creator.cooperations}次</span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-[#74767e]">最近合作</span>
                        <span className="font-medium text-[#404145]">{creator.lastCooperation}</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <Button size="sm" className="w-full bg-[#1dbf73] hover:bg-[#19a463]">
                        <Plus className="w-4 h-4 mr-1" />
                        发任务
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            {/* Messages */}
            <TabsContent value="messages">
              <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="divide-y divide-slate-100">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-4 hover:bg-slate-50 cursor-pointer ${msg.unread ? 'bg-blue-50/30' : ''}`}
                      onClick={() => setActiveTab('bids')}
                    >
                      <div className="flex items-start gap-4">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={msg.avatar} />
                          <AvatarFallback>{msg.from[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-[#404145]">{msg.from}</p>
                            <span className="text-sm text-[#74767e]">{msg.time}</span>
                          </div>
                          <p className="text-sm text-[#74767e] mt-1">{msg.content}</p>
                        </div>
                        {msg.unread && <span className="w-2 h-2 bg-red-500 rounded-full" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Finance */}
            <TabsContent value="finance">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 左侧交易记录 */}
                <div className="lg:col-span-2">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
                    <div className="p-5 border-b border-slate-100">
                      <h3 className="font-semibold text-[#404145]">交易记录</h3>
                    </div>

                    {/* 筛选区域 */}
                    <div className="p-5 border-b border-slate-100 bg-slate-50">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* 开始日期 */}
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">开始日期</label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                          />
                        </div>

                        {/* 结束日期 */}
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">结束日期</label>
                          <input
                            type="date"
                            className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                          />
                        </div>

                        {/* 类型筛选 */}
                        <div>
                          <label className="block text-sm font-medium text-[#404145] mb-2">类型</label>
                          <select className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]">
                            <option>全部</option>
                            <option>充值</option>
                            <option>支出</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <table className="w-full">
                      <thead className="bg-slate-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">类型</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">任务名称</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">金额</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">日期</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {transactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                              <Badge variant="secondary" className={tx.type === '充值' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}>
                                {tx.type}
                              </Badge>
                            </td>
                            <td className="px-6 py-4 text-sm text-[#404145]">{tx.title}</td>
                            <td className={`px-6 py-4 font-medium ${tx.amount.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                              {tx.amount}
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">{tx.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* 右侧账户余额 */}
                <div className="space-y-4">
                  <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100">
                    <p className="text-[#74767e] text-sm">账户余额</p>
                    <p className="text-3xl font-bold text-[#404145] mt-2">¥12,500</p>
                    <Button className="w-full mt-4 bg-[#1dbf73] hover:bg-[#19a463]">
                      立即充值
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* 视频播放弹窗 */}
      {showVideoModal && currentVideo && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowVideoModal(false)}>
          <div className="bg-white rounded-2xl p-6 max-w-3xl w-full shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-[#1a1a1a]">{currentVideo.type}</h3>
              <button
                onClick={() => setShowVideoModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>
            <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">▶️</div>
                <p className="text-lg opacity-80">{currentVideo.title}</p>
                <p className="text-sm opacity-60 mt-2">视频播放区域</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 确认通过弹窗 */}
      {showApproveModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1dbf73]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <CheckCircle className="w-6 h-6 text-[#1dbf73]" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">确认通过</h3>
            </div>
            <p className="text-[#74767e] text-base leading-relaxed mb-6">
              确认验收后，系统将扣除剩余预付尾款，同时交付无水印完整版和视频版权授权书，请确认是否通过。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowApproveModal(false)
                  setPendingApproveId(null)
                }}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-xl hover:bg-[#f5f5f5] transition-colors font-medium text-base"
              >
                取消
              </button>
              <button
                onClick={confirmApproveOrder}
                className="flex-1 py-3 bg-[#1dbf73] text-white rounded-xl hover:bg-[#19a463] transition-colors font-medium text-base"
              >
                确认通过
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 授权书弹窗 */}
      {showAuthModal && currentAuthBid && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4" onClick={() => setShowAuthModal(false)}>
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col" onClick={(e) => e.stopPropagation()}>
            {/* 头部 */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="text-xl font-bold text-[#1a1a1a]">视频内容授权书</h3>
              <button
                onClick={() => setShowAuthModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* PDF内容区域 */}
            <div className="flex-1 overflow-y-auto p-8 bg-slate-50">
              <div className="bg-white max-w-2xl mx-auto p-8 shadow-lg">
                {/* 授权书标题 */}
                <div className="text-center mb-8 pb-4 border-b-2 border-slate-200">
                  <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">视频内容授权书</h1>
                  <p className="text-sm text-[#74767e]">电子合同编号：{currentAuthBid.id ? `AUTH-${currentAuthBid.id}-${new Date().getFullYear()}` : 'AUTH-001-2026'}</p>
                </div>

                {/* 甲方信息 */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">甲方（广告主）</h2>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-[#74767e] w-24">公司名称：</span>
                      <span className="font-medium text-[#404145]">热力豆科技有限公司</span>
                    </div>
                    <div className="flex">
                      <span className="text-[#74767e] w-24">联系人：</span>
                      <span className="font-medium text-[#404145]">广告主负责人</span>
                    </div>
                    <div className="flex">
                      <span className="text-[#74767e] w-24">联系邮箱：</span>
                      <span className="font-medium text-[#404145]">contact@reluodou.com</span>
                    </div>
                  </div>
                </div>

                {/* 乙方信息 */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">乙方（创作者）</h2>
                  <div className="bg-slate-50 p-4 rounded-lg space-y-2 text-sm">
                    <div className="flex">
                      <span className="text-[#74767e] w-24">创作者：</span>
                      <span className="font-medium text-[#404145]">{currentAuthBid.creator}</span>
                    </div>
                    <div className="flex">
                      <span className="text-[#74767e] w-24">作品名称：</span>
                      <span className="font-medium text-[#404145]">{currentAuthBid.order}</span>
                    </div>
                    <div className="flex">
                      <span className="text-[#74767e] w-24">任务金额：</span>
                      <span className="font-medium text-[#1dbf73]">{currentAuthBid.price}</span>
                    </div>
                  </div>
                </div>

                {/* 授权内容 */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">授权内容</h2>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed text-[#404145] space-y-3">
                    <p>
                      <strong>1. 授权权利：</strong>
                      乙方（创作者）同意将视频作品的完整著作权，包括但不限于复制权、发行权、信息网络传播权、改编权、翻译权、汇编权、表演权、放映权、广播权、制作权等全部著作财产权授权给甲方使用。
                    </p>
                    <p>
                      <strong>2. 授权范围：</strong>
                      甲方可在其指定的商业渠道、平台及宣传材料中使用该视频，包括但不限于抖音、快手、视频号、公众号、电视广告、电商平台等各类媒体平台。
                    </p>
                    <p>
                      <strong>3. 授权期限：</strong>
                      自授权书签署之日起，授权期限为<span className="text-[#1dbf73] font-bold">永久</span>有效。
                    </p>
                    <p>
                      <strong>4. 授权地域：</strong>
                      全球范围内。
                    </p>
                    <p>
                      <strong>5. 使用方式：</strong>
                      甲方有权对视频进行剪辑、配音、添加字幕、特效处理等二次创作，无需另行征得乙方同意。
                    </p>
                    <p>
                      <strong>6. 独占性：</strong>
                      本授权为独占性授权，乙方不得将同一作品或其衍生作品授权给第三方使用。
                    </p>
                  </div>
                </div>

                {/* 法律效力 */}
                <div className="mb-6">
                  <h2 className="text-lg font-bold text-[#1a1a1a] mb-3">法律效力</h2>
                  <div className="bg-slate-50 p-4 rounded-lg text-sm leading-relaxed text-[#404145]">
                    <p className="mb-3">
                      <strong>1. 电子合同效力：</strong>
                      本授权书以电子合同形式签署，具有与纸质合同同等的法律效力。平台采用时间戳和哈希值技术确保合同的完整性和不可篡改性。
                    </p>
                    <p className="mb-3">
                      <strong>2. 法律证据：</strong>
                      本授权书附带的时间戳（{new Date().toLocaleString('zh-CN')}）和哈希值值作为法律证据，可用于司法诉讼、版权登记等法律程序。
                    </p>
                    <p>
                      <strong>3. 权利保证：</strong>
                      乙方保证对其创作的视频作品拥有完整的著作权，不存在侵犯第三方知识产权的情形。如因版权纠纷产生的一切法律责任由乙方承担。
                    </p>
                  </div>
                </div>

                {/* 签署信息 */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-[#1a1a1a] mb-2">甲方（广告主）</p>
                    <div className="text-xs text-[#74767e] space-y-1">
                      <p>签署日期：{new Date().toLocaleDateString('zh-CN')}</p>
                      <p>时间戳：{Date.now()}</p>
                      <p>哈希值：{Math.random().toString(36).substring(2, 15)}{Math.random().toString(36).substring(2, 15)}</p>
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded-lg p-4">
                    <p className="text-sm font-bold text-[#1a1a1a] mb-2">乙方（创作者）</p>
                    <div className="text-xs text-[#74767e] space-y-1">
                      <p>签署日期：{new Date().toLocaleDateString('zh-CN')}</p>
                      <p>时间戳：{Date.now()}</p>
                      <p>哈希值：{Math.random().toString(36).substring(2, 15)}{Math.random().toString(36).substring(2, 15)}</p>
                    </div>
                  </div>
                </div>

                {/* 免责声明 */}
                <div className="bg-[#fff7ed] border-l-4 border-[#f97316] p-4 rounded-r-lg">
                  <p className="text-sm text-[#9a7a69]">
                    <strong>免责声明：</strong>
                    本授权书由平台根据甲乙双方交易记录自动生成。平台仅提供技术支持和存储服务，不对授权内容的真实性和合法性承担责任。如授权内容与事实不符，由提供虚假信息的一方承担全部法律责任。
                  </p>
                </div>
              </div>
            </div>

            {/* 底部操作 */}
            <div className="p-6 border-t border-slate-100 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.print()
                  }}
                  className="flex-1 py-3 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-xl transition-colors font-medium text-sm"
                >
                  打印授权书
                </button>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-xl hover:bg-[#f5f5f5] transition-colors font-medium text-sm"
                >
                  关闭
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 修改意见弹窗 */}
      {showModifyModal && pendingModifyId !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1dbf73]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <MessageSquare className="w-6 h-6 text-[#1dbf73]" />
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-[#1a1a1a]">修改意见</h3>
                <p className="text-sm text-[#74767e]">创作者将收到您的修改意见并重新提交</p>
              </div>
            </div>

            {/* 当前投标信息 */}
            {(() => {
              const currentBid = myBids.find(b => b.id === pendingModifyId)
              if (!currentBid) return null
              return (
                <div className="mb-4 p-4 bg-slate-50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={currentBid.avatar} />
                      <AvatarFallback>{currentBid.creator[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold text-[#404145]">{currentBid.creator}</p>
                      <p className="text-sm text-[#74767e]">{currentBid.order}</p>
                    </div>
                    <span className="text-lg font-bold text-[#1dbf73]">{currentBid.price}</span>
                  </div>
                </div>
              )
            })()}

            {/* 历史修改意见 */}
            {modifyComments.has(pendingModifyId) && modifyComments.get(pendingModifyId)!.length > 0 && (
              <div className="mb-4">
                <p className="text-sm font-medium text-[#404145] mb-3">历史修改意见</p>
                <div className="max-h-40 overflow-y-auto space-y-2">
                  {modifyComments.get(pendingModifyId)!.map((comment) => (
                    <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                      <p className="text-sm text-[#404145]">{comment.content}</p>
                      <p className="text-xs text-[#74767e] mt-1">{comment.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 输入框 */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-[#404145] mb-2">
                请描述需要修改的内容 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={currentModifyInput}
                onChange={(e) => setCurrentModifyInput(e.target.value)}
                placeholder="请详细说明您希望创作者修改的地方，例如：镜头切换不够流畅、背景音乐需要更换、字幕位置需要调整等..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#1dbf73] resize-none"
                rows={5}
                maxLength={500}
              />
              <p className="text-xs text-[#74767e] mt-1 text-right">
                {currentModifyInput.length}/500
              </p>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowModifyModal(false)
                  setPendingModifyId(null)
                  setCurrentModifyInput('')
                }}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-xl hover:bg-[#f5f5f5] transition-colors font-medium text-base"
              >
                取消
              </button>
              <button
                onClick={confirmModify}
                disabled={!currentModifyInput.trim()}
                className={`flex-1 py-3 rounded-xl transition-colors font-medium text-base ${
                  currentModifyInput.trim()
                    ? 'bg-[#1dbf73] hover:bg-[#19a463] text-white'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                发送修改意见
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 任务详情弹窗 */}
      {showOrderDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            {/* 弹窗头部 */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e4e5e7]">
              <h2 className="text-xl font-bold text-[#1a1a1a]">任务详情</h2>
              <button
                onClick={() => setShowOrderDetailModal(false)}
                className="text-[#74767e] hover:text-[#404145] transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 弹窗内容 */}
            <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
              {/* 任务标题和类型 */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-[#1a1a1a] mb-2">{selectedOrder.title}</h3>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#1dbf73] text-white text-sm rounded">{selectedOrder.type}</span>
                </div>
              </div>

              {/* 佣金价格 */}
              <div className="mb-6">
                <div className="flex items-center justify-between p-4 bg-[#f0faf5] border border-[#d4f0e3] rounded-lg">
                  <div className="text-sm text-[#74767e]">佣金价格</div>
                  <div className="text-3xl font-bold text-[#1dbf73]">¥{selectedOrder.price}</div>
                </div>
              </div>

              {/* 任务参数网格 */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {/* 素材条数 */}
                <div className="bg-[#f7f7f7] rounded-lg p-4">
                  <div className="text-xs text-[#74767e] mb-1">素材条数</div>
                  <div className="text-lg font-bold text-[#1a1a1a]">{selectedOrder.items} 条</div>
                </div>

                {/* AI创作 */}
                <div className="bg-[#f7f7f7] rounded-lg p-4">
                  <div className="text-xs text-[#74767e] mb-1">AI创作</div>
                  <div className="text-sm font-medium text-[#1a1a1a]">{selectedOrder.acceptAI}</div>
                </div>

                {/* 投放平台 */}
                <div className="bg-[#f7f7f7] rounded-lg p-4">
                  <div className="text-xs text-[#74767e] mb-1">投放平台</div>
                  <div className="text-sm font-medium text-[#1a1a1a]">{selectedOrder.platform}</div>
                </div>

                {/* 场景要求 */}
                <div className="bg-[#f7f7f7] rounded-lg p-4">
                  <div className="text-xs text-[#74767e] mb-1">场景要求</div>
                  <div className="text-sm font-medium text-[#1a1a1a]">{selectedOrder.scene}</div>
                </div>

                {/* 视频风格 */}
                <div className="bg-[#f7f7f7] rounded-lg p-4">
                  <div className="text-xs text-[#74767e] mb-1">视频风格</div>
                  <div className="text-sm font-medium text-[#1a1a1a]">{selectedOrder.style}</div>
                </div>

                {/* 配音要求 */}
                <div className="bg-[#f7f7f7] rounded-lg p-4">
                  <div className="text-xs text-[#74767e] mb-1">配音要求</div>
                  <div className="text-sm font-medium text-[#1a1a1a]">{selectedOrder.dubbing}</div>
                </div>

                {/* 任务时效 */}
                <div className="bg-[#f7f7f7] rounded-lg p-4">
                  <div className="text-xs text-[#74767e] mb-1">任务时效</div>
                  <div className="text-sm font-medium text-[#1a1a1a]">{selectedOrder.taskTime}</div>
                </div>
              </div>

              {/* 任务时间 */}
              <div className="mb-6">
                <div className="text-sm font-medium text-[#404145] mb-3">任务时间</div>
                <div className="flex items-center gap-2 text-sm text-[#74767e]">
                  <Clock className="w-4 h-4 text-[#1dbf73]" />
                  <span>{new Date(selectedOrder.startTime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                  <span>~</span>
                  <span>{new Date(selectedOrder.endTime).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              </div>

              {/* 参考视频/图片 */}
              {selectedOrder.coverImages && selectedOrder.coverImages.length > 0 && (
                <div className="mb-6">
                  <div className="text-sm font-medium text-[#404145] mb-3">参考视频/图片</div>
                  <div className="grid grid-cols-4 gap-3">
                    {selectedOrder.coverImages.map((img, i) => (
                      <div key={i} className="aspect-video bg-gradient-to-br from-[#003912] to-[#1dbf73] rounded-lg flex items-center justify-center text-white/60">
                        <div className="text-center">
                          <div className="text-xs mb-1">{img}</div>
                          <div className="text-xs">参考{i + 1}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 任务描述 */}
              <div>
                <div className="text-sm font-medium text-[#404145] mb-3">任务描述</div>
                <div className="bg-[#f7f7f7] rounded-lg p-4 text-sm text-[#74767e]">
                  <p className="leading-relaxed">{selectedOrder.description}</p>
                </div>
              </div>
            </div>

            {/* 弹窗底部 */}
            <div className="px-6 py-4 border-t border-[#e4e5e7] flex justify-end">
              <button
                onClick={() => setShowOrderDetailModal(false)}
                className="px-6 py-2 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-lg transition-colors font-medium"
              >
                关闭
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 审片弹窗 */}
      {showReviewModal && currentReviewOrder && (
        <div className="fixed inset-0 bg-[#1a1a1a] flex items-center justify-center z-50">
          <div className="relative w-full max-w-lg h-[85vh] flex flex-col">
            {/* 关闭按钮 */}
            <button
              onClick={() => setShowReviewModal(false)}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            {/* 任务信息 */}
            <div className="absolute top-4 left-4 z-10">
              <p className="text-white text-lg font-semibold">{currentReviewOrder.title}</p>
              <p className="text-white/70 text-sm mt-1">投稿 {currentVideoIndex + 1}/5</p>
            </div>

            {/* 当前视频卡片 */}
            <div className="flex-1 flex items-center justify-center px-4">
              {(() => {
                const videos = [
                  { id: 1, video: '美妆高光.mp4', submitTime: '2小时前', gradient: 'from-[#003912] to-[#1dbf73]' },
                  { id: 2, video: '产品展示.mp4', submitTime: '3小时前', gradient: 'from-[#1a1a2e] to-[#16213e]' },
                  { id: 3, video: '创意视频.mp4', submitTime: '5小时前', gradient: 'from-[#2d1b69] to-[#11998e]' },
                  { id: 4, video: '动画演示.mp4', submitTime: '1天前', gradient: 'from-[#c94b4b] to-[#4b134f]' },
                  { id: 5, video: '3D展示.mp4', submitTime: '1天前', gradient: 'from-[#f97316] to-[#ea580c]' },
                ]
                const currentVideo = videos[currentVideoIndex]

                return (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    {/* 视频卡片 */}
                    <div
                      className={`relative w-full aspect-[9/16] max-h-[65vh] bg-gradient-to-br from-[#1a1a2e] to-[#16213e] rounded-3xl overflow-hidden shadow-2xl transition-transform duration-75`}
                      style={{
                        transform: isVerticalSwipe
                          ? `translateY(${dragOffset}px)`
                          : `translateX(${dragOffset}px) rotate(${dragOffset * 0.05}deg)`,
                        opacity: 1 - Math.abs(dragOffset) / 300,
                        cursor: touchStart ? 'grabbing' : 'grab'
                      }}
                      onMouseDown={handleTouchStart}
                      onMouseUp={handleTouchEnd}
                      onMouseMove={handleTouchMove}
                      onMouseLeave={() => {
                        if (touchStart) {
                          setDragOffset(0)
                          setSwipeDirection(null)
                          setTouchStart(null)
                          setIsVerticalSwipe(false)
                        }
                      }}
                      onTouchStart={handleTouchStart}
                      onTouchEnd={handleTouchEnd}
                      onTouchMove={handleTouchMove}
                    >
                      {/* 视频内容 */}
                      <div
                        className={`absolute inset-0 bg-gradient-to-br ${currentVideo.gradient} flex items-center justify-center cursor-pointer select-none`}
                        onClick={() => handleVideoClick(currentVideo.video, '投稿视频')}
                      >
                        <div className="text-center text-white pointer-events-none">
                          <div className="text-6xl mb-3 opacity-80">▶️</div>
                          <div className="text-lg font-medium opacity-90">{currentVideo.video}</div>
                        </div>
                      </div>

                      {/* 滑动指示器 - 不喜欢（仅水平滑动） */}
                      {!isVerticalSwipe && dragOffset < -20 && (
                        <div
                          className="absolute top-1/2 left-6 -translate-y-1/2 border-4 border-red-500 text-red-500 px-6 py-3 rounded-xl transition-opacity"
                          style={{ opacity: Math.min(1, Math.abs(dragOffset) / 80) }}
                        >
                          <span className="text-4xl font-bold">不喜欢</span>
                        </div>
                      )}

                      {/* 滑动指示器 - 喜欢（仅水平滑动） */}
                      {!isVerticalSwipe && dragOffset > 20 && (
                        <div
                          className="absolute top-1/2 right-6 -translate-y-1/2 border-4 border-[#1dbf73] text-[#1dbf73] px-6 py-3 rounded-xl transition-opacity"
                          style={{ opacity: Math.min(1, Math.abs(dragOffset) / 80) }}
                        >
                          <span className="text-4xl font-bold">喜欢</span>
                        </div>
                      )}

                      {/* 滑动指示器 - 下一个（垂直滑动） */}
                      {isVerticalSwipe && Math.abs(dragOffset) > 20 && (
                        <div
                          className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-sm transition-opacity"
                          style={{ opacity: Math.min(0.8, Math.abs(dragOffset) / 100) }}
                        >
                          <div className="text-white text-2xl font-bold">下一个视频</div>
                        </div>
                      )}

                      {/* 提交时间 */}
                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-black/40 backdrop-blur-sm rounded-lg px-4 py-2">
                          <p className="text-white text-sm">投稿时间：{currentVideo.submitTime}</p>
                        </div>
                      </div>

                      {/* 进度指示 */}
                      <div className="absolute top-6 left-6 flex gap-1.5">
                        {videos.map((_, i) => (
                          <div
                            key={i}
                            className={`h-1 rounded-full transition-all ${
                              i === currentVideoIndex
                                ? 'w-8 bg-white'
                                : i < currentVideoIndex
                                ? 'w-6 bg-white/50'
                                : 'w-2 bg-white/30'
                            }`}
                          />
                        ))}
                      </div>
                    </div>

                    {/* 左右操作按钮 */}
                    {currentVideoIndex < videos.length - 1 ? (
                      <div className="flex items-center justify-center gap-6 mt-8 w-full">
                        <button
                          onClick={handleSwipeLeft}
                          className="w-16 h-16 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        >
                          <X className="w-8 h-8" />
                        </button>
                        <button
                          onClick={handleSwipeRight}
                          className="w-16 h-16 rounded-full bg-[#1dbf73] hover:bg-[#19a463] text-white shadow-lg flex items-center justify-center transition-all hover:scale-110 active:scale-95"
                        >
                          <Star className="w-8 h-8 fill-current" />
                        </button>
                      </div>
                    ) : (
                      /* 全部审完的完成按钮 */
                      <div className="flex items-center justify-center mt-8 w-full">
                        <button
                          onClick={() => setShowReviewModal(false)}
                          className="px-12 py-4 bg-[#1dbf73] hover:bg-[#19a463] text-white rounded-full text-lg font-semibold shadow-lg transition-all hover:scale-105 active:scale-95"
                        >
                          审核完成
                        </button>
                      </div>
                    )}

                    {/* 提示文字 */}
                    {currentVideoIndex < videos.length - 1 && (
                      <div className="flex flex-col items-center gap-3 mt-4 w-full text-white/50 text-xs">
                        <div className="flex items-center justify-center gap-2">
                          <span>↑↓ 上下切换</span>
                          <span>|</span>
                          <span>←→ 不喜欢/喜欢</span>
                        </div>
                      </div>
                    )}
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* 不喜欢确认弹窗 */}
      {showDislikeConfirm && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">确认不喜欢</h3>
            </div>
            <p className="text-[#74767e] text-base leading-relaxed mb-6">
              点击不喜欢后，该视频将无法找回。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDislikeConfirm(false)}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-xl hover:bg-[#f5f5f5] transition-colors font-medium text-base"
              >
                取消
              </button>
              <button
                onClick={confirmDislike}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium text-base"
              >
                确认不喜欢
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 喜欢确认弹窗 */}
      {showLikeConfirm && currentReviewOrder && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1dbf73]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-[#1dbf73] fill-current" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">确认喜欢</h3>
            </div>
            <p className="text-[#74767e] text-base leading-relaxed mb-6">
              确认喜欢后，系统将自动扣除{currentReviewOrder.price}元预付佣金，请确认。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLikeConfirm(false)}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-xl hover:bg-[#f5f5f5] transition-colors font-medium text-base"
              >
                取消
              </button>
              <button
                onClick={confirmLike}
                className="flex-1 py-3 bg-[#1dbf73] text-white rounded-xl hover:bg-[#19a463] transition-colors font-medium text-base"
              >
                确认喜欢
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
