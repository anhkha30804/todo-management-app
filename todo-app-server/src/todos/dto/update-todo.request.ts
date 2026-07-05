import { IsDateString, IsEnum, IsOptional, IsString, MaxLength } from 'class-validator'
import { TodoPriority, TodoStatus } from '../schemas/todo.schema'

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
  due_date?: string
}
