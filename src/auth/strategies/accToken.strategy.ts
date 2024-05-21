import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../../users/users.service';
import { constantsJWT } from '../jwt-secret';

type JwtPayload = {
  sub: string;
  email: string;
};

const extactFromCookie = (request) => {
  let token = null;
  if (request && request.cookies) token = request.cookies['access_token'];
  return token;
};

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private userService: UsersService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([extactFromCookie]),
      secretOrKey: constantsJWT[0],
      userNameField: 'email',
    });
  }

  async validate(payload: JwtPayload): Promise<any> {
    const res = await this.userService.findById(payload.sub);
    if (res) {
      res['sub'] = payload.sub;
      return res;
    } else {
      throw new Error('User not found');
    }
  }
}
