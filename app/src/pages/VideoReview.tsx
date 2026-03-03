import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, X } from 'lucide-react'

// 投稿视频数据
const submissionVideos = [
  {
    id: 1,
    taskName: '美妆品牌抖音短视频',
    creatorName: '小明影视',
    videoUrl: '/videos/sample-1.mp4',
    thumbnail: 'from-[#003912] to-[#1dbf73]',
    submittedAt: '2小时前',
  },
  {
    id: 2,
    taskName: '产品展示视频拍摄',
    creatorName: '视频达人',
    videoUrl: '/videos/sample-2.mp4',
    thumbnail: 'from-[#1a1a2e] to-[#16213e]',
    submittedAt: '5小时前',
  },
  {
    id: 3,
    taskName: '企业宣传片剪辑',
    creatorName: '动画工坊',
    videoUrl: '/videos/sample-3.mp4',
    thumbnail: 'from-[#2d1b69] to-[#11998e]',
    submittedAt: '1天前',
  },
  {
    id: 4,
    taskName: 'APP演示动画',
    creatorName: '三维视界',
    videoUrl: '/videos/sample-4.mp4',
    thumbnail: 'from-[#c94b4b] to-[#4b134f]',
    submittedAt: '2天前',
  },
  {
    id: 5,
    taskName: '美食探店视频',
    creatorName: '味蕾视频',
    videoUrl: '/videos/sample-5.mp4',
    thumbnail: 'from-[#f97316] to-[#ea580c]',
    submittedAt: '3天前',
  },
  {
    id: 6,
    taskName: '健身教程合集',
    creatorName: '运动达人',
    videoUrl: '/videos/sample-6.mp4',
    thumbnail: 'from-[#0891b2] to-[#0e7490]',
    submittedAt: '4天前',
  },
  {
    id: 7,
    taskName: '旅游vlog剪辑',
    creatorName: '旅行记录',
    videoUrl: '/videos/sample-7.mp4',
    thumbnail: 'from-[#7c3aed] to-[#6d28d9]',
    submittedAt: '5天前',
  },
  {
    id: 8,
    taskName: '科技产品开箱',
    creatorName: '数码测评',
    videoUrl: '/videos/sample-8.mp4',
    thumbnail: 'from-[#4338ca] to-[#3730a3]',
    submittedAt: '6天前',
  },
]

export default function VideoReview() {
  const navigate = useNavigate()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showHint, setShowHint] = useState(true)
  const [showRejectModal, setShowRejectModal] = useState(false)
  const [showInterestModal, setShowInterestModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const currentVideo = submissionVideos[currentIndex]
  const hasNext = currentIndex < submissionVideos.length - 1
  const hasPrev = currentIndex > 0

  // 切换到下一条
  const goToNext = () => {
    if (hasNext) {
      setShowHint(false)
      setCurrentIndex((prev) => prev + 1)
    }
  }

  // 切换到上一条
  const goToPrev = () => {
    if (hasPrev) {
      setShowHint(false)
      setCurrentIndex((prev) => prev - 1)
    }
  }

  // 处理鼠标滚轮
  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        goToNext()
      } else if (e.deltaY < 0) {
        goToPrev()
      }
    }

    const container = containerRef.current
    if (container) {
      container.addEventListener('wheel', handleWheel)
      return () => container.removeEventListener('wheel', handleWheel)
    }
  }, [currentIndex])

  // 处理键盘事件
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        goToNext()
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        goToPrev()
      } else if (e.key === 'Escape') {
        navigate('/client-workspace')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [currentIndex])

  // 感兴趣 - 显示确认弹窗
  const handleInterested = () => {
    setShowInterestModal(true)
  }

  // 确认感兴趣
  const confirmInterested = () => {
    console.log('感兴趣:', currentVideo.id)
    setShowInterestModal(false)
    goToNext()
  }

  // 不感兴趣 - 显示确认弹窗
  const handleNotInterested = () => {
    setShowRejectModal(true)
  }

  // 确认不感兴趣
  const confirmNotInterested = () => {
    console.log('不感兴趣:', currentVideo.id)
    setShowRejectModal(false)
    goToNext()
  }

  return (
    <div className="fixed inset-0 bg-[#1a1a1a] flex overflow-hidden">
      {/* 左侧按钮区域 - 不感兴趣 */}
      <div className="w-32 flex items-center justify-center flex-shrink-0">
        <button
          onClick={handleNotInterested}
          className="group flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-white/5 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-red-500/20 group-hover:bg-red-500/30 flex items-center justify-center transition-all duration-300">
            <X className="w-8 h-8 text-red-500" />
          </div>
          <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors">
            不感兴趣
          </span>
        </button>
      </div>

      {/* 中间视频区域 */}
      <div className="flex-1 flex items-center justify-center p-12 relative" ref={containerRef}>
        {/* 返回按钮 */}
        <button
          onClick={() => navigate('/client-workspace')}
          className="absolute top-6 left-6 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 flex-shrink-0"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        {/* 关闭按钮 */}
        <button
          onClick={() => navigate('/client-workspace')}
          className="absolute top-6 right-6 z-20 w-12 h-12 rounded-full bg-black/30 hover:bg-black/50 backdrop-blur-sm flex items-center justify-center text-white transition-all duration-300 flex-shrink-0"
        >
          <X className="w-6 h-6" />
        </button>

        {/* 视频容器 */}
        <div className="relative w-full max-w-2xl aspect-[9/16]">
          {/* 视频列表 */}
          {submissionVideos.map((video, index) => (
            <div
              key={video.id}
              className={`absolute inset-0 transition-all duration-300 ease-out rounded-2xl overflow-hidden ${
                index === currentIndex
                  ? 'opacity-100 scale-100'
                  : index < currentIndex
                  ? 'opacity-0 scale-95 translate-y-[-100%]'
                  : 'opacity-0 scale-95 translate-y-[100%]'
              }`}
            >
              {/* 视频占位区域 */}
              <div className={`w-full h-full bg-gradient-to-br ${video.thumbnail} flex items-center justify-center`}>
                <div className="text-center text-white/60">
                  <div className="text-6xl mb-4">▶️</div>
                  <div className="text-lg opacity-80">视频播放区域</div>
                </div>
              </div>
            </div>
          ))}

          {/* 操作提示 */}
          {showHint && (
            <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 pointer-events-none">
              <div className="bg-black/60 backdrop-blur-sm rounded-full px-6 py-4 text-white/95 text-sm flex items-center gap-3 animate-bounce">
                <span className="text-xl">🖱️</span>
                <span className="font-medium">滚动鼠标或按 ↑↓ 键切换视频</span>
              </div>
            </div>
          )}

          {/* 计数器 */}
          <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm rounded-full px-4 py-2 text-white text-sm font-medium">
            {currentIndex + 1} / {submissionVideos.length}
          </div>
        </div>
      </div>

      {/* 左下角任务信息 */}
      <div className="absolute bottom-0 left-0 right-32 p-6">
        <div className="bg-black/50 backdrop-blur-md rounded-xl p-5 max-w-md">
          <h3 className="text-white text-xl font-bold mb-2">{currentVideo.taskName}</h3>
          <p className="text-white/80 text-sm">{currentVideo.submittedAt}</p>
        </div>
      </div>

      {/* 右侧按钮区域 - 感兴趣 */}
      <div className="w-32 flex items-center justify-center flex-shrink-0">
        <button
          onClick={handleInterested}
          className="group flex flex-col items-center gap-3 p-6 rounded-2xl hover:bg-white/5 transition-all duration-300"
        >
          <div className="w-16 h-16 rounded-full bg-[#1dbf73]/20 group-hover:bg-[#1dbf73]/30 flex items-center justify-center transition-all duration-300">
            <svg
              className="w-8 h-8 text-[#1dbf73]"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
          </div>
          <span className="text-white/90 text-sm font-medium group-hover:text-white transition-colors">
            感兴趣
          </span>
        </button>
      </div>

      {/* 不感兴趣确认弹窗 */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <X className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">确认不感兴趣</h3>
            </div>
            <p className="text-[#74767e] text-base leading-relaxed mb-6">
              确认不感兴趣后，将无法找回该视频，确认是否不感兴趣？
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRejectModal(false)}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-xl hover:bg-[#f5f5f5] transition-colors font-medium text-base"
              >
                取消
              </button>
              <button
                onClick={confirmNotInterested}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors font-medium text-base"
              >
                确认不感兴趣
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 感兴趣确认弹窗 */}
      {showInterestModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-[#1dbf73]/10 rounded-full flex items-center justify-center flex-shrink-0">
                <svg
                  className="w-6 h-6 text-[#1dbf73]"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-[#1a1a1a]">确认感兴趣</h3>
            </div>
            <p className="text-[#74767e] text-base leading-relaxed mb-6">
              确认感兴趣后，将自动扣除预付任务佣金的30%，可在投稿管理中查看完整版视频。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowInterestModal(false)}
                className="flex-1 py-3 border border-[#e4e5e7] text-[#404145] rounded-xl hover:bg-[#f5f5f5] transition-colors font-medium text-base"
              >
                取消
              </button>
              <button
                onClick={confirmInterested}
                className="flex-1 py-3 bg-[#1dbf73] text-white rounded-xl hover:bg-[#19a463] transition-colors font-medium text-base"
              >
                确认感兴趣
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
