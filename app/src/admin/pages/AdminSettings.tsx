import { useState } from 'react'
import {
  Bell,
  Shield,
  CreditCard,
  Mail,
  Globe,
  Users,
  Save,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')

  const tabs = [
    { id: 'general', label: '基础设置', icon: Globe },
    { id: 'notifications', label: '通知设置', icon: Bell },
    { id: 'payment', label: '支付设置', icon: CreditCard },
    { id: 'security', label: '安全设置', icon: Shield },
    { id: 'email', label: '邮件设置', icon: Mail },
    { id: 'users', label: '用户权限', icon: Users },
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">系统设置</h1>
        <p className="text-slate-500 mt-1">配置平台各项参数和功能</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-[#1dbf73] text-white'
                      : 'text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            {activeTab === 'general' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">基础设置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">平台名称</label>
                    <input
                      type="text"
                      defaultValue="创影汇"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">平台标语</label>
                    <input
                      type="text"
                      defaultValue="专业的视频广告定制平台"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">客服电话</label>
                    <input
                      type="text"
                      defaultValue="400-888-8888"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">客服邮箱</label>
                    <input
                      type="email"
                      defaultValue="contact@chuangyinghui.com"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">平台介绍</label>
                    <textarea
                      rows={4}
                      defaultValue="创影汇是专业的视频广告定制平台，连接品牌与创作者，提供高质量的视频制作服务。"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73] resize-none"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">通知设置</h2>
                
                <div className="space-y-4">
                  {[
                    { label: '新订单通知', desc: '当有新订单发布时通知管理员', default: true },
                    { label: '新用户注册', desc: '当有新用户注册时通知管理员', default: true },
                    { label: '创作者认证申请', desc: '当有创作者申请认证时通知', default: true },
                    { label: '投诉举报', desc: '当收到用户投诉时通知', default: true },
                    { label: '订单完成', desc: '当订单完成时通知相关方', default: false },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                      <div>
                        <p className="font-medium text-slate-800">{item.label}</p>
                        <p className="text-sm text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" defaultChecked={item.default} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1dbf73]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">支付设置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">平台服务费比例 (%)</label>
                    <input
                      type="number"
                      defaultValue="10"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                    <p className="text-sm text-slate-500 mt-1">从每笔订单中抽取的服务费比例</p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">最低提现金额 (¥)</label>
                    <input
                      type="number"
                      defaultValue="100"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">提现手续费 (¥)</label>
                    <input
                      type="number"
                      defaultValue="2"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-800 mb-2">支持的支付方式</p>
                    <div className="space-y-2">
                      {['支付宝', '微信支付', '银行卡'].map((method) => (
                        <label key={method} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]" />
                          <span className="text-slate-700">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">安全设置</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-800 mb-2">登录安全</p>
                    <div className="space-y-3">
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]" />
                        <span className="text-slate-700">启用登录验证码</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]" />
                        <span className="text-slate-700">异地登录提醒</span>
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]" />
                        <span className="text-slate-700">强制密码定期更换</span>
                      </label>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">密码最小长度</label>
                    <input
                      type="number"
                      defaultValue="8"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">登录失败锁定次数</label>
                    <input
                      type="number"
                      defaultValue="5"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                    <p className="text-sm text-slate-500 mt-1">超过此次数将锁定账号30分钟</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">邮件设置</h2>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">SMTP服务器</label>
                    <input
                      type="text"
                      defaultValue="smtp.example.com"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">SMTP端口</label>
                    <input
                      type="number"
                      defaultValue="587"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">发件人邮箱</label>
                    <input
                      type="email"
                      defaultValue="noreply@chuangyinghui.com"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">发件人名称</label>
                    <input
                      type="text"
                      defaultValue="创影汇"
                      className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-[#1dbf73]"
                    />
                  </div>
                  
                  <Button variant="outline" className="border-slate-200">
                    发送测试邮件
                  </Button>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6">
                <h2 className="text-lg font-semibold text-slate-800">用户权限</h2>
                
                <div className="space-y-4">
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-800 mb-2">甲方用户权限</p>
                    <div className="space-y-2">
                      {['发布订单', '查看创作者', '发起聊天', '评价订单'].map((perm) => (
                        <label key={perm} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]" />
                          <span className="text-slate-700">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 rounded-lg">
                    <p className="font-medium text-slate-800 mb-2">创作者权限</p>
                    <div className="space-y-2">
                      {['浏览订单', '提交投标', '发起聊天', '上传作品'].map((perm) => (
                        <label key={perm} className="flex items-center gap-2">
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-300 text-[#1dbf73] focus:ring-[#1dbf73]" />
                          <span className="text-slate-700">{perm}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-slate-100">
              <Button className="bg-[#1dbf73] hover:bg-[#19a463]">
                <Save className="w-4 h-4 mr-2" />
                保存设置
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
