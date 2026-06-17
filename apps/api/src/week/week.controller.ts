import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import type { CurrentWeek } from '@cairn/types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload';
import { GenerateWeekDto } from './dto/generate-week.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { WeekGenerationService } from './week-generation.service';
import { WeekService } from './week.service';

// Protegido pelo JwtAuthGuard global (sem @Public).
@Controller('current-week')
export class WeekController {
  constructor(
    private readonly week: WeekService,
    private readonly weekGen: WeekGenerationService,
  ) {}

  @Get()
  getCurrentWeek(@CurrentUser() user: JwtPayload): Promise<CurrentWeek> {
    return this.week.getCurrentWeek(user.sub);
  }

  @Post('generate')
  generate(@CurrentUser() user: JwtPayload, @Body() dto: GenerateWeekDto): Promise<CurrentWeek> {
    return this.weekGen.generate(user.sub, dto.provider ?? 'claude');
  }

  @Patch('tasks/:taskId')
  updateTask(
    @CurrentUser() user: JwtPayload,
    @Param('taskId') taskId: string,
    @Body() dto: UpdateTaskStatusDto,
  ): Promise<CurrentWeek> {
    return this.week.updateTaskStatus(user.sub, taskId, dto.status, dto.incompleteReason ?? null);
  }
}
