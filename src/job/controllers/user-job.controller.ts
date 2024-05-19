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
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { successResponse } from 'src/common/docs/response.doc';
import { JobUpdateStatusDto } from '../dto/update-job.dto';
import { UserJobService } from '../services/user-job.service';
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';

import { HistoryJobResponse, JobDetailResponse } from '../job-doc.dto';
import { ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
@UseGuards(RoleGuard(Role.User))
@ApiTags('job')
@Controller('job')
export class UserJobController {
  constructor(
    private readonly jobService: JobService,
    private readonly userJobService: UserJobService,
  ) {}

  @Post(':id/update-status')
  @ApiOkResponse(successResponse)
  async updateStatus(@Param('id') id: string, dto: JobUpdateStatusDto) {
    return this.userJobService.updateStatusById(id, dto);
  }
  @ApiExtraModels(HistoryJobResponse)
  @ApiOkResponse({
    description: 'List of user saved jobs',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(HistoryJobResponse),
          },
        },
      },
    },
  })
  @Get('/history')
  async getHistory(@Req() req) {
    const userId = req.user['sub'];
    return this.userJobService.getHistory(userId);
  }
}
