import { Todo } from '@/types/todo.types'

interface OverviewHeroProps {
   todos: Todo[]
}

export function OverviewHero({ todos }: OverviewHeroProps) {
   const total = todos.length
   const pending = todos.filter((t) => t.status === 'pending').length
   const inProgress = todos.filter((t) => t.status === 'in_progress').length
   const completed = todos.filter((t) => t.status === 'completed').length
   const overdue = todos.filter((t) => t.isOverdue).length
   const pct = total === 0 ? 0 : Math.round((completed / total) * 100)

   return (
      <div className="bg-card rounded-2xl border border-border/50 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[190px]">
         {/* Left Panel: Greeting & Progress */}
         <div className="p-6 md:col-span-7 bg-linear-to-br from-teal-600 to-emerald-600 text-white flex flex-col justify-between">
            <div>
               <h2 className="text-lg font-bold tracking-tight">Overview Dashboard</h2>
               <p className="text-xs text-emerald-100/90 mt-1">
                  Organize your day, achieve your goals. You have {pending + inProgress} active
                  tasks today.
               </p>
            </div>

            <div className="mt-5">
               <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                  <span className="text-emerald-100">Overall Progress</span>
                  <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] font-bold tabular-nums">
                     {pct}% Completed
                  </span>
               </div>
               <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div
                     className="h-full bg-white rounded-full transition-all duration-500"
                     style={{ width: `${pct}%` }}
                  />
               </div>
               <p className="text-[10px] text-emerald-200 mt-1.5">
                  {completed} of {total} total tasks completed
               </p>
            </div>
         </div>

         {/* Right Panel: Metrics Grid */}
         <div className="p-6 md:col-span-5 grid grid-cols-2 gap-3 bg-card/50">
            <div className="flex flex-col justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40 transition-colors hover:bg-muted/50">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Pending
               </span>
               <span className="text-2xl font-bold mt-1 text-amber-600 dark:text-amber-400 tabular-nums">
                  {pending}
               </span>
            </div>
            <div className="flex flex-col justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40 transition-colors hover:bg-muted/50">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  In Progress
               </span>
               <span className="text-2xl font-bold mt-1 text-blue-600 dark:text-blue-400 tabular-nums">
                  {inProgress}
               </span>
            </div>
            <div className="flex flex-col justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40 transition-colors hover:bg-muted/50">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Completed
               </span>
               <span className="text-2xl font-bold mt-1 text-emerald-600 dark:text-emerald-400 tabular-nums">
                  {completed}
               </span>
            </div>
            <div className="flex flex-col justify-between p-3.5 rounded-xl bg-muted/30 border border-border/40 transition-colors hover:bg-muted/50">
               <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  Overdue
               </span>
               <span className="text-2xl font-bold mt-1 text-rose-600 dark:text-rose-400 tabular-nums">
                  {overdue}
               </span>
            </div>
         </div>
      </div>
   )
}
