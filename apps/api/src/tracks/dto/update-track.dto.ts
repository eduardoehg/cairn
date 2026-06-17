import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import type { TrackStatus, TrackType, UpdateTrackRequest } from '@cairn/types';

const TYPES: TrackType[] = ['project', 'cadence'];
const STATUSES: TrackStatus[] = ['active', 'paused', 'done'];

export class UpdateTrackDto implements UpdateTrackRequest {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(12)
  code?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  short?: string;

  @IsOptional()
  @IsIn(TYPES)
  type?: TrackType;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  goal?: string;

  @IsOptional()
  @IsIn(STATUSES)
  status?: TrackStatus;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  priority?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(100)
  progress?: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  cadence?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  streak?: number;
}
