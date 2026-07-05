'use client'

import { useState } from 'react'
import { Search, SortAsc, SortDesc, Plus } from 'lucide-react'
import { Header } from '@/components/layout/Header'
import { KanbanColumn } from '@/components/board/KanbanColumn'
import { TodoFormModal } from '@/components/board/TodoFormModal'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useTodos } from '@/hooks/useTodos'
import { useDebounce } from '@/hooks/useDebounce'
import { KANBAN_COLUMNS } from '@/constants/todo.constants'
import { Todo, TodoPriority, TodoSortBy, SortOrder, TodoStatus } from '@/types/todo.types'

export default function BoardPage() {
  const [search, setSearch] = useState('')
  const [priority, setPriority] = useState('all')
  const [sortBy, setSortBy] = useState(TodoSortBy.CREATED_AT)
  const [sortOrder, setSortOrder] = useState(SortOrder.DESC)

  const [modalOpen, setModalOpen] = useState(false)
  const [editTodo, setEditTodo] = useState<Todo | null>(null)
  const [addStatus, setAddStatus] = useState<TodoStatus>(TodoStatus.PENDING)

  const debouncedSearch = useDebounce(search, 350)

  const { data, isLoading } = useTodos({
    search: debouncedSearch || undefined,
    priority: priority !== 'all' ? (priority as TodoPriority) : undefined,
    sortBy: sortBy as TodoSortBy,
    sortOrder: sortOrder as SortOrder,
    limit: 200
  })

  const todos = data?.data ?? []
  const byStatus = (status: TodoStatus) => todos.filter((t) => t.status === status)

  const openCreate = (status: TodoStatus) => {
    setEditTodo(null)
    setAddStatus(status)
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
    <div className="flex flex-col flex-1 min-h-0">
      <Header
        title="Board"
        right={
          <Button size="sm" className="h-8 gap-1.5" onClick={() => openCreate(TodoStatus.PENDING)}>
            <Plus size={14} />
            New Task
          </Button>
        }
      />

      {/* Toolbar */}
      <div className="flex items-center gap-2 px-6 py-2.5 border-b border-border bg-card shrink-0">
        <div className="relative">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-8 h-8 w-52 text-sm"
          />
        </div>

        <Select value={priority} onValueChange={(v) => v && setPriority(v)}>
          <SelectTrigger className="h-8 w-[130px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All priorities</SelectItem>
            <SelectItem value={TodoPriority.HIGH}>High</SelectItem>
            <SelectItem value={TodoPriority.MEDIUM}>Medium</SelectItem>
            <SelectItem value={TodoPriority.LOW}>Low</SelectItem>
          </SelectContent>
        </Select>

        <Select value={sortBy} onValueChange={(v) => v && setSortBy(v as TodoSortBy)}>
          <SelectTrigger className="h-8 w-[130px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TodoSortBy.CREATED_AT}>Created</SelectItem>
            <SelectItem value={TodoSortBy.END_DATE}>Due date</SelectItem>
            <SelectItem value={TodoSortBy.START_DATE}>Start date</SelectItem>
            <SelectItem value={TodoSortBy.PRIORITY}>Priority</SelectItem>
          </SelectContent>
        </Select>

        <button
          onClick={() => setSortOrder((o) => (o === SortOrder.ASC ? SortOrder.DESC : SortOrder.ASC))}
          className="h-8 w-8 flex items-center justify-center rounded-md border border-input bg-background hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={sortOrder === SortOrder.ASC ? 'Ascending' : 'Descending'}
        >
          {sortOrder === SortOrder.ASC ? <SortAsc size={14} /> : <SortDesc size={14} />}
        </button>
      </div>

      {/* Kanban board — fills remaining height */}
      <div className="flex-1 overflow-auto p-6 min-h-0">
        {isLoading ? (
          <BoardSkeleton />
        ) : (
          <div className="flex gap-5 h-full">
            {KANBAN_COLUMNS.map((status) => (
              <KanbanColumn
                key={status}
                status={status}
                todos={byStatus(status)}
                onEdit={openEdit}
                onAdd={() => openCreate(status)}
              />
            ))}
          </div>
        )}
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

function BoardSkeleton() {
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
