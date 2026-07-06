import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { UsersModule } from '../users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JwtAuthGuard } from './guards/jwt-auth.guard'

@Module({
   imports: [
      UsersModule,
      JwtModule.registerAsync({
         inject: [ConfigService],
         useFactory: (config: ConfigService) => {
            const secret = config.get<string>('JWT_SECRET')
            const expiresIn = (config.get<string>('JWT_EXPIRY') ?? '1d') as any
            return {
               secret,
               signOptions: { expiresIn }
            }
         }
      })
   ],
   controllers: [AuthController],
   providers: [AuthService, JwtAuthGuard],
   exports: [AuthService, JwtAuthGuard, JwtModule, UsersModule]
})
export class AuthModule {}
