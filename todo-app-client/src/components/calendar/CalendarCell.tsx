import { Todo } from '@/types/todo.types'
import { CalendarCard } from './CalendarCard'

interface CalendarCellProps {
   todos: Todo[]
   onEdit?: (todo: Todo) => void
}

export function CalendarCell({ todos, onEdit }: CalendarCellProps) {
   return (
      <div className="border-r border-border last:border-r-0 p-2 flex flex-col gap-1.5 overflow-y-auto bg-card">
         {todos.map((todo) => (
            <CalendarCard key={todo._id} todo={todo} onEdit={onEdit} />
         ))}
      </div>
   )
}
