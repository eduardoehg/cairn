import {
  BadRequestException,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import type { CurrentWeek, Task } from '@cairn/types';
import { ProviderRegistry } from '../llm/provider-registry';
import type { GeneratedWeek } from '../llm/week-output.schema';
import { TracksService } from '../tracks/tracks.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class WeekGenerationService {
  constructor(
    private readonly tracks: TracksService,
    private readonly users: UsersService,
    private readonly registry: ProviderRegistry,
  ) {}

  /**
   * Gera a semana a partir das trilhas ativas + orçamento do usuário.
   * Fatia 3b.1: valida e RETORNA (ainda não persiste — isso vem no 3b.2).
   */
  async generate(userId: string, providerName: string): Promise<CurrentWeek> {
    const all = await this.tracks.list(userId);
    const active = all.filter((t) => t.status === 'active');
    if (active.length === 0) {
      throw new BadRequestException('Adicione ao menos uma trilha ativa antes de gerar a semana.');
    }

    const profile = await this.users.getProfile(userId);
    const budgetHours = profile.weeklyBudgetHours;

    const provider = this.registry.get(providerName);
    const generated = await provider.generateWeek({ tracks: active, budgetHours, weekNumber: 1 });

    // Régua de negócio: a soma das estimativas não pode passar do teto (orçamento × 1.25).
    const sum = generated.tasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    const cap = budgetHours * 1.25;
    if (sum > cap + 1e-6) {
      throw new UnprocessableEntityException(
        `A geração estourou o orçamento (${sum}h > teto ${cap}h). Tente novamente.`,
      );
    }

    return this.toCurrentWeek(generated);
  }

  private toCurrentWeek(generated: GeneratedWeek): CurrentWeek {
    const tasks: Task[] = generated.tasks.map((t, i) => ({
      id: `gen-${i + 1}`,
      description: t.description,
      estimatedHours: t.estimatedHours,
      stage: t.stage,
      status: 'pending',
      incompleteReason: null,
    }));
    const estimatedHours = tasks.reduce((acc, t) => acc + t.estimatedHours, 0);
    return {
      id: 'generated-preview',
      number: 1,
      startDate: new Date().toISOString().slice(0, 10),
      estimatedHours,
      percentComplete: 0,
      tasks,
    };
  }
}
