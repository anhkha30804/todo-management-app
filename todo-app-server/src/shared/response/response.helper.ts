import { PaginationMeta, SuccessResponse } from './response.dto'

export function successResponse<T>(
  data: T,
  message = 'Success',
  meta?: Partial<PaginationMeta>
): SuccessResponse<T> {
  return { success: true, message, data, ...(meta && { meta }) }
}
