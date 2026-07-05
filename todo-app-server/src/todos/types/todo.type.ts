import type { Todo } from '../schemas/todo.schema'

export enum TodoStatus {
   PENDING = 'pending',
   IN_PROGRESS = 'in_progress',
   COMPLETED = 'completed'
}

export enum TodoPriority {
   LOW = 'low',
   MEDIUM = 'medium',
   HIGH = 'high'
}

export enum TodoSortBy {
   CREATED_AT = 'createdAt',
   START_DATE = 'start_date',
   END_DATE = 'end_date',
   PRIORITY = 'priority'
}

export enum SortOrder {
   ASC = 'asc',
   DESC = 'desc'
}

export type TodoWithOverdue = Omit<Todo, 'isOverdue'> & {
   _id: unknown
   isOverdue: boolean
   createdAt: Date
   updatedAt: Date
}
