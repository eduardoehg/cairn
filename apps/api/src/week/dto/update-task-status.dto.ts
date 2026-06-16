import { IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import type { TaskStatus, UpdateTaskStatusRequest } from '@cairn/types';

const STATUSES: TaskStatus[] = ['pending', 'done', 'not_done'];

export class UpdateTaskStatusDto implements UpdateTaskStatusRequest {
  @IsIn(STATUSES)
  status!: TaskStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  incompleteReason?: string;
}
