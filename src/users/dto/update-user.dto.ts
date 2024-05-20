import { IsString, IsUrl } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UpdateCVDto {
  @ApiProperty({
    example: 'https://example.com/cv.pdf',
  })
  @IsUrl()
  @IsString()
  cvURL: string;
}
