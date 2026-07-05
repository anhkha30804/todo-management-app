import {
   Body,
   Controller,
   Delete,
   Get,
   HttpCode,
   HttpStatus,
   Param,
   Patch,
   Post,
   Query,
   UseGuards
} from '@nestjs/common'
import { successResponse } from '../shared/response/response.helper'
import { CreateTodoRequest } from './dto/create-todo.request'
import { QueryTodoRequest } from './dto/query-todo.request'
import { UpdateTodoRequest } from './dto/update-todo.request'
import { TodosService } from './todos.service'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CurrentUser } from '../auth/decorators/current-user.decorator'
import type { UserDocument } from '../users/schemas/user.schema'

@Controller('todos')
@UseGuards(JwtAuthGuard)
export class TodosController {
   constructor(private readonly todosService: TodosService) {}

   @Post()
   async create(@Body() req: CreateTodoRequest, @CurrentUser() user: UserDocument) {
      const todo = await this.todosService.create(req, user._id.toString())
      return successResponse(todo, 'Todo created')
   }

   @Get()
   async findAll(@Query() req: QueryTodoRequest, @CurrentUser() user: UserDocument) {
      const { data, total, page, limit, totalPages } = await this.todosService.findAll(
         req,
         user._id.toString()
      )
      return successResponse(data, 'OK', { total, page, limit, totalPages })
   }

   @Get(':id')
   async findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
      const todo = await this.todosService.findOne(id, user._id.toString())
      return successResponse(todo, 'OK')
   }

   @Patch(':id')
   async update(
      @Param('id') id: string,
      @Body() req: UpdateTodoRequest,
      @CurrentUser() user: UserDocument
   ) {
      const todo = await this.todosService.update(id, req, user._id.toString())
      return successResponse(todo, 'Todo updated')
   }

   @Patch(':id/toggle')
   async toggle(@Param('id') id: string, @CurrentUser() user: UserDocument) {
      const todo = await this.todosService.toggle(id, user._id.toString())
      return successResponse(todo, 'Todo toggled')
   }

   @Delete(':id')
   @HttpCode(HttpStatus.NO_CONTENT)
   async remove(@Param('id') id: string, @CurrentUser() user: UserDocument) {
      await this.todosService.remove(id, user._id.toString())
   }
}
