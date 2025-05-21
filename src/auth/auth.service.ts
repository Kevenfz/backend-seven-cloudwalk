import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import * as usersMock from '../users/mocks/users.json';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    // Find the user in the mock array
    const user = (usersMock as any[]).find((user: any) => user.email === email);

    if (!user) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos');
    }

    // Compare the provided password with the mock password (assuming no bcrypt for simplicity)
    if (password !== user.password) {
      throw new UnauthorizedException('Usuário e/ou senha inválidos');
    }

    // Generate JWT token
    const token = this.jwtService.sign({ sub: user.id, email: user.email });

    // Remove password from the returned user object
    const userWithoutPassword = { ...user };
    delete userWithoutPassword.password;

    return {
      token,
      user: userWithoutPassword,
    };
  }
}