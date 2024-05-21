import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Job } from 'src/job/schemas/job.schema';
import JobSearchResult from '../types/jobSearchResponse.interface';
import JobSearchBody from '../types/jobSearchBody.interface';

@Injectable()
export default class JobsSearchService {
  index = 'search-jobs';

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async search(text: string, paginationParam, filterParam) {
    const conditions: {
      type?: string;
      experience?: string;
      location?: string;
      industry?: string;
      workingMode?: string;
    } = {};
    let filterDate = [];
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
      filterDate.push({
        range: {
          date: {
            gte: date.toISOString(),
          },
        },
      });
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
    const body = await this.elasticsearchService.search<JobSearchResult>({
      index: this.index,
      body: {
        size: 1000,
        query: {
          multi_match: {
            query: text,
            fields: [
              'title',
              'description',
              'companyName',
              'location',
              'industry',
              'workingMode',
              'type',
              'experience',
            ],
          },
        },
      },
    });
    const hits = body.hits.hits;
    const res = hits.map((item) => item._source);
    return res;
  }
}
