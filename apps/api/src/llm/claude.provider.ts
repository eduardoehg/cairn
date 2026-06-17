import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';
import { zodOutputFormat } from '@anthropic-ai/sdk/helpers/zod';
import type { GenerateWeekInput, LlmProvider } from './llm.types';
import { buildSystemPrompt, buildUserPrompt } from './prompt';
import { generatedWeekSchema, type GeneratedWeek } from './week-output.schema';

@Injectable()
export class ClaudeProvider implements LlmProvider {
  readonly name = 'claude';
  private client?: Anthropic;

  constructor(private readonly config: ConfigService) {}

  // Lazy: só exige a chave quando a geração via Claude é de fato pedida.
  private getClient(): Anthropic {
    if (!this.client) {
      this.client = new Anthropic({ apiKey: this.config.getOrThrow<string>('ANTHROPIC_API_KEY') });
    }
    return this.client;
  }

  async generateWeek(input: GenerateWeekInput): Promise<GeneratedWeek> {
    const model = this.config.get<string>('LLM_CLAUDE_MODEL', 'claude-opus-4-8');
    const response = await this.getClient().messages.parse({
      model,
      max_tokens: 16000,
      thinking: { type: 'adaptive' },
      system: buildSystemPrompt(),
      messages: [{ role: 'user', content: buildUserPrompt(input) }],
      output_config: { format: zodOutputFormat(generatedWeekSchema) },
    });

    if (response.stop_reason === 'refusal') {
      throw new Error('O modelo recusou a geração.');
    }
    const parsed = response.parsed_output;
    if (!parsed) {
      throw new Error('A saída do modelo não passou na validação do schema.');
    }
    return parsed;
  }
}
