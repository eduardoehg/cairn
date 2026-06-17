import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LlmModule } from '../llm/llm.module';
import { TracksModule } from '../tracks/tracks.module';
import { UsersModule } from '../users/users.module';
import { TaskProgress } from './task-progress.entity';
import { TaskProgressService } from './task-progress.service';
import { WeekController } from './week.controller';
import { WeekGenerationService } from './week-generation.service';
import { WeekService } from './week.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskProgress]), LlmModule, TracksModule, UsersModule],
  controllers: [WeekController],
  providers: [WeekService, TaskProgressService, WeekGenerationService],
})
export class WeekModule {}
