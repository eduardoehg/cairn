import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import type { LoginRequest } from '@cairn/types';

export class LoginDto implements LoginRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @IsNotEmpty()
  password!: string;
}
