import { Injectable } from '@nestjs/common';
import { JobDocument } from 'aws-sdk/clients/iot';
import { Model } from 'mongoose';
import { Job } from '../schemas/job.schema';
import { InjectModel } from '@nestjs/mongoose';
import JobsSearchService from './jobSearch.service';
import { JobRepository } from '../repositories/job.repository';
import { filter } from 'rxjs';
import { UserRepository } from 'src/users/repositories/user.repository';
const { spawnSync } = require('child_process');

@Injectable()
export class JobService {
  constructor(
    public jobRepository: JobRepository,
    private jobsSearchService: JobsSearchService,
    private userRepository: UserRepository,
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
    });
    return result;
  }

  async getJobById(id: string) {
    return await this.jobRepository.findOne({
      _id: id,
    });
  }

  async searchForJobs(
    text: string,
    paginationParam,
    filterParam,
    isMatchingCV,
    userId,
  ) {
    const results = await this.jobsSearchService.search(
      text,
      paginationParam,
      filterParam,
      isMatchingCV,
      userId,
    );

    return results;
    // const ids = results.map((result) => result.id);
    // const conditions: {
    //   _id?: {
    //     $in: string[];
    //   };
    // } = {};
    // conditions._id = {
    //   $in: ids,
    // };

    // return await this.jobRepository.pagination({
    //   conditions: conditions,
    //   ...paginationParam,
    //   sort: {
    //     order: 1,
    //     ...paginationParam.sort,
    //   },
    // });
  }

  async getCoverLetter(userId, id: string) {
    const user = await this.userRepository.findOne({
      _id: userId,
    });

    const job = await this.jobRepository.findOne({
      _id: id,
    });

    const userInfo = {
      fullName: user.fullName,
      email: user.email,
      phone: user.phone,
      address: user.address,
      city: user.city,
      skills: user.skills,
    };

    const pythonProcess = await spawnSync('python', [
      'src/scripts/job_script.py',
      'generate_cover_letter',
      job.company,
      job.title,
      job.experience,
      job.requirements,
      job.description,
      JSON.stringify(userInfo),
    ]);

    const result = pythonProcess.stdout?.toString();
    console.log(result);
    return result;
  }
}
