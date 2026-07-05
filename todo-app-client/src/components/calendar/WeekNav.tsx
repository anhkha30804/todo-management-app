import { addWeeks, endOfWeek, format, isSameDay, startOfWeek, subWeeks } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface WeekNavProps {
   anchor: Date
   setAnchor: (d: Date) => void
}

export function WeekNav({ anchor, setAnchor }: WeekNavProps) {
   const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
   const isCurrentWeek = isSameDay(anchor, currentWeekStart)
   const weekLabel = `${format(anchor, 'MMM d')} – ${format(endOfWeek(anchor, { weekStartsOn: 1 }), 'MMM d, yyyy')}`

   return (
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border bg-card shrink-0">
         <button
            onClick={() => setAnchor(subWeeks(anchor, 1))}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
         >
            <ChevronLeft size={16} />
         </button>
         <button
            onClick={() => setAnchor(addWeeks(anchor, 1))}
            className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
         >
            <ChevronRight size={16} />
         </button>
         <span className="text-sm font-semibold text-foreground">{weekLabel}</span>
         {isCurrentWeek && (
            <span className="text-[10px] font-bold px-2 py-0.5 ml-1.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 select-none uppercase tracking-wider leading-none">
               This Week
            </span>
         )}
      </div>
   )
}
