import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import * as usersMock from '../users/mocks/users.json';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: { sub: string; email: string }) {
    const user = (usersMock as any[]).find((user) => user.email === payload.email);

    if (!user) {
      throw new UnauthorizedException(
        'Usuário não existe ou não está autenticado',
      );
    }

    // Assuming password is a property in the mock data that should not be returned
    if (user.password) {
      delete user.password;
    }


    return user;
  }
}