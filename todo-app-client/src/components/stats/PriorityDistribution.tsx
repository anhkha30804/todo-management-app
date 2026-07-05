import { Todo, TodoPriority } from '@/types/todo.types'
import { PRIORITY_CONFIG } from '@/constants/todo.constants'
import { HorizontalBar } from './HorizontalBar'

interface PriorityDistributionProps {
   todos: Todo[]
}

const PRIORITY_BAR_VARS: Record<TodoPriority, string> = {
   [TodoPriority.HIGH]: 'var(--priority-high-text)',
   [TodoPriority.MEDIUM]: 'var(--priority-medium-text)',
   [TodoPriority.LOW]: 'var(--priority-low-text)'
}

export function PriorityDistribution({ todos }: PriorityDistributionProps) {
   const counts = {
      [TodoPriority.HIGH]: todos.filter((t) => t.priority === TodoPriority.HIGH).length,
      [TodoPriority.MEDIUM]: todos.filter((t) => t.priority === TodoPriority.MEDIUM).length,
      [TodoPriority.LOW]: todos.filter((t) => t.priority === TodoPriority.LOW).length
   }
   const total = todos.length

   return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5">
         <h2 className="text-sm font-semibold text-foreground mb-0.5">Priority Breakdown</h2>
         <p className="text-xs text-muted-foreground mb-5">Tasks grouped by priority level</p>

         <div className="flex flex-col gap-4">
            {[TodoPriority.HIGH, TodoPriority.MEDIUM, TodoPriority.LOW].map((priority) => (
               <HorizontalBar
                  key={priority}
                  label={PRIORITY_CONFIG[priority].label}
                  value={counts[priority]}
                  total={total}
                  barColor={PRIORITY_BAR_VARS[priority]}
                  badgeClass={PRIORITY_CONFIG[priority].badgeClass}
               />
            ))}
         </div>
      </div>
   )
}
