import { join } from 'node:path';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { dataSourceOptions } from './data-source';
import { UsersModule } from './users/users.module';
import { WeekModule } from './week/week.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      // .env lives at the monorepo root; in prod the vars come from the platform.
      envFilePath: [join(process.cwd(), '../../.env'), '.env'],
    }),
    JwtModule.register({ global: true }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      migrationsRun: process.env.RUN_MIGRATIONS === 'true',
    }),
    UsersModule,
    AuthModule,
    WeekModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    // Global guard: everything is protected by default; public routes use @Public().
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
