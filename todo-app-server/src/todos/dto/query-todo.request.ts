import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator'
import { Type } from 'class-transformer'
import { TodoPriority, TodoStatus } from '../schemas/todo.schema'

export enum TodoSortBy {
  CREATED_AT = 'createdAt',
  DUE_DATE = 'due_date',
  PRIORITY = 'priority'
}

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc'
}

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
  @Max(100)
  @IsOptional()
  limit?: number = 10
}
