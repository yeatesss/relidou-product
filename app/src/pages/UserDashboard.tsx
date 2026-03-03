import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, MessageSquare, Star, Settings, LogOut, ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const userData = {
  name: '测试用户',
  avatar: '/images/creator-1.jpg',
  email: 'test@example.com',
  phone: '138****8888',
  type: 'client', // 'client' or 'creator'
  stats: {
    orders: 12,
    completed: 8,
    inProgress: 3,
    pending: 1,
  },
}

const recentOrders = [
  { id: 1, title: '美妆品牌抖音短视频', status: '进行中', budget: '¥800-1500', date: '2026-02-23', bids: 5 },
  { id: 2, title: '产品展示视频拍摄', status: '已完成', budget: '¥1200', date: '2026-02-20', bids: 3 },
  { id: 3, title: '企业宣传片剪辑', status: '待确认', budget: '¥3000', date: '2026-02-18', bids: 8 },
]

const menuItems = [
  { id: 'orders', name: '我的订单', icon: Briefcase },
  { id: 'messages', name: '消息中心', icon: MessageSquare },
  { id: 'favorites', name: '我的收藏', icon: Star },
  { id: 'settings', name: '账号设置', icon: Settings },
]

export default function UserDashboard() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case '进行中':
        return 'bg-blue-100 text-blue-700'
      case '已完成':
        return 'bg-green-100 text-green-700'
      case '待确认':
        return 'bg-yellow-100 text-yellow-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className={`lg:col-span-1 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            {/* User Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-4">
              <div className="flex items-center gap-4 mb-4">
                <Avatar className="w-16 h-16">
                  <AvatarImage src={userData.avatar} alt={userData.name} />
                  <AvatarFallback>{userData.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="font-semibold text-[#404145]">{userData.name}</h2>
                  <Badge className="bg-[#1dbf73]/10 text-[#1dbf73]">
                    {userData.type === 'client' ? '甲方' : '创作者'}
                  </Badge>
                </div>
              </div>
              <div className="text-sm text-[#74767e]">
                <p>{userData.email}</p>
                <p>{userData.phone}</p>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              {menuItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-6 py-4 hover:bg-[#f7f7f7] transition-colors border-b border-[#f7f7f7] last:border-b-0 ${
                      activeTab === item.id ? 'bg-[#f7f7f7] text-[#1dbf73]' : 'text-[#404145]'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.name}</span>
                    <ChevronRight className="w-4 h-4 text-[#74767e]" />
                  </button>
                )
              })}
              <button
                onClick={() => navigate('/login')}
                className="w-full flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="flex-1 text-left">退出登录</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'overview' && (
              <div className={`space-y-6 transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                {/* Stats */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-[#404145]">{userData.stats.orders}</div>
                    <div className="text-sm text-[#74767e]">总订单</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-green-500">{userData.stats.completed}</div>
                    <div className="text-sm text-[#74767e]">已完成</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-blue-500">{userData.stats.inProgress}</div>
                    <div className="text-sm text-[#74767e]">进行中</div>
                  </div>
                  <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="text-3xl font-bold text-yellow-500">{userData.stats.pending}</div>
                    <div className="text-sm text-[#74767e]">待处理</div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-[#404145] mb-4">快速操作</h3>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => navigate('/post-order')}
                      className="bg-[#1dbf73] hover:bg-[#19a463] text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      发布新订单
                    </Button>
                    <Button variant="outline" className="border-[#e4e5e7]">
                      <Briefcase className="w-4 h-4 mr-2" />
                      查看全部订单
                    </Button>
                    <Button variant="outline" className="border-[#e4e5e7]">
                      <MessageSquare className="w-4 h-4 mr-2" />
                      查看消息
                    </Button>
                  </div>
                </div>

                {/* Recent Orders */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-[#404145]">最近订单</h3>
                    <button className="text-[#1dbf73] text-sm hover:underline">查看全部</button>
                  </div>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div
                        key={order.id}
                        className="flex items-center justify-between p-4 bg-[#f7f7f7] rounded-lg hover:bg-[#e4e5e7]/50 transition-colors cursor-pointer"
                      >
                        <div>
                          <h4 className="font-medium text-[#404145]">{order.title}</h4>
                          <div className="flex items-center gap-4 mt-1 text-sm text-[#74767e]">
                            <span>{order.date}</span>
                            <span>{order.bids}人投标</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                          <div className="text-[#1dbf73] font-medium mt-1">{order.budget}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-[#404145] mb-4">我的订单</h3>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div
                      key={order.id}
                      className="flex items-center justify-between p-4 border border-[#e4e5e7] rounded-lg hover:border-[#1dbf73]/30 transition-colors"
                    >
                      <div>
                        <h4 className="font-medium text-[#404145]">{order.title}</h4>
                        <div className="flex items-center gap-4 mt-1 text-sm text-[#74767e]">
                          <span>{order.date}</span>
                          <span>{order.bids}人投标</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(order.status)}>{order.status}</Badge>
                        <div className="text-[#1dbf73] font-medium mt-1">{order.budget}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'messages' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-[#404145] mb-4">消息中心</h3>
                <div className="text-center py-12 text-[#74767e]">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无新消息</p>
                </div>
              </div>
            )}

            {activeTab === 'favorites' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-[#404145] mb-4">我的收藏</h3>
                <div className="text-center py-12 text-[#74767e]">
                  <Star className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>暂无收藏内容</p>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-[#404145] mb-4">账号设置</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-[#e4e5e7] rounded-lg">
                    <div>
                      <div className="font-medium text-[#404145]">修改密码</div>
                      <div className="text-sm text-[#74767e]">定期更换密码保护账号安全</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#e4e5e7]">
                      修改
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-[#e4e5e7] rounded-lg">
                    <div>
                      <div className="font-medium text-[#404145]">绑定手机</div>
                      <div className="text-sm text-[#74767e]">{userData.phone}</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#e4e5e7]">
                      更换
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border border-[#e4e5e7] rounded-lg">
                    <div>
                      <div className="font-medium text-[#404145]">实名认证</div>
                      <div className="text-sm text-[#74767e]">完成实名认证获得更多权益</div>
                    </div>
                    <Button variant="outline" size="sm" className="border-[#1dbf73] text-[#1dbf73]">
                      去认证
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
