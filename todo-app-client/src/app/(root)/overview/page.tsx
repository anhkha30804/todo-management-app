'use client'

import { Header } from '@/components/layout/Header'
import { OverviewHero } from '@/components/overview/OverviewHero'
import { RecentTasks } from '@/components/overview/RecentTasks'
import { UpcomingDeadlines } from '@/components/overview/UpcomingDeadlines'
import { PriorityBreakdown } from '@/components/overview/PriorityBreakdown'
import { useTodos } from '@/hooks/useTodos'
import { Skeleton } from '@/components/ui/skeleton'

export default function OverviewPage() {
  const { data, isLoading } = useTodos({ limit: 200 })
  const todos = data?.data ?? []

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Overview" />
      <main className="flex-1 overflow-auto p-6">
        {isLoading ? (
          <OverviewSkeleton />
        ) : (
          <div className="max-w-[1200px] mx-auto w-full flex flex-col gap-6">
            {/* Top Row: Hero Stats Panel */}
            <OverviewHero todos={todos} />

            {/* Bottom Row: Detailed Grid Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column - Workload List */}
              <div className="lg:col-span-8 flex flex-col min-w-0">
                <RecentTasks todos={todos} />
              </div>

              {/* Right Column - Breakdown & Deadlines */}
              <div className="lg:col-span-4 flex flex-col gap-6 min-w-0">
                <PriorityBreakdown todos={todos} />
                <UpcomingDeadlines todos={todos} />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

function OverviewSkeleton() {
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
