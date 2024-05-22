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
  fullName?: string;

  @Prop({
    required: false,
  })
  phone?: string;

  @Prop({
    required: false,
  })
  address?: string;

  @Prop({
    required: false,
  })
  city?: string;

  @Prop({
    required: false,
  })
  sex?: string;

  @Prop({
    required: false,
  })
  birthday?: string;

  @Prop({
    required: false,
  })
  country?: string;

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

  @Prop({
    required: false,
  })
  linkedin?: string;

  @Prop({
    required: false,
  })
  github?: string;

  @Prop({
    required: false,
  })
  facebook?: string;

  @Prop({
    required: false,
  })
  website?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
