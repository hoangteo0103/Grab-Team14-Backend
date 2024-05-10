import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import {
  ExperienceLevelFilters,
  IndustryFilters,
  TimeFilters,
  TypeFilters,
  WorkingModeFilters,
} from '../filter.constant';

export type SearchQueryDocument = SearchQuery & Document;

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class SearchQuery {
  @Prop({ required: true, maxlength: 100 })
  name: string;

  @Prop({ required: false })
  location?: string;

  @Prop({ required: false })
  keyword?: string;

  @Prop({ required: false, enum: Object.values(ExperienceLevelFilters) })
  experience_level?: string;

  @Prop({ required: false, enum: Object.values(TimeFilters) })
  time_filter?: string;

  @Prop({ required: false, enum: Object.values(TypeFilters) })
  type?: string;

  @Prop({ required: false, enum: Object.values(WorkingModeFilters) })
  working_mode?: string;

  @Prop({ required: false, enum: Object.values(IndustryFilters) })
  industry?: string;

  @Prop({ required: false })
  last_crawled_linkedIn?: Date;

  @Prop({ required: false })
  last_crawled_topcv?: Date;

  @Prop({ required: false })
  last_crawled_indeed?: Date;
}

export const SearchQuerySchema = SchemaFactory.createForClass(SearchQuery);
