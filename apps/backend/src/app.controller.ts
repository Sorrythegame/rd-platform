import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  // 健康检查接口，返回一段 JSON 数据验证运行状态
  @Get('api/health')
  getHealth(): Record<string, string> {
    return {
      status: 'ok',
      message: '后端服务运行正常'
    };
  }
}
