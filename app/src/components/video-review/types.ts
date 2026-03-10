export interface ShapeData {
  type: 'rect' | 'arrow' | 'ellipse' | 'pen' | 'text'
  color?: string
  x?: number
  y?: number
  w?: number
  h?: number
  cx?: number
  cy?: number
  rx?: number
  ry?: number
  x1?: number
  y1?: number
  x2?: number
  y2?: number
  points?: { x: number, y: number }[]
  text?: string
}

export interface VideoAnnotation {
  id: string
  frame: number
  timecode: number
  shape: ShapeData
  note: string
  author: {
    id: string
    role: 'advertiser' | 'creator'
    name: string
    color: string
  }
  status: 'pending' | 'resolved'
  createdAt: Date
  comments: Comment[]
}

export interface Comment {
  id: string
  author: {
    id: string
    role: 'advertiser' | 'creator'
    name: string
    color: string
  }
  text: string
  createdAt: Date
  reactions: {
    [key: string]: number
  }
}

export interface ReviewSessionProps {
  bidId: number
  taskId: string
  videoUrl: string
  authorName: string
  onClose: () => void
  onSubmit: (annotations: VideoAnnotation[]) => void
  mode?: 'advertiser' | 'creator' // 模式：广告主可标注，创作者只能查看
}

export type ToolType = 'cursor' | 'arrow' | 'rect' | 'ellipse' | 'pen' | 'text'
