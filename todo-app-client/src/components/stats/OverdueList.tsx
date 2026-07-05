import { AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Todo } from '@/types/todo.types'
import { PRIORITY_CONFIG } from '@/constants/todo.constants'

interface OverdueListProps {
  todos: Todo[]
}

export function OverdueList({ todos }: OverdueListProps) {
  const overdue = todos
    .filter((t) => t.isOverdue)
    .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime())

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-0.5">
        <AlertCircle
          size={14}
          className={overdue.length > 0 ? 'text-rose-500' : 'text-muted-foreground'}
        />
        <h2 className="text-sm font-semibold text-foreground">Overdue Tasks</h2>
        {overdue.length > 0 && (
          <span className="ml-auto text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded-full">
            {overdue.length}
          </span>
        )}
      </div>
      <p className="text-xs text-muted-foreground mb-4">Tasks past their due date</p>

      {overdue.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2">
          <span className="text-2xl">🎉</span>
          <p className="text-sm text-muted-foreground font-medium">No overdue tasks!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-0">
          {overdue.map((todo) => {
            const daysLate = Math.ceil(
              (Date.now() - new Date(todo.end_date!).getTime()) / (1000 * 60 * 60 * 24)
            )
            return (
              <div
                key={todo._id}
                className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{todo.title}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className={cn(
                        'text-[10px] font-semibold px-1.5 py-0.5 rounded',
                        PRIORITY_CONFIG[todo.priority].badgeClass
                      )}
                    >
                      {PRIORITY_CONFIG[todo.priority].label}
                    </span>
                    <span className="text-[10px] text-rose-500 font-semibold">
                      {daysLate}d overdue
                    </span>
                  </div>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
                  {format(new Date(todo.end_date!), 'MMM d')}
                </span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
