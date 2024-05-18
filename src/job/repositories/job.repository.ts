import AbstractRepository from 'src/common/abstracts/repository.abstract';
import { PaginateModel } from 'mongoose';

import { Job, JobDocument } from 'src/job/schemas/job.schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class JobRepository extends AbstractRepository<JobDocument> {
  constructor(@InjectModel(Job.name) model: PaginateModel<JobDocument>) {
    super(model);
  }
}
