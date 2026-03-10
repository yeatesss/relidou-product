// Video annotation list component
import type { VideoAnnotation, ShapeData } from './types'
import { MessageCircle, CheckCircle, Trash2, Reply, Send, ChevronRight } from 'lucide-react'
import { useState } from 'react'

interface AnnotationListProps {
  annotations: VideoAnnotation[]
  activeAnnotationId: string | null
  setActiveAnnotationId: (id: string) => void
  onResolve: (id: string) => void
  onDelete: (id: string) => void
  onJumpTo: (timecode: number) => void
  pendingShape: ShapeData | null
  newNote: string
  setNewNote: (note: string) => void
  onSubmitAnnotation: () => void
  onCancelAnnotation: () => void
  videoRef: React.RefObject<HTMLVideoElement>
  setCurrentFrame: (frame: number) => void
  isReadOnly?: boolean // 是否为只读模式（创作者模式）
  mode?: 'advertiser' | 'creator' // 模式
  onAddComment?: (annotationId: string, comment: string) => void // 添加评论回调
  currentUserName?: string // 当前用户名称
  currentUserColor?: string // 当前用户颜色
}

const TOOL_ICONS: Record<string, string> = {
  rect: '▭',
  ellipse: '◯',
  arrow: '↗',
  pen: '✏',
  text: 'T',
}

export default function AnnotationList({
  annotations,
  activeAnnotationId,
  setActiveAnnotationId,
  onResolve,
  onDelete,
  onJumpTo,
  pendingShape,
  newNote,
  setNewNote,
  onSubmitAnnotation,
  onCancelAnnotation,
  videoRef,
  setCurrentFrame,
  isReadOnly = false,
  mode = 'advertiser',
  onAddComment,
  currentUserName = mode === 'creator' ? '创作者' : '广告主',
  currentUserColor = mode === 'creator' ? '#06b6d4' : '#ef4444',
}: AnnotationListProps) {
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({})
  const [replyVisible, setReplyVisible] = useState<Record<string, boolean>>({})

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 1000)
    if (diff < 10) return '刚刚'
    if (diff < 60) return `${diff}秒前`
    if (diff < 3600) return `${Math.floor(diff / 60)}分钟前`
    if (diff < 86400) return `${Math.floor(diff / 3600)}小时前`
    return `${Math.floor(diff / 86400)}天前`
  }

  const addComment = (annotationId: string) => {
    const text = replyInputs[annotationId]?.trim()
    if (!text) return

    // 调用回调函数添加评论
    if (onAddComment) {
      onAddComment(annotationId, text)
    }

    // 清空输入框并隐藏
    setReplyInputs({ ...replyInputs, [annotationId]: '' })
    setReplyVisible({ ...replyVisible, [annotationId]: false })
  }

  const toggleReply = (annotationId: string) => {
    setReplyVisible({ ...replyVisible, [annotationId]: !replyVisible[annotationId] })
  }

  const formatTime = (seconds: number) => {
    if (!seconds || isNaN(seconds)) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }

  const jumpToAnnotation = (timecode: number) => {
    onJumpTo(timecode)
    if (videoRef.current) {
      videoRef.current.currentTime = timecode
    }
  }

  return (
    <div className="w-80 bg-[#111118] border-l border-[#2a2a38] flex flex-col flex-shrink-0">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#2a2a38]">
        <h2 className="text-sm font-bold text-[#e8e8f0] flex items-center gap-2">
          <MessageCircle className="w-4 h-4 text-[#1dbf73]" />
          标注列表
          <span className="ml-auto text-xs font-normal text-[#74767e]">
            {annotations.length} 条
          </span>
        </h2>
      </div>

      {/* Annotations */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {annotations.length === 0 ? (
          <div className="text-center py-8">
            <MessageCircle className="w-12 h-12 text-[#353548] mx-auto mb-3" />
            <p className="text-sm text-[#5a5a72]">暂无标注</p>
            <p className="text-xs text-[#353548] mt-1">
              在视频上绘制标注后<br />说明会显示在这里
            </p>
          </div>
        ) : (
          annotations.map((ann, index) => {
            const isActive = ann.id === activeAnnotationId
            const icon = TOOL_ICONS[ann.shape.type] || '●'
            const timeSince = getRelativeTime(ann.createdAt)

            return (
              <div
                key={ann.id}
                className={`bg-[#18181f] border rounded-lg overflow-hidden transition-all cursor-pointer ${
                  isActive
                    ? 'border-[#1dbf73] shadow-lg shadow-[#1dbf73]/20'
                    : 'border-[#2a2a38] hover:border-[#353548]'
                }`}
                onClick={() => {
                  setActiveAnnotationId(ann.id)
                  jumpToAnnotation(ann.timecode)
                }}
              >
                {/* Header */}
                <div className="p-3 flex items-start gap-2 border-b border-[#2a2a38]">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: ann.author.color + '30' }}
                  >
                    <span className="text-sm font-bold" style={{ color: ann.author.color }}>
                      {icon}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-[#e8e8f0] truncate">
                        {ann.author.name}
                      </span>
                      <span className="text-xs text-[#1dbf73] font-mono">
                        F{ann.frame}
                      </span>
                    </div>
                    <div className="text-xs text-[#74767e]">
                      {timeSince}
                    </div>
                  </div>
                </div>

                {/* Note */}
                {ann.note && (
                  <div className="p-3 text-sm text-[#e8e8f0] leading-relaxed border-b border-[#2a2a38]">
                    {ann.note}
                  </div>
                )}

                {/* Comments */}
                {ann.comments && ann.comments.length > 0 && (
                  <div className="p-3 space-y-2 border-b border-[#2a2a38]">
                    {ann.comments.map((comment) => (
                      <div key={comment.id} className="flex items-start gap-2 text-xs">
                        <div
                          className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-[10px] font-bold text-white"
                          style={{ backgroundColor: comment.author.color }}
                        >
                          {comment.author.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-0.5">
                            <span className="font-medium text-[#e8e8f0]">{comment.author.name}</span>
                            <span className="text-[#5a5a72]">{getRelativeTime(comment.createdAt)}</span>
                          </div>
                          <div className="text-[#74767e] break-words">{comment.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Reply Input */}
                {replyVisible[ann.id] && (
                  <div className="p-3 border-b border-[#2a2a38] bg-[#1a1a24]">
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <textarea
                          value={replyInputs[ann.id] || ''}
                          onChange={(e) => setReplyInputs({ ...replyInputs, [ann.id]: e.target.value })}
                          placeholder="输入回复内容..."
                          className="w-full px-3 py-2 bg-[#18181f] border border-[#2a2a38] rounded-lg text-sm text-[#e8e8f0] placeholder-[#5a5a72] resize-none focus:outline-none focus:border-[#1dbf73] transition-colors"
                          rows={2}
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div className="flex items-center justify-end gap-2 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              toggleReply(ann.id)
                            }}
                            className="px-3 py-1 text-xs border border-[#2a2a38] rounded hover:bg-[#21212a] transition-colors text-[#74767e]"
                          >
                            取消
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              addComment(ann.id)
                            }}
                            className="px-3 py-1 text-xs bg-[#1dbf73] text-white rounded hover:bg-[#19a463] transition-colors"
                          >
                            发送
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="p-3 bg-[#12121a]">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        toggleReply(ann.id)
                      }}
                      className="flex-1 flex items-center gap-1 px-2 py-1.5 text-xs border border-[#2a2a2a38] rounded hover:bg-[#21212a] hover:border-[#353548] transition-colors text-[#74767e]"
                    >
                      <Reply className="w-3 h-3" />
                      {replyVisible[ann.id] ? '收起' : '回复'}
                    </button>
                    {!isReadOnly && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onResolve(ann.id)
                          }}
                          className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                            ann.status === 'resolved'
                              ? 'border-[#22c55e] text-[#22c55e]'
                              : 'border-[#2a2a38] text-[#74767e] hover:border-[#22c55e] hover:text-[#22c55e]'
                          }`}
                          title={ann.status === 'resolved' ? '重新开启' : '标记已解决'}
                        >
                          <CheckCircle className="w-3 h-3" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(ann.id)
                          }}
                          className="px-2 py-1.5 text-xs border border-[#2a2a38] rounded hover:bg-red-500/10 hover:border-red-500 hover:text-red-500 transition-colors text-[#74767e]"
                          title="删除"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Annotation Panel - 广告主模式下显示 */}
      {!isReadOnly && (
        <div className="border-t border-[#2a2a38] p-3 bg-[#111118]">
          <div className="mb-2 text-xs font-medium text-[#5a5a72]">
            📌 添加标注说明
          </div>
          <textarea
            id="new-note-input"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="描述这个问题或建议..."
            className="w-full px-3 py-2 bg-[#18181f] border border-[#2a2a38] rounded-lg text-sm text-[#e8e8f0] placeholder-[#5a5a72] resize-none focus:outline-none focus:border-[#1dbf73] transition-colors"
            rows={3}
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-[#5a5a72]">
              当前帧: F{Math.round((videoRef.current?.currentTime || 0) * 30)}
            </span>
            <div className="flex gap-2">
              <button
                onClick={onCancelAnnotation}
                className="px-3 py-1.5 text-xs border border-[#2a2a38] rounded hover:bg-[#21212a] transition-colors text-[#74767e]"
              >
                取消
              </button>
              <button
                onClick={onSubmitAnnotation}
                className="px-3 py-1.5 text-xs bg-[#1dbf73] text-white rounded hover:bg-[#19a463] transition-colors flex items-center gap-1"
              >
                <Send className="w-3 h-3" />
                添加
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 创作者模式下的提示 */}
      {isReadOnly && (
        <div className="border-t border-[#2a2a38] p-3 bg-[#111118]">
          <div className="text-center text-xs text-[#5a5a72]">
            <MessageCircle className="w-4 h-4 mx-auto mb-1 text-[#1dbf73]" />
            查看广告主的修改意见
            <br />
            点击"回复"按钮与广告主沟通
          </div>
        </div>
      )}
    </div>
  )
}
