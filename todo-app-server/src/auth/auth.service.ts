import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcryptjs'
import { ConfigurationException } from '../shared/exceptions/configuration.exception'
import { UsersService } from '../users/users.service'
import { LoginRequest } from './dto/login.request'
import { RegisterRequest } from './dto/register.request'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {
    // 1. Verify that the JWT_SECRET configuration is present
    const secret = this.configService.get<string>('JWT_SECRET')
    if (!secret) {
      throw new ConfigurationException('JWT_SECRET configuration is missing')
    }
  }

  async register(req: RegisterRequest) {
    // 1. Hash the password using bcryptjs
    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(req.password, salt)

    // 2. Create the user in the database
    const user = await this.usersService.create(req.username, passwordHash)

    // 3. Generate the JWT payload and sign it
    const payload = { sub: user._id.toString(), username: user.username }
    const accessToken = await this.jwtService.signAsync(payload)

    // 4. Return user information and access token
    return {
      user: {
        id: user._id,
        username: user.username
      },
      accessToken
    }
  }

  async login(req: LoginRequest) {
    // 1. Find the user in the database
    const user = await this.usersService.findByUsername(req.username)
    if (!user) {
      throw new UnauthorizedException('Invalid username or password')
    }

    // 2. Verify the password hash
    const isPasswordValid = await bcrypt.compare(req.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password')
    }

    // 3. Generate the JWT payload and sign it
    const payload = { sub: user._id.toString(), username: user.username }
    const accessToken = await this.jwtService.signAsync(payload)

    // 4. Return user information and access token
    return {
      user: {
        id: user._id,
        username: user.username
      },
      accessToken
    }
  }
}
