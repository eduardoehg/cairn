import { IsNotEmpty, IsString } from 'class-validator';
import type { RefreshRequest } from '@cairn/types';

export class RefreshDto implements RefreshRequest {
  @IsString()
  @IsNotEmpty()
  refreshToken!: string;
}
