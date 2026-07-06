import { Skeleton } from '@/components/ui/skeleton'

export function OverviewSkeleton() {
   return (
      <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6 animate-pulse">
         {/* Hero Skeleton */}
         <Skeleton className="h-[190px] rounded-2xl" />

         {/* Grid Content Skeleton */}
         <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-8">
               <Skeleton className="h-[360px] rounded-xl" />
            </div>

            {/* Right Column */}
            <div className="lg:col-span-4 flex flex-col gap-6">
               <Skeleton className="h-[210px] rounded-xl" />
               <Skeleton className="h-[360px] rounded-xl" />
            </div>
         </div>
      </div>
   )
}
