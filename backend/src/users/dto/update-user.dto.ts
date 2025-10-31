import { IsEmail, IsOptional, IsString, IsEnum } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  fullName?: string;

  @IsOptional()
  @IsEnum(['ADMIN', 'MANAGER', 'CLIENT', 'CANDIDATE'])
  role?: string;
}