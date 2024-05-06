import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import Role from '../role/roles.enum';
export class CreateUserDto {
  @IsOptional()
  @IsString()
  @ApiProperty({ example: 'hoangteo' })
  username: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@gmail.com' })
  email: string;

  @ValidateIf((o) => o.username != null)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password' })
  password: string;

  @IsNotEmpty()
  @ApiProperty({ example: 'Hoang' })
  name: string;

  @ValidateIf((o) => o.username != null)
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: '0333333333' })
  contactNumber: string;

  @ValidateIf((o) => o.username != null)
  @ApiProperty({ enum: ['Admin'] })
  @IsString()
  role: Role;
}
