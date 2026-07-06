import { Skeleton } from '@/components/ui/skeleton'

export function BoardSkeleton() {
   return (
      <div className="flex gap-5 h-full">
         {/* Pending Column (width flex-1, min-w-[260px]) */}
         <div className="flex flex-col h-full flex-1 min-w-[260px]">
            {/* Header */}
            <div className="flex items-center justify-between px-1.5 pb-3 shrink-0">
               <div className="flex items-center gap-1.5">
                  <Skeleton className="h-5 w-20 rounded" />
                  <Skeleton className="h-4 w-6 rounded-full" />
               </div>
               <Skeleton className="h-6 w-6 rounded-lg" />
            </div>
            {/* Card list container */}
            <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200/80 border-t-4 border-t-violet-300/40 p-3 flex flex-col gap-2.5">
               {/* 3 stacked card skeletons */}
               {[1, 2, 3].map((key) => (
                  <div key={key} className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3 h-[90px] shrink-0">
                     <Skeleton className="h-4 w-3/4 rounded" />
                     <div className="flex items-center justify-between mt-auto">
                        <Skeleton className="h-4 w-12 rounded" />
                        <Skeleton className="h-3.5 w-20 rounded" />
                     </div>
                  </div>
               ))}
               {/* Add task button skeleton at the bottom */}
               <div className="mt-auto pt-2">
                  <Skeleton className="h-9 w-full rounded-xl" />
               </div>
            </div>
         </div>

         {/* In Progress Column (width flex-1, min-w-[260px]) */}
         <div className="flex flex-col h-full flex-1 min-w-[260px]">
            {/* Header */}
            <div className="flex items-center justify-between px-1.5 pb-3 shrink-0">
               <div className="flex items-center gap-1.5">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-4 w-6 rounded-full" />
               </div>
            </div>
            {/* Card list container */}
            <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200/80 border-t-4 border-t-amber-300/40 p-3 flex flex-col gap-2.5">
               {/* 2 stacked card skeletons */}
               {[1, 2].map((key) => (
                  <div key={key} className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3 h-[90px] shrink-0">
                     <Skeleton className="h-4 w-5/6 rounded" />
                     <div className="flex items-center justify-between mt-auto">
                        <Skeleton className="h-4 w-12 rounded" />
                        <Skeleton className="h-3.5 w-16 rounded" />
                     </div>
                  </div>
               ))}
            </div>
         </div>

         {/* Completed Column (width flex-[2], min-w-[540px]) */}
         <div className="flex flex-col h-full flex-[2] min-w-[540px]">
            {/* Header */}
            <div className="flex items-center justify-between px-1.5 pb-3 shrink-0">
               <div className="flex items-center gap-1.5">
                  <Skeleton className="h-5 w-24 rounded" />
                  <Skeleton className="h-4 w-6 rounded-full" />
               </div>
            </div>
            {/* Card list container with 2-column grid layout for cards */}
            <div className="flex-1 bg-slate-50/50 rounded-2xl border border-slate-200/80 border-t-4 border-t-teal-300/40 p-3 flex flex-col">
               <div className="grid grid-cols-1 xl:grid-cols-2 gap-2.5">
                  {/* 4 card skeletons arranged in a grid */}
                  {[1, 2, 3, 4].map((key) => (
                     <div key={key} className="bg-white rounded-xl p-4 border border-slate-200/60 shadow-xs flex flex-col gap-3 h-[90px]">
                        <Skeleton className="h-4 w-2/3 rounded" />
                        <div className="flex items-center justify-between mt-auto">
                           <Skeleton className="h-4 w-12 rounded" />
                           <Skeleton className="h-3.5 w-24 rounded" />
                        </div>
                     </div>
                  ))}
               </div>
            </div>
         </div>
      </div>
   )
}
