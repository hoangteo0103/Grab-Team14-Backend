import { Injectable } from '@nestjs/common';
import { JobDocument } from 'aws-sdk/clients/iot';
import { Model } from 'mongoose';
import { Job } from '../schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import JobsSearchService from './jobSearch.service';
import { JobRepository } from '../repositories/job.repository';
import { filter } from 'rxjs';
import { UserJob, UserJobDocument } from '../schemas/user-job.schema';
import { JobUpdateStatusDto } from '../dto/update-job.dto';

@Injectable()
export class UserJobService {
  constructor(
    @InjectModel(UserJob.name) private userJobModel: Model<UserJobDocument>,
    public jobRepository: JobRepository,
  ) {}

  updateStatusById(id: string, dto: JobUpdateStatusDto) {
    return this.userJobModel.findOneAndUpdate({ _id: id }, dto);
  }

  async getHistory(userId: string) {
    const history = await this.userJobModel.find({ user: userId }).exec();
    const jobs = await history.map(async (history) => {
      const jobDetail = await this.jobRepository.findById(history.job.id);
      jobDetail['status'] = history.status;
      return jobDetail;
    });
    return jobs;
  }
}
