/**
 * Contratos compartilhados entre apps/api (NestJS) e apps/web (Next).
 * Regra do projeto: tipos de contrato vivem aqui, nunca duplicados.
 */

/** Tipo de trilha — distinção central do domínio (ver coach-spec.md §3). */
export type TipoTrilha = 'projeto' | 'cadencia';

/** Resposta do health-check da API. Primeiro contrato que cruza back/front. */
export interface ApiInfo {
  name: string;
  version: string;
  status: 'ok';
}
