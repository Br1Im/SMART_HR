import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateBlockDto {
  @IsNotEmpty()
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsNotEmpty()
  @IsString()
  courseId: string;

  @IsNotEmpty()
  @IsNumber()
  position: number;
}