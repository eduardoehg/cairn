import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.enableCors();

  const port = process.env.API_PORT ?? process.env.PORT ?? 4001;
  await app.listen(port);
  console.log(`[api] cairn rodando em http://localhost:${port}`);
}

void bootstrap();
