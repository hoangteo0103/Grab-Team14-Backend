import { ApiProperty } from '@nestjs/swagger';
import {
  ExperienceLevelFilters,
  IndustryFilters,
  TimeFilters,
  TypeFilters,
  WorkingModeFilters,
} from './filter.constant';

export class FilterResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  keyword: string;

  @ApiProperty({
    enum: ExperienceLevelFilters,
  })
  experience_level: string;

  @ApiProperty({
    enum: TimeFilters,
  })
  time: string;

  @ApiProperty({
    enum: TypeFilters,
  })
  type: string;

  @ApiProperty({
    enum: WorkingModeFilters,
  })
  working_mode: string;

  @ApiProperty({
    isArray: true,
    enum: IndustryFilters,
  })
  industry: [string];
}

export class FilterListResponse {
  @ApiProperty({})
  name: string;
}

export class FilterDetailResponse {
  @ApiProperty()
  name: string;

  @ApiProperty()
  location: string;

  @ApiProperty()
  keyword: string;

  @ApiProperty({
    enum: ExperienceLevelFilters,
  })
  experience_level: string;

  @ApiProperty({
    enum: TimeFilters,
  })
  time: string;

  @ApiProperty({
    enum: TypeFilters,
  })
  type: string;

  @ApiProperty({
    enum: WorkingModeFilters,
  })
  working_mode: string;

  @ApiProperty({
    isArray: true,
    enum: IndustryFilters,
  })
  industry: [string];
}
