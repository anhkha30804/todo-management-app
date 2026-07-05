import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface StatCardProps {
   label: string
   value: number
   icon: LucideIcon
   colorClass: string
   bgClass: string
}

export function StatCard({ label, value, icon: Icon, colorClass, bgClass }: StatCardProps) {
   return (
      <div className="bg-card rounded-xl border border-border/60 shadow-sm p-5 flex items-center gap-4">
         <div
            className={cn(
               'w-10 h-10 rounded-lg flex items-center justify-center shrink-0',
               bgClass
            )}
         >
            <Icon size={18} className={colorClass} />
         </div>
         <div className="min-w-0">
            <p className="text-2xl font-bold text-foreground leading-none">{value}</p>
            <p className="text-xs text-muted-foreground mt-1 font-medium">{label}</p>
         </div>
      </div>
   )
}
