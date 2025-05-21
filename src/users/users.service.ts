import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { Users } from './entities/user.entity'; // Importe a interface/classe Users correta
import { MailerService } from '@nestjs-modules/mailer';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as usersMock from './mocks/users.json';
import { handleErrorConstraintUnique } from './../utils/handle.error.utils';

const saltRounds = 10;

@Injectable()
export class UsersService {
  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async findAll() {
    return usersMock;
  }

  async create(dto: CreateUserDto) {

    // Simula a verificação de email duplicado
    if (usersMock.some(user => user.email === dto.email)) {
      throw new BadRequestException('Email já cadastrado.');
    }

    dto.password = bcrypt.hashSync(dto.password, saltRounds);
    try {
      const newUser = { id: (usersMock.length + 1).toString(), ...dto, active: false, verificationCode: Math.random().toString(36).substring(7) }; // Gera um ID simples e código de verificação
      usersMock.push(newUser as any); // Adiciona ao array mockado
      return newUser;
    } catch (error) {
      console.log(error);
      return handleErrorConstraintUnique(error);
    }
  }

  async findOne(id: string) {
    const user = usersMock.find(user => (user as any).id === id); // Caste para 'any' temporariamente se o mock não tiver ID
    if (!user) {
      throw new NotFoundException(`Registro ID:${id} não localizado.`);
    }
    return user;
  }

  async update(id: string, dto: UpdateUserDto) {
    const _data: Partial<any> = { ...dto }; // Use 'any' ou crie uma interface para os dados mockados

    const index = usersMock.findIndex(user => (user as any).id === id); // Caste para 'any'
    const user = usersMock[index];

    if (!user) {
      throw new NotFoundException(`Registro ID: ${id} não localizado.`);
    }

    if( _data.password ) {
      _data.password = bcrypt.hashSync(_data.password, saltRounds);
    }

    try {
      usersMock[index] = { ...usersMock[index], ..._data } as any; // Atualiza o usuário no array mockado e caste para 'any'
      return usersMock[index];    } catch (error) {
      console.log(error);
      return handleErrorConstraintUnique(error);
    }
  }

  async delete(id: string) {
    const recordIndex = usersMock.findIndex(user => (user as any).id === id); // Caste para 'any'
    if (recordIndex === -1) {
      throw new NotFoundException(`Registro ID:${id} não localizado.`);
    }

    try {
      const deletedUser = usersMock.splice(recordIndex, 1); // Remove do array mockado
      return deletedUser[0];
    } catch (error) {
      console.log(error);

      throw new BadRequestException(
        `Não foi possível deletar o registro ID:${id}`,
      );
    }
  }

  async verification(code: string) {
    // check in database if code exists
    const user = usersMock.find(user => (user as any).verificationCode === code); // Caste para 'any'

    // codigo de verificação não localizado, retorna error
    if (!user) {
      throw new NotFoundException(`Código de confirmação inválido.`);
    }

    // if code exists muda status de usuário para ativo
    (user as any).active = true; // Ativa o usuário no array mockado
    return user as any; // Caste para 'any' ao retornar
  }

  async recovery(email: string) {
    // check in database if email exists
    const user = usersMock.find(user => user.email === email);

    // email não localizado, retorna error
    if (!user) {
      throw new NotFoundException(`E-mail inválido!`);
    }

    // code exists
    let _url = `https://seven-cloudwalk.herokuapp.com/users/recovery-confirmation/${(user as any).id}`;
    if (process.env.NODE_ENV === 'development') {
      _url = `http://localhost:3500/users/recovery-confirmation/${(user as any).id}`;
    }

    try {
      await this.mailerService.sendMail({
        to: email,
        subject: 'Recuperação de senha',
        text: 'Recuperação de senha',
        template: './recovery-password',
        context: {
          url: _url,
        },
      });

      return { statusCode: 200, message: `Enviado para o email: ${email}` };
    } catch (error) {
      console.log(error);

      throw new BadRequestException(`Erro no envio de e-mail para ${email}`);
    }
  }
}