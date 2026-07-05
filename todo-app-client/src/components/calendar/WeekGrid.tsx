import { format, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { Todo } from '@/types/todo.types'
import { CalendarCell } from './CalendarCell'

interface WeekGridProps {
  weekDays: Date[]
  getSlot: (day: Date, isAM: boolean) => Todo[]
}

export function WeekGrid({ weekDays, getSlot }: WeekGridProps) {
  return (
    <div className="h-full min-h-[400px] flex flex-col" style={{ minWidth: '680px' }}>
      {/* Day header row */}
      <div className="grid grid-cols-7 bg-card border-b border-border shrink-0">
        {weekDays.map((day) => (
          <div
            key={day.toISOString()}
            className="py-3 text-center border-r border-border last:border-r-0"
          >
            <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wide">
              {format(day, 'EEE')}
            </p>
            <p
              className={cn(
                'text-base font-bold mt-0.5',
                isToday(day) ? 'text-primary' : 'text-foreground'
              )}
            >
              {format(day, 'd')}
            </p>
          </div>
        ))}
      </div>

      {/* AM row */}
      <div className="flex-1 grid grid-cols-7 border-b-2 border-border">
        {weekDays.map((day) => (
          <CalendarCell key={`am-${day.toISOString()}`} todos={getSlot(day, true)} />
        ))}
      </div>

      {/* PM row */}
      <div className="flex-1 grid grid-cols-7">
        {weekDays.map((day) => (
          <CalendarCell key={`pm-${day.toISOString()}`} todos={getSlot(day, false)} />
        ))}
      </div>
    </div>
  )
}
