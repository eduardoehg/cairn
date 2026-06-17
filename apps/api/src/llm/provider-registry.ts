import { BadRequestException, Injectable } from '@nestjs/common';
import type { LlmProvider } from './llm.types';
import { ClaudeProvider } from './claude.provider';
import { MockProvider } from './mock.provider';

@Injectable()
export class ProviderRegistry {
  private readonly providers: Map<string, LlmProvider>;

  constructor(claude: ClaudeProvider, mock: MockProvider) {
    this.providers = new Map<string, LlmProvider>([
      [claude.name, claude],
      [mock.name, mock],
    ]);
  }

  get(name: string): LlmProvider {
    const provider = this.providers.get(name);
    if (!provider) {
      throw new BadRequestException(`Provedor de IA desconhecido: ${name}`);
    }
    return provider;
  }
}
