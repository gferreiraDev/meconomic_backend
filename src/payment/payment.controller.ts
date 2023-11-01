import { Controller, Get, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@Controller('payment')
@UseGuards(AuthGuard('jwt'))
export class PaymentController {
  constructor(private readonly service: PaymentService) {}

  @Get()
  async listPayments(@CurrentUser('id') userId: string) {
    const lastPayments = await this.service.listPayments(userId, {});

    return {
      message: 'Pesquisa realizada com sucesso',
      data: lastPayments,
    };
  }
}
