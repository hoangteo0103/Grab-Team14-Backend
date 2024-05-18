import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import {
  ExperienceLevelFilters,
  IndustryFilters,
  TimeFilters,
  TypeFilters,
  WorkingModeFilters,
} from '../filter.constant';

class User extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user' })
  _id: string;
}
const UserSchema = SchemaFactory.createForClass(User);

export type FilterDocument = Filter & Document;

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Filter {
  @Prop({ required: true, maxlength: 100 })
  name: string;

  @Prop({ required: true, type: UserSchema })
  user: User;

  @Prop({ required: true, default: false })
  isActive: boolean;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  keyword?: string;

  @Prop({ required: false, enum: Object.values(ExperienceLevelFilters) })
  experience?: string;

  @Prop({ required: false, enum: Object.values(TimeFilters) })
  time?: string;

  @Prop({ required: false, enum: Object.values(TypeFilters) })
  type?: string;

  @Prop({ required: false, enum: Object.values(WorkingModeFilters) })
  workingMode?: string;

  @Prop({ required: false, enum: Object.values(IndustryFilters) })
  industry?: string;

  @Prop({ required: false })
  includeTitles?: [string];

  @Prop({ required: false })
  excludeTitles?: [string];

  @Prop({ required: false })
  excludeCompanies?: [string];

  @Prop({ required: false })
  includeDescription?: [string];

  @Prop({ required: false })
  excludeDescription?: [string];
}

export const FilterSchema = SchemaFactory.createForClass(Filter);
