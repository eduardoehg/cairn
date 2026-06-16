import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import type { CurrentWeek } from '@cairn/types';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import type { JwtPayload } from '../auth/jwt-payload';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { WeekService } from './week.service';

// Protegido pelo JwtAuthGuard global (sem @Public).
@Controller('current-week')
export class WeekController {
  constructor(private readonly week: WeekService) {}

  @Get()
  getCurrentWeek(@CurrentUser() user: JwtPayload): Promise<CurrentWeek> {
    return this.week.getCurrentWeek(user.sub);
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
