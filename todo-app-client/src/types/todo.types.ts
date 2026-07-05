import { TodoStatus, TodoPriority, TodoSortBy, SortOrder } from './enum.types'

export * from './enum.types'
export * from './response.types'

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
