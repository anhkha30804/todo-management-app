import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Todo, TodoSchema } from './schemas/todo.schema'
import { TodosController } from './todos.controller'
import { TodosService } from './todos.service'
import { AuthModule } from '../auth/auth.module'

@Module({
   imports: [MongooseModule.forFeature([{ name: Todo.name, schema: TodoSchema }]), AuthModule],
   controllers: [TodosController],
   providers: [TodosService]
})
export class TodosModule {}
