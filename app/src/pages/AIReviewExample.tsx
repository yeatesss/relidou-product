import { useState } from 'react'
import { CheckCircle, AlertTriangle, XCircle, AlertCircle, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import { AIReviewResult } from '../types/aiReview'

// 模拟不同场景的AI反馈
const mockResults: Record<string, AIReviewResult> = {
  good: {
    task_score: 92,
    pass_level: 'green',
    pass_desc: '合格',
    problems: [],
    suggestions: [
      '建议明确视频画幅比例（如9:16竖屏）',
      '建议补充交付时间要求'
    ],
    risk_warning: ''
  },
  warning: {
    task_score: 58,
    pass_level: 'yellow',
    pass_desc: '需优化',
    problems: [
      { item: '内容清晰度', issue: '存在模糊描述"好看就行""你发挥"，未明确具体要求和风格' },
      { item: '验收标准', issue: '缺少明确、可量化的验收标准，易产生纠纷' },
      { item: '权责清晰', issue: '未说明修改次数、版权归属、返工规则' },
      { item: '佣金合理性', issue: '15秒视频600元偏低，建议参考市场价800-1200元' }
    ],
    suggestions: [
      '明确视频风格和具体要求（如：自然生活化/专业测评向）',
      '补充验收标准（如：画面清晰度、内容完整性、品牌一致性）',
      '明确修改次数（建议2-3次）和版权归属',
      '建议提高佣金至800-1200元，或降低制作难度要求'
    ],
    risk_warning: '存在验收标准模糊和佣金偏低风险，建议优化后再发布'
  },
  bad: {
    task_score: 25,
    pass_level: 'red',
    pass_desc: '不建议发布',
    problems: [
      { item: '合规性', issue: '涉及医疗功效承诺（"治疗失眠""3天减肥"），违反广告法，存在法律风险' },
      { item: '可行性', issue: '60秒×3条，要求复杂，3天内完成不现实' },
      { item: '佣金合理性', issue: '3条60秒视频仅500元，远低于市场价（约1500-2500元）' },
      { item: '权责清晰', issue: '"满意为止"无修改次数限制，易导致无限返工' },
      { item: '创作者友好度', issue: '存在严重坑点，极易产生纠纷' }
    ],
    suggestions: [
      '立即修改产品描述，去除违规医疗功效承诺，符合广告法要求',
      '重新评估任务难度和制作周期，给足合理时间',
      '大幅提高佣金至1500-2500元区间，匹配制作难度',
      '明确修改次数（建议不超过3次）和验收标准',
      '建议参考平台同类任务的定价和标准发布'
    ],
    risk_warning: '严重违规风险：涉嫌虚假宣传、违反广告法；纠纷风险极高，强烈不建议发布'
  }
}

export default function AIReviewExample() {
  const [selectedScenario, setSelectedScenario] = useState<string>('warning')
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['score', 'problems']))

  const result = mockResults[selectedScenario]
  const taskName = selectedScenario === 'good' ? '护肤品牌抖音好物种草视频' :
                   selectedScenario === 'warning' ? '电商产品推广视频' :
                   '保健品宣传视频'

  const toggleSection = (section: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev)
      if (newSet.has(section)) {
        newSet.delete(section)
      } else {
        newSet.add(section)
      }
      return newSet
    })
  }

  const getLevelConfig = (level: string) => {
    switch (level) {
      case 'green':
        return {
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          textColor: 'text-green-800',
          icon: CheckCircle,
          iconColor: 'text-green-600'
        }
      case 'yellow':
        return {
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          textColor: 'text-yellow-800',
          icon: AlertTriangle,
          iconColor: 'text-yellow-600'
        }
      case 'red':
        return {
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          textColor: 'text-red-800',
          icon: XCircle,
          iconColor: 'text-red-600'
        }
      default:
        return {
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          textColor: 'text-gray-800',
          icon: AlertCircle,
          iconColor: 'text-gray-600'
        }
    }
  }

  const config = getLevelConfig(result.pass_level)
  const LevelIcon = config.icon

  return (
    <div className="min-h-screen bg-[#f7f7f7] pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-[#1a1a1a] mb-2">AI 任务预审功能演示</h1>
          <p className="text-[#74767e]">展示豆包AI预审任务的反馈结果</p>
        </div>

        {/* 场景选择器 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 mb-6">
          <label className="block text-sm font-medium text-[#404145] mb-3">
            选择测试场景：
          </label>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setSelectedScenario('good')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedScenario === 'good'
                  ? 'bg-green-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ✅ 合格任务
            </button>
            <button
              onClick={() => setSelectedScenario('warning')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedScenario === 'warning'
                  ? 'bg-yellow-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ⚠️ 需优化
            </button>
            <button
              onClick={() => setSelectedScenario('bad')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                selectedScenario === 'bad'
                  ? 'bg-red-500 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              ❌ 不建议发布
            </button>
          </div>
        </div>

        {/* 任务信息 */}
        <div className="bg-white rounded-xl p-5 shadow-sm border border-slate-100 mb-6">
          <h2 className="text-lg font-semibold text-[#404145] mb-3">任务信息</h2>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-[#74767e]">任务名称：</span>
              <span className="font-medium text-[#404145]">{taskName}</span>
            </div>
            <div>
              <span className="text-[#74767e]">视频类型：</span>
              <span className="font-medium text-[#404145]">好物种草</span>
            </div>
            <div>
              <span className="text-[#74767e]">时长：</span>
              <span className="font-medium text-[#404145]">15-30秒</span>
            </div>
            <div>
              <span className="text-[#74767e]">条数：</span>
              <span className="font-medium text-[#404145]">1条</span>
            </div>
            <div>
              <span className="text-[#74767e]">佣金：</span>
              <span className={`font-bold ${result.pass_level === 'green' ? 'text-green-600' : result.pass_level === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                {selectedScenario === 'good' ? '¥1,200' : selectedScenario === 'warning' ? '¥600' : '¥500'}
              </span>
            </div>
            <div>
              <span className="text-[#74767e]">结算方式：</span>
              <span className="font-medium text-[#404145]">验收合格后结算</span>
            </div>
          </div>
        </div>

        {/* AI 预审结果 */}
        <div className={`rounded-xl border-2 ${config.borderColor} ${config.bgColor} overflow-hidden`}>
          {/* 结果头部 */}
          <div className="p-5 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center`}>
                  <LevelIcon className={`w-7 h-7 ${config.iconColor}`} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-[#1a1a1a]">AI 预审结果</h2>
                  <p className="text-sm text-[#74767e] mt-0.5">
                    豆包AI · 任务预审助手
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className={`text-4xl font-bold ${result.pass_level === 'green' ? 'text-green-600' : result.pass_level === 'yellow' ? 'text-yellow-600' : 'text-red-600'}`}>
                  {result.task_score}
                  <span className="text-lg font-normal text-[#74767e]">/100</span>
                </div>
                <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-bold mt-1 ${config.bgColor} ${config.textColor} border ${config.borderColor}`}>
                  {result.pass_desc}
                </div>
              </div>
            </div>
          </div>

          {/* 评分说明 */}
          <div className="p-5 border-b border-slate-200 bg-white/50">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-[#404145]">评分等级说明</h3>
              <button
                onClick={() => toggleSection('score')}
                className="text-[#74767e] hover:text-[#1a1a1a] transition-colors"
              >
                {expandedSections.has('score') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </button>
            </div>
            {expandedSections.has('score') && (
              <div className="grid grid-cols-3 gap-3 mt-3">
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                  <div className="font-bold text-green-700">90-100分</div>
                  <div className="text-xs text-green-600 mt-1">合格，推荐发布</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
                  <div className="font-bold text-yellow-700">60-89分</div>
                  <div className="text-xs text-yellow-600 mt-1">需优化，可发布但存在风险</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                  <div className="font-bold text-red-700">0-59分</div>
                  <div className="text-xs text-red-600 mt-1">不通过，不建议发布</div>
                </div>
              </div>
            )}
          </div>

          {/* 问题列表 */}
          {result.problems.length > 0 && (
            <div className="p-5 border-b border-slate-200 bg-white/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#404145] flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-orange-500" />
                  发现问题 ({result.problems.length})
                </h3>
                <button
                  onClick={() => toggleSection('problems')}
                  className="text-[#74767e] hover:text-[#1a1a1a] transition-colors"
                >
                  {expandedSections.has('problems') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              {expandedSections.has('problems') && (
                <div className="space-y-2 mt-3">
                  {result.problems.map((problem, index) => (
                    <div key={index} className="bg-white border border-orange-200 rounded-lg p-3">
                      <div className="flex items-start gap-2">
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex-shrink-0 mt-0.5">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <div className="font-semibold text-orange-700 text-sm">{problem.item}</div>
                          <div className="text-sm text-[#74767e] mt-1">{problem.issue}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 改进建议 */}
          {result.suggestions.length > 0 && (
            <div className="p-5 border-b border-slate-200 bg-white/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-[#404145] flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-blue-500" />
                  改进建议 ({result.suggestions.length})
                </h3>
                <button
                  onClick={() => toggleSection('suggestions')}
                  className="text-[#74767e] hover:text-[#1a1a1a] transition-colors"
                >
                  {expandedSections.has('suggestions') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </button>
              </div>
              {expandedSections.has('suggestions') && (
                <div className="space-y-2 mt-3">
                  {result.suggestions.map((suggestion, index) => (
                    <div key={index} className="flex items-start gap-2 bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-blue-500 text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <p className="text-sm text-blue-900 flex-1">{suggestion}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 风险提示 */}
          {result.risk_warning && (
            <div className="p-5 bg-red-50 border-t border-red-200">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-red-800 mb-1">风险提示</h4>
                  <p className="text-sm text-red-700">{result.risk_warning}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 原始JSON */}
        <div className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-[#404145]">AI 返回的原始 JSON</h3>
            <button
              onClick={() => toggleSection('json')}
              className="text-[#74767e] hover:text-[#1a1a1a] transition-colors"
            >
              {expandedSections.has('json') ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </button>
          </div>
          {expandedSections.has('json') && (
            <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mt-3">
              {JSON.stringify(result, null, 2)}
            </pre>
          )}
        </div>

        {/* 使用说明 */}
        <div className="mt-6 bg-white rounded-xl p-5 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-[#404145] mb-3">📝 对接说明</h3>
          <div className="space-y-2 text-sm text-[#74767e]">
            <p>1. <strong>传入参数</strong>：将任务表单的所有字段（名称、类型、时长、佣金、要求等）序列化传给AI</p>
            <p>2. <strong>AI返回</strong>：豆包AI只返回纯JSON格式，不做任何额外解释</p>
            <p>3. <strong>解析展示</strong>：前端解析JSON后，根据pass_level渲染不同颜色和图标</p>
            <p>4. <strong>实时预审</strong>：广告主填写表单时可随时触发AI预审，获取实时反馈</p>
          </div>
        </div>
      </div>
    </div>
  )
}
