import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { HydratedDocument } from 'mongoose'

export type UserDocument = HydratedDocument<User>

@Schema({ timestamps: true })
export class User {
   @Prop({ required: true, unique: true, trim: true, lowercase: true, maxlength: 50 })
   username: string

   @Prop({ required: true })
   password: string

   createdAt: Date
   updatedAt: Date
}

export const UserSchema = SchemaFactory.createForClass(User)
