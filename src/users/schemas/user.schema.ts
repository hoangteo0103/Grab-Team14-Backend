import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import Role from '../role/roles.enum';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ required: true, unique: true })
  email?: string;

  @Prop({ required: false, unique: true })
  username?: string;

  @Prop({
    required: true,
  })
  password?: string;

  @Prop({
    required: false,
  })
  name?: string;

  @Prop({
    required: false,
  })
  contactNumber?: string;

  @Prop()
  refreshToken?: string;

  @Prop({ require: true, default: Role.User })
  role?: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
