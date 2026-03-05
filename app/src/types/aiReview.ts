// AI预审相关类型定义
export type TaskDetails = {
  taskName: string
  videoType: string
  duration: string
  quantity: number
  coreRequirements: string
  budget: number
  settlementMethod: string
  deliveryTime: string
  modificationCount?: number
  copyrightOwnership?: string
  acceptanceCriteria?: string
  scene?: string
  style?: string
  dubbing?: string
  platform?: string
  resolution?: string
  acceptAI?: string
}

export type AIReviewResult = {
  task_score: number
  pass_level: 'green' | 'yellow' | 'red'
  pass_desc: string
  problems: Array<{ item: string; issue: string }>
  suggestions: string[]
  risk_warning: string
}

export type AIReviewResponse = {
  success: boolean
  data?: AIReviewResult
  error?: string
}
