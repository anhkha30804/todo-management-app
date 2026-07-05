import { IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator'
import { TodoPriority } from '../schemas/todo.schema'

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
  due_date?: string
}
