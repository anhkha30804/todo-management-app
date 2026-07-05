import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { TodoPriority, TodoStatus } from '../types/todo.type'

export class CreateTodoRequest {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string

  @IsString()
  @IsOptional()
  @MaxLength(1000)
  description?: string

  @IsEnum(TodoPriority)
  @IsOptional()
  priority?: TodoPriority

  @IsDateString()
  @IsOptional()
  start_date?: string

  @IsDateString()
  @IsOptional()
  end_date?: string

  @IsEnum(TodoStatus)
  @IsOptional()
  status?: TodoStatus
}
