import { IsIn, IsInt, IsOptional, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import type { CreateTrackRequest, TrackType } from '@cairn/types';

const TYPES: TrackType[] = ['project', 'cadence'];

export class CreateTrackDto implements CreateTrackRequest {
  @IsString()
  @MinLength(1)
  @MaxLength(12)
  code!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name!: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  short?: string;

  @IsIn(TYPES)
  type!: TrackType;

  @IsString()
  @MaxLength(500)
  goal!: string;

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
}
