import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document, Schema as MongooseSchema } from 'mongoose';
import * as paginate from 'mongoose-paginate-v2';
import { Status } from '../job.constant';

class User extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'user' })
  _id: string;
}
const UserSchema = SchemaFactory.createForClass(User);

class Job extends Document {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'job' })
  _id: string;
}
const JobSchema = SchemaFactory.createForClass(Job);

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
  @Prop({ required: true, type: UserSchema })
  user: User;

  @Prop({ required: true, type: JobSchema })
  job: Job;

  @Prop({ required: true, type: Object.values(Status), default: Status.SAVED })
  status: string;
}

export const UserJobSchema = SchemaFactory.createForClass(UserJob);
UserJobSchema.plugin(paginate);
