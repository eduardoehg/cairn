import { Injectable, NotFoundException } from '@nestjs/common';
import type { CurrentWeek, TaskStatus } from '@cairn/types';
import { TaskProgressService } from './task-progress.service';

@Injectable()
export class WeekService {
  constructor(private readonly progress: TaskProgressService) {}

  /**
   * Fatia 1/2: semana seed (hardcoded). Sai na Fatia 3, quando a geração via IA
   * passa a montar e persistir a semana de verdade.
   *
   * O seed honra os invariantes: orbita UMA peça de trabalho (a API) tocando
   * build → show → visibility, e a soma das estimativas (5.5h) cabe no
   * orçamento de ~6h (spec §4). O status é só o default; o real vem do banco.
   */
  private seedWeek(): CurrentWeek {
    return {
      id: 'seed-week-1',
      number: 1,
      startDate: '2026-06-15',
      estimatedHours: 5.5,
      percentComplete: 0,
      tasks: [
        {
          id: 'seed-t1',
          description: "Implement custom auth (JWT + guard) in Cairn's API",
          estimatedHours: 2.5,
          stage: 'build',
          status: 'pending',
          incompleteReason: null,
        },
        {
          id: 'seed-t2',
          description: 'Ship a protected GET /current-week returning the week',
          estimatedHours: 1.5,
          stage: 'show',
          status: 'pending',
          incompleteReason: null,
        },
        {
          id: 'seed-t3',
          description: 'Post on LinkedIn about writing auth from scratch in NestJS',
          estimatedHours: 1.5,
          stage: 'visibility',
          status: 'pending',
          incompleteReason: null,
        },
      ],
    };
  }

  /** Semana seed com o status persistido do usuário aplicado por cima. */
  async getCurrentWeek(userId: string): Promise<CurrentWeek> {
    const week = this.seedWeek();
    const saved = await this.progress.findForUser(userId);
    const byTask = new Map(saved.map((p) => [p.taskId, p]));

    week.tasks = week.tasks.map((task) => {
      const p = byTask.get(task.id);
      return p ? { ...task, status: p.status, incompleteReason: p.incompleteReason } : task;
    });

    const done = week.tasks.filter((t) => t.status === 'done').length;
    week.percentComplete = Math.round((done / week.tasks.length) * 100);
    return week;
  }

  async updateTaskStatus(
    userId: string,
    taskId: string,
    status: TaskStatus,
    incompleteReason: string | null,
  ): Promise<CurrentWeek> {
    if (!this.seedWeek().tasks.some((t) => t.id === taskId)) {
      throw new NotFoundException('Task not found');
    }
    // O motivo só faz sentido em 'not_done'; nos demais, limpa.
    const reason = status === 'not_done' ? incompleteReason : null;
    await this.progress.upsert(userId, taskId, status, reason);
    return this.getCurrentWeek(userId);
  }
}
