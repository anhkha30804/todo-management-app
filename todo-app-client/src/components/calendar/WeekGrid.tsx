import { format, isToday } from 'date-fns'
import { cn } from '@/lib/utils'
import { Todo } from '@/types/todo.types'
import { CalendarCell } from './CalendarCell'

interface WeekGridProps {
   weekDays: Date[]
   getSlot: (day: Date, isAM: boolean) => Todo[]
   onEdit?: (todo: Todo) => void
}

export function WeekGrid({ weekDays, getSlot, onEdit }: WeekGridProps) {
   return (
      <div className="h-full flex flex-col" style={{ minWidth: '780px' }}>
         {/* Day header row */}
         <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-card border-b border-border shrink-0">
            <div className="border-r border-border" />
            {weekDays.map((day) => (
               <div
                  key={day.toISOString()}
                  className="py-3 text-center border-r border-border last:border-r-0"
               >
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
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
         <div className="flex-1 min-h-[180px] grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border">
            <div className="border-r border-border bg-muted/20 flex items-center justify-center text-[10px] font-bold text-muted-foreground select-none shrink-0">
               <span>AM</span>
            </div>
            {weekDays.map((day) => (
               <CalendarCell
                  key={`am-${day.toISOString()}`}
                  todos={getSlot(day, true)}
                  onEdit={onEdit}
               />
            ))}
         </div>

         {/* PM row */}
         <div className="flex-1 min-h-[180px] grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr]">
            <div className="border-r border-border bg-muted/20 flex items-center justify-center text-[10px] font-bold text-muted-foreground select-none shrink-0">
               <span>PM</span>
            </div>
            {weekDays.map((day) => (
               <CalendarCell
                  key={`pm-${day.toISOString()}`}
                  todos={getSlot(day, false)}
                  onEdit={onEdit}
               />
            ))}
         </div>
      </div>
   )
}
