import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UsersService } from '../../users/users.service'

@Injectable()
export class JwtAuthGuard implements CanActivate {
   constructor(
      private readonly jwtService: JwtService,
      private readonly usersService: UsersService
   ) {}

   async canActivate(context: ExecutionContext): Promise<boolean> {
      // 1. Extract authorization header from request
      const request = context.switchToHttp().getRequest()
      const authHeader = request.headers.authorization

      // 2. Verify Bearer format is correct
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
         throw new UnauthorizedException('Authorization header is missing or malformed')
      }

      const token = authHeader.split(' ')[1]
      try {
         // 3. Verify JWT token using JwtService
         const payload = await this.jwtService.verifyAsync(token)

         // 4. Retrieve user from UsersService and attach to request
         const user = await this.usersService.findById(payload.sub)
         if (!user) {
            throw new UnauthorizedException('User not found')
         }
         request.user = user
         return true
      } catch {
         throw new UnauthorizedException('Invalid or expired token')
      }
   }
}
