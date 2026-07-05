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

export interface Todo {
  _id: string
  title: string
  description?: string
  status: TodoStatus
  priority: TodoPriority
  start_date?: string
  end_date?: string
  isOverdue: boolean
  createdAt: string
  updatedAt: string
  isMutating?: boolean
}

export interface PaginationMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface ApiResponse<T> {
  success: boolean
  message: string
  data: T
  meta?: PaginationMeta
}

export interface TodoQueryParams {
  search?: string
  status?: TodoStatus
  priority?: TodoPriority
  sortBy?: TodoSortBy
  sortOrder?: SortOrder
  page?: number
  limit?: number
}

export interface CreateTodoPayload {
  title: string
  description?: string
  priority?: TodoPriority
  status?: TodoStatus
  start_date?: string
  end_date?: string
}

export interface UpdateTodoPayload {
  title?: string
  description?: string
  status?: TodoStatus
  priority?: TodoPriority
  start_date?: string
  end_date?: string
}
