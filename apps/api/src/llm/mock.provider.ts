import { Injectable } from '@nestjs/common';
import type { GenerateWeekInput, LlmProvider } from './llm.types';
import type { GeneratedWeek } from './week-output.schema';

/** Stub de dev/teste: gera uma semana válida sem chamar IA (sem chave). */
@Injectable()
export class MockProvider implements LlmProvider {
  readonly name = 'mock';

  generateWeek(input: GenerateWeekInput): Promise<GeneratedWeek> {
    const code = input.tracks[0]?.code ?? 'GEN';
    return Promise.resolve({
      diagnostico: 'Semana de exemplo (mock) — geração sem IA.',
      tasks: [
        { description: 'Tarefa de construir (mock)', estimatedHours: 2, stage: 'build', trackCode: code },
        { description: 'Tarefa de mostrar (mock)', estimatedHours: 1.5, stage: 'show', trackCode: code },
        {
          description: 'Tarefa de visibilidade (mock)',
          estimatedHours: 1.5,
          stage: 'visibility',
          trackCode: code,
        },
      ],
    });
  }
}
