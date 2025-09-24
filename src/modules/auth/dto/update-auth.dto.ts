import { PartialType } from '@nestjs/mapped-types';
import { CreateAuthDto } from './create-auth.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateAuthDto extends PartialType(CreateAuthDto) {
  @IsNotEmpty()
  @IsString()
  firts_name!: string;

  @IsNotEmpty()
  @IsString()
  last_name!: string;

  @IsNotEmpty()
  @IsString()
  username!: string;
}
