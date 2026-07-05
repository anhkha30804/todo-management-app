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
  Query
} from '@nestjs/common'
import { successResponse } from '../shared/response/response.helper'
import { CreateTodoRequest } from './dto/create-todo.request'
import { QueryTodoRequest } from './dto/query-todo.request'
import { UpdateTodoRequest } from './dto/update-todo.request'
import { TodosService } from './todos.service'

@Controller('todos')
export class TodosController {
  constructor(private readonly todosService: TodosService) {}

  @Post()
  async create(@Body() req: CreateTodoRequest) {
    const todo = await this.todosService.create(req)
    return successResponse(todo, 'Todo created')
  }

  @Get()
  async findAll(@Query() req: QueryTodoRequest) {
    const { data, total, page, limit, totalPages } = await this.todosService.findAll(req)
    return successResponse(data, 'OK', { total, page, limit, totalPages })
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const todo = await this.todosService.findOne(id)
    return successResponse(todo, 'OK')
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() req: UpdateTodoRequest) {
    const todo = await this.todosService.update(id, req)
    return successResponse(todo, 'Todo updated')
  }

  @Patch(':id/toggle')
  async toggle(@Param('id') id: string) {
    const todo = await this.todosService.toggle(id)
    return successResponse(todo, 'Todo toggled')
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.todosService.remove(id)
  }
}
