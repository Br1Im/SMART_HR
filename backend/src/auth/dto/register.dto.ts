import { IsEmail, IsString, MinLength, IsIn, IsNotEmpty, IsOptional } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsNotEmpty({ message: 'Email обязателен' })
  email: string;

  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  @IsNotEmpty({ message: 'Пароль обязателен' })
  password: string;

  @IsString({ message: 'Полное имя должно быть строкой' })
  @IsNotEmpty({ message: 'Полное имя обязательно' })
  fullName: string;

  @IsIn(['ADMIN', 'CURATOR', 'CLIENT', 'CANDIDATE'], { message: 'Недопустимая роль' })
  @IsNotEmpty({ message: 'Роль обязательна' })
  role: string;

  @IsOptional()
  @IsString({ message: 'Пароль администратора должен быть строкой' })
  adminPassword?: string;
}