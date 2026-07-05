import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'
import { TodoPriority, TodoStatus } from '../types/todo.type'

export type TodoDocument = HydratedDocument<Todo>

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true, trim: true, maxlength: 200 })
  title: string

  @Prop({ trim: true, maxlength: 1000 })
  description?: string

  @Prop({ type: String, enum: TodoStatus, default: TodoStatus.PENDING })
  status: TodoStatus

  @Prop({ type: String, enum: TodoPriority, default: TodoPriority.MEDIUM })
  priority: TodoPriority

  @Prop({ type: Date })
  start_date?: Date

  @Prop({ type: Date })
  end_date?: Date

  createdAt: Date
  updatedAt: Date
}

export const TodoSchema = SchemaFactory.createForClass(Todo)

TodoSchema.index({ status: 1 })
TodoSchema.index({ priority: 1 })
TodoSchema.index({ start_date: 1 })
TodoSchema.index({ end_date: 1 })
TodoSchema.index({ createdAt: -1 })
TodoSchema.index({ title: 'text', description: 'text' })
