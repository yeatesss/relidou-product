import { useState, useEffect, useRef } from 'react'
import { X, Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from 'lucide-react'
import type { ToolType, VideoAnnotation, ShapeData, ReviewSessionProps } from './types'
import AnnotationToolbar from './AnnotationToolbar'
import AnnotationList from './AnnotationList'
import { ArrowLeft, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react'

const FPS = 30
const TOOL_COLORS = [
  '#6366f1', // 紫色 - 广告主
  '#ef4444', // 红色 - 高优先级
  '#eab308', // 黄色 - 中等优先级
  '#22c55e', // 绿色 - 低优先级
  '#06b6d4', // 青色 - 创作者
  '#ec4899', // 粉色
  '#f97316', // 橙色
]

export default function VideoReviewModal({
  bidId,
  taskId,
  videoUrl,
  authorName,
  onClose,
  onSubmit,
  mode = 'advertiser', // 默认为广告主模式
}: ReviewSessionProps) {
  console.log('VideoReviewModal props:', { bidId, taskId, videoUrl, authorName, mode })

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 是否为只读模式（创作者模式）
  const isReadOnly = mode === 'creator'

  // 状态
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTool, setCurrentTool] = useState<ToolType>('cursor')
  const [currentColor, setCurrentColor] = useState(TOOL_COLORS[0])
  const [isDrawing, setIsDrawing] = useState(false)
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null)
  const [annotations, setAnnotations] = useState<VideoAnnotation[]>([])
  const [activeAnnotationId, setActiveAnnotationId] = useState<string | null>(null)
  const [pendingShape, setPendingShape] = useState<ShapeData | null>(null)
  const [newNote, setNewNote] = useState('')
  const [currentFrame, setCurrentFrame] = useState(0)

  // 初始化
  useEffect(() => {
    if (videoRef.current) {
      const video = videoRef.current
      video.addEventListener('loadedmetadata', () => {
        setDuration(video.duration)
        syncCanvasSize()
      })
      video.addEventListener('timeupdate', () => {
        setCurrentTime(video.currentTime)
        setCurrentFrame(Math.round(video.currentTime * FPS))
      })
      video.addEventListener('play', () => setIsPlaying(true))
      video.addEventListener('pause', () => setIsPlaying(false))
    }

    // 加载演示标注
    loadDemoAnnotations()

    // 延迟同步canvas大小，确保视频已经渲染
    setTimeout(() => {
      syncCanvasSize()
      renderAnnotations()
    }, 500)

    // 键盘快捷键
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' ||
          (e.target as HTMLElement).tagName === 'TEXTAREA') {
        return
      }

      switch(e.key) {
        case ' ':
          e.preventDefault()
          togglePlay()
          break
        case ',':
          e.preventDefault()
          stepFrame(-1)
          break
        case '.':
          e.preventDefault()
          stepFrame(1)
          break
        case 'v':
        case 'V':
          setCurrentTool('cursor')
          break
        case 'a':
        case 'A':
          setCurrentTool('arrow')
          break
        case 'r':
        case 'R':
          setCurrentTool('rect')
          break
        case 'Escape':
          cancelNewAnnotation()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  // 监听窗口大小变化
  useEffect(() => {
    const handleResize = () => {
      syncCanvasSize()
      renderAnnotations()
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // 监听视频时间更新，重新渲染标注
  useEffect(() => {
    renderAnnotations()
  }, [currentFrame, annotations, activeAnnotationId])

  // 监听duration变化，加载演示标注
  useEffect(() => {
    // 创作者模式下立即加载演示数据
    if (isReadOnly && annotations.length === 0) {
      loadDemoAnnotations()
    } else if (duration > 0 && annotations.length === 0) {
      loadDemoAnnotations()
    }
  }, [duration, isReadOnly])

  // 同步画布大小
  const syncCanvasSize = () => {
    if (!videoRef.current || !canvasRef.current) return
    const video = videoRef.current
    const canvas = canvasRef.current

    // 获取视频元素的实际显示尺寸
    const videoRect = video.getBoundingClientRect()

    // 设置canvas的实际像素尺寸
    canvas.width = videoRect.width
    canvas.height = videoRect.height

    console.log('Canvas synced:', { width: canvas.width, height: canvas.height, videoRect })
  }

  // 播放控制
  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
    } else {
      videoRef.current.pause()
    }
  }

  const stepFrame = (delta: number) => {
    if (!videoRef.current) return
    videoRef.current.pause()
    const newTime = Math.max(0, Math.min(duration, currentTime + delta / FPS))
    videoRef.current.currentTime = newTime
  }

  // 画布绘制
  const renderAnnotations = () => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // 渲染当前帧附近的标注
    const visibleAnnotations = annotations.filter(
      ann => !ann.status || ann.status === 'pending'
    ).filter(
      ann => Math.abs(ann.frame - currentFrame) <= 1
    )

    visibleAnnotations.forEach((ann, index) => {
      const isActive = ann.id === activeAnnotationId
      drawShape(ctx, ann.shape, isActive, ann.author.color, index + 1)
    })

    // 渲染正在绘制的形状（预览）
    if (pendingShape) {
      drawPreviewShape(ctx, pendingShape)
    }
  }

  const drawShape = (
    ctx: CanvasRenderingContext2D,
    shape: ShapeData,
    isActive: boolean,
    color: string,
    index: number
  ) => {
    ctx.save()
    ctx.strokeStyle = shape.color || color
    ctx.fillStyle = (shape.color || color) + '30'
    ctx.lineWidth = isActive ? 3 : 2
    ctx.shadowColor = shape.color || color
    ctx.shadowBlur = isActive ? 12 : 6

    switch (shape.type) {
      case 'rect':
        if (shape.x !== undefined && shape.y !== undefined && shape.w && shape.h) {
          ctx.strokeRect(shape.x, shape.y, shape.w, shape.h)
          ctx.fillRect(shape.x, shape.y, shape.w, shape.h)
          drawBadge(ctx, shape.x + 4, shape.y - 12, index, color)
        }
        break
      case 'ellipse':
        if (shape.cx && shape.cy && shape.rx && shape.ry) {
          ctx.beginPath()
          ctx.ellipse(shape.cx, shape.cy, shape.rx, shape.ry, 0, 0, Math.PI * 2)
          ctx.fill()
          ctx.stroke()
          drawBadge(ctx, shape.cx - shape.rx + 4, shape.cy - shape.ry - 12, index, color)
        }
        break
      case 'arrow':
        if (shape.x1 && shape.y1 && shape.x2 && shape.y2) {
          drawArrow(ctx, shape.x1, shape.y1, shape.x2, shape.y2, color, 3)
          drawBadge(ctx, shape.x1 - 8, shape.y1 - 12, index, color)
        }
        break
      case 'pen':
        if (shape.points && shape.points.length > 1) {
          ctx.beginPath()
          ctx.moveTo(shape.points[0].x, shape.points[0].y)
          shape.points.forEach(p => ctx.lineTo(p.x, p.y))
          ctx.stroke()
          if (shape.points[0]) {
            drawBadge(ctx, shape.points[0].x - 8, shape.points[0].y - 12, index, color)
          }
        }
        break
      case 'text':
        if (shape.x && shape.y && shape.text) {
          ctx.shadowBlur = 0
          ctx.font = 'bold 16px sans-serif'
          ctx.fillStyle = color
          ctx.strokeStyle = 'rgba(0,0,0,0.8)'
          ctx.lineWidth = 4
          ctx.strokeText(shape.text, shape.x, shape.y)
          ctx.fillText(shape.text, shape.x, shape.y)
          drawBadge(ctx, shape.x - 8, shape.y - 24, index, color)
        }
        break
    }

    ctx.restore()
  }

  const drawBadge = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    num: number,
    color: string
  ) => {
    ctx.save()
    ctx.shadowBlur = 0
    ctx.fillStyle = color
    const radius = 10
    ctx.beginPath()
    ctx.arc(x + radius, y + radius, radius, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 11px monospace'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(num.toString(), x + radius, y + radius)
    ctx.restore()
  }

  const drawArrow = (
    ctx: CanvasRenderingContext2D,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    color: string,
    width: number
  ) => {
    const dx = x2 - x1
    const dy = y2 - y1
    const len = Math.sqrt(dx * dx + dy * dy)
    if (len < 1) return

    const nx = dx / len
    const ny = dy / len
    const headLength = Math.max(width * 3, 12)
    const headWidth = headLength * 0.7

    ctx.save()
    ctx.strokeStyle = color
    ctx.fillStyle = color
    ctx.lineWidth = width
    ctx.lineCap = 'round'

    // 线条
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2 - nx * headLength * 0.5, y2 - ny * headLength * 0.5)
    ctx.stroke()

    // 箭头
    ctx.beginPath()
    ctx.moveTo(x2, y2)
    ctx.lineTo(x2 - nx * headLength - ny * headWidth, y2 - ny * headLength + nx * headWidth)
    ctx.lineTo(x2 - nx * headLength + ny * headWidth, y2 - ny * headLength - nx * headWidth)
    ctx.closePath()
    ctx.fill()

    ctx.restore()
  }

  const drawPreviewShape = (ctx: CanvasRenderingContext2D, shape: ShapeData) => {
    ctx.save()
    ctx.strokeStyle = currentColor + '80'
    ctx.fillStyle = currentColor + '20'
    ctx.lineWidth = 2
    ctx.setLineDash([5, 5])

    drawShape(ctx, shape, false, currentColor, 0)

    ctx.restore()
  }

  // 鼠标事件处理
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // 创作者模式下禁用绘制
    if (isReadOnly) return

    console.log('Mouse down on canvas:', { currentTool, isDrawing })
    if (currentTool === 'cursor' || !videoRef.current) return
    videoRef.current.pause()

    const canvas = canvasRef.current
    if (!canvas) {
      console.log('Canvas ref is null!')
      return
    }

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    console.log('Canvas coordinates:', { x, y, rect, canvasSize: { width: canvas.width, height: canvas.height } })

    setIsDrawing(true)
    setDrawStart({ x, y })

    if (currentTool === 'pen') {
      setPendingShape({
        type: 'pen',
        points: [{ x, y }],
        color: currentColor,
      })
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !drawStart || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    if (currentTool === 'rect') {
      setPendingShape({
        type: 'rect',
        x: Math.min(drawStart.x, x),
        y: Math.min(drawStart.y, y),
        w: Math.abs(x - drawStart.x),
        h: Math.abs(y - drawStart.y),
        color: currentColor,
      })
    } else if (currentTool === 'ellipse') {
      setPendingShape({
        type: 'ellipse',
        cx: (drawStart.x + x) / 2,
        cy: (drawStart.y + y) / 2,
        rx: Math.abs(x - drawStart.x) / 2,
        ry: Math.abs(y - drawStart.y) / 2,
        color: currentColor,
      })
    } else if (currentTool === 'arrow') {
      setPendingShape({
        type: 'arrow',
        x1: drawStart.x,
        y1: drawStart.y,
        x2: x,
        y2: y,
        color: currentColor,
      })
    } else if (currentTool === 'pen' && pendingShape?.type === 'pen') {
      setPendingShape({
        ...pendingShape,
        points: [...pendingShape.points, { x, y }],
      })
    }

    renderAnnotations()
  }

  const handleCanvasMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || currentTool === 'cursor' || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setIsDrawing(false)

    if (currentTool === 'text') {
      const text = prompt('请输入标注文字:')
      if (text) {
        setPendingShape({
          type: 'text',
          x,
          y,
          text,
          color: currentColor,
        })
        setTimeout(() => submitAnnotation(), 100)
      }
      return
    }

    if (pendingShape) {
      // 聚焦到标注输入框
      const noteInput = document.getElementById('new-note-input') as HTMLTextAreaElement
      noteInput?.focus()
    }

    renderAnnotations()
  }

  // 提交标注
  const submitAnnotation = () => {
    if (!pendingShape) {
      // 可以只添加文字说明
      if (newNote.trim()) {
        const ann: VideoAnnotation = {
          id: Date.now().toString(),
          frame: currentFrame,
          timecode: currentTime,
          shape: {
            type: 'rect',
            x: 50,
            y: 50,
            w: 100,
            h: 60,
            color: currentColor,
          },
          note: newNote,
          author: {
            id: 'advertiser-1',
            role: 'advertiser',
            name: '广告主-张伟',
            color: currentColor,
          },
          status: 'pending',
          createdAt: new Date(),
          comments: [],
        }
        setAnnotations([...annotations, ann])
        setNewNote('')
        return
      }
      alert('请先在视频上绘制标注')
      return
    }

    const ann: VideoAnnotation = {
      id: Date.now().toString(),
      frame: currentFrame,
      timecode: currentTime,
      shape: pendingShape,
      note: newNote || '（无文字说明）',
      author: {
        id: 'advertiser-1',
        role: 'advertiser',
        name: '广告主-张伟',
        color: pendingShape.color,
      },
      status: 'pending',
      createdAt: new Date(),
      comments: [],
    }

    setAnnotations([...annotations, ann])
    setPendingShape(null)
    setNewNote('')
    setActiveAnnotationId(ann.id)
  }

  const cancelNewAnnotation = () => {
    setPendingShape(null)
    setNewNote('')
    renderAnnotations()
  }

  const handleAddComment = (annotationId: string, commentText: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      author: {
        id: mode === 'creator' ? 'creator-1' : 'advertiser-1',
        role: mode === 'creator' ? 'creator' : 'advertiser',
        name: mode === 'creator' ? '创作者' : '广告主',
        color: mode === 'creator' ? '#06b6d4' : '#ef4444',
      },
      text: commentText,
      createdAt: new Date(),
      reactions: {},
    }

    setAnnotations(
      annotations.map(ann =>
        ann.id === annotationId
          ? { ...ann, comments: [...ann.comments, newComment] }
          : ann
      )
    )
  }

  const resolveAnnotation = (id: string) => {
    const ann = annotations.find(a => a.id === id)
    if (ann) {
      setAnnotations(
        annotations.map(a =>
          a.id === id ? { ...a, status: a.status === 'resolved' ? 'pending' : 'resolved' } : a
        )
      )
    }
  }

  const deleteAnnotation = (id: string) => {
    setAnnotations(annotations.filter(a => a.id !== id))
    if (activeAnnotationId === id) {
      setActiveAnnotationId(null)
    }
    renderAnnotations()
  }

  // 加载演示标注
  const loadDemoAnnotations = () => {
    // 使用固定的时间来计算帧数，即使视频没有加载
    const videoDuration = duration > 0 ? duration : 10 // 默认10秒视频

    const demoAnnotations: VideoAnnotation[] = [
      {
        id: '1',
        frame: Math.floor(videoDuration * FPS * 0.1),
        timecode: videoDuration * 0.1,
        shape: {
          type: 'rect',
          x: 100,
          y: 80,
          w: 200,
          h: 120,
          color: '#ef4444',
        },
        note: '品牌LOGO显示太小，在手机端看不清楚。建议放大至少1.5倍，或者使用更清晰的素材。',
        author: {
          id: 'advertiser-1',
          role: 'advertiser',
          name: '花漾美妆',
          color: '#ef4444',
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 7200000), // 2小时前
        comments: [
          {
            id: 'c1',
            author: {
              id: 'creator-1',
              role: 'creator',
              name: '创作者-小明',
              color: '#06b6d4',
            },
            text: '收到，我会重新制作一个更大的LOGO',
            createdAt: new Date(Date.now() - 3600000), // 1小时前
            reactions: { '👍': 1 },
          },
        ],
      },
      {
        id: '2',
        frame: Math.floor(videoDuration * FPS * 0.25),
        timecode: videoDuration * 0.25,
        shape: {
          type: 'arrow',
          x1: 400,
          y1: 250,
          x2: 280,
          y2: 180,
          color: '#eab308',
        },
        note: '这个转场效果太生硬，建议使用渐变淡入淡出，时长控制在0.3-0.5秒之间，让整体更流畅。',
        author: {
          id: 'advertiser-1',
          role: 'advertiser',
          name: '花漾美妆',
          color: '#eab308',
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 5400000), // 1.5小时前
        comments: [],
      },
      {
        id: '3',
        frame: Math.floor(videoDuration * FPS * 0.4),
        timecode: videoDuration * 0.4,
        shape: {
          type: 'ellipse',
          cx: 300,
          cy: 200,
          rx: 80,
          ry: 60,
          color: '#22c55e',
        },
        note: '产品特写的光线不够，建议增加侧逆光，让产品轮廓更突出。另外背景可以虚化处理。',
        author: {
          id: 'advertiser-1',
          role: 'advertiser',
          name: '花漾美妆',
          color: '#22c55e',
        },
        status: 'resolved',
        createdAt: new Date(Date.now() - 86400000), // 1天前
        comments: [
          {
            id: 'c2',
            author: {
              id: 'creator-1',
              role: 'creator',
              name: '创作者-小明',
              color: '#06b6d4',
            },
            text: '好的，我会在下一版中调整光线和背景效果',
            createdAt: new Date(Date.now() - 7200000), // 2小时前
            reactions: {},
          },
          {
            id: 'c3',
            author: {
              id: 'advertiser-1',
              role: 'advertiser',
              name: '花漾美妆',
              color: '#ef4444',
            },
            text: '👍 预期效果：产品立体感增强，背景虚化突出主体',
            createdAt: new Date(Date.now() - 3600000), // 1小时前
            reactions: { '👍': 2, '❤️': 1 },
          },
        ],
      },
      {
        id: '4',
        frame: Math.floor(videoDuration * FPS * 0.6),
        timecode: videoDuration * 0.6,
        shape: {
          type: 'text',
          x: 150,
          y: 300,
          text: '字幕需要优化',
          color: '#ec4899',
        },
        note: '字幕字体太小，颜色对比度不够。建议使用白色字体+黑色描边，字号放大2-3号。',
        author: {
          id: 'advertiser-1',
          role: 'advertiser',
          name: '花漾美妆',
          color: '#ec4899',
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 1800000), // 30分钟前
        comments: [],
      },
      {
        id: '5',
        frame: Math.floor(videoDuration * FPS * 0.8),
        timecode: videoDuration * 0.8,
        shape: {
          type: 'rect',
          x: 50,
          y: 100,
          w: 180,
          h: 100,
          color: '#6366f1',
        },
        note: '结尾联系方式显示时间太短，用户可能看不清电话号码。建议延长到2-3秒。',
        author: {
          id: 'advertiser-1',
          role: 'advertiser',
          name: '花漾美妆',
          color: '#6366f1',
        },
        status: 'pending',
        createdAt: new Date(Date.now() - 900000), // 15分钟前
        comments: [
          {
            id: 'c4',
            author: {
              id: 'creator-1',
              role: 'creator',
              name: '创作者-小明',
              color: '#06b6d4',
            },
            text: '明白，我会调整到2.5秒',
            createdAt: new Date(Date.now() - 300000), // 5分钟前
            reactions: { '👌': 1 },
          },
        ],
      },
    ]
    console.log('Loading demo annotations:', demoAnnotations)
    setAnnotations(demoAnnotations)
  }

  // 格式化时间
  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  // 导出标注数据
  const handleExport = () => {
    const data = annotations.map(a => ({
      id: a.id,
      frame: a.frame,
      timecode: formatTime(a.timecode),
      type: a.shape.type,
      note: a.note,
      author: a.author.name,
      status: a.status,
    }))
    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `video-review-${bidId}.json`
    a.click()
    URL.revokeObjectURL(url)
    alert('标注数据已导出')
  }

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex flex-col">
      {/* Header */}
      <div className="h-14 bg-[#111118] border-b border-[#2a2a38] flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-[#1dbf73] to-[#19a463] rounded-lg flex items-center justify-center">
            <span className="text-white text-sm">▶</span>
          </div>
          <div>
            <h1 className="text-sm font-bold text-white">视频审片标注</h1>
            <p className="text-xs text-[#74767e]">{authorName} · 投稿#{bidId}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-[#74767e]">当前帧: F{currentFrame}</span>
          <span className="text-xs text-[#74767e]">标注数: {annotations.length}</span>
          {!isReadOnly && (
            <button
              onClick={handleExport}
              className="px-3 py-1.5 text-xs border border-[#2a2a38] bg-[#1dbf73] text-white rounded hover:bg-[#19a463]"
            >
              导出标注
            </button>
          )}
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#21212a] rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-[#74767e]" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Toolbar - 广告主模式下显示 */}
        {!isReadOnly && (
          <AnnotationToolbar
            currentTool={currentTool}
            setCurrentTool={setCurrentTool}
            currentColor={currentColor}
            setCurrentColor={setCurrentColor}
            colors={TOOL_COLORS}
          />
        )}

        {/* Center - Video Area */}
        <div className="flex-1 flex flex-col bg-[#060608]" ref={containerRef}>
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="relative inline-block" id="video-container">
              <video
                ref={videoRef}
                src={videoUrl}
                className="max-w-full max-h-[calc(100vh-200px)] bg-gray-200 rounded-lg shadow-lg scale-150"
                preload="metadata"
                onLoadStart={() => {
                  // 视频开始加载时同步canvas大小
                  setTimeout(() => {
                    syncCanvasSize()
                    renderAnnotations()
                  }, 100)
                }}
              />
              <canvas
                ref={canvasRef}
                onMouseDown={handleCanvasMouseDown}
                onMouseMove={handleCanvasMouseMove}
                onMouseUp={handleCanvasMouseUp}
                onMouseLeave={handleCanvasMouseUp}
                className="absolute top-0 left-0 cursor-crosshair"
                style={{ pointerEvents: currentTool === 'cursor' ? 'none' : 'auto' }}
              />
            </div>
          </div>

          {/* Timeline */}
          <div className="h-24 bg-[#111118] border-t border-[#2a2a38] p-4 flex-shrink-0">
            <div className="flex items-center gap-3 mb-3">
              <button onClick={() => stepFrame(-1)} className="p-2 hover:bg-[#21212a] rounded-lg">
                <SkipBack className="w-4 h-4 text-[#74767e]" />
              </button>
              <button onClick={togglePlay} className="p-3 bg-[#1dbf73] hover:bg-[#19a463] rounded-full">
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-white" />
                ) : (
                  <Play className="w-5 h-5 text-white ml-0.5" />
                )}
              </button>
              <button onClick={() => stepFrame(1)} className="p-2 hover:bg-[#21212a] rounded-lg">
                <SkipForward className="w-4 h-4 text-[#74767e]" />
              </button>
              <div className="text-xs text-[#74767e] font-mono">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              <input
                type="range"
                min={0}
                max={duration}
                step={1 / FPS}
                value={currentTime}
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.currentTime = parseFloat(e.target.value)
                  }
                }}
                className="flex-1 h-1 accent-[#1dbf73]"
              />
              <button onClick={() => setIsMuted(!isMuted)} className="p-2 hover:bg-[#21212a] rounded-lg">
                {isMuted ? (
                  <VolumeX className="w-4 h-4 text-[#74767e]" />
                ) : (
                  <Volume2 className="w-4 h-4 text-[#74767e]" />
                )}
              </button>
            </div>
            <div className="text-xs text-[#74767e]">
              <span className="text-[#5a5a72]">快捷键:</span> Space 播放 | ,
              上一帧 | . 下一帧 | V 选择 | A 箭头 | R 矩形
            </div>
          </div>
        </div>

        {/* Right Panel - Annotation List */}
        <AnnotationList
          annotations={annotations}
          activeAnnotationId={activeAnnotationId}
          setActiveAnnotationId={setActiveAnnotationId}
          onResolve={resolveAnnotation}
          onDelete={deleteAnnotation}
          onJumpTo={(timecode) => {
            if (videoRef.current) {
              videoRef.current.currentTime = timecode
            }
          }}
          pendingShape={pendingShape}
          newNote={newNote}
          setNewNote={setNewNote}
          onSubmitAnnotation={submitAnnotation}
          onCancelAnnotation={cancelNewAnnotation}
          videoRef={videoRef}
          setCurrentFrame={setCurrentFrame}
          isReadOnly={isReadOnly}
          mode={mode}
          onAddComment={handleAddComment}
          currentUserName={mode === 'creator' ? '创作者' : '广告主'}
          currentUserColor={mode === 'creator' ? '#06b6d4' : '#ef4444'}
        />
      </div>

      {/* Footer */}
      {!isReadOnly && (
        <div className="h-16 bg-[#111118] border-t border-[#2a2a38] flex items-center justify-center gap-4 px-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-[#2a2a38] text-[#e8e8f0] rounded-lg hover:bg-[#21212a] transition-colors"
          >
            取消
          </button>
          <button
            onClick={() => onSubmit(annotations)}
            className="px-8 py-2 bg-gradient-to-r from-[#1dbf73] to-[#19a463] text-white rounded-lg hover:from-[#19a463] hover:to-[#158f57] transition-all font-medium"
          >
            要求修改
          </button>
        </div>
      )}
    </div>
  )
}
