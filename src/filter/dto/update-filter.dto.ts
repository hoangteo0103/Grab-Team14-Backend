import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateFilterDto } from './create-filter.dto';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { STATUS } from 'src/common/common.constant';

export class UpdateFilterDto extends PartialType(CreateFilterDto) {}

export class FilterUpdateStatusDto {
  @ApiProperty({
    required: true,
    example: STATUS.ACTIVE,
  })
  @IsEnum(STATUS)
  @IsNotEmpty()
  status: string;

  @IsString()
  @IsOptional()
  _id: string;
}
