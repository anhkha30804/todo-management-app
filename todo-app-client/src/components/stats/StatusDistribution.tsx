import { Todo, TodoStatus } from '@/types/todo.types'
import { DonutChart } from './DonutChart'

interface StatusDistributionProps {
  todos: Todo[]
}

const STATUS_COLORS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'var(--status-pending-dot)',
  [TodoStatus.IN_PROGRESS]: 'var(--status-in-progress-dot)',
  [TodoStatus.COMPLETED]: 'var(--status-completed-dot)'
}

const STATUS_LABELS: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'Pending',
  [TodoStatus.IN_PROGRESS]: 'In Progress',
  [TodoStatus.COMPLETED]: 'Completed'
}

export function StatusDistribution({ todos }: StatusDistributionProps) {
  const counts = {
    [TodoStatus.PENDING]: todos.filter((t) => t.status === TodoStatus.PENDING).length,
    [TodoStatus.IN_PROGRESS]: todos.filter((t) => t.status === TodoStatus.IN_PROGRESS).length,
    [TodoStatus.COMPLETED]: todos.filter((t) => t.status === TodoStatus.COMPLETED).length
  }
  const total = todos.length
  const pct = total === 0 ? 0 : Math.round((counts[TodoStatus.COMPLETED] / total) * 100)

  const segments = Object.entries(counts).map(([status, value]) => ({
    value,
    color: STATUS_COLORS[status as TodoStatus],
    label: STATUS_LABELS[status as TodoStatus]
  }))

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5">
      <h2 className="text-sm font-semibold text-foreground mb-0.5">Status Distribution</h2>
      <p className="text-xs text-muted-foreground mb-5">Breakdown of tasks by status</p>

      <div className="flex items-center gap-6">
        <DonutChart
          segments={segments}
          total={total}
          centerValue={`${pct}%`}
          centerLabel="done"
          size={148}
          thickness={18}
        />

        <div className="flex flex-col gap-3 flex-1">
          {Object.entries(counts).map(([status, count]) => (
            <div key={status} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: STATUS_COLORS[status as TodoStatus] }}
                />
                <span className="text-sm text-foreground">
                  {STATUS_LABELS[status as TodoStatus]}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-foreground tabular-nums">{count}</span>
                <span className="text-xs text-muted-foreground w-8 text-right tabular-nums">
                  {total === 0 ? '0%' : `${Math.round((count / total) * 100)}%`}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
