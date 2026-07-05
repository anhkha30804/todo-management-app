import { format } from 'date-fns'
import { cn } from '@/lib/utils'
import { Todo } from '@/types/todo.types'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/constants/todo.constants'

export function CalendarCard({ todo }: { todo: Todo }) {
  const priorityCfg = PRIORITY_CONFIG[todo.priority]
  const statusCfg = STATUS_CONFIG[todo.status]

  return (
    <div
      className={cn(
        'rounded-lg px-2.5 py-2 text-xs border',
        todo.isOverdue
          ? 'bg-[var(--overdue-bg)]/40 border-[var(--overdue-border)]'
          : 'bg-muted/50 border-border/40'
      )}
    >
      <div className="flex items-center justify-between gap-1 mb-1">
        <span className={cn('text-[9px] font-bold px-1.5 py-0.5 rounded', priorityCfg.badgeClass)}>
          {priorityCfg.label}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium tabular-nums">
          {format(new Date(todo.start_date!), 'HH:mm')}
        </span>
      </div>

      <p className="font-semibold text-foreground leading-snug line-clamp-2">{todo.title}</p>

      <div className="flex items-center gap-1.5 mt-1.5">
        <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusCfg.dotClass)} />
        <span className="text-muted-foreground text-[10px]">{statusCfg.label}</span>
        {todo.isOverdue && (
          <span className="text-[9px] font-semibold text-[var(--overdue-text)] ml-auto">
            Overdue
          </span>
        )}
      </div>
    </div>
  )
}
