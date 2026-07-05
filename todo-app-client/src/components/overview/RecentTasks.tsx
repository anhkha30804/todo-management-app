import { ClockArrowUp } from 'lucide-react'
import { Todo } from '@/types/todo.types'
import { TaskListItem } from './TaskListItem'

interface RecentTasksProps {
  todos: Todo[]
}

export function RecentTasks({ todos }: RecentTasksProps) {
  const recent = [...todos]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6)

  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5 flex flex-col flex-1">
      <div className="flex items-center gap-2 mb-1">
        <ClockArrowUp size={15} className="text-muted-foreground" />
        <h2 className="text-sm font-semibold text-foreground">Recent Tasks</h2>
      </div>
      <p className="text-xs text-muted-foreground mb-4">Last created tasks</p>

      {recent.length === 0 ? (
        <p className="text-sm text-muted-foreground py-6 text-center">No tasks yet</p>
      ) : (
        <div>
          {recent.map((todo) => (
            <TaskListItem key={todo._id} todo={todo} dateField="createdAt" />
          ))}
        </div>
      )}
    </div>
  )
}
