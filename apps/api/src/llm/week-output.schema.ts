import { z } from 'zod';

/**
 * Schema da saída estruturada do modelo (a semana gerada).
 * O SDK valida a resposta contra este schema (structured outputs); restrições
 * de contagem/limite são validadas no cliente pelo helper.
 */
export const generatedWeekSchema = z.object({
  diagnostico: z
    .string()
    .describe('Racional curto da semana (1–2 frases): por que essas tarefas e como cabem no tempo.'),
  tasks: z
    .array(
      z.object({
        description: z
          .string()
          .describe('Tarefa concreta, atômica e marcável, em português.'),
        estimatedHours: z.number().describe('Estimativa em horas (ex.: 1.5).'),
        stage: z
          .enum(['build', 'show', 'visibility'])
          .describe('Etapa do funil: build (construir), show (mostrar), visibility (visibilidade).'),
        trackCode: z.string().describe('code da trilha de origem desta tarefa.'),
      }),
    )
    .min(3)
    .max(5)
    .describe('Entre 3 e 5 tarefas que orbitam as trilhas, cabendo no orçamento.'),
});

export type GeneratedWeek = z.infer<typeof generatedWeekSchema>;
