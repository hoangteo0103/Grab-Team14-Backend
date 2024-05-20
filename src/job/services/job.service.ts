import { Injectable } from '@nestjs/common';
import { JobDocument } from 'aws-sdk/clients/iot';
import { Model } from 'mongoose';
import { Job } from '../schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import JobsSearchService from './jobSearch.service';
import { JobRepository } from '../repositories/job.repository';
import { filter } from 'rxjs';

@Injectable()
export class JobService {
  constructor(
    public jobRepository: JobRepository,
    private jobsSearchService: JobsSearchService,
  ) {}
  public async list(paginationParam, filterParam) {
    const conditions: {
      date?: {
        $gte: Date;
      };
      type?: string;
      experience?: string;
      location?: string;
      industry?: string;
      workingMode?: string;
    } = {};

    if (filterParam.time) {
      const date = new Date();
      if (filterParam.time === 'DAY') {
        date.setDate(date.getDate() - 1);
      }
      if (filterParam.time === 'WEEK') {
        date.setDate(date.getDate() - 7);
      }

      if (filterParam.time === 'MONTH') {
        date.setMonth(date.getMonth() - 1);
      }
      conditions.date = {
        $gte: date,
      };
    }

    if (filterParam.type) {
      conditions.type = filterParam.type;
    }

    if (filterParam.experience) {
      conditions.experience = filterParam.experience;
    }

    if (filterParam.location) {
      conditions.location = filterParam.location;
    }

    if (filterParam.industry) {
      conditions.industry = filterParam.industry;
    }

    if (filterParam.workingMode) {
      conditions.workingMode = filterParam.workingMode;
    }
    const result = await this.jobRepository.pagination({
      conditions,
      ...paginationParam,
      sort: {
        order: 1,
        ...paginationParam.sort,
      },
      select: [
        'id',
        'title',
        'date',
        'companyName',
        'companyLink',
        'companyImageUrl',
        'location',
        'companyLocation',
        'experience',
        'type',
        'workingMode',
        'platform',
      ],
    });
    return result;
  }

  async getJobById(id: string) {
    return await this.jobRepository.findOne({
      _id: id,
    });
  }

  async searchForJobs(text: string, paginationParam, filterParam) {
    const results = await this.jobsSearchService.search(
      text,
      paginationParam,
      filterParam,
    );
    const ids = results.map((result) => result.id);
    return await this.jobRepository.pagination({
      _id: { $in: ids },
      ...paginationParam,
      sort: {
        order: 1,
        ...paginationParam.sort,
      },
    });
  }
}
