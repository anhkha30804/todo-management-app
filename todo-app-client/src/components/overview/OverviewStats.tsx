import { CheckCircle2, Circle, Clock, AlertCircle, LayoutList } from 'lucide-react'
import { StatCard } from './StatCard'
import { Todo } from '@/types/todo.types'

interface OverviewStatsProps {
   todos: Todo[]
}

export function OverviewStats({ todos }: OverviewStatsProps) {
   const total = todos.length
   const pending = todos.filter((t) => t.status === 'pending').length
   const inProgress = todos.filter((t) => t.status === 'in_progress').length
   const completed = todos.filter((t) => t.status === 'completed').length
   const overdue = todos.filter((t) => t.isOverdue).length

   return (
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
         <StatCard
            label="Total Tasks"
            value={total}
            icon={LayoutList}
            colorClass="text-slate-600"
            bgClass="bg-slate-100"
         />
         <StatCard
            label="Pending"
            value={pending}
            icon={Circle}
            colorClass="text-amber-600"
            bgClass="bg-amber-50"
         />
         <StatCard
            label="In Progress"
            value={inProgress}
            icon={Clock}
            colorClass="text-blue-600"
            bgClass="bg-blue-50"
         />
         <StatCard
            label="Completed"
            value={completed}
            icon={CheckCircle2}
            colorClass="text-emerald-600"
            bgClass="bg-emerald-50"
         />
         <StatCard
            label="Overdue"
            value={overdue}
            icon={AlertCircle}
            colorClass="text-rose-600"
            bgClass="bg-rose-50"
         />
      </div>
   )
}
