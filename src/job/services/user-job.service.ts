import { Inject, Injectable } from '@nestjs/common';
import { JobDocument } from 'aws-sdk/clients/iot';
import mongoose, { Model } from 'mongoose';
import { Job } from '../schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import JobsSearchService from './jobSearch.service';
import { JobRepository } from '../repositories/job.repository';
import { filter } from 'rxjs';
import { UserJob, UserJobDocument } from '../schemas/user-job.schema';
import { JobUpdateStatusDto } from '../dto/update-job.dto';
import { Status } from '../job.constant';
import { User, UserDocument } from 'src/users/schemas/user.schema';

@Injectable()
export class UserJobService {
  constructor(
    @InjectModel(UserJob.name) private userJobModel: Model<UserJobDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    public jobRepository: JobRepository,
  ) {}

  async updateStatusById(userId: string, id: string, dto: JobUpdateStatusDto) {
    if (dto.status == Status.SAVED) {
      const job = await this.userModel.findOne({ userId: userId, jobId: id });
      if (job != null) {
        console.log('Duplicated');
        return;
      }
      await this.userJobModel.create({
        userId: userId,
        jobId: id,
        status: dto.status,
      });
    } else {
      await this.userJobModel
        .findOneAndUpdate({ userId: userId, jobId: id }, { status: dto.status })
        .exec();
    }
  }

  async getHistory(userId: string) {
    console.log(userId);
    const history = await this.userJobModel.find({ userId: userId }).exec();

    const jobs = await Promise.all(
      history.map(async (historyJob) => {
        if (!mongoose.Types.ObjectId.isValid(historyJob.jobId)) return null;

        const jobDetail = await this.jobRepository.findById(historyJob.jobId);
        console.log(jobDetail);
        jobDetail['status'] = historyJob.status;
        return jobDetail;
      }),
    );
    return jobs;
  }
}
