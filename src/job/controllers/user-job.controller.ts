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
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { successResponse } from 'src/common/docs/response.doc';
import { JobUpdateStatusDto } from '../dto/update-job.dto';
import { UserJobService } from '../services/user-job.service';
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';

import { HistoryJobResponse } from '../job-doc.dto';
import { ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
@UseGuards(RoleGuard(Role.User))
@ApiTags('user-job')
@Controller('userJob')
@ApiCookieAuth()
export class UserJobController {
  constructor(
    private readonly jobService: JobService,
    private readonly userJobService: UserJobService,
  ) {}

  @Post(':id/update-status')
  @ApiOkResponse(successResponse)
  async updateStatus(
    @Param('id') id: string,
    @Req() req,
    @Body() dto: JobUpdateStatusDto,
  ) {
    const userId = req.user['sub'];
    console.log(id);
    await this.userJobService.updateStatusById(userId, id, dto);
    return {
      status: 'success',
    };
  }
  @ApiExtraModels(HistoryJobResponse)
  @ApiOkResponse({
    description: 'List of history jobs',
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
  @Get('history')
  async getHistory(@Req() req) {
    const userId = req.user['sub'];
    console.log(userId);
    return await this.userJobService.getHistory(userId);
  }

  @Get(':id/status')
  async getStatus(@Param('id') id: string, @Req() req) {
    const userId = req.user['sub'];
    const res = await this.userJobService.getJobStatus(userId, id);
    return res;
  }
}
