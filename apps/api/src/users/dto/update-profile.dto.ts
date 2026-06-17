import { IsEmail, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';
import type { UpdateProfileRequest } from '@cairn/types';

export class UpdateProfileDto implements UpdateProfileRequest {
  @IsOptional()
  @IsString()
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsNumber()
  @Min(0.5)
  @Max(40)
  weeklyBudgetHours?: number;
}
