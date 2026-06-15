import { IsEmail, IsString, MinLength } from 'class-validator';
import type { RegisterRequest } from '@cairn/types';

export class RegisterDto implements RegisterRequest {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  password!: string;
}
