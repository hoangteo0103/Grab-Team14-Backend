import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import Role from '../role/roles.enum';

export type UserDocument = User & Document;

@Schema({
  timestamps: true,
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
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

  @Prop({
    required: false,
  })
  cvURL?: string;

  @Prop({
    required: false,
  })
  coverLetter?: string;

  @Prop({
    required: false,
  })
  skills?: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
