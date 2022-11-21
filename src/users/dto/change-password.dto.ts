import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class ChangePasswordDto {
  @IsString({
    message: 'Informe uma senha válida',
  })
  @MinLength(8, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  @MaxLength(32, {
    message: 'A senha deve ter no máximo 32 caracteres.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número ou um símbulo',
  })
  @ApiProperty({
    description:
      'Nova senha do usuário.',
    example: 'te$Ste456',
  })
  password: string;

  @IsString({
    message: 'Informe uma senha válida',
  })
  @MinLength(8, {
    message: 'A senha deve ter no mínimo 6 caracteres',
  })
  @MaxLength(32, {
    message: 'A senha deve ter no máximo 32 caracteres.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'A senha deve conter pelo menos uma letra maiúscula, uma letra minúscula, um número ou um símbulo',
  })
  @ApiProperty({
    description:
      'Confirmação da senha do usuário.',
    example: 'te$Ste456',
  })
  passwordConfirmation: string;
}
