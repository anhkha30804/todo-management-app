import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { QueryFilter } from 'mongoose'
import { Model } from 'mongoose'
import { CreateTodoRequest } from './dto/create-todo.request'
import { QueryTodoRequest, SortOrder, TodoSortBy } from './dto/query-todo.request'
import { UpdateTodoRequest } from './dto/update-todo.request'
import { Todo, TodoDocument, TodoStatus } from './schemas/todo.schema'

@Injectable()
export class TodosService {
  constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

  // Create Todo
  async create(req: CreateTodoRequest): Promise<TodoDocument> {
    return this.todoModel.create(req)
  }

  // List Todos
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

    // 1. Build Query Filter
    if (search) filter.$text = { $search: search }
    if (status) filter.status = status
    if (priority) filter.priority = priority

    // 2. Build Sort and Pagination
    const skip = (page - 1) * limit
    const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 }

    // 3. Execute Query
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

  // Find One Todo by Id
  async findOne(id: string): Promise<TodoDocument> {
    const todo = await this.todoModel.findById(id).lean()
    if (!todo) throw new NotFoundException('Todo not found')
    return this.withIsOverdue(todo) as TodoDocument
  }

  // Update Todo
  async update(id: string, req: UpdateTodoRequest): Promise<TodoDocument> {
    const todo = await this.todoModel
      .findByIdAndUpdate(id, req, { new: true, runValidators: true })
      .lean()
    if (!todo) throw new NotFoundException('Todo not found')
    return this.withIsOverdue(todo) as TodoDocument
  }

  async toggle(id: string): Promise<TodoDocument> {
    const todo = await this.todoModel.findById(id)
    if (!todo) throw new NotFoundException('Todo not found')

    todo.status = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED

    await todo.save()
    return this.withIsOverdue(todo.toObject()) as TodoDocument
  }

  // Add isOverdue field
  private withIsOverdue(todo: object) {
    const t = todo as Record<string, unknown>
    const isOverdue =
      t.due_date != null &&
      new Date(t.due_date as string) < new Date() &&
      t.status !== TodoStatus.COMPLETED
    return { ...t, isOverdue }
  }
}
