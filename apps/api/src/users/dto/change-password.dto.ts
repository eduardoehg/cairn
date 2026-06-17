import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import type { ChangePasswordRequest } from '@cairn/types';

export class ChangePasswordDto implements ChangePasswordRequest {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @IsString()
  @MinLength(8, { message: 'A nova senha deve ter ao menos 8 caracteres' })
  newPassword!: string;
}
