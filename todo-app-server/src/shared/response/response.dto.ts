export interface PaginationMeta {
   page: number
   limit: number
   total: number
   totalPages: number
}

export interface SuccessResponse<T> {
   success: true
   message: string
   data: T
   meta?: Partial<PaginationMeta>
}

export interface ErrorResponse {
   success: false
   message: string
   error: {
      code: string
      details?: unknown
   }
   timestamp: string
   path: string
}
