import { IsString, IsUrl } from 'class-validator';
import { CreateUserDto } from './create-user.dto';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class UpdateCVDto {
  @ApiProperty({
    example: 'https://example.com/cv.pdf',
  })
  @IsUrl()
  @IsString()
  cvURL: string;
}

export class UpdateUserDto {
  @ApiProperty({
    required: false,
    example: 'test',
  })
  coverLetter?: string;
  @ApiProperty({
    required: false,
    example: 'test@test.com',
  })
  email?: string;

  @ApiProperty({
    required: false,
    example: 'test',
  })
  username: string;

  @ApiProperty({
    required: false,
    example: 'test',
  })
  fullName?: string;

  @ApiProperty({
    required: false,
    example: '0123456789',
  })
  phone?: string;

  @ApiProperty({
    required: false,
    example: 'test address',
  })
  address?: string;

  @ApiProperty({
    required: false,
    example: 'Male',
  })
  sex?: string;

  @ApiProperty({
    required: false,
    example: '2021-01-01',
  })
  birthday?: Date;

  @ApiProperty({
    required: false,
    example: 'Vietnam',
  })
  country?: string;

  @ApiProperty({
    required: false,
    example: 'https://linkedin.com/avatar.png',
  })
  linkedin?: string;

  @ApiProperty({
    required: false,
    example: 'https:://github.com/avatar.png',
  })
  github?: string;

  @ApiProperty({
    required: false,
    example: 'https://facebook.com/avatar.png',
  })
  facebook?: string;

  @ApiProperty({
    required: false,
    example: 'https://twitter.com/avatar.png',
  })
  website?: string;
}
