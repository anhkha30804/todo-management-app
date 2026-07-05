import { BarChart3 } from 'lucide-react'
import { Todo } from '@/types/todo.types'

interface PriorityBreakdownProps {
   todos: Todo[]
}

export function PriorityBreakdown({ todos }: PriorityBreakdownProps) {
   const activeTodos = todos.filter((t) => t.status !== 'completed')
   const total = activeTodos.length

   const high = activeTodos.filter((t) => t.priority === 'high').length
   const medium = activeTodos.filter((t) => t.priority === 'medium').length
   const low = activeTodos.filter((t) => t.priority === 'low').length

   const getPct = (val: number) => (total === 0 ? 0 : Math.round((val / total) * 100))

   return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5 flex flex-col">
         <div className="flex items-center gap-2 mb-1">
            <BarChart3 size={15} className="text-muted-foreground" />
            <h2 className="text-sm font-semibold text-foreground">Active Priorities</h2>
         </div>
         <p className="text-xs text-muted-foreground mb-4">Remaining tasks breakdown</p>

         <div className="flex flex-col gap-4">
            {/* High */}
            <div>
               <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-rose-600 dark:text-rose-400">High Priority</span>
                  <span className="text-muted-foreground tabular-nums">
                     {high} tasks ({getPct(high)}%)
                  </span>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                     className="h-full bg-rose-500 rounded-full transition-all duration-500"
                     style={{ width: `${getPct(high)}%` }}
                  />
               </div>
            </div>

            {/* Medium */}
            <div>
               <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-amber-600 dark:text-amber-400">Medium Priority</span>
                  <span className="text-muted-foreground tabular-nums">
                     {medium} tasks ({getPct(medium)}%)
                  </span>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                     className="h-full bg-amber-500 rounded-full transition-all duration-500"
                     style={{ width: `${getPct(medium)}%` }}
                  />
               </div>
            </div>

            {/* Low */}
            <div>
               <div className="flex items-center justify-between text-xs font-semibold mb-1">
                  <span className="text-emerald-600 dark:text-emerald-400">Low Priority</span>
                  <span className="text-muted-foreground tabular-nums">
                     {low} tasks ({getPct(low)}%)
                  </span>
               </div>
               <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                     className="h-full bg-emerald-500 rounded-full transition-all duration-500"
                     style={{ width: `${getPct(low)}%` }}
                  />
               </div>
            </div>
         </div>
      </div>
   )
}
