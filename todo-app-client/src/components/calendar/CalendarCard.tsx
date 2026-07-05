import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/constants/todo.constants'
import { cn } from '@/lib/utils'
import { Todo } from '@/types/todo.types'
import { format } from 'date-fns'

export function CalendarCard({ todo, onEdit }: { todo: Todo; onEdit?: (todo: Todo) => void }) {
  const priorityCfg = PRIORITY_CONFIG[todo.priority]
  const statusCfg = STATUS_CONFIG[todo.status]

  return (
    <div
      onClick={() => onEdit?.(todo)}
      className={cn(
        'rounded-lg px-2.5 py-2 text-xs border select-none cursor-pointer transition-all duration-150',
        'hover:shadow-sm hover:border-border/80',
        todo.isOverdue
          ? 'bg-(--overdue-bg)/30 border-(--overdue-border)/60 hover:bg-(--overdue-bg)/40'
          : 'bg-muted/30 border-border/40 hover:bg-muted/50'
      )}
    >
      <div className="flex flex-wrap items-center justify-between gap-x-1.5 gap-y-0.5 mb-1.5">
        <span
          className={cn(
            'text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0',
            priorityCfg.badgeClass
          )}
        >
          {priorityCfg.label}
        </span>
        <span className="text-[10px] text-muted-foreground font-medium tabular-nums shrink-0">
          {format(new Date(todo.start_date!), 'HH:mm')}
        </span>
      </div>

      <p className="font-semibold text-foreground leading-snug line-clamp-2">{todo.title}</p>

      <div className="flex flex-wrap items-center justify-between gap-x-1.5 gap-y-0.5 mt-1.5">
        <div className="flex items-center gap-1 shrink-0">
          <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', statusCfg.dotClass)} />
          <span className="text-muted-foreground text-[10px]">{statusCfg.label}</span>
        </div>
        {todo.isOverdue && (
          <span className="text-[9px] font-semibold text-(--overdue-text)">Overdue</span>
        )}
      </div>
    </div>
  )
}
