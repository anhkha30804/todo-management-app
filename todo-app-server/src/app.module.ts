import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { TodosModule } from './todos/todos.module'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'

@Module({
   imports: [
      ConfigModule.forRoot({ isGlobal: true }),
      MongooseModule.forRootAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => ({
            uri: config.get<string>('MONGODB_URI')
         })
      }),
      UsersModule,
      AuthModule,
      TodosModule
   ],
   controllers: [],
   providers: []
})
export class AppModule {}
