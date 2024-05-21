import { Body, Controller, Post, Req } from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateCVDto, UpdateUserDto } from './dto/update-user.dto';
import {
  ApiBody,
  ApiOkResponse,
  ApiTags,
  ApiUnprocessableEntityResponse,
} from '@nestjs/swagger';
import { ApiException, successResponse } from 'src/common/docs/response.doc';

@ApiTags('user')
@Controller('user')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOkResponse(successResponse)
  @ApiUnprocessableEntityResponse({
    type: ApiException,
  })
  @ApiBody({ required: true, type: UpdateCVDto })
  @Post('/update-cv')
  async updateCV(@Req() req, @Body() dto: UpdateCVDto) {
    const userId = req.user['sub'];
    await this.usersService.updateCV(userId, dto);
    return {
      status: 'success',
    };
  }

  @ApiOkResponse(successResponse)
  @ApiUnprocessableEntityResponse({
    type: ApiException,
  })
  @ApiBody({ required: true, type: UpdateUserDto })
  @Post('/update-info')
  async updateInfo(@Req() req, @Body() dto: UpdateUserDto) {
    const userId = req.user['sub'];
    await this.usersService.updateOptions(userId, dto);
    return {
      status: 'success',
    };
  }
}
