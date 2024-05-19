import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
} from '@nestjs/common';
import { FilterService } from '../filter.service';
import { ApiCookieAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  TimeFilters,
  ExperienceLevelFilters,
  IndustryFilters,
  WorkingModeFilters,
  TypeFilters,
} from 'src/filter/filter.constant';

@ApiCookieAuth()
@ApiTags('filter-options')
@Controller('filter/option')
export class FilterOptionController {
  constructor(private readonly filterService: FilterService) {}

  @Get('time')
  @ApiOkResponse({
    description: 'Get all time filters. e.g. any, day, month, etc.',
    status: 200,
    isArray: true,
    type: [String],
  })
  getTimeFilters(@Res() res) {
    const times = Object.keys(TimeFilters).filter((item) => {
      return isNaN(Number(item));
    });
    res.status(200).json(times);
  }

  @Get('type')
  @ApiOkResponse({
    description: 'Get all type filters. e.g. internship, full-time, etc.',
    status: 200,
    isArray: true,
    type: [String],
  })
  getTypeFilters(@Res() res) {
    const types = Object.keys(TypeFilters).filter((item) => {
      return isNaN(Number(item));
    });
    res.status(200).json(types);
  }

  @Get('experience-level')
  @ApiOkResponse({
    description:
      'Get all experience level filters. e.g. entry, mid, senior, etc.',
    status: 200,
    isArray: true,
    type: [String],
  })
  getExperienceLevelFilters(@Res() res) {
    const experienceLevels = Object.keys(ExperienceLevelFilters).filter(
      (item) => {
        return isNaN(Number(item));
      },
    );
    res.status(200).json(experienceLevels);
  }

  @Get('working-mode')
  @ApiOkResponse({
    description: 'Get all working mode filters. e.g. remote, on-site, etc.',
    status: 200,
    isArray: true,
    type: [String],
  })
  getWorkingModeFilters(@Res() res) {
    const workingModes = Object.keys(WorkingModeFilters).filter((item) => {
      return isNaN(Number(item));
    });
    res.status(200).json(workingModes);
  }

  @Get('industry')
  @ApiOkResponse({
    description: 'Get all industry filters. e.g. tech, finance, etc.',
    status: 200,
    isArray: true,
    type: [String],
  })
  getIndustryFilters(@Res() res) {
    const industries = Object.keys(IndustryFilters).filter((item) => {
      return isNaN(Number(item));
    });
    res.status(200).json(industries);
  }
}
