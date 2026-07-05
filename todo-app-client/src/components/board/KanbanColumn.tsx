'use client'

import { Plus } from 'lucide-react'
import { Todo, TodoStatus } from '@/types/todo.types'
import { STATUS_CONFIG } from '@/constants/todo.constants'
import { TodoCard } from './TodoCard'
import { useDroppable } from '@dnd-kit/core'
import { cn } from '@/lib/utils'

const DOT_VAR: Record<TodoStatus, string> = {
  [TodoStatus.PENDING]: 'var(--status-pending-dot)',
  [TodoStatus.IN_PROGRESS]: 'var(--status-in-progress-dot)',
  [TodoStatus.COMPLETED]: 'var(--status-completed-dot)'
}

interface KanbanColumnProps {
  status: TodoStatus
  todos: Todo[]
  onEdit: (todo: Todo) => void
  onAdd: () => void
}

export function KanbanColumn({ status, todos, onEdit, onAdd }: KanbanColumnProps) {
  const config = STATUS_CONFIG[status]
  const dotColor = DOT_VAR[status]

  const { setNodeRef, isOver } = useDroppable({
    id: status
  })

  return (
    <div className="flex flex-col flex-1 min-w-[260px] h-full">
      {/* Column header */}
      <div className="flex items-center justify-between px-1 pb-3 shrink-0">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dotColor }} />
          <span className="text-sm font-semibold text-foreground">{config.label}</span>
          <span className="text-xs font-semibold text-muted-foreground bg-border/60 px-1.5 py-0.5 rounded-full">
            {todos.length}
          </span>
        </div>
        <button
          onClick={onAdd}
          className="p-1 rounded-md hover:bg-border/60 text-muted-foreground hover:text-foreground transition-colors"
          title={`Add to ${config.label}`}
        >
          <Plus size={15} />
        </button>
      </div>

      {/* Cards + add button container */}
      <div className="flex-1 bg-card rounded-xl border border-border/60 flex flex-col overflow-hidden shadow-sm">
        {/* Cards list */}
        <div
          ref={setNodeRef}
          className={cn(
            'flex-1 overflow-y-auto p-2.5 flex flex-col gap-2 min-h-0 transition-colors duration-150 rounded-t-xl',
            isOver && 'bg-primary/5 border-b border-primary/10'
          )}
        >
          {todos.length === 0 ? (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-xs text-muted-foreground">No tasks</p>
            </div>
          ) : (
            todos.map((todo) => <TodoCard key={todo._id} todo={todo} onEdit={onEdit} />)
          )}
        </div>

        {/* Add task */}
        <div className="px-2.5 pb-2.5 shrink-0">
          <button
            onClick={onAdd}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <Plus size={12} />
            Add task
          </button>
        </div>
      </div>
    </div>
  )
}
