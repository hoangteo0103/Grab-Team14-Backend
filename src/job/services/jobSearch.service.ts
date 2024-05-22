import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { Job } from 'src/job/schemas/job.schema';
import JobSearchResult from '../types/jobSearchResponse.interface';
import JobSearchBody from '../types/jobSearchBody.interface';
import { UserRepository } from 'src/users/repositories/user.repository';
import { filter } from 'rxjs';

@Injectable()
export default class JobsSearchService {
  index = 'search-jobs';

  constructor(
    private readonly elasticsearchService: ElasticsearchService,
    private readonly userRepository: UserRepository,
  ) {}

  async search(
    text: string,
    paginationParam,
    filterParam,
    isMatchingCV: boolean,
    userId: string,
  ) {
    let userQueryInfo = '';
    if (isMatchingCV == true && userId != null) {
      const user = await this.userRepository.findOne({ _id: userId });
      if (!user) {
        throw new Error('User not found');
      }
      userQueryInfo = user.skills.join(' ');
    }
    let conditions = '';
    if (filterParam.experience != null) {
      conditions = conditions + ' ' + filterParam.experience;
    }
    if (filterParam.location != null) {
      conditions = conditions + ' ' + filterParam.location;
    }

    if (filterParam.industry != null) {
      conditions = conditions + ' ' + filterParam.industry;
    }

    if (filterParam.type != null) {
      conditions = conditions + ' ' + filterParam.type;
    }

    if (filterParam.workingMode != null) {
      conditions = conditions + ' ' + filterParam.workingMode;
    }

    text = text + ' ' + conditions;

    text = text + ' ' + userQueryInfo;
    console.log('text', text);
    const body = await this.elasticsearchService.search<JobSearchResult>({
      index: this.index,
      body: {
        size: paginationParam.limit,
        from: (paginationParam.page - 1) * paginationParam.limit,
        query: {
          function_score: {
            query: {
              multi_match: {
                query: text,
                fields: [
                  'title',
                  'description',
                  'company',
                  'location',
                  'industry',
                  'workingMode',
                  'type',
                  'experience',
                ],
                fuzziness: 'AUTO',
                prefix_length: 2,
              },
            },
          },
        },
      },
    });
    const hits = body.hits.hits;

    const docs = hits.map((hit) => {
      return {
        ...hit._source,
        score: hit._score,
      };
    });

    return {
      totalDocs: body.hits.total,
      docs: docs,
    };
  }
}
