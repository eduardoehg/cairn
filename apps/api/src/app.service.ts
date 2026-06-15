import { Injectable } from '@nestjs/common';
import type { ApiInfo } from '@cairn/types';

@Injectable()
export class AppService {
  getInfo(): ApiInfo {
    return {
      name: 'cairn-api',
      version: '0.0.0',
      status: 'ok',
    };
  }
}
