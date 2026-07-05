import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { TodoPriority, TodoStatus } from '../types/todo.type'

export class UpdateTodoRequest {
  @IsString()
  @IsOptional()
  @MaxLength(200)
  title?: string

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus

  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority

  @IsDateString()
  @IsOptional()
  start_date?: string

  @IsDateString()
  @IsOptional()
  end_date?: string
}
