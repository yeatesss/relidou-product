import { CheckCircle, AlertTriangle, XCircle, AlertCircle, Lightbulb } from 'lucide-react'
import { AIReviewResult } from '../types/aiReview'

interface AIReviewResultProps {
  result: AIReviewResult
  onDismiss?: () => void
}

export default function AIReviewResultDisplay({ result, onDismiss }: AIReviewResultProps) {
  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'green':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600',
          badgeBg: 'bg-green-100'
        }
      case 'yellow':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600',
          badgeBg: 'bg-yellow-100'
        }
      case 'red':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: XCircle,
          iconColor: 'text-red-600',
          badgeBg: 'bg-red-100'
        }
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: AlertCircle,
          iconColor: 'text-gray-600',
          badgeBg: 'bg-gray-100'
        }
    }
  }

  const config = getLevelConfig(result.pass_level)
  const LevelIcon = config.icon

  return (
    <div className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} overflow-hidden`}>
      {/* 结果头部 */}
      <div className="p-4 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center`}>
              <LevelIcon className={`w-6 h-6 ${config.iconColor}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#1a1a1a]">AI 预审结果</h3>
              <p className="text-xs text-[#74767e]">豆包AI · 任务预审助手</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${result.pass_level === 'green' ? 'text-green-600' : result.pass_level === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
              {result.task_score}
              <span className="text-sm font-normal text-[#74767e]">/100</span>
            </div>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold mt-1 ${config.badgeBg} ${config.textColor} border ${config.borderColor}`}>
              {result.pass_desc}
            </div>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="absolute top-4 right-4 text-[#74767e] hover:text-[#1a1a1a] transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* 问题列表 */}
      {result.problems.length > 0 && (
        <div className="p-4 border-b border-slate-200 bg-white/50">
          <h4 className="font-semibold text-[#404145] mb-3 flex items-center gap-2 text-sm">
            <AlertCircle className="w-4 h-4 text-orange-500" />
            发现问题 ({result.problems.length})
          </h4>
          <div className="space-y-2">
            {result.problems.map((problem, index) => (
              <div key={index} className="bg-white border border-orange-200 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex-shrink-0 mt-0.5">
                    {index + 1}
                  </span>
                  <div className="flex-1">
                    <div className="font-semibold text-orange-700 text-xs">{problem.item}</div>
                    <div className="text-xs text-[#74767e] mt-1">{problem.issue}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 改进建议 */}
      {result.suggestions.length > 0 && (
        <div className="p-4 bg-white/50">
          <h4 className="font-semibold text-[#404145] mb-3 flex items-center gap-2 text-sm">
            <Lightbulb className="w-4 h-4 text-blue-500" />
            改进建议 ({result.suggestions.length})
          </h4>
          <div className="space-y-2">
            {result.suggestions.map((suggestion, index) => (
              <div key={index} className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </span>
                <p className="text-xs text-blue-900 flex-1">{suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 风险提示 */}
      {result.risk_warning && (
        <div className="p-4 bg-red-50 border-t border-red-200">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-red-800 text-sm mb-1">风险提示</h4>
              <p className="text-xs text-red-700">{result.risk_warning}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
