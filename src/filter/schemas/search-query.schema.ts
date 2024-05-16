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
  experienceLevel?: string;

  @Prop({ required: false, enum: Object.values(TimeFilters) })
  time?: string;

  @Prop({ required: false, enum: Object.values(TypeFilters) })
  type?: string;

  @Prop({ required: false, enum: Object.values(WorkingModeFilters) })
  workingMode?: string;

  @Prop({ required: false, enum: Object.values(IndustryFilters) })
  industry?: string;

  @Prop({ required: false })
  lastCrawledLinkedIn?: Date;

  @Prop({ required: false })
  lastCrawledTopcv?: Date;

  @Prop({ required: false })
  lastCrawledIndeed?: Date;
}

export const SearchQuerySchema = SchemaFactory.createForClass(SearchQuery);
