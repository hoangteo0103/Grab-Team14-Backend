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
    required: function () {
      return this.username ? true : false;
    },
  })
  password?: string;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  name?: string;

  @Prop({
    required: function () {
      return this.username ? true : false;
    },
  })
  contactNumber?: string;

  @Prop()
  refreshToken?: string;

  @Prop({ require: true, default: Role.Admin })
  role?: Role;
}

export const UserSchema = SchemaFactory.createForClass(User);
