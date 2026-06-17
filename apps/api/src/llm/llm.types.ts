import type { TrackType } from '@cairn/types';
import type { GeneratedWeek } from './week-output.schema';

/** Visão mínima de uma trilha usada no prompt (compatível com a entity Track). */
export interface PromptTrack {
  code: string;
  name: string;
  type: TrackType;
  goal: string;
  status: string;
  priority: number;
  progress: number | null;
  cadence: string | null;
  streak: number;
}

export interface GenerateWeekInput {
  tracks: PromptTrack[];
  budgetHours: number;
  weekNumber: number;
}

/** Porta: cada provedor de IA implementa esta interface. */
export interface LlmProvider {
  readonly name: string;
  generateWeek(input: GenerateWeekInput): Promise<GeneratedWeek>;
}
