import { BadRequestException, Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { Users } from 'src/users/entities/user.entity';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(user: Users, token: string) {
    const appBaseUrl = this.configService.get<string>('APP_BASE_URL');
    let _url = `${appBaseUrl}/users/verification/${token}`;

    if (!appBaseUrl && process.env.NODE_ENV === 'development') {
      _url = `http://localhost:3900/users/verification/${token}`;
    } else if (!appBaseUrl) {
      console.warn('APP_BASE_URL not defined. Using a placeholder URL.');
      _url = `http://example.com/users/verification/${token}`; // URL placeholder
    }

    try {
      await this.mailerService.sendMail({
        to: user.email,
        subject: 'Confirmação de Email',
        template: './confirmation',
        context: {
          url: _url
        },
      });

      return { statusCode: 200, message: `Enviado para o email: ${user.email}` };
    } catch (error) {
      console.error('Erro ao enviar e-mail de confirmação:', error); // Usar console.error para erros

      throw new BadRequestException(`Erro no envio de e-mail para ${user.email}`);
    }
  }

  async sendPasswordRecovery(email: string, userId: string) {
    const appBaseUrl = this.configService.get<string>('APP_BASE_URL');
    let _url = `${appBaseUrl}/users/recovery-confirmation/${userId}`;

    if (!appBaseUrl && process.env.NODE_ENV === 'development') {
      _url = `http://localhost:3900/users/recovery-confirmation/${userId}`;
    } else if (!appBaseUrl) {
      console.warn('APP_BASE_URL not defined. Using a placeholder URL for password recovery.');
      _url = `http://example.com/users/recovery-confirmation/${userId}`;
    }

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Recuperação de senha',
        text: 'Recuperação de senha', // Considere usar um template HTML para o corpo do e-mail
        template: './recovery-password', // Certifique-se que este template existe
        context: {
          url: _url,
        },
      });

      return { statusCode: 200, message: `Enviado para o email: ${email}` };
    } catch (error) {
      console.error('Erro ao enviar e-mail de recuperação de senha:', error);
      throw new BadRequestException(`Erro no envio de e-mail para ${email}`);
    }
  }
}
