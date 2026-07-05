'use client'

import { WeekGrid } from '@/components/calendar/WeekGrid'
import { WeekNav } from '@/components/calendar/WeekNav'
import { Header } from '@/components/layout/Header'
import { useTodos } from '@/hooks/useTodos'
import { TodoStatus } from '@/types/todo.types'
import { eachDayOfInterval, endOfWeek, getHours, isSameDay, startOfWeek } from 'date-fns'
import { useMemo, useState } from 'react'

export default function CalendarPage() {
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  const weekDays = useMemo(
    () => eachDayOfInterval({ start: anchor, end: endOfWeek(anchor, { weekStartsOn: 1 }) }),
    [anchor]
  )

  const { data } = useTodos({ limit: 200 })

  const scheduledTodos = useMemo(
    () => (data?.data ?? []).filter((t) => t.status !== TodoStatus.COMPLETED && !!t.start_date),
    [data]
  )

  const getSlot = (day: Date, isAM: boolean) =>
    scheduledTodos.filter((t) => {
      const d = new Date(t.start_date!)
      return isSameDay(d, day) && (isAM ? getHours(d) < 12 : getHours(d) >= 12)
    })

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <Header title="Calendar" />
      <WeekNav anchor={anchor} setAnchor={setAnchor} />
      <div className="flex-1 overflow-auto min-h-0">
        <WeekGrid weekDays={weekDays} getSlot={getSlot} />
      </div>
    </div>
  )
}
