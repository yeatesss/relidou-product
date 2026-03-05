import { useState } from 'react'
import { Sparkles, Loader2 } from 'lucide-react'
import { aiReviewService } from '../services/aiReviewService'
import { TaskDetails, AIReviewResult } from '../types/aiReview'
import AIReviewResultDisplay from './AIReviewResult'

interface AIReviewButtonProps {
  taskDetails: TaskDetails
  onReviewComplete?: (result: any) => void
  buttonClassName?: string
  disabled?: boolean
}

export default function AIReviewButton({
  taskDetails,
  onReviewComplete,
  buttonClassName = '',
  disabled = false
}: AIReviewButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [showResult, setShowResult] = useState(false)

  const handleReview = async () => {
    // 验证必填字段
    if (!taskDetails.taskName || !taskDetails.videoType || !taskDetails.coreRequirements) {
      alert('请先填写任务名称、视频类型和核心要求')
      return
    }

    setIsLoading(true)
    setShowResult(false)

    try {
      const response = await aiReviewService.reviewTask(taskDetails)

      if (response.success && response.data) {
        setResult(response.data)
        setShowResult(true)
        onReviewComplete?.(response.data)
      } else {
        alert('AI预审失败：' + (response.error || '未知错误'))
      }
    } catch (error) {
      console.error('AI预审错误:', error)
      alert('AI预审出错，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleReview}
        disabled={isLoading || disabled}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
          disabled
            ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md'
        } ${buttonClassName}`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            AI预审中...
          </>
        ) : (
          <>
            <Sparkles className="w-4 h-4" />
            AI 预审
          </>
        )}
      </button>

      {/* 预审结果弹窗 */}
      {showResult && result && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl max-h-[80vh] overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#1a1a1a]">AI预审结果</h3>
              <button
                onClick={() => setShowResult(false)}
                className="text-slate-400 hover:text-slate-600 transition-colors"
              >
                ✕
              </button>
            </div>
            <div className="p-4 overflow-y-auto max-h-[60vh]">
              <AIReviewResultDisplay result={result} />
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setShowResult(false)}
                className="px-4 py-2 text-sm text-[#74767e] hover:text-[#1a1a1a] transition-colors"
              >
                关闭
              </button>
              <button
                onClick={() => setShowResult(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${
                  result.pass_level === 'green'
                    ? 'bg-green-500 hover:bg-green-600 text-white'
                    : result.pass_level === 'yellow'
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white'
                    : 'bg-slate-200 text-slate-600'
                }`}
              >
                {result.pass_level === 'green' ? '确认发布' : result.pass_level === 'yellow' ? '仍要发布' : '我知道了'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
