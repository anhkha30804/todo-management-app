'use client'

import { format } from 'date-fns'
import { CalendarDays, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Todo, TodoStatus } from '@/types/todo.types'
import { PRIORITY_CONFIG, STATUS_CONFIG } from '@/constants/todo.constants'
import { useUpdateTodo, useDeleteTodo } from '@/hooks/useTodos'
import { toast } from 'sonner'

interface TodoCardProps {
  todo: Todo
  onEdit: (todo: Todo) => void
}

const NEXT_STATUS: Record<TodoStatus, TodoStatus> = {
  [TodoStatus.PENDING]: TodoStatus.IN_PROGRESS,
  [TodoStatus.IN_PROGRESS]: TodoStatus.COMPLETED,
  [TodoStatus.COMPLETED]: TodoStatus.PENDING
}

function fmtDate(iso: string) {
  return format(new Date(iso), 'MMM d')
}

export function TodoCard({ todo, onEdit }: TodoCardProps) {
  const { mutate: updateTodo } = useUpdateTodo()
  const { mutate: deleteTodo } = useDeleteTodo()

  const handleStatusCycle = (e: React.MouseEvent) => {
    e.stopPropagation()
    updateTodo(
      { id: todo._id, payload: { status: NEXT_STATUS[todo.status] } },
      { onError: () => toast.error('Failed to update status') }
    )
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    deleteTodo(todo._id, {
      onSuccess: () => toast.success('Task deleted'),
      onError: () => toast.error('Failed to delete task')
    })
  }

  const dateLabel = [
    todo.start_date && fmtDate(todo.start_date),
    todo.end_date && fmtDate(todo.end_date)
  ]
    .filter(Boolean)
    .join(' – ')

  return (
    <div
      className={cn(
        'group relative bg-card rounded-xl p-3.5 cursor-pointer select-none',
        'shadow-sm hover:shadow-md transition-shadow duration-150',
        'border border-border/60',
        todo.isOverdue && 'border-[var(--overdue-border)]'
      )}
      onClick={() => onEdit(todo)}
    >
      {/* Hover actions */}
      <div className="absolute top-2.5 right-2.5 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onEdit(todo)
          }}
          className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground"
          title="Edit"
        >
          <Pencil size={12} />
        </button>
        <button
          onClick={handleDelete}
          className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
          title="Delete"
        >
          <Trash2 size={12} />
        </button>
      </div>

      {/* Badges row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-2">
        <span
          className={cn(
            'text-[10px] font-semibold px-1.5 py-0.5 rounded',
            PRIORITY_CONFIG[todo.priority].badgeClass
          )}
        >
          {PRIORITY_CONFIG[todo.priority].label}
        </span>
        {todo.isOverdue && (
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[var(--overdue-bg)] text-[var(--overdue-text)]">
            Overdue
          </span>
        )}
      </div>

      {/* Title */}
      <p
        className={cn(
          'text-[13px] font-medium leading-snug text-foreground line-clamp-2 pr-10',
          todo.status === TodoStatus.COMPLETED && 'line-through text-muted-foreground'
        )}
      >
        {todo.title}
      </p>

      {/* Description */}
      {todo.description && (
        <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2 leading-relaxed">
          {todo.description}
        </p>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        <button
          onClick={handleStatusCycle}
          className="flex items-center gap-1.5 group/s"
          title="Click to cycle status"
        >
          <span
            className={cn(
              'w-2 h-2 rounded-full transition-transform group-hover/s:scale-125',
              STATUS_CONFIG[todo.status].dotClass
            )}
          />
          <span className="text-[11px] text-muted-foreground group-hover/s:text-foreground transition-colors">
            {STATUS_CONFIG[todo.status].label}
          </span>
        </button>

        {dateLabel && (
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <CalendarDays size={11} />
            <span>{dateLabel}</span>
          </div>
        )}
      </div>
    </div>
  )
}
