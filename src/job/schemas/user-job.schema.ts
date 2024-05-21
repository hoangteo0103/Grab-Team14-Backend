import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Status } from '../job.constant';

export type UserJobDocument = UserJob & Document;

@Schema({
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    },
  },
})
export class UserJob {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  jobId: string;

  @Prop({ required: true, type: Object.values(Status), default: Status.SAVED })
  status: string;
}

export const UserJobSchema = SchemaFactory.createForClass(UserJob);
UserJobSchema.plugin(paginate);
