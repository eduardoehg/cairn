import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskProgress } from './task-progress.entity';
import { TaskProgressService } from './task-progress.service';
import { WeekController } from './week.controller';
import { WeekService } from './week.service';

@Module({
  imports: [TypeOrmModule.forFeature([TaskProgress])],
  controllers: [WeekController],
  providers: [WeekService, TaskProgressService],
})
export class WeekModule {}
