import 'reflect-metadata';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // CORS: libera as origens de CORS_ORIGINS (lista separada por vírgula).
  // Sem a env (dev local), reflete qualquer origem.
  const corsOrigins = process.env.CORS_ORIGINS?.split(',')
    .map((o) => o.trim())
    .filter(Boolean);
  app.enableCors({ origin: corsOrigins && corsOrigins.length > 0 ? corsOrigins : true });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.API_PORT ?? process.env.PORT ?? 4001;
  await app.listen(port);
  console.log(`[api] cairn running at http://localhost:${port}`);
}

void bootstrap();
