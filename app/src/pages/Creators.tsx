import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Filter, Star, CheckCircle, ChevronDown, MapPin, Briefcase } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'

const categories = ['全部', '视频剪辑', 'UGC出镜', 'MG动画', '产品摄影', '直播运营', '3D设计']
const skills = ['全部', '剪辑', '调色', '特效', '口播', '测评', '动画', '建模']
const locations = ['全部', '北京', '上海', '广州', '深圳', '杭州', '成都', '全国']

const creators = [
  {
    id: 1,
    name: '小明影视',
    avatar: '/images/creator-1.jpg',
    title: '资深视频剪辑师',
    rating: 4.9,
    orders: 328,
    startingPrice: 300,
    location: '北京',
    skills: ['剪辑', '调色', '特效'],
    tags: ['抖音', '宣传片', 'Vlog'],
    verified: true,
    description: '5年视频剪辑经验，擅长抖音短视频、企业宣传片、个人Vlog等多种类型视频制作。',
    portfolio: [1, 2, 3],
  },
  {
    id: 2,
    name: 'Lisa出镜',
    avatar: '/images/creator-2.jpg',
    title: 'UGC内容创作者',
    rating: 4.8,
    orders: 156,
    startingPrice: 200,
    location: '上海',
    skills: ['口播', '测评', '种草'],
    tags: ['美妆', '时尚', '生活方式'],
    verified: true,
    description: '专业UGC创作者，擅长美妆、时尚类产品测评和种草视频，粉丝10万+。',
    portfolio: [1, 2, 3],
  },
  {
    id: 3,
    name: '动画工坊',
    avatar: '/images/creator-3.jpg',
    title: 'MG动画设计师',
    rating: 5.0,
    orders: 89,
    startingPrice: 800,
    location: '深圳',
    skills: ['MG动画', '动效', '3D'],
    tags: ['动画', 'APP演示', '品牌动画'],
    verified: true,
    description: '专注MG动画设计，为多家知名品牌制作动画宣传片，风格多样，创意十足。',
    portfolio: [1, 2, 3],
  },
  {
    id: 4,
    name: '摄影达人',
    avatar: '/images/creator-1.jpg',
    title: '产品摄影师',
    rating: 4.7,
    orders: 234,
    startingPrice: 500,
    location: '广州',
    skills: ['产品摄影', '灯光', '后期'],
    tags: ['电商', '产品', '静物'],
    verified: true,
    description: '专业产品摄影师，拥有完整的摄影棚设备，擅长各类产品拍摄。',
    portfolio: [1, 2, 3],
  },
  {
    id: 5,
    name: '直播小助手',
    avatar: '/images/creator-2.jpg',
    title: '直播运营专家',
    rating: 4.6,
    orders: 178,
    startingPrice: 400,
    location: '杭州',
    skills: ['直播', '切片', '运营'],
    tags: ['直播', '切片', '运营'],
    verified: true,
    description: '擅长直播切片制作和直播内容运营，熟悉各大直播平台规则。',
    portfolio: [1, 2, 3],
  },
  {
    id: 6,
    name: '三维视界',
    avatar: '/images/creator-3.jpg',
    title: '3D设计师',
    rating: 4.9,
    orders: 67,
    startingPrice: 1000,
    location: '成都',
    skills: ['3D建模', '渲染', '动画'],
    tags: ['3D', '产品渲染', '建筑'],
    verified: true,
    description: '专业3D设计师，擅长产品渲染、建筑可视化等，作品质量高。',
    portfolio: [1, 2, 3],
  },
]

export default function Creators() {
  const navigate = useNavigate()
  const [selectedCategory, setSelectedCategory] = useState('全部')
  const [selectedSkill, setSelectedSkill] = useState('全部')
  const [selectedLocation, setSelectedLocation] = useState('全部')
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const filteredCreators = creators.filter((creator) => {
    if (selectedCategory !== '全部' && !creator.tags.some(t => t.includes(selectedCategory))) return false
    if (selectedSkill !== '全部' && !creator.skills.includes(selectedSkill)) return false
    if (selectedLocation !== '全部' && creator.location !== selectedLocation) return false
    if (searchQuery && !creator.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20">
      {/* Header */}
      <div className="bg-white border-b border-[#e4e5e7]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className={`text-3xl font-bold text-[#404145] mb-4 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            发现创作者
          </h1>
          <p className={`text-[#74767e] transition-all duration-500 delay-100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
            找到适合您项目的专业视频创作者
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Bar */}
        <div className={`bg-white rounded-xl p-4 mb-6 shadow-sm transition-all duration-500 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#74767e]" />
              <input
                type="text"
                placeholder="搜索创作者..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20"
              />
            </div>

            {/* Filter Button */}
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 border-[#e4e5e7]"
            >
              <Filter className="w-4 h-4" />
              筛选
              <ChevronDown className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
            </Button>
          </div>

          {/* Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-[#e4e5e7] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#404145] mb-2">专业领域</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2.5 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73]"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#404145] mb-2">技能标签</label>
                <select
                  value={selectedSkill}
                  onChange={(e) => setSelectedSkill(e.target.value)}
                  className="w-full p-2.5 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73]"
                >
                  {skills.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#404145] mb-2">所在城市</label>
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="w-full p-2.5 border border-[#e4e5e7] rounded-lg focus:outline-none focus:border-[#1dbf73]"
                >
                  {locations.map((l) => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className={`mb-6 transition-all duration-500 delay-300 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <span className="text-[#74767e]">共找到 </span>
          <span className="font-semibold text-[#404145]">{filteredCreators.length}</span>
          <span className="text-[#74767e]"> 位创作者</span>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator, index) => (
            <div
              key={creator.id}
              onClick={() => navigate(`/creators/${creator.id}`)}
              className={`bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer border border-transparent hover:border-[#1dbf73]/20 transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
              style={{ transitionDelay: `${300 + index * 80}ms` }}
            >
              {/* Cover */}
              <div className="h-32 bg-gradient-to-r from-[#003912] to-[#0a4226]" />
              
              {/* Content */}
              <div className="px-6 pb-6">
                {/* Avatar */}
                <div className="relative -mt-12 mb-4">
                  <Avatar className="w-24 h-24 border-4 border-white">
                    <AvatarImage src={creator.avatar} alt={creator.name} />
                    <AvatarFallback className="bg-[#f7f7f7] text-[#404145] text-xl">
                      {creator.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {creator.verified && (
                    <div className="absolute bottom-0 right-0 w-6 h-6 bg-[#1dbf73] rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-[#404145] hover:text-[#1dbf73] transition-colors">
                    {creator.name}
                  </h3>
                  <p className="text-sm text-[#74767e]">{creator.title}</p>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-[#ffb33e] text-[#ffb33e]" />
                    <span className="font-semibold text-[#404145]">{creator.rating}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#74767e]">
                    <Briefcase className="w-4 h-4" />
                    <span>{creator.orders}单</span>
                  </div>
                  <div className="flex items-center gap-1 text-[#74767e]">
                    <MapPin className="w-4 h-4" />
                    <span>{creator.location}</span>
                  </div>
                </div>

                {/* Skills */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {creator.skills.map((skill) => (
                    <Badge key={skill} variant="secondary" className="bg-[#f7f7f7] text-[#74767e]">
                      {skill}
                    </Badge>
                  ))}
                </div>

                {/* Description */}
                <p className="text-sm text-[#74767e] mb-4 line-clamp-2">
                  {creator.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCreators.length === 0 && (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-[#f7f7f7] rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="w-10 h-10 text-[#74767e]" />
            </div>
            <h3 className="text-lg font-semibold text-[#404145] mb-2">没有找到相关创作者</h3>
            <p className="text-[#74767e]">尝试调整筛选条件或搜索关键词</p>
          </div>
        )}
      </div>
    </div>
  )
}
