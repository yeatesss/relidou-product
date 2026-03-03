import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Search, Send, MoreVertical, Phone, Video, Paperclip, Smile } from 'lucide-react'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

const conversations = [
  {
    id: 1,
    user: {
      name: '小明影视',
      avatar: '/images/creator-1.jpg',
      online: true,
    },
    lastMessage: '好的，我会按照您的要求修改',
    lastTime: '10:30',
    unread: 2,
    orderTitle: '美妆品牌抖音短视频',
  },
  {
    id: 2,
    user: {
      name: 'Lisa出镜',
      avatar: '/images/creator-2.jpg',
      online: false,
    },
    lastMessage: '请问什么时候可以开始拍摄？',
    lastTime: '昨天',
    unread: 0,
    orderTitle: '产品测评视频',
  },
  {
    id: 3,
    user: {
      name: '动画工坊',
      avatar: '/images/creator-3.jpg',
      online: true,
    },
    lastMessage: '初稿已经发给您了，请查收',
    lastTime: '昨天',
    unread: 1,
    orderTitle: 'APP演示动画',
  },
]

const messages = [
  {
    id: 1,
    sender: 'me',
    content: '您好，我对您的作品很感兴趣',
    time: '10:00',
  },
  {
    id: 2,
    sender: 'other',
    content: '您好，感谢您的关注！请问有什么可以帮您的？',
    time: '10:05',
  },
  {
    id: 3,
    sender: 'me',
    content: '我想做一个美妆产品的抖音短视频，您有空接这个单吗？',
    time: '10:10',
  },
  {
    id: 4,
    sender: 'other',
    content: '可以的，请问您有什么具体要求吗？比如视频时长、风格等',
    time: '10:15',
  },
  {
    id: 5,
    sender: 'me',
    content: '需要15-30秒，风格要年轻化、时尚感强一些',
    time: '10:20',
  },
  {
    id: 6,
    sender: 'other',
    content: '明白了，我会按照您的要求修改',
    time: '10:30',
  },
]

export default function Messages() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState('')

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleSend = () => {
    if (newMessage.trim()) {
      alert('消息发送成功！')
      setNewMessage('')
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`bg-white rounded-xl shadow-sm overflow-hidden h-[calc(100vh-140px)] transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="grid grid-cols-1 md:grid-cols-3 h-full">
            {/* Conversations List */}
            <div className="border-r border-[#e4e5e7]">
              {/* Header */}
              <div className="p-4 border-b border-[#e4e5e7]">
                <div className="flex items-center gap-3 mb-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-[#74767e] hover:text-[#1dbf73]"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <h2 className="font-semibold text-[#404145]">消息中心</h2>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#74767e]" />
                  <input
                    type="text"
                    placeholder="搜索对话..."
                    className="w-full pl-9 pr-4 py-2 border border-[#e4e5e7] rounded-lg text-sm focus:outline-none focus:border-[#1dbf73]"
                  />
                </div>
              </div>

              {/* List */}
              <div className="overflow-y-auto h-[calc(100%-100px)]">
                {conversations.map((conv) => (
                  <div
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 cursor-pointer hover:bg-[#f7f7f7] transition-colors border-b border-[#f7f7f7] ${
                      selectedConversation?.id === conv.id ? 'bg-[#f7f7f7]' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={conv.user.avatar} alt={conv.user.name} />
                          <AvatarFallback>{conv.user.name[0]}</AvatarFallback>
                        </Avatar>
                        {conv.user.online && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium text-[#404145] truncate">{conv.user.name}</h3>
                          <span className="text-xs text-[#74767e]">{conv.lastTime}</span>
                        </div>
                        <p className="text-xs text-[#74767e] mb-1">{conv.orderTitle}</p>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-[#74767e] truncate">{conv.lastMessage}</p>
                          {conv.unread > 0 && (
                            <span className="w-5 h-5 bg-[#1dbf73] text-white text-xs rounded-full flex items-center justify-center">
                              {conv.unread}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="md:col-span-2 flex flex-col h-full">
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-[#e4e5e7] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-10 h-10">
                        <AvatarImage src={selectedConversation.user.avatar} alt={selectedConversation.user.name} />
                        <AvatarFallback>{selectedConversation.user.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium text-[#404145]">{selectedConversation.user.name}</h3>
                        <p className="text-xs text-[#74767e]">{selectedConversation.orderTitle}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#f7f7f7] rounded-lg transition-colors">
                        <Phone className="w-5 h-5 text-[#74767e]" />
                      </button>
                      <button className="p-2 hover:bg-[#f7f7f7] rounded-lg transition-colors">
                        <Video className="w-5 h-5 text-[#74767e]" />
                      </button>
                      <button className="p-2 hover:bg-[#f7f7f7] rounded-lg transition-colors">
                        <MoreVertical className="w-5 h-5 text-[#74767e]" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] px-4 py-2 rounded-2xl ${
                            msg.sender === 'me'
                              ? 'bg-[#1dbf73] text-white rounded-br-md'
                              : 'bg-[#f7f7f7] text-[#404145] rounded-bl-md'
                          }`}
                        >
                          <p>{msg.content}</p>
                          <span className={`text-xs mt-1 block ${msg.sender === 'me' ? 'text-white/70' : 'text-[#74767e]'}`}>
                            {msg.time}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-[#e4e5e7]">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-[#f7f7f7] rounded-lg transition-colors">
                        <Paperclip className="w-5 h-5 text-[#74767e]" />
                      </button>
                      <button className="p-2 hover:bg-[#f7f7f7] rounded-lg transition-colors">
                        <Smile className="w-5 h-5 text-[#74767e]" />
                      </button>
                      <input
                        type="text"
                        placeholder="输入消息..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 px-4 py-2 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73]"
                      />
                      <Button
                        onClick={handleSend}
                        className="bg-[#1dbf73] hover:bg-[#19a463] text-white"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center text-[#74767e]">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-[#f7f7f7] rounded-full flex items-center justify-center mx-auto mb-4">
                      <Send className="w-8 h-8" />
                    </div>
                    <p>选择一个对话开始聊天</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
