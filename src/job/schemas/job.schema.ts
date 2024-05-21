import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import {
  ExperienceLevelFilters,
  IndustryFilters,
  TimeFilters,
  TypeFilters,
  WorkingModeFilters,
} from 'src/filter/filter.constant';

export type JobDocument = Job & Document;

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class Job {
  @Prop({ required: true, maxlength: 100 })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  date: Date;

  @Prop({ required: true })
  jobLink: string;

  @Prop({ required: false })
  applyLink?: string;

  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  companyLink: string;

  @Prop({ required: false })
  companyImageUrl: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  companyLocation?: string;

  @Prop({ required: false })
  requirements?: [string];

  @Prop({ required: false, enum: Object.values(ExperienceLevelFilters) })
  experience?: string;

  @Prop({ required: false, enum: Object.values(TimeFilters) })
  time?: string;

  @Prop({ required: false, enum: Object.values(TypeFilters) })
  type?: string;

  @Prop({ required: false, enum: Object.values(WorkingModeFilters) })
  workingMode?: string;

  @Prop({ required: false })
  industry?: [string];

  @Prop({ required: true, enum: ['Linkedin', 'Topcv', 'Indeed'] })
  platform: string;
}

export const JobSchema = SchemaFactory.createForClass(Job);
JobSchema.plugin(paginate);
