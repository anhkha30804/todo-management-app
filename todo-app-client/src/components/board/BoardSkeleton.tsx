import { Skeleton } from '@/components/ui/skeleton'

export function BoardSkeleton() {
   return (
      <div className="flex gap-5 h-full">
         {[3, 2, 1].map((count, i) => (
            <div
               key={i}
               className="w-[320px] shrink-0 bg-card rounded-xl border border-border/60 p-3 flex flex-col gap-2 shadow-sm"
            >
               <Skeleton className="h-6 w-32 mb-1" />
               {Array.from({ length: count }).map((_, j) => (
                  <Skeleton key={j} className="h-24 w-full rounded-lg" />
               ))}
            </div>
         ))}
      </div>
   )
}
