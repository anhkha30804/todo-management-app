'use client'

import { Header } from '@/components/layout/Header'
import { useTodos } from '@/hooks/useTodos'
import { StatsTopRow } from '@/components/stats/StatsTopRow'
import { StatusDistribution } from '@/components/stats/StatusDistribution'
import { PriorityDistribution } from '@/components/stats/PriorityDistribution'
import { OverdueList } from '@/components/stats/OverdueList'
import { ActivityTrend } from '@/components/stats/ActivityTrend'
import { Loader2 } from 'lucide-react'

export default function StatsPage() {
   const { data, isLoading } = useTodos({ limit: 500 })
   const todos = data?.data ?? []

   return (
      <div className="flex flex-col flex-1 overflow-hidden">
         <Header title="Stats" />
         <main className="flex-1 overflow-auto p-6">
            {isLoading ? (
               <div className="flex items-center justify-center h-64">
                  <Loader2 size={20} className="animate-spin text-muted-foreground" />
               </div>
            ) : (
               <div className="max-w-[1200px] mx-auto flex flex-col gap-6">
                  {/* Top metrics row */}
                  <StatsTopRow todos={todos} />

                  {/* Performance charts */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <ActivityTrend todos={todos} />
                     <StatusDistribution todos={todos} />
                  </div>

                  {/* Breakdown & lists */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                     <PriorityDistribution todos={todos} />
                     <OverdueList todos={todos} />
                  </div>
               </div>
            )}
         </main>
      </div>
   )
}
