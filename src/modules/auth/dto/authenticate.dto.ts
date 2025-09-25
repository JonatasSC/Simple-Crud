import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateDto {
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
