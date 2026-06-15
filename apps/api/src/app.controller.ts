import { Controller, Get } from '@nestjs/common';
import type { ApiInfo } from '@cairn/types';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): ApiInfo {
    return this.appService.getInfo();
  }
}
