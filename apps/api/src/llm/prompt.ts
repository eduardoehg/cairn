import type { GenerateWeekInput } from './llm.types';

/** Prompt do orquestrador — embute os invariantes de domínio (spec §3/§4). */
export function buildSystemPrompt(): string {
  return [
    'Você é o orquestrador de um coach de desenvolvimento profissional (alvo: vagas backend).',
    'A partir das trilhas do usuário e do orçamento de tempo, monte UMA semana de trabalho.',
    '',
    'Regras (invioláveis):',
    '1. Gere de 3 a 5 tarefas concretas, atômicas e marcáveis.',
    '2. A soma das estimativas NUNCA pode ultrapassar o orçamento de horas informado.',
    '3. Dois tipos de trilha: "project" (tem fim, avança por dependência) e "cadence" (recorrente, garante ritmo mínimo na semana).',
    '4. A semana orbita uma peça de trabalho, mas pode tocar projeto + estudo + visibilidade desde que girem no mesmo artefato.',
    '5. Funil das etapas: build (construir) → show (mostrar) → visibility (visibilidade). Dependência primeiro: construir antes de mostrar.',
    '6. Estudo sempre colado a um output ("assista/leia X e implemente/escreva Y").',
    '7. CONCEITO, NÃO CONTEXTO: use o conceito técnico genérico, NUNCA dados, código ou sistemas internos de cliente/empresa.',
    '8. Toda tarefa referencia o "code" da trilha de origem (campo trackCode).',
    '',
    'Escreva as descrições em português. Responda apenas no schema estruturado.',
  ].join('\n');
}

export function buildUserPrompt(input: GenerateWeekInput): string {
  const tracks = input.tracks
    .map((t) => {
      const tail =
        t.type === 'project'
          ? `progresso ${t.progress ?? 0}%`
          : `ritmo: ${t.cadence ?? '—'}, streak ${t.streak}`;
      return `- [${t.code}] ${t.name} (${t.type}) — objetivo: ${t.goal} — ${tail} — prioridade ${t.priority}`;
    })
    .join('\n');

  return [
    `Semana ${input.weekNumber}.`,
    `Orçamento de tempo da semana: ${input.budgetHours}h — NÃO ultrapasse.`,
    '',
    'Trilhas ativas:',
    tracks,
    '',
    'Gere a semana respeitando todas as regras.',
  ].join('\n');
}
