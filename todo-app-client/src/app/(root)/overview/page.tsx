'use client'

import { Header } from '@/components/layout/Header'
import { OverviewHero } from '@/components/overview/OverviewHero'
import { RecentTasks } from '@/components/overview/RecentTasks'
import { UpcomingDeadlines } from '@/components/overview/UpcomingDeadlines'
import { PriorityBreakdown } from '@/components/overview/PriorityBreakdown'
import { useTodos } from '@/hooks/useTodos'
import { OverviewSkeleton } from '@/components/overview/OverviewSkeleton'

export default function OverviewPage() {
   const { data, isLoading } = useTodos({ limit: 200 })
   const todos = data?.data ?? []

   return (
      <div className="flex flex-col flex-1 min-h-0">
         <Header title="Overview" />
         <main className="flex-1 overflow-auto px-6 pt-6 pb-12">
            {isLoading ? (
               <OverviewSkeleton />
            ) : (
               <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
                  {/* Top Row: Hero Stats Panel */}
                  <OverviewHero todos={todos} />

                  {/* Bottom Row: Detailed Grid Layout */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:h-[470px]">
                     {/* Left Column - Workload List */}
                     <div className="lg:col-span-8 flex flex-col min-w-0 lg:h-full">
                        <RecentTasks todos={todos} />
                     </div>

                     {/* Right Column - Breakdown & Deadlines */}
                     <div className="lg:col-span-4 flex flex-col gap-6 min-w-0 lg:h-full">
                        <div className="shrink-0">
                           <PriorityBreakdown todos={todos} />
                        </div>
                        <div className="flex-1 min-h-0">
                           <UpcomingDeadlines todos={todos} />
                        </div>
                     </div>
                  </div>
               </div>
            )}
         </main>
      </div>
   )
}


