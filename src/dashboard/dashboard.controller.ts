import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { DashboardService } from './dashboard.service';
import { AuthGuard } from '@nestjs/passport';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('dashboard')
@UseGuards(AuthGuard('jwt'))
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get()
  async getDashboardData(@CurrentUser('id') id: string) {
    const data = await this.service.getData(id);

    return {
      message: 'Sucesso',
      data,
    };
  }
}
