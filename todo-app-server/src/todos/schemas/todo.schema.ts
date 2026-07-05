import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type TodoDocument = HydratedDocument<Todo>

export enum TodoStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}

export enum TodoPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high'
}

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
  due_date?: Date

  createdAt: Date
  updatedAt: Date

  get isOverdue(): boolean {
    return (
      this.due_date != null &&
      this.due_date < new Date() &&
      this.status !== TodoStatus.COMPLETED
    )
  }
}

export const TodoSchema = SchemaFactory.createForClass(Todo)

TodoSchema.index({ status: 1 })
TodoSchema.index({ priority: 1 })
TodoSchema.index({ due_date: 1 })
TodoSchema.index({ createdAt: -1 })
TodoSchema.index({ title: 'text', description: 'text' })
