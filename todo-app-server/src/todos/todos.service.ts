import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import type { QueryFilter } from 'mongoose'
import { Model, Types } from 'mongoose'
import { CreateTodoRequest } from './dto/create-todo.request'
import { QueryTodoRequest } from './dto/query-todo.request'
import { UpdateTodoRequest } from './dto/update-todo.request'
import { Todo, TodoDocument } from './schemas/todo.schema'
import { SortOrder, TodoSortBy, TodoStatus, TodoWithOverdue } from './types/todo.type'

@Injectable()
export class TodosService {
   constructor(@InjectModel(Todo.name) private todoModel: Model<TodoDocument>) {}

   // Create Todo
   async create(req: CreateTodoRequest, userId: string): Promise<TodoDocument> {
      // 1. Validate that end_date is not earlier than start_date
      if (req.start_date && req.end_date && new Date(req.end_date) < new Date(req.start_date)) {
         throw new BadRequestException('End date cannot be earlier than start date')
      }

      // 2. Create the todo document with default pending status and associate the authenticated user
      return this.todoModel.create({
         ...req,
         user: new Types.ObjectId(userId) as any,
         status: TodoStatus.PENDING
      })
   }

   // List Todos
   async findAll(req: QueryTodoRequest, userId: string) {
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

      // 1. Build Query Filter including user ownership check
      if (search) filter.$text = { $search: search }
      if (status) filter.status = status
      if (priority) filter.priority = priority

      // Filter to show only the user's own todos
      filter.user = new Types.ObjectId(userId) as any

      // 2. Build Sort and Pagination
      const skip = (page - 1) * limit
      const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === SortOrder.ASC ? 1 : -1 }

      // 3. Execute Query to retrieve paginated data and count total records
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
   async findOne(id: string, userId: string): Promise<TodoWithOverdue> {
      // 1. Find existing todo document by ID
      const todo = await this.todoModel.findById(id).lean()
      if (!todo || todo.user.toString() !== userId) {
         throw new NotFoundException('Todo not found')
      }

      return this.withIsOverdue(todo)
   }

   // Update Todo
   async update(id: string, req: UpdateTodoRequest, userId: string): Promise<TodoWithOverdue> {
      // 1. Find existing todo document by ID
      const existingTodo = await this.todoModel.findById(id)
      if (!existingTodo || existingTodo.user.toString() !== userId) {
         throw new NotFoundException('Todo not found')
      }

      // 2. Validate that end_date is not earlier than start_date
      const newStartDate = req.start_date ? new Date(req.start_date) : existingTodo.start_date
      const newEndDate = req.end_date ? new Date(req.end_date) : existingTodo.end_date

      if (newStartDate && newEndDate && newEndDate < newStartDate) {
         throw new BadRequestException('End date cannot be earlier than start date')
      }

      // 3. Perform update and return updated todo
      const todo = await this.todoModel
         .findByIdAndUpdate(id, req, { new: true, runValidators: true })
         .lean()
      return this.withIsOverdue(todo)
   }

   // Toggle Todo Status
   async toggle(id: string, userId: string): Promise<TodoWithOverdue> {
      // 1. Find existing todo document by ID
      const todo = await this.todoModel.findById(id)
      if (!todo || todo.user.toString() !== userId) {
         throw new NotFoundException('Todo not found')
      }

      // 2. Toggle the completed status
      todo.status = todo.status === TodoStatus.COMPLETED ? TodoStatus.PENDING : TodoStatus.COMPLETED

      await todo.save()
      return this.withIsOverdue(todo.toObject())
   }

   // Remove Todo
   async remove(id: string, userId: string): Promise<void> {
      // 1. Find existing todo document by ID
      const todo = await this.todoModel.findById(id)
      if (!todo || todo.user.toString() !== userId) {
         throw new NotFoundException('Todo not found')
      }

      // 2. Delete the todo document
      await this.todoModel.findByIdAndDelete(id)
   }

   async removeAll(): Promise<void> {
      // 1. Delete all todo documents from database
      await this.todoModel.deleteMany({})
   }

   // Add isOverdue field
   private withIsOverdue(todo: unknown): TodoWithOverdue {
      const t = todo as Record<string, unknown>
      const isOverdue =
         t.end_date != null &&
         new Date(t.end_date as string) < new Date() &&
         t.status !== TodoStatus.COMPLETED
      return {
         ...(t as unknown as Todo),
         _id: t._id,
         isOverdue,
         createdAt: t.createdAt as Date,
         updatedAt: t.updatedAt as Date
      }
   }
}
