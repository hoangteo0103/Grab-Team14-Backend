import { ApiProperty } from '@nestjs/swagger';
import { Status } from '../job.constant';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class JobUpdateStatusDto {
  @ApiProperty({
    required: true,
    example: Status.SAVED,
  })
  @IsEnum(Status)
  @IsNotEmpty()
  status: string;
}
