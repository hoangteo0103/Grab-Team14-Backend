import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
} from '@nestjs/common';
import { FilterService } from '../filter.service';
import { CreateFilterDto } from '../dto/create-filter.dto';
import {
  FilterUpdateStatusDto,
  UpdateFilterDto,
} from '../dto/update-filter.dto';
import Role from 'src/users/role/roles.enum';
import RoleGuard from 'src/users/role/roles.guards';
import {
  ApiBody,
  ApiCookieAuth,
  ApiExtraModels,
  ApiOkResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import {
  FilterDetailResponse,
  FilterListResponse,
  FilterResponse,
} from '../filter-doc.dto';
import { successResponse } from 'src/common/docs/response.doc';
import { BodyId } from 'src/common/decorators/body-id.decorator';
import { FilterUpdateStatusPipe } from '../pipes/filter-update-status.pipe';

@UseGuards(RoleGuard(Role.User))
@ApiCookieAuth()
@ApiExtraModels(FilterResponse)
@ApiTags('filter')
@Controller('filter')
export class FilterController {
  constructor(private readonly filterService: FilterService) {}

  @ApiOkResponse({
    description: 'The record has been successfully created.',
    schema: {
      properties: {
        data: {
          $ref: getSchemaPath(FilterResponse),
        },
      },
    },
  })
  @ApiBody({
    required: true,
    type: CreateFilterDto,
  })
  @Post()
  create(@Req() req, @Body() createFilterDto: CreateFilterDto) {
    createFilterDto.user = req.user['sub'];
    return this.filterService.create(createFilterDto);
  }

  @Get()
  @ApiExtraModels(FilterListResponse)
  @ApiOkResponse({
    description: 'List of filters',
    schema: {
      properties: {
        data: {
          type: 'array',
          items: {
            $ref: getSchemaPath(FilterListResponse),
          },
        },
      },
    },
  })
  findAll(@Req() req) {
    const userId = req.user['sub'];
    return this.filterService.findAll(userId);
  }

  @Get(':id')
  @ApiExtraModels(FilterDetailResponse)
  @ApiOkResponse({
    description: 'Detail of filter',
    schema: {
      properties: {
        data: {
          $ref: getSchemaPath(FilterDetailResponse),
        },
      },
    },
  })
  getDetail(@Param('id') id: string) {
    return this.filterService.findOne(id);
  }

  @Put(':id/update-status')
  @ApiOkResponse(successResponse)
  async updateStatus(
    @Param('id') id: string,
    @BodyId(FilterUpdateStatusPipe) dto: FilterUpdateStatusDto,
  ) {
    await this.filterService.updateStatusById(id, dto);
    return {
      status: 'success',
    };
  }

  @Put(':id')
  @ApiBody({
    required: true,
    type: UpdateFilterDto,
  })
  @ApiOkResponse(successResponse)
  async update(
    @Param('id') id: string,
    @Body() updateFilterDto: UpdateFilterDto,
  ) {
    await this.filterService.update(id, updateFilterDto);
    return {
      status: 'success',
    };
  }

  @Delete(':id')
  @ApiOkResponse(successResponse)
  async remove(@Param('id') id: string) {
    await this.filterService.remove(id);
    return {
      status: 'success',
    };
  }
}
