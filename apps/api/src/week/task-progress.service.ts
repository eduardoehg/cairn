import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { TaskStatus } from '@cairn/types';
import { TaskProgress } from './task-progress.entity';

@Injectable()
export class TaskProgressService {
  constructor(
    @InjectRepository(TaskProgress)
    private readonly repo: Repository<TaskProgress>,
  ) {}

  findForUser(userId: string): Promise<TaskProgress[]> {
    return this.repo.find({ where: { userId } });
  }

  async upsert(
    userId: string,
    taskId: string,
    status: TaskStatus,
    incompleteReason: string | null,
  ): Promise<void> {
    await this.repo.upsert({ userId, taskId, status, incompleteReason }, ['userId', 'taskId']);
  }
}
