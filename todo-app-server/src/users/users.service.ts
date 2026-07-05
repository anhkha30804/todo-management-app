import { ConflictException, Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { User, UserDocument } from './schemas/user.schema'

@Injectable()
export class UsersService {
   constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {}

   async create(username: string, passwordHash: string): Promise<UserDocument> {
      // 1. Check if username already exists
      const existing = await this.findByUsername(username)
      if (existing) {
         throw new ConflictException('Username already exists')
      }

      // 2. Create and return the user document
      return this.userModel.create({
         username: username.toLowerCase().trim(),
         password: passwordHash
      })
   }

   async findByUsername(username: string): Promise<UserDocument | null> {
      return this.userModel.findOne({ username: username.toLowerCase().trim() }).exec()
   }

   async findById(id: string): Promise<UserDocument | null> {
      return this.userModel.findById(id).exec()
   }
}
