import { Controller, Get } from '@nestjs/common';
import type { CurrentWeek } from '@cairn/types';
import { WeekService } from './week.service';

// Protected by the global JwtAuthGuard (no @Public).
@Controller('current-week')
export class WeekController {
  constructor(private readonly week: WeekService) {}

  @Get()
  getCurrentWeek(): CurrentWeek {
    return this.week.getCurrentWeek();
  }
}
