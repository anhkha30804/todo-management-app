'use client'

import { useState, useMemo } from 'react'
import { addDays, isSameDay, startOfWeek } from 'date-fns'
import { Header } from '@/components/layout/Header'
import { WeekNav } from '@/components/calendar/WeekNav'
import { WeekGrid } from '@/components/calendar/WeekGrid'
import { TodoFormModal } from '@/components/board/TodoFormModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { useTodos } from '@/hooks/useTodos'
import { Todo, TodoStatus } from '@/types/todo.types'
import { CalendarSkeleton } from '@/components/calendar/CalendarSkeleton'

export default function CalendarPage() {
  const [anchor, setAnchor] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }))

  const [modalOpen, setModalOpen] = useState(false)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [addStatus, setAddStatus] = useState<TodoStatus>(TodoStatus.PENDING)

  // Fetch todos with a safe limit
  const { data, isLoading } = useTodos({ limit: 150 })
  const todos = useMemo(() => {
    return (data?.data ?? []).filter(
      (t) => t.status === TodoStatus.PENDING || t.status === TodoStatus.IN_PROGRESS
    )
  }, [data])

  // Generate 7 days of the week starting from anchor (Monday)
  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(anchor, i))
  }, [anchor])

  // Get todos scheduled for AM or PM slot on a specific day
  const getSlot = (day: Date, isAM: boolean) => {
    return todos.filter((todo) => {
      if (!todo.start_date) return false
      const todoDate = new Date(todo.start_date)
      if (!isSameDay(todoDate, day)) return false
      const hour = todoDate.getHours()
      return isAM ? hour < 12 : hour >= 12
    })
  }

  const openCreate = () => {
    setEditTodo(null)
    setAddStatus(TodoStatus.PENDING)
    setModalOpen(true)
  }

  const openEdit = (todo: Todo) => {
    setEditTodo(todo)
    setModalOpen(true)
  }

  const closeModal = () => {
    setModalOpen(false)
    setEditTodo(null)
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">
      <Header
        title="Calendar"
        right={
          <Button size="sm" className="h-8 gap-1.5" onClick={openCreate}>
            <Plus size={14} />
            New Task
          </Button>
        }
      />

      <div className="flex-1 flex flex-col min-h-0 bg-background p-6">
        <div className="flex-1 border border-border rounded-xl bg-card shadow-sm flex flex-col overflow-hidden min-h-0">
          <WeekNav anchor={anchor} setAnchor={setAnchor} />

          <div className="flex-1 overflow-auto min-h-0">
            {isLoading ? (
              <CalendarSkeleton />
            ) : (
              <WeekGrid weekDays={weekDays} getSlot={getSlot} onEdit={openEdit} />
            )}
          </div>
        </div>
      </div>

      <TodoFormModal
        open={modalOpen}
        onClose={closeModal}
        todo={editTodo}
        defaultStatus={addStatus}
      />
    </div>
  )
}
