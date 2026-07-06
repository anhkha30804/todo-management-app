import { BadRequestException, NotFoundException } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { Model, Types } from 'mongoose'
import { Todo } from './schemas/todo.schema'
import { TodosService } from './todos.service'
import { SortOrder, TodoSortBy, TodoStatus, TodoPriority } from './types/todo.type'

describe('TodosService', () => {
   let service: TodosService
   let model: Model<any>

   const mockUserId = new Types.ObjectId().toString()
   const mockTodoId = new Types.ObjectId().toString()

   const mockTodoDoc = (id = mockTodoId) => ({
      _id: new Types.ObjectId(id),
      title: 'Test Task',
      description: 'Test Description',
      status: TodoStatus.PENDING,
      priority: TodoPriority.MEDIUM,
      start_date: new Date(),
      end_date: new Date(Date.now() + 86400000), // tomorrow
      user: new Types.ObjectId(mockUserId),
      createdAt: new Date(),
      updatedAt: new Date(),
      toObject: jest.fn().mockReturnThis(),
      save: jest.fn().mockResolvedValue(this)
   })

   const mockTodoModel = {
      create: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
      deleteMany: jest.fn()
   }

   beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
         providers: [
            TodosService,
            {
               provide: getModelToken(Todo.name),
               useValue: mockTodoModel
            }
         ]
      }).compile()

      service = module.get<TodosService>(TodosService)
      model = module.get<Model<any>>(getModelToken(Todo.name))

      jest.clearAllMocks()
   })

   describe('create', () => {
      it('should successfully create a todo', async () => {
         const dto = {
            title: 'New Todo',
            description: 'New Description',
            start_date: new Date().toISOString(),
            end_date: new Date(Date.now() + 86400000).toISOString(),
            priority: TodoPriority.HIGH
         }
         const expectedResult = mockTodoDoc()
         mockTodoModel.create.mockResolvedValue(expectedResult)

         // 1. Execute the create operation
         const result = await service.create(dto, mockUserId)

         // 2. Assert result and that model.create was called with user ID and default pending status
         expect(result).toBe(expectedResult)
         expect(mockTodoModel.create).toHaveBeenCalledWith({
            ...dto,
            user: new Types.ObjectId(mockUserId),
            status: TodoStatus.PENDING
         })
      })

      it('should throw BadRequestException if end_date is earlier than start_date', async () => {
         const dto = {
            title: 'Invalid Todo',
            start_date: new Date(Date.now() + 86400000).toISOString(), // tomorrow
            end_date: new Date().toISOString() // today
         }

         // 1. Execute with invalid dates and verify it throws
         await expect(service.create(dto, mockUserId)).rejects.toThrow(BadRequestException)
         expect(mockTodoModel.create).not.toHaveBeenCalled()
      })
   })

   describe('findAll', () => {
      it('should return paginated list of todos and count', async () => {
         const query = {
            search: 'test',
            status: TodoStatus.PENDING,
            priority: TodoPriority.MEDIUM,
            sortBy: TodoSortBy.CREATED_AT,
            sortOrder: SortOrder.DESC,
            page: 1,
            limit: 10
         }

         const mockTodos = [mockTodoDoc()]
         const mockQueryObj = {
            sort: jest.fn().mockReturnThis(),
            skip: jest.fn().mockReturnThis(),
            limit: jest.fn().mockReturnThis(),
            lean: jest.fn().mockResolvedValue(mockTodos)
         }

         mockTodoModel.find.mockReturnValue(mockQueryObj)
         mockTodoModel.countDocuments.mockResolvedValue(1)

         // 1. Call the service method
         const result = await service.findAll(query, mockUserId)

         // 2. Assert model queries were executed with correct filters and ownership
         expect(mockTodoModel.find).toHaveBeenCalledWith({
            $text: { $search: 'test' },
            status: TodoStatus.PENDING,
            priority: TodoPriority.MEDIUM,
            user: new Types.ObjectId(mockUserId)
         })
         expect(mockQueryObj.sort).toHaveBeenCalledWith({ [TodoSortBy.CREATED_AT]: -1 })
         expect(mockQueryObj.skip).toHaveBeenCalledWith(0)
         expect(mockQueryObj.limit).toHaveBeenCalledWith(10)
         expect(result.data).toHaveLength(1)
         expect(result.total).toBe(1)
         expect(result.totalPages).toBe(1)
      })
   })

   describe('findOne', () => {
      it('should return the todo with isOverdue flag', async () => {
         const todo = mockTodoDoc()
         const mockFindByIdQuery = {
            lean: jest.fn().mockResolvedValue(todo)
         }
         mockTodoModel.findById.mockReturnValue(mockFindByIdQuery)

         // 1. Retrieve the single todo
         const result = await service.findOne(mockTodoId, mockUserId)

         // 2. Assert the returned todo is mapped with overdue calculation
         expect(result._id).toEqual(todo._id)
         expect(result.isOverdue).toBeDefined()
      })

      it('should throw NotFoundException if todo does not exist', async () => {
         const mockFindByIdQuery = {
            lean: jest.fn().mockResolvedValue(null)
         }
         mockTodoModel.findById.mockReturnValue(mockFindByIdQuery)

         // 1.   Attempt to find non-existent todo
         await expect(service.findOne(mockTodoId, mockUserId)).rejects.toThrow(NotFoundException)
      })

      it('should throw NotFoundException if todo belongs to another user', async () => {
         const todo = mockTodoDoc()
         todo.user = new Types.ObjectId() // different user
         const mockFindByIdQuery = {
            lean: jest.fn().mockResolvedValue(todo)
         }
         mockTodoModel.findById.mockReturnValue(mockFindByIdQuery)

         // 1.   Attempt to access another user's todo
         await expect(service.findOne(mockTodoId, mockUserId)).rejects.toThrow(NotFoundException)
      })
   })

   describe('update', () => {
      it('should update and return the updated todo', async () => {
         const existing = mockTodoDoc()
         mockTodoModel.findById.mockResolvedValue(existing)

         const updated = { ...existing, title: 'Updated Title' }
         const mockUpdateQuery = {
            lean: jest.fn().mockResolvedValue(updated)
         }
         mockTodoModel.findByIdAndUpdate.mockReturnValue(mockUpdateQuery)

         const dto = { title: 'Updated Title' }

         // 1. Execute the update operation
         const result = await service.update(mockTodoId, dto, mockUserId)

         // 2. Assert the update query was made with correct arguments
         expect(result.title).toBe('Updated Title')
         expect(mockTodoModel.findByIdAndUpdate).toHaveBeenCalledWith(mockTodoId, dto, {
            new: true,
            runValidators: true
         })
      })

      it('should throw BadRequestException if new end_date is before start_date', async () => {
         const existing = mockTodoDoc()
         existing.start_date = new Date(Date.now() + 86400000) // tomorrow
         mockTodoModel.findById.mockResolvedValue(existing)

         const dto = { end_date: new Date().toISOString() } // today

         // 1. Execute the update with invalid dates
         await expect(service.update(mockTodoId, dto, mockUserId)).rejects.toThrow(
            BadRequestException
         )
      })
   })

   describe('toggle', () => {
      it('should toggle pending to completed', async () => {
         const todo = mockTodoDoc()
         todo.status = TodoStatus.PENDING
         mockTodoModel.findById.mockResolvedValue(todo)

         // 1. Execute the toggle operation
         const result = await service.toggle(mockTodoId, mockUserId)

         // 2. Assert the status toggled to completed and document save was called
         expect(todo.status).toBe(TodoStatus.COMPLETED)
         expect(todo.save).toHaveBeenCalled()
         expect(result.status).toBe(TodoStatus.COMPLETED)
      })
   })

   describe('remove', () => {
      it('should delete the todo if it exists and belongs to user', async () => {
         const todo = mockTodoDoc()
         mockTodoModel.findById.mockResolvedValue(todo)

         // 1. Execute remove
         await service.remove(mockTodoId, mockUserId)

         // 2. Assert delete query was called
         expect(mockTodoModel.findByIdAndDelete).toHaveBeenCalledWith(mockTodoId)
      })
   })

   describe('removeAll', () => {
      it('should delete all documents in collection', async () => {
         // 1. Execute removeAll
         await service.removeAll()

         // 2. Assert deleteMany was called with empty filter
         expect(mockTodoModel.deleteMany).toHaveBeenCalledWith({})
      })
   })
})
