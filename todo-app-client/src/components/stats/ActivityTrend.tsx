import { useMemo } from 'react'
import { subDays, isSameDay, format } from 'date-fns'
import { Todo } from '@/types/todo.types'
import { TrendingUp } from 'lucide-react'

interface ActivityTrendProps {
  todos: Todo[]
}

export function ActivityTrend({ todos }: ActivityTrendProps) {
  const completedTodos = useMemo(() => {
    return todos.filter((t) => t.status === 'completed' && t.updatedAt)
  }, [todos])

  // Get the last 7 days including today
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 })
      .map((_, i) => subDays(new Date(), i))
      .reverse()
  }, [])

  // Count completions per day
  const dataPoints = useMemo(() => {
    return last7Days.map((day) => {
      const count = completedTodos.filter((t) => isSameDay(new Date(t.updatedAt), day)).length
      return {
        label: format(day, 'EEE'),
        count
      }
    })
  }, [last7Days, completedTodos])

  const maxCount = useMemo(() => {
    const max = Math.max(...dataPoints.map((d) => d.count))
    return max === 0 ? 5 : max
  }, [dataPoints])

  // SVG dimensions
  const height = 180
  const width = 500

  // Generate SVG coordinates for the line path
  const points = useMemo(() => {
    return dataPoints.map((dp, i) => {
      const x = (i / 6) * (width - 40) + 20
      const y = height - 35 - (dp.count / maxCount) * (height - 70)
      return { x, y }
    })
  }, [dataPoints, maxCount])

  // Generate path 'd' string
  const linePath = useMemo(() => {
    if (points.length === 0) return ''
    return points.reduce((acc, p, i) => {
      return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`
    }, '')
  }, [points])

  // Generate path 'd' string for gradient area fill
  const areaPath = useMemo(() => {
    if (points.length === 0) return ''
    const startX = points[0].x
    const endX = points[points.length - 1].x
    const bottomY = height - 25
    return `${linePath} L ${endX} ${bottomY} L ${startX} ${bottomY} Z`
  }, [points, linePath])

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5 flex flex-col h-full">
      <div className="flex items-center gap-2 mb-1">
        <TrendingUp size={15} className="text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Completion Trend</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-6">Tasks completed over the last 7 days</p>

      {/* SVG Responsive Container */}
      <div className="w-full relative h-[180px] mt-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.1" />
              <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines (horizontal) */}
          {Array.from({ length: 4 }).map((_, i) => {
            const y = 30 + i * ((height - 70) / 3)
            const value = Math.round(maxCount - (i / 3) * maxCount)
            return (
              <g key={i}>
                <line
                  x1="20"
                  y1={y}
                  x2={width - 20}
                  y2={y}
                  stroke="currentColor"
                  className="text-border/30"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x="4"
                  y={y + 3}
                  className="text-[9px] font-semibold fill-muted-foreground/80 select-none tabular-nums"
                >
                  {value}
                </text>
              </g>
            )
          })}

          {/* Area Fill */}
          <path d={areaPath} fill="url(#areaGrad)" />

          {/* Line Path */}
          <path
            d={linePath}
            fill="none"
            stroke="currentColor"
            className="text-primary"
            strokeWidth={2}
          />

          {/* Data Points / Circles */}
          {points.map((p, i) => (
            <g key={i} className="group/dot">
              <circle
                cx={p.x}
                cy={p.y}
                r={4}
                fill="var(--card)"
                stroke="currentColor"
                className="text-primary"
                strokeWidth={2}
              />
              <circle
                cx={p.x}
                cy={p.y}
                r={8}
                fill="currentColor"
                className="text-primary opacity-0 hover:opacity-10 transition-opacity cursor-pointer"
              />
            </g>
          ))}

          {/* X Axis Labels */}
          {dataPoints.map((dp, i) => {
            const x = (i / 6) * (width - 40) + 20
            return (
              <text
                key={i}
                x={x}
                y={height - 6}
                textAnchor="middle"
                className="text-[9px] font-bold fill-muted-foreground/80 select-none uppercase tracking-wider"
              >
                {dp.label}
              </text>
            )
          })}
        </svg>
      </div>
    </div>
  )
}
