import { Skeleton } from '@/components/ui/skeleton'

export function CalendarSkeleton() {
   return (
      <div className="h-full flex flex-col animate-pulse" style={{ minWidth: '780px' }}>
         <div className="grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] bg-card border-b border-border py-4">
            <div />
            {Array.from({ length: 7 }).map((_, i) => (
               <div key={i} className="flex flex-col items-center gap-1.5">
                  <Skeleton className="h-3.5 w-10" />
                  <Skeleton className="h-5 w-6 rounded-md" />
               </div>
            ))}
         </div>
         <div className="flex-1 grid grid-cols-[60px_1fr_1fr_1fr_1fr_1fr_1fr_1fr] border-b border-border">
            <div className="bg-muted/10 border-r border-border" />
            {Array.from({ length: 7 }).map((_, i) => (
               <div
                  key={i}
                  className="border-r border-border last:border-r-0 p-2 flex flex-col gap-2"
               >
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <Skeleton className="h-14 w-full rounded-lg" />
               </div>
            ))}
         </div>
      </div>
   )
}
