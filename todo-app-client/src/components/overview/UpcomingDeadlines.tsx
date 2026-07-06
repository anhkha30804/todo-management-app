import { CalendarClock } from 'lucide-react'
import { Todo, TodoStatus } from '@/types/todo.types'
import { TaskListItem } from './TaskListItem'

interface UpcomingDeadlinesProps {
   todos: Todo[]
}

export function UpcomingDeadlines({ todos }: UpcomingDeadlinesProps) {
   const now = new Date()
   const upcoming = todos
      .filter((t) => t.end_date && t.status !== TodoStatus.COMPLETED && new Date(t.end_date) >= now)
      .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime())
      .slice(0, 15)

   const overdue = todos
      .filter((t) => t.isOverdue)
      .sort((a, b) => new Date(a.end_date!).getTime() - new Date(b.end_date!).getTime())
      .slice(0, 15)

   const list = [...overdue, ...upcoming].slice(0, 15)

   return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5 flex flex-col h-full">
         <div className="flex items-center gap-2 mb-1 shrink-0">
            <CalendarClock size={15} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Deadlines</h2>
         </div>
         <p className="text-xs text-muted-foreground mb-4 shrink-0">Overdue + upcoming due dates</p>

         {list.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center flex-1 flex items-center justify-center">No upcoming deadlines</p>
         ) : (
            <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
               {list.map((todo) => (
                  <TaskListItem key={todo._id} todo={todo} dateField="end_date" />
               ))}
            </div>
         )}
      </div>
   )
}
