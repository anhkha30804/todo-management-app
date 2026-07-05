import { TodoPriority, TodoStatus } from '@/types/todo.types'

export const STATUS_CONFIG: Record<
   TodoStatus,
   { label: string; badgeClass: string; dotClass: string }
> = {
   [TodoStatus.PENDING]: {
      label: 'Pending',
      badgeClass: 'bg-(--status-pending-bg) text-(--status-pending-text)',
      dotClass: 'bg-(--status-pending-dot)'
   },
   [TodoStatus.IN_PROGRESS]: {
      label: 'In Progress',
      badgeClass: 'bg-(--status-in-progress-bg) text-(--status-in-progress-text)',
      dotClass: 'bg-(--status-in-progress-dot)'
   },
   [TodoStatus.COMPLETED]: {
      label: 'Completed',
      badgeClass: 'bg-(--status-completed-bg) text-(--status-completed-text)',
      dotClass: 'bg-(--status-completed-dot)'
   }
}

export const PRIORITY_CONFIG: Record<TodoPriority, { label: string; badgeClass: string }> = {
   [TodoPriority.LOW]: {
      label: 'Low',
      badgeClass: 'bg-(--priority-low-bg) text-(--priority-low-text)'
   },
   [TodoPriority.MEDIUM]: {
      label: 'Medium',
      badgeClass: 'bg-(--priority-medium-bg) text-(--priority-medium-text)'
   },
   [TodoPriority.HIGH]: {
      label: 'High',
      badgeClass: 'bg-(--priority-high-bg) text-(--priority-high-text)'
   }
}

export const KANBAN_COLUMNS = [
   TodoStatus.PENDING,
   TodoStatus.IN_PROGRESS,
   TodoStatus.COMPLETED
] as const
