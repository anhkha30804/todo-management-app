import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/constants/todo.constants'
import { cn } from '@/lib/utils'
import { Todo } from '@/types/todo.types'
import { format } from 'date-fns'

interface TaskListItemProps {
  todo: Todo
  dateField?: 'createdAt' | 'end_date'
}

export function TaskListItem({ todo, dateField = 'createdAt' }: TaskListItemProps) {
  const statusCfg = STATUS_CONFIG[todo.status]
  const priorityCfg = PRIORITY_CONFIG[todo.priority]
  const dateValue = dateField === 'end_date' ? todo.end_date : todo.createdAt

  return (
    <div className="flex items-start gap-3 py-3 border-b border-border/50 last:border-0">
      <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', statusCfg.dotClass)} />
      <div className="flex-1 min-w-0">
        <p
          className={cn(
            'text-sm font-medium text-foreground truncate',
            todo.status === 'completed' && 'line-through text-muted-foreground'
          )}
        >
          {todo.title}
        </p>
        <div className="flex items-center gap-2 mt-0.5">
          <span
            className={cn(
              'text-[10px] font-semibold px-1.5 py-0.5 rounded',
              priorityCfg.badgeClass
            )}
          >
            {priorityCfg.label}
          </span>
          {todo.isOverdue && (
            <span className="text-[10px] font-semibold text-(--overdue-text)">Overdue</span>
          )}
        </div>
      </div>
      {dateValue && (
        <span className="text-[11px] text-muted-foreground shrink-0 tabular-nums">
          {format(new Date(dateValue), 'MMM d')}
        </span>
      )}
    </div>
  )
}
