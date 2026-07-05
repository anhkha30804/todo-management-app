import { Todo } from '@/types/todo.types'

interface CompletionProgressProps {
  todos: Todo[]
}

export function CompletionProgress({ todos }: CompletionProgressProps) {
  const total = todos.length
  const completed = todos.filter((t) => t.status === 'completed').length
  const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Overall Progress</h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {completed} of {total} tasks completed
          </p>
        </div>
        <span className="text-2xl font-bold text-foreground">{pct}%</span>
      </div>
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
