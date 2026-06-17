import { IsIn, IsOptional } from 'class-validator';

// Inclui 'mock' (stub de dev/teste sem chave) além dos provedores reais.
const PROVIDERS = ['claude', 'openai', 'gemini', 'mock'] as const;

export class GenerateWeekDto {
  @IsOptional()
  @IsIn(PROVIDERS)
  provider?: (typeof PROVIDERS)[number];
}
