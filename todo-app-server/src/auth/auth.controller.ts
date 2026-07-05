import { Body, Controller, Post } from '@nestjs/common'
import { successResponse } from '../shared/response/response.helper'
import { AuthService } from './auth.service'
import { LoginRequest } from './dto/login.request'
import { RegisterRequest } from './dto/register.request'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  async register(@Body() req: RegisterRequest) {
    const result = await this.authService.register(req)
    return successResponse(result, 'Registration successful')
  }

  @Post('login')
  async login(@Body() req: LoginRequest) {
    const result = await this.authService.login(req)
    return successResponse(result, 'Login successful')
  }
}
