import { Module } from '@nestjs/common';
import { ClaudeProvider } from './claude.provider';
import { MockProvider } from './mock.provider';
import { ProviderRegistry } from './provider-registry';

@Module({
  providers: [ClaudeProvider, MockProvider, ProviderRegistry],
  exports: [ProviderRegistry],
})
export class LlmModule {}
