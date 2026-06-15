import { Controller, Get } from '@nestjs/common';
import type { ApiInfo } from '@cairn/types';
import { Public } from './common/decorators/public.decorator';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Public()
  @Get('health')
  getHealth(): ApiInfo {
    return this.appService.getInfo();
  }
}
