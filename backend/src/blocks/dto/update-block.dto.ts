import { PartialType } from '@nestjs/mapped-types';
import { CreateBlockDto } from './create-block.dto';
import { IsNumber, IsOptional } from 'class-validator';

export class UpdateBlockDto extends PartialType(CreateBlockDto) {
  @IsOptional()
  @IsNumber()
  position?: number;
}