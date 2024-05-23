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
  UseGuards,
  Req,
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
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';
import { Request } from 'express';

@ApiTags('job')
@Controller('job')
@ApiExtraModels(JobListResponse)
@ApiExtraModels(PaginationResponse)
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
  @ApiQuery({
    name: 'isMatchingCV',
    required: false,
    type: 'boolean',
    example: 'true',
  })
  @ApiQuery({
    name: 'userId',
    required: false,
    type: 'string',
    example: 'true',
  })
  async list(
    @pagination() paginationParam,
    @Req() req: Request,
    @filter() filterParams,
    @Query('search') search: string,
    @Query('isMatchingCV') isMatchingCV: boolean,
    @Query('userId') userId: string,
  ) {
    if (
      search ||
      filterParams.type ||
      filterParams.experience ||
      filterParams.industry ||
      filterParams.workingMode ||
      isMatchingCV ||
      userId
    ) {
      return this.jobService.searchForJobs(
        search,
        paginationParam,
        filterParams,
        isMatchingCV,
        userId,
      );
    }
    // }
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

  @UseGuards(RoleGuard(Role.User))
  @Get(':id/cover-letter')
  async getCoverLetter(@Req() req, @Param('id') id: string) {
    const userId = req.user['sub'];

    return this.jobService.getCoverLetter(userId, id);
  }
}
