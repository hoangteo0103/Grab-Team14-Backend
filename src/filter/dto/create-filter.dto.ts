import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import {
  ExperienceLevelFilters,
  IndustryFilters,
  TimeFilters,
  TypeFilters,
  WorkingModeFilters,
} from '../filter.constant';

export class CreateFilterDto {
  @ApiProperty({
    description: 'Name of the filter',
    type: 'string',
    required: true,
    maxLength: 100,
    example: 'My Data Engineer Filter',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'ID of User who created the filter',
    type: 'string',
    example: '60f9f1b6d9f7c8000f0f3b1d',
  })
  @IsString()
  user: string;

  @ApiProperty({
    description: 'Location of the job',
    type: 'string',
    required: false,
    example: 'Ho Chi Minh',
  })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({
    description: 'Keyword to search for',
    type: 'string',
    required: false,
    example: 'Data Engineer',
  })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    description: 'Experience level of the job',
    type: 'string',
    required: false,
    example: 'ENTRY_LEVEL',
  })
  @IsOptional()
  @IsString()
  @IsEnum(ExperienceLevelFilters)
  experience_level?: string;

  @ApiProperty({
    description: 'Time filter of the job',
    type: 'string',
    required: false,
    example: 'DAY',
  })
  @IsOptional()
  @IsString()
  @IsEnum(TimeFilters)
  time?: string;

  @ApiProperty({
    description: 'Type of the job',
    type: 'string',
    required: false,
    example: 'FULL_TIME',
  })
  @IsOptional()
  @IsString()
  @IsEnum(TypeFilters)
  type?: string;

  @ApiProperty({
    description: 'Working mode of the job',
    type: 'string',
    required: false,
    example: 'REMOTE',
  })
  @IsOptional()
  @IsString()
  @IsEnum(WorkingModeFilters)
  working_mode?: string;

  @ApiProperty({
    description: 'Industry of the job',
    type: 'string',
    required: false,
    example: ['TECHNOLOGY_INFORMATION_AND_MEDIA'],
  })
  @IsOptional()
  @IsString({ each: true })
  @IsEnum(IndustryFilters, { each: true })
  industry?: [string];

  @ApiProperty({
    description: 'Include titles of the job',
    type: 'string',
    required: false,
    example: ['Data Engineer'],
  })
  @IsOptional()
  @IsString({ each: true })
  includeTitles?: [string];

  @ApiProperty({
    description: 'Exclude titles of the job',
    type: 'string',
    required: false,
    example: ['QC'],
  })
  excludeTitles?: [string];

  @ApiProperty({
    description: 'Exclude companies of the job',
    type: 'string',
    required: false,
    example: ['Google'],
  })
  excludeCompanies?: [string];

  @ApiProperty({
    description: 'Include description of the job',
    type: 'string',
    required: false,
    example: ['Python'],
  })
  includeDescription?: [string];

  @ApiProperty({
    description: 'Exclude description of the job',
    type: 'string',
    required: false,
    example: ['frontend'],
  })
  excludeDescription?: [string];
}
