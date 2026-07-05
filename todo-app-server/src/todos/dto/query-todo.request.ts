import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { TodoPriority, TodoStatus, TodoSortBy, SortOrder } from '../types/todo.type'

export class QueryTodoRequest {
  @IsString()
  @IsOptional()
  search?: string

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus

  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority

  @IsEnum(TodoSortBy)
  @IsOptional()
  sortBy?: TodoSortBy = TodoSortBy.CREATED_AT

  @IsEnum(SortOrder)
  @IsOptional()
  sortOrder?: SortOrder = SortOrder.DESC

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  page?: number = 1

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(500)
  @IsOptional()
  limit?: number = 10
}
