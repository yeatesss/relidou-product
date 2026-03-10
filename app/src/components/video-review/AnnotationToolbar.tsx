import type { ToolType } from './types'
import {
  MousePointer2,
  ArrowUpRight,
  Square,
  Circle,
  Pen,
  Type as TypeIcon,
  Undo2
} from 'lucide-react'

interface AnnotationToolbarProps {
  currentTool: ToolType
  setCurrentTool: (tool: ToolType) => void
  currentColor: string
  setCurrentColor: (color: string) => void
  colors: string[]
}

const tools = [
  { id: 'cursor' as ToolType, icon: MousePointer2, label: '选择', shortcut: 'V' },
  { id: 'arrow' as ToolType, icon: ArrowUpRight, label: '箭头', shortcut: 'A' },
  { id: 'rect' as ToolType, icon: Square, label: '矩形', shortcut: 'R' },
  { id: 'ellipse' as ToolType, icon: Circle, label: '椭圆', shortcut: 'E' },
  { id: 'pen' as ToolType, icon: Pen, label: '画笔', shortcut: 'P' },
  { id: 'text' as ToolType, icon: TypeIcon, label: '文字', shortcut: 'T' },
]

export default function AnnotationToolbar({
  currentTool,
  setCurrentTool,
  currentColor,
  setCurrentColor,
  colors,
}: AnnotationToolbarProps) {
  return (
    <div className="w-14 bg-[#111118] border-r border-[#2a2a38] flex flex-col items-center py-3 gap-1 flex-shrink-0">
      {tools.map((tool) => {
        const Icon = tool.icon
        const isActive = currentTool === tool.id
        return (
          <button
            key={tool.id}
            onClick={() => setCurrentTool(tool.id)}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all relative group ${
              isActive
                ? 'bg-[#1dbf73]/20 border border-[#1dbf73]'
                : 'border border-transparent hover:bg-[#21212a] hover:border-[#353548]'
            }`}
            title={`${tool.label} (${tool.shortcut})`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#1dbf73]' : 'text-[#74767e]'}`} />
            <span className="absolute left-full ml-2 px-2 py-1 bg-[#21212a] border border-[#353548] rounded text-xs text-[#e8e8f0] opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
              {tool.label}
            </span>
          </button>
        )
      })}

      <div className="w-8 h-px bg-[#2a2a38] my-1" />

      {/* Color Palette */}
      <div className="flex flex-col items-center gap-2">
        {colors.map((color, index) => (
          <button
            key={color}
            onClick={() => setCurrentColor(color)}
            className={`w-6 h-6 rounded-full border-2 transition-all ${
              currentColor === color
                ? 'border-white scale-110 shadow-lg shadow-white/20'
                : 'border-transparent hover:scale-110'
            }`}
            style={{ backgroundColor: color }}
            title={`颜色 ${index + 1}`}
          />
        ))}
      </div>

      <div className="w-8 h-px bg-[#2a2a38] my-1" />

      <div className="mt-auto flex flex-col items-center gap-1">
        <button
          onClick={() => {
            // TODO: 实现撤销功能
          }}
          className="w-10 h-10 rounded-lg flex items-center justify-center border border-transparent hover:bg-[#21212a] hover:border-[#353548] transition-all"
          title="撤销 (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4 text-[#74767e]" />
        </button>
      </div>
    </div>
  )
}
