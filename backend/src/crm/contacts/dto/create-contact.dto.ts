import { IsString, IsNotEmpty, IsOptional, IsEmail } from 'class-validator';

export class CreateContactDto {
  @IsString({ message: 'Полное имя должно быть строкой' })
  @IsNotEmpty({ message: 'Полное имя обязательно' })
  fullName: string;

  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsOptional()
  email?: string;

  @IsString({ message: 'Телефон должен быть строкой' })
  @IsOptional()
  phone?: string;

  @IsString({ message: 'Должность должна быть строкой' })
  @IsOptional()
  position?: string;

  @IsString({ message: 'Заметки должны быть строкой' })
  @IsOptional()
  notes?: string;

  @IsString({ message: 'Некорректный ID организации' })
  @IsNotEmpty({ message: 'ID организации обязателен' })
  orgId: string;
}