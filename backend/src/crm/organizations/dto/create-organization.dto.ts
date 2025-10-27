import { IsString, IsNotEmpty, IsOptional, IsUrl, IsEmail } from 'class-validator';

export class CreateOrganizationDto {
  @IsString({ message: 'Название должно быть строкой' })
  @IsNotEmpty({ message: 'Название обязательно' })
  name: string;

  @IsString({ message: 'ИНН должен быть строкой' })
  @IsNotEmpty({ message: 'ИНН обязателен' })
  inn: string;

  @IsUrl({}, { message: 'Некорректный URL сайта' })
  @IsOptional()
  site?: string;

  @IsString({ message: 'Описание должно быть строкой' })
  @IsOptional()
  description?: string;

  @IsString({ message: 'Адрес должен быть строкой' })
  @IsOptional()
  address?: string;

  @IsString({ message: 'Телефон должен быть строкой' })
  @IsOptional()
  phone?: string;

  @IsEmail({}, { message: 'Некорректный email адрес' })
  @IsOptional()
  email?: string;

  @IsUrl({}, { message: 'Некорректный URL сайта' })
  @IsOptional()
  website?: string;
}