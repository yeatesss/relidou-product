// ─── 运营后台 Mock 数据 ────────────────────────────────────────────────

// 仪表板统计数据
export const dashboardStats = {
  // 用户统计
  totalUsers: 12580,
  totalAdvertisers: 3520,
  totalCreators: 9060,
  newUsersToday: 87,
  newUsersThisMonth: 1245,

  // 认证统计
  pendingAdvertiserCertifications: 23,
  approvedAdvertiserCertifications: 3250,
  pendingCreatorVerifications: 45,

  // 任务统计
  totalTasks: 8920,
  pendingTasks: 56,
  approvedTasks: 7580,
  activeTasks: 2340,
  completedTasks: 6524,

  // 订单统计
  totalOrders: 15680,
  pendingOrders: 234,
  inProgressOrders: 1560,
  completedOrders: 13886,
  frozenOrders: 12,

  // 财务统计
  totalRevenue: '¥2,580,000',
  todayRevenue: '¥45,800',
  monthRevenue: '¥1,258,000',
  pendingPayments: '¥186,500',
}

// 广告主认证数据
export const advertiserCertifications = [
  {
    id: 'cert-001',
    userId: 'user-001',
    companyName: '杭州热力豆科技有限公司',
    businessLicense: 'https://example.com/license-001.jpg',
    creditCode: '91330100MA2ABCDE5',
    legalPerson: '张三',
    registeredAddress: '浙江省杭州市余杭区文一西路969号',
    validUntil: '2028-06-15',
    status: 'pending' as const,
    submittedAt: '2026-03-12 10:30',
  },
  {
    id: 'cert-002',
    userId: 'user-002',
    companyName: '上海花漾美妆有限公司',
    businessLicense: 'https://example.com/license-002.jpg',
    creditCode: '91310000MA1X5Y6Z7W',
    legalPerson: '李四',
    registeredAddress: '上海市浦东新区张江高科技园区',
    validUntil: '2027-12-31',
    status: 'pending' as const,
    submittedAt: '2026-03-11 15:20',
  },
  {
    id: 'cert-003',
    userId: 'user-003',
    companyName: '北京互联科技工作室',
    businessLicense: 'https://example.com/license-003.jpg',
    creditCode: '91110100MA3P4Q5R6S',
    legalPerson: '王五',
    registeredAddress: '北京市海淀区中关村大街1号',
    validUntil: '2026-08-20',
    status: 'approved' as const,
    submittedAt: '2026-03-10 09:15',
    reviewedAt: '2026-03-10 16:30',
    reviewedBy: 'admin-001',
  },
  {
    id: 'cert-004',
    userId: 'user-004',
    companyName: '广州潮流服饰贸易商行',
    businessLicense: 'https://example.com/license-004.jpg',
    creditCode: '91440100MA2K3L4M5N',
    legalPerson: '赵六',
    registeredAddress: '广东省广州市天河区珠江新城',
    validUntil: '2029-05-10',
    status: 'rejected' as const,
    submittedAt: '2026-03-09 14:00',
    reviewedAt: '2026-03-10 11:20',
    reviewedBy: 'admin-002',
    rejectReason: '营业执照图片不清晰，请重新上传清晰版本',
  },
]

// 创作者数据
export const creators = [
  {
    id: 'creator-001',
    userId: 'user-101',
    nickname: '视频达人小王',
    avatar: 'https://example.com/avatar-001.jpg',
    realName: '王*',
    idCard: '310101********1234',
    phone: '138****5678',
    city: '上海',
    birthday: '1995-06-15',
    languages: ['普通话', '英语'],
    skills: ['好物测评', '口播分享', '剪辑混剪'],
    bio: '专注短视频制作5年，擅长产品测评和知识分享',
    bankName: '中国工商银行',
    bankAccount: '6217************1234',
    bankVerified: true,
    completedAt: '2026-01-15 10:00',
    status: 'active' as const,
    totalOrders: 156,
    completedOrders: 148,
    averageRating: 4.8,
    totalEarnings: '¥128,500',
    createdAt: '2025-12-01',
  },
  {
    id: 'creator-002',
    userId: 'user-102',
    nickname: '创意工作室',
    avatar: 'https://example.com/avatar-002.jpg',
    realName: '李*',
    idCard: '310101********5678',
    phone: '139****8765',
    city: '北京',
    birthday: '1992-03-22',
    languages: ['普通话', '日语'],
    skills: ['搞笑创意', '干货讲解', '即时访谈'],
    bio: '专业视频制作团队，提供创意短视频服务',
    bankName: '中国建设银行',
    bankAccount: '6217************5678',
    bankVerified: true,
    completedAt: '2026-02-01 15:30',
    status: 'active' as const,
    totalOrders: 234,
    completedOrders: 225,
    averageRating: 4.9,
    totalEarnings: '¥256,800',
    createdAt: '2025-11-15',
  },
  {
    id: 'creator-003',
    userId: 'user-103',
    nickname: '美妆博主小美',
    avatar: 'https://example.com/avatar-003.jpg',
    realName: '张*',
    idCard: '310101********9012',
    phone: '137****4321',
    city: '杭州',
    birthday: '1998-09-10',
    languages: ['普通话', '韩语'],
    skills: ['好物种草', '电商', '口播分享'],
    bio: '美妆领域专业创作者，擅长产品推荐和使用教程',
    bankName: '招商银行',
    bankAccount: '6214************9012',
    bankVerified: true,
    completedAt: '2026-02-20 11:00',
    status: 'active' as const,
    totalOrders: 89,
    completedOrders: 85,
    averageRating: 4.7,
    totalEarnings: '¥67,200',
    createdAt: '2026-01-10',
  },
  {
    id: 'creator-004',
    userId: 'user-104',
    nickname: '新手创作者',
    avatar: 'https://example.com/avatar-004.jpg',
    realName: '刘*',
    idCard: '310101********3456',
    phone: '136****7890',
    city: '深圳',
    birthday: '2000-05-20',
    languages: ['普通话', '粤语'],
    skills: ['剪辑混剪'],
    bio: '新人创作者，努力学习提升中',
    bankName: '中国银行',
    bankAccount: '6216************3456',
    bankVerified: false,
    completedAt: '2026-03-05 09:30',
    status: 'active' as const,
    totalOrders: 5,
    completedOrders: 3,
    averageRating: 4.5,
    totalEarnings: '¥1,800',
    createdAt: '2026-03-01',
  },
  {
    id: 'creator-005',
    userId: 'user-105',
    nickname: '违规用户',
    avatar: 'https://example.com/avatar-005.jpg',
    realName: '陈*',
    idCard: '310101********7890',
    phone: '135****2345',
    city: '广州',
    birthday: '1993-11-30',
    languages: ['普通话'],
    skills: ['电商', '好物种草'],
    bio: '电商视频创作者',
    bankName: '中国农业银行',
    bankAccount: '6228************7890',
    bankVerified: true,
    completedAt: '2026-01-20 14:00',
    status: 'banned' as const,
    totalOrders: 23,
    completedOrders: 18,
    averageRating: 3.2,
    totalEarnings: '¥12,600',
    createdAt: '2025-12-20',
  },
]

// 任务审核数据
export const taskReviews = [
  {
    id: 'review-001',
    taskId: 'task-001',
    advertiserId: 'user-001',
    advertiserName: '热力豆科技',
    advertiserCompany: '杭州热力豆科技有限公司',

    title: '美妆抖音信息流视频素材制作',
    type: '爆款复刻' as const,
    budget: '200',

    basicRequirements: '需要制作美妆产品推广视频，要求画面精美、产品展示清晰',
    mandatoryRequirements: '视频中必须出现产品特写镜头，时长15-30秒，竖屏拍摄',
    optionalRequirements: '如能加入使用效果对比更佳',
    supplementaryInfo: '参考品牌：完美日记、花西子的视频风格',

    items: '4',
    acceptAI: '不接受',
    scene: '不限',
    style: '正式',
    dubbing: '普通话',
    platform: ['抖音', '快手'],
    resolution: '9:16',
    taskTime: '72小时',

    coverImages: ['https://example.com/cover-001.jpg', 'https://example.com/cover-002.jpg'],

    startTime: '2026-03-15',
    endTime: '2026-03-20',
    submittedAt: '2026-03-12 14:30',

    aiReviewScore: 85,
    aiReviewStatus: 'pass' as const,
    aiReviewSuggestions: [],
    aiReviewOverall: '任务信息完整，要求明确，符合平台规范。',

    status: 'pending' as const,
  },
  {
    id: 'review-002',
    taskId: 'task-002',
    advertiserId: 'user-002',
    advertiserName: '花漾美妆',
    advertiserCompany: '上海花漾美妆有限公司',

    title: '本地生活探店视频拍摄剪辑',
    type: '原创内容' as const,
    budget: '300',

    basicRequirements: '拍摄本地餐厅探店视频',
    mandatoryRequirements: '时长30-60秒',
    optionalRequirements: '无',
    supplementaryInfo: '',

    items: '2',
    acceptAI: '接受',
    scene: '实景',
    style: '不限',
    dubbing: '普通话',
    platform: ['小红书'],
    resolution: '9:16',
    taskTime: '72小时',

    coverImages: [],

    startTime: '2026-03-18',
    endTime: '2026-03-25',
    submittedAt: '2026-03-12 10:15',

    aiReviewScore: 65,
    aiReviewStatus: 'warning' as const,
    aiReviewSuggestions: [
      {
        type: '基础要求',
        content: '任务描述过于简单，建议补充更多细节，如：目标餐厅类型、视频风格偏好、是否需要出镜等',
        priority: 'high' as const,
      },
      {
        type: '任务参数',
        content: '素材条数为2条，建议明确是否为同一餐厅的不同角度展示',
        priority: 'medium' as const,
      },
    ],
    aiReviewOverall: '任务基本信息完整，但描述较为简单，建议补充更多细节要求，以获得更符合预期的作品。',

    status: 'pending' as const,
  },
  {
    id: 'review-003',
    taskId: 'task-003',
    advertiserId: 'user-003',
    advertiserName: '互联科技',
    advertiserCompany: '北京互联科技工作室',

    title: '电商产品种草视频KOC真人出镜',
    type: '爆款复刻' as const,
    budget: '150',

    basicRequirements: '需要真人出镜介绍产品',
    mandatoryRequirements: '必须真人出镜',
    optionalRequirements: '无',
    supplementaryInfo: '',

    items: '3',
    acceptAI: '不接受',
    scene: '不限',
    style: '幽默',
    dubbing: '方言',
    platform: ['抖音', '视频号'],
    resolution: '9:16',
    taskTime: '48小时',

    coverImages: ['https://example.com/cover-003.jpg'],

    startTime: '2026-03-14',
    endTime: '2026-03-16',
    submittedAt: '2026-03-11 16:45',

    aiReviewScore: 78,
    aiReviewStatus: 'warning' as const,
    aiReviewSuggestions: [
      {
        type: '硬性要求',
        content: '建议补充具体的产品类型信息',
        priority: 'medium' as const,
      },
    ],
    aiReviewOverall: '任务基本要求明确，建议补充产品类型等细节信息。',

    status: 'modifying' as const,
    reviewedAt: '2026-03-12 09:30',
    reviewedBy: 'admin-001',
    modifySuggestions: ['请补充具体的产品类型信息', '建议增加目标受众的描述'],
  },
]

// 订单数据
export const orders = [
  {
    id: 'order-001',
    taskId: 'task-001',
    taskTitle: '美妆抖音信息流视频素材制作',
    advertiserId: 'user-001',
    advertiserName: '热力豆科技',
    advertiserCompany: '杭州热力豆科技有限公司',

    creatorId: 'creator-001',
    creatorName: '视频达人小王',
    creatorAvatar: 'https://example.com/avatar-001.jpg',

    price: 200,
    platformFee: 20,
    creatorEarning: 180,

    status: 'in_progress' as const,

    highlightVideo: 'https://example.com/highlight-001.mp4',
    watermarkVideo: 'https://example.com/watermark-001.mp4',

    createdAt: '2026-03-10 10:00',
    acceptedAt: '2026-03-10 14:30',
  },
  {
    id: 'order-002',
    taskId: 'task-002',
    taskTitle: '本地生活探店视频拍摄剪辑',
    advertiserId: 'user-002',
    advertiserName: '花漾美妆',
    advertiserCompany: '上海花漾美妆有限公司',

    creatorId: 'creator-002',
    creatorName: '创意工作室',
    creatorAvatar: 'https://example.com/avatar-002.jpg',

    price: 300,
    platformFee: 30,
    creatorEarning: 270,

    status: 'completed' as const,

    highlightVideo: 'https://example.com/highlight-002.mp4',
    watermarkVideo: 'https://example.com/watermark-002.mp4',
    finalVideo: 'https://example.com/final-002.mp4',

    rating: 5,
    reviewComment: '合作非常愉快！视频质量超出预期，交付及时，沟通顺畅。强烈推荐！',
    reviewedAt: '2026-03-08 16:20',

    createdAt: '2026-03-05 09:00',
    acceptedAt: '2026-03-05 11:00',
    completedAt: '2026-03-08 15:00',
    paidAt: '2026-03-08 17:00',
  },
  {
    id: 'order-003',
    taskId: 'task-003',
    taskTitle: '电商产品种草视频KOC真人出镜',
    advertiserId: 'user-003',
    advertiserName: '互联科技',
    advertiserCompany: '北京互联科技工作室',

    creatorId: 'creator-003',
    creatorName: '美妆博主小美',
    creatorAvatar: 'https://example.com/avatar-003.jpg',

    price: 150,
    platformFee: 15,
    creatorEarning: 135,

    status: 'frozen' as const,

    highlightVideo: 'https://example.com/highlight-003.mp4',
    watermarkVideo: 'https://example.com/watermark-003.mp4',

    createdAt: '2026-03-08 14:00',
    acceptedAt: '2026-03-08 16:00',
  },
]
