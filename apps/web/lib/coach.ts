/**
 * Coach — helpers de apresentação + dados de exibição.
 *
 * O contrato real vem de @cairn/types (semana + tarefas, persistidas pela API).
 * O que ainda NÃO existe no backend (trilhas de orquestração, orçamento, tutor,
 * fechar-semana → diagnóstico/IA) é a Fatia 3/4 do build-plan e está marcado
 * aqui como MOCK até ser modelado de verdade.
 */
import type { TaskStage } from '@cairn/types';

export type Screen = 'week' | 'tracks';

/** Etapa do funil construir → mostrar → visibilidade (spec §4/§7). */
export const STAGE_META: Record<TaskStage, { label: string; hue: number; glyph: string }> = {
  build: { label: 'construir', hue: 250, glyph: '◷' },
  show: { label: 'mostrar', hue: 150, glyph: '◳' },
  visibility: { label: 'visibilidade', hue: 40, glyph: '◆' },
};

export const STAGE_ORDER: TaskStage[] = ['build', 'show', 'visibility'];

export function stageColor(stage: TaskStage): string {
  return `oklch(0.72 0.13 ${STAGE_META[stage].hue})`;
}

/** 2 → "2h", 1.5 → "1h30", 0.5 → "30min". */
export function formatHours(h: number): string {
  const whole = Math.floor(h);
  const mins = Math.round((h - whole) * 60);
  if (whole && mins) return `${whole}h${String(mins).padStart(2, '0')}`;
  if (whole) return `${whole}h`;
  return `${mins}min`;
}

export function clampPct(value: number, max: number): number {
  if (max <= 0) return 0;
  return Math.max(0, Math.min(100, (value / max) * 100));
}

/** Orçamento de tempo da semana (spec §4): alvo ~6h, teto 7h30. */
export const BUDGET_HOURS = 6;
export const CAP_HOURS = 7.5;

/** startDate ISO (YYYY-MM-DD) → "9 – 15 jun". */
export function weekRange(startDate: string): string {
  const start = new Date(`${startDate}T00:00:00`);
  if (Number.isNaN(start.getTime())) return '';
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  const month = (d: Date) =>
    d.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
  return start.getMonth() === end.getMonth()
    ? `${start.getDate()} – ${end.getDate()} ${month(end)}`
    : `${start.getDate()} ${month(start)} – ${end.getDate()} ${month(end)}`;
}

/** Motivos sugeridos para tarefa não-feita (input do diagnóstico, spec §4). */
export const MOTIVOS = [
  'Faltou tempo na semana',
  'A tarefa estava grande demais',
  'Travei / não soube por onde começar',
  'Imprevisto pessoal',
  'Perdi a motivação',
];

// ── MOCK ─────────────────────────────────────────────────────────────────────
// Trilhas de orquestração. Ainda não vêm da API (entram na Fatia 3). Servem só
// para popular a sidebar e a tela "Trilhas" com o visual oficial.
export interface MockTrack {
  id: string;
  code: string;
  name: string;
  short: string;
  type: 'projeto' | 'cadencia';
  goal: string;
  progress?: number;
  cadence?: string;
  streak?: number;
}

export const MOCK_TRACKS: MockTrack[] = [
  { id: 'portfolio', code: 'PORT', name: 'Projeto de portfólio', short: 'Portfólio', type: 'projeto', goal: 'Publicar o case do Coach (este app)', progress: 0.62 },
  { id: 'github', code: 'GH', name: 'Reformular o GitHub', short: 'GitHub', type: 'projeto', goal: 'Perfil + 3 repositórios apresentáveis', progress: 0.34 },
  { id: 'linkedin', code: 'IN', name: 'LinkedIn', short: 'LinkedIn', type: 'cadencia', goal: '1 publicação por semana', cadence: '1 post / semana', streak: 5 },
  { id: 'curso', code: 'CUR', name: 'Curso do Deschamps', short: 'Curso', type: 'cadencia', goal: 'Avançar 2 aulas por semana', cadence: '2 aulas / semana', streak: 3 },
];
