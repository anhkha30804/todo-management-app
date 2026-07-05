import { TodoPriority, TodoStatus } from '@/types/todo.types'

export const STATUS_CONFIG: Record<
  TodoStatus,
  { label: string; badgeClass: string; dotClass: string }
> = {
  [TodoStatus.PENDING]: {
    label: 'Pending',
    badgeClass: 'bg-[var(--status-pending-bg)] text-[var(--status-pending-text)]',
    dotClass: 'bg-[var(--status-pending-dot)]'
  },
  [TodoStatus.IN_PROGRESS]: {
    label: 'In Progress',
    badgeClass: 'bg-[var(--status-in-progress-bg)] text-[var(--status-in-progress-text)]',
    dotClass: 'bg-[var(--status-in-progress-dot)]'
  },
  [TodoStatus.COMPLETED]: {
    label: 'Completed',
    badgeClass: 'bg-[var(--status-completed-bg)] text-[var(--status-completed-text)]',
    dotClass: 'bg-[var(--status-completed-dot)]'
  }
}

export const PRIORITY_CONFIG: Record<
  TodoPriority,
  { label: string; badgeClass: string }
> = {
  [TodoPriority.LOW]: {
    label: 'Low',
    badgeClass: 'bg-[var(--priority-low-bg)] text-[var(--priority-low-text)]'
  },
  [TodoPriority.MEDIUM]: {
    label: 'Medium',
    badgeClass: 'bg-[var(--priority-medium-bg)] text-[var(--priority-medium-text)]'
  },
  [TodoPriority.HIGH]: {
    label: 'High',
    badgeClass: 'bg-[var(--priority-high-bg)] text-[var(--priority-high-text)]'
  }
}

export const KANBAN_COLUMNS = [
  TodoStatus.PENDING,
  TodoStatus.IN_PROGRESS,
  TodoStatus.COMPLETED
] as const
