import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  Render,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AccessTokenGuard } from '../common/guards/accessToken.guards';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from '../common/guards/refreshToken.guards';
import { UsersService } from '../users/users.service';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { ChangePasswordDto } from './dto/update-auth.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

  @Post('reset-password')
  async resetPassword(@Req() req, @Res() res) {
    await this.authService.resetPassword(req.body.email);
    return res.status(HttpStatus.OK).json({ message: 'Check your email' });
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res) {
    const tokens = await this.authService.signUp(createUserDto);
    return res.status(HttpStatus.CREATED).json(tokens);
  }

  @Post('signin')
  async signin(@Body() data: AuthDto, @Req() req, @Res() res) {
    const jwt_token = await this.authService.signIn(data);
    res.cookie('access_token', jwt_token.accessToken, {
      sameSite: 'none',
      secure: true,
    });
    res.cookie('refresh_token', jwt_token.refreshToken, {
      sameSite: 'none',
      secure: true,
    });
    const user = await this.userService.findByEmail(data.email);

    const returnUser = {
      ...user,
      password: undefined,
    };
    return res.status(HttpStatus.OK).json({
      user: returnUser,
      accessToken: jwt_token.accessToken,
      refreshToken: jwt_token.refreshToken,
    });
  }

  @ApiCookieAuth()
  @UseGuards(AccessTokenGuard)
  @Post('change-password')
  async changePassword(@Req() req, @Res() res, @Body() dto: ChangePasswordDto) {
    const userId = req.user['sub'];
    await this.authService.changePassword(userId, dto);
    return res.status(HttpStatus.OK).json({ message: 'Password changed' });
  }
  @ApiCookieAuth()
  @UseGuards(AccessTokenGuard)
  @Get('logout')
  logout(@Req() req: Request, @Res() res) {
    this.authService.logout(req.user['sub']);
  }

  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refreshTokens(@Req() req: Request) {
    const userId = req.user['sub'];
    const refreshToken = req.user['refreshToken'];
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
