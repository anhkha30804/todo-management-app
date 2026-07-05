import { cn } from '@/lib/utils'
import { Todo, TodoStatus } from '@/types/todo.types'
import { AlertCircle, CheckCircle2, Flame, Zap } from 'lucide-react'

interface StatsTopRowProps {
  todos: Todo[]
}

interface MetricProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
}

function MetricCard({ label, value, sub, icon: Icon, iconBg, iconColor }: MetricProps) {
  return (
    <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5 flex items-center gap-4">
      <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', iconBg)}>
        <Icon size={20} className={iconColor} />
      </div>
      <div>
        <p className="text-[11px] text-muted-foreground font-medium mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
        {sub && <p className="text-[11px] text-muted-foreground mt-1">{sub}</p>}
      </div>
    </div>
  )
}

export function StatsTopRow({ todos }: StatsTopRowProps) {
  const total = todos.length
  const completed = todos.filter((t) => t.status === TodoStatus.COMPLETED)
  const active = todos.filter((t) => t.status !== TodoStatus.COMPLETED)

  // 1. Completion Rate
  const completionRate = total === 0 ? 0 : Math.round((completed.length / total) * 100)

  // 2. On-Time Completion Rate
  const completedWithDeadlines = completed.filter((t) => t.end_date)
  const onTimeCount = completedWithDeadlines.filter((t) => {
    return new Date(t.updatedAt) <= new Date(t.end_date!)
  }).length
  const onTimeRate =
    completedWithDeadlines.length === 0
      ? 100
      : Math.round((onTimeCount / completedWithDeadlines.length) * 100)

  // 3. Overdue Rate of active tasks
  const overdueCount = active.filter((t) => t.isOverdue).length
  const overdueRate = active.length === 0 ? 0 : Math.round((overdueCount / active.length) * 100)

  // 4. Avg Completion Velocity
  const completionTimes = completed.map((t) => {
    return new Date(t.updatedAt).getTime() - new Date(t.createdAt).getTime()
  })
  const avgMs =
    completionTimes.length === 0
      ? 0
      : completionTimes.reduce((a, b) => a + b, 0) / completionTimes.length
  const avgHrs = avgMs / (1000 * 60 * 60)
  const velocityLabel =
    avgHrs === 0 ? '-' : avgHrs < 24 ? `${avgHrs.toFixed(1)}h` : `${(avgHrs / 24).toFixed(1)}d`

  // 5. Productivity Grade
  const score = Math.round(completionRate * 0.3 + onTimeRate * 0.4 + (100 - overdueRate) * 0.3)
  const getGrade = (s: number) => {
    if (s >= 95) return 'A+'
    if (s >= 85) return 'A'
    if (s >= 70) return 'B'
    if (s >= 55) return 'C'
    if (s >= 40) return 'D'
    return 'F'
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <MetricCard
        label="Efficiency Grade"
        value={total === 0 ? '-' : getGrade(score)}
        sub={total === 0 ? 'No tasks tracked' : `Productivity Score: ${score}`}
        icon={Zap}
        iconBg="bg-amber-50"
        iconColor="text-amber-500"
      />
      <MetricCard
        label="On-Time Rate"
        value={completedWithDeadlines.length === 0 ? '-' : `${onTimeRate}%`}
        sub={
          completedWithDeadlines.length === 0
            ? 'No deadline tasks'
            : `${onTimeCount} of ${completedWithDeadlines.length} on time`
        }
        icon={CheckCircle2}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <MetricCard
        label="Avg. Completion Time"
        value={velocityLabel}
        sub={avgHrs === 0 ? 'No tasks completed' : 'From start to done'}
        icon={Flame}
        iconBg="bg-blue-50"
        iconColor="text-blue-500"
      />
      <MetricCard
        label="Overdue Rate"
        value={`${overdueRate}%`}
        sub={`${overdueCount} of ${active.length} active overdue`}
        icon={AlertCircle}
        iconBg={overdueCount > 0 ? 'bg-rose-50' : 'bg-slate-50'}
        iconColor={overdueCount > 0 ? 'text-rose-500' : 'text-slate-400'}
      />
    </div>
  )
}
