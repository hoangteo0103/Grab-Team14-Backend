import { ApiProperty } from '@nestjs/swagger';
import {
  ExperienceLevelFilters,
  IndustryFilters,
  TimeFilters,
  TypeFilters,
  WorkingModeFilters,
} from 'src/filter/filter.constant';

export class JobListResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyLink: string;

  @ApiProperty()
  companyImageUrl: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  companyLocation?: string;

  @ApiProperty({
    enum: ExperienceLevelFilters,
  })
  experience?: string;

  @ApiProperty({
    enum: TypeFilters,
  })
  type?: string;

  @ApiProperty({
    enum: WorkingModeFilters,
  })
  workingMode?: string;

  @ApiProperty({
    enum: ['Linkedin', 'Topcv', 'Indeed', 'Vietnamworks'],
  })
  platform: string;
}

export class JobDetailResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  jobLink: string;

  @ApiProperty()
  applyLink: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyLink: string;

  @ApiProperty()
  companyImageUrl: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  companyLocation?: string;

  @ApiProperty()
  requirements?: [string];

  @ApiProperty({
    enum: ExperienceLevelFilters,
  })
  experience?: string;

  @ApiProperty({
    enum: TimeFilters,
  })
  time?: string;

  @ApiProperty({
    enum: TypeFilters,
  })
  type?: string;

  @ApiProperty({
    enum: WorkingModeFilters,
  })
  workingMode?: string;

  @ApiProperty({
    type: [String],
    enum: IndustryFilters,
  })
  industry?: [string];

  @ApiProperty({
    enum: ['Linkedin', 'Topcv', 'Indeed', 'Vietnamworks'],
  })
  platform: string;
}

export class HistoryJobResponse {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  jobLink: string;

  @ApiProperty()
  applyLink: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty()
  companyLink: string;

  @ApiProperty()
  companyImageUrl: string;

  @ApiProperty()
  location?: string;

  @ApiProperty()
  companyLocation?: string;

  @ApiProperty()
  requirements?: [string];

  @ApiProperty({
    enum: ExperienceLevelFilters,
  })
  experience?: string;

  @ApiProperty({
    enum: TimeFilters,
  })
  time?: string;

  @ApiProperty({
    enum: TypeFilters,
  })
  type?: string;

  @ApiProperty({
    enum: WorkingModeFilters,
  })
  workingMode?: string;

  @ApiProperty({
    type: [String],
    enum: IndustryFilters,
  })
  industry?: [string];

  @ApiProperty({
    enum: ['Linkedin', 'Topcv', 'Indeed', 'Vietnamworks'],
  })
  platform: string;

  @ApiProperty()
  createdAt: Date;
}
