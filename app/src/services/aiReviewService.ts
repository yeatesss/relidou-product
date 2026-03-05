import { TaskDetails, AIReviewResult, AIReviewResponse } from '../types/aiReview'

/**
 * AI预审服务类
 * 负责对接豆包AI API进行任务预审
 */
class AIReviewService {
  private apiUrl: string
  private apiKey: string

  constructor() {
    // TODO: 从环境变量或配置文件中获取
    this.apiUrl = import.meta.env.VITE_DOUBAO_API_URL || 'https://ark.cn-beijing.volces.com/api/v3/chat/completions'
    this.apiKey = import.meta.env.VITE_DOUBAO_API_KEY || ''
  }

  /**
   * 构建AI预审的Prompt
   */
  private buildPrompt(taskDetails: TaskDetails): string {
    const systemPrompt = `你是短视频接单平台的【AI 任务预审助手】，只负责客观、严格、中立地预审广告主发布的视频制作任务详情。
你的立场：站在真实创作者视角，判断任务是否清晰、可执行、无纠纷风险。

## 一、预审维度与评分依据（必须严格按以下8项判断）
1. 信息完整性：任务名称、视频类型、时长、条数、核心要求、佣金、结算方式是否完整。
2. 内容清晰度：需求是否明确，无"随便做""看着办""你发挥"等模糊描述。
3. 合规性：是否包含违规词、绝对化用语、虚假宣传、医疗功效、违规承诺等。
4. 可行性：内容量、制作难度、时长限制是否合理可实现。
5. 验收标准：是否明确、可量化、无歧义。
6. 佣金合理性：制作难度与佣金是否匹配，是否存在"高要求低佣金"。
7. 权责清晰：修改次数、版权归属、返工规则、交付形式是否清晰。
8. 创作者友好度：是否存在隐形要求、坑点、易产生纠纷的模糊条款。

## 二、打分与等级规则
- 总分：0～100 分
- 90～100：green（合格，推荐发布）
- 60～89：yellow（需优化，可发布但存在风险）
- 0～59：red（不通过，不建议发布）

## 三、输出格式强制要求
只返回标准 JSON，不解释、不补充、不聊天、不换行、不添加任何多余文字，结构如下：
{
  "task_score": 分数（数字）,
  "pass_level": "green/yellow/red",
  "pass_desc": "合格/需优化/不建议发布",
  "problems": [
    {"item":"维度名称","issue":"具体问题描述"}
  ],
  "suggestions": ["改进建议1","改进建议2"],
  "risk_warning": "风险提示，无风险则为空字符串"
}

## 四、行为约束
1. 只做判断，不帮广告主写文案、不做创意、不修改任务内容。
2. 严格客观，不偏袒广告主，也不刻意刁难。
3. 问题必须具体、可落地，建议必须可执行。
4. 必须严格返回 JSON，不得返回任何多余内容。`

    const userPrompt = `请预审以下视频制作任务：

【任务名称】${taskDetails.taskName}
【视频类型】${taskDetails.videoType}
【视频时长】${taskDetails.duration}
【交付数量】${taskDetails.quantity}条
【核心要求】${taskDetails.coreRequirements}
【任务预算】¥${taskDetails.budget}
【结算方式】${taskDetails.settlementMethod}
【交付时间】${taskDetails.deliveryTime}
${taskDetails.modificationCount ? `【修改次数】${taskDetails.modificationCount}次` : ''}
${taskDetails.copyrightOwnership ? `【版权归属】${taskDetails.copyrightOwnership}` : ''}
${taskDetails.acceptanceCriteria ? `【验收标准】${taskDetails.acceptanceCriteria}` : ''}

请严格按照要求返回JSON格式的预审结果。`

    return {
      systemPrompt,
      userPrompt
    }
  }

  /**
   * 调用豆包AI API进行预审
   */
  async reviewTask(taskDetails: TaskDetails): Promise<AIReviewResponse> {
    try {
      // 如果没有配置API Key，返回模拟数据用于开发测试
      if (!this.apiKey) {
        console.warn('豆包AI API Key未配置，返回模拟数据')
        return this.getMockResult(taskDetails)
      }

      const { systemPrompt, userPrompt } = this.buildPrompt(taskDetails)

      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'ep-20241105120356-rd6vl', // 豆包模型ID
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
          ],
          temperature: 0.3,
          max_tokens: 2000
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const data = await response.json()
      const content = data.choices[0]?.message?.content

      if (!content) {
        throw new Error('AI返回内容为空')
      }

      // 解析AI返回的JSON
      const result: AIReviewResult = JSON.parse(content)

      return {
        success: true,
        data: result
      }
    } catch (error) {
      console.error('AI预审失败:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : '未知错误'
      }
    }
  }

  /**
   * 获取模拟结果（用于开发测试）
   */
  private getMockResult(taskDetails: TaskDetails): AIReviewResponse {
    // 根据任务详情简单判断返回不同等级的结果
    const hasCompleteInfo = taskDetails.taskName &&
                           taskDetails.videoType &&
                           taskDetails.coreRequirements &&
                           taskDetails.budget > 0

    const hasVagueLanguage = /随便|看着办|你发挥|差不多|还行/.test(taskDetails.coreRequirements)
    const hasUnreasonablePrice = taskDetails.budget < 500 && taskDetails.quantity >= 1

    if (!hasCompleteInfo) {
      return {
        success: true,
        data: {
          task_score: 15,
          pass_level: 'red',
          pass_desc: '不建议发布',
          problems: [
            { item: '信息完整性', issue: '任务关键信息不完整' }
          ],
          suggestions: ['请补充完整的任务信息'],
          risk_warning: '信息严重缺失，无法接单'
        }
      }
    }

    if (hasVagueLanguage || hasUnreasonablePrice) {
      return {
        success: true,
        data: {
          task_score: 58,
          pass_level: 'yellow',
          pass_desc: '需优化',
          problems: hasVagueLanguage ? [
            { item: '内容清晰度', issue: '存在模糊描述，未明确具体要求' }
          ] : [],
          suggestions: hasVagueLanguage ? [
            '明确具体要求和风格'
          ] : [],
          risk_warning: '存在验收标准模糊风险'
        }
      }
    }

    return {
      success: true,
      data: {
        task_score: 92,
        pass_level: 'green',
        pass_desc: '合格',
        problems: [],
        suggestions: [
          '建议明确视频画幅比例',
          '建议补充交付时间要求'
        ],
        risk_warning: ''
      }
    }
  }
}

// 导出单例
export const aiReviewService = new AIReviewService()
