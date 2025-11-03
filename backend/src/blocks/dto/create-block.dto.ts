import { IsNotEmpty, IsString, IsOptional, IsNumber, Min } from 'class-validator';

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

  @IsNumber()
  @Min(0)
  position: number;
}