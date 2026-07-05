import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { QueryFilter } from 'mongoose'
import { Model } from 'mongoose'
import { CreateTodoRequest } from './dto/create-todo.request'
import { QueryTodoRequest } from './dto/query-todo.request'
import { UpdateTodoRequest } from './dto/update-todo.request'
import { Todo, TodoDocument } from './schemas/todo.schema'
import { TodoStatus, TodoSortBy, SortOrder, TodoWithOverdue } from './types/todo.type'

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  async create(req: CreateTodoRequest): Promise<TodoDocument> {
    return this.todoModel.create(req)
  }

  async findAll(req: QueryTodoRequest) {
    const {
      search,
      status,
      priority,
      sortBy = TodoSortBy.CREATED_AT,
      sortOrder = SortOrder.DESC,
      page = 1,
      limit = 10
    } = req
    const filter: QueryFilter<TodoDocument> = {}

    if (search) filter.$text = { $search: search }
    if (status) filter.status = status
    if (priority) filter.priority = priority

    const skip = (page - 1) * limit
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 }

    const [data, total] = await Promise.all([
      this.todoModel.find(filter).sort(sort).skip(skip).limit(limit).lean(),
      this.todoModel.countDocuments(filter)
    ])

    return {
      data: data.map((todo) => this.withIsOverdue(todo)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    }
  }

  async findOne(id: string): Promise<TodoWithOverdue> {
    const todo = await this.todoModel.findById(id).lean()
    if (!todo) throw new NotFoundException('Todo not found')
    return this.withIsOverdue(todo)
  }

  async update(id: string, req: UpdateTodoRequest): Promise<TodoWithOverdue> {
    const todo = await this.todoModel
      .findByIdAndUpdate(id, req, { new: true, runValidators: true })
      .lean()
    if (!todo) throw new NotFoundException('Todo not found')
    return this.withIsOverdue(todo)
  }

  async toggle(id: string): Promise<TodoWithOverdue> {
    const todo = await this.todoModel.findById(id)
    if (!todo) throw new NotFoundException('Todo not found')

    todo.status = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED

    await todo.save()
    return this.withIsOverdue(todo.toObject())
  }

  async remove(id: string): Promise<void> {
    const todo = await this.todoModel.findByIdAndDelete(id)
    if (!todo) throw new NotFoundException('Todo not found')
  }

  async removeAll(): Promise<void> {
    // 1.   Delete all todo documents from database
    await this.todoModel.deleteMany({})
  }

  private withIsOverdue(todo: unknown): TodoWithOverdue {
    const t = todo as Record<string, unknown>
    const isOverdue =
      t.end_date != null &&
      new Date(t.end_date as string) < new Date() &&
      t.status !== TodoStatus.COMPLETED
    return { ...(t as unknown as Todo), _id: t._id, isOverdue, createdAt: t.createdAt as Date, updatedAt: t.updatedAt as Date }
  }
}
