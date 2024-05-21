import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { JobService } from '../services/job.service';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { PaginationResponse } from 'src/common/docs/response.doc';
import { pagination } from 'src/common/decorators/pagination';
import { JobDetailResponse, JobListResponse } from '../job-doc.dto';
import { PaginationCustomInterceptor } from '../interceptors/pagination-custom.interceptor';
import { filter } from 'src/common/decorators/filter';

@ApiTags('job')
@Controller('job')
@ApiExtraModels(JobListResponse)
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Get('/')
  @ApiOkResponse({
    schema: {
      properties: {
        data: {
          allOf: [
            { $ref: getSchemaPath(PaginationResponse) },
            {
              properties: {
                docs: {
                  type: 'array',
                  items: { $ref: getSchemaPath(JobListResponse) },
                },
              },
            },
          ],
        },
      },
    },
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: 'number',
    example: 10,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: 'number',
    example: 1,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    type: 'string',
    example: 'order.asc',
  })
  @ApiQuery({
    name: 'time',
    required: false,
    type: 'string',
    example: 'Day',
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: 'string',
    example: 'FULL_TIME',
  })
  @ApiQuery({
    name: 'experience',
    required: false,
    type: 'string',
    example: 'ENTRY_LEVEL',
  })
  @ApiQuery({
    name: 'workingMode',
    required: false,
    type: 'string',
    example: 'REMOTE',
  })
  @ApiQuery({
    name: 'industry',
    required: false,
    type: 'string',
    example: 'TECHNOLOGY_INFORMATION_AND_MEDIA',
  })
  @ApiQuery({
    name: 'location',
    required: false,
    type: 'string',
    example: 'Ha Noi',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: 'string',
    example: 'Developer',
  })
  async list(
    @pagination() paginationParam,
    @filter() filterParams,
    @Query('search') search: string,
  ) {
    if (search) {
      console.log(search);
      return this.jobService.searchForJobs(
        search,
        paginationParam,
        filterParams,
      );
    }
    return this.jobService.list(paginationParam, filterParams);
  }

  @ApiExtraModels(JobDetailResponse)
  @ApiOkResponse({
    description: 'Detail of Job',
    schema: {
      properties: {
        data: {
          $ref: getSchemaPath(JobDetailResponse),
        },
      },
    },
  })
  @Get(':id')
  async getDetailJob(@Param('id') id: string) {
    return this.jobService.getJobById(id);
  }
}
