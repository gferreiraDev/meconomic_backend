import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { InvoiceService } from './invoice.service';
import { AuthGuard } from '@nestjs/passport';
import { QueryInvoiceDto } from './dto/query-invoices.dto';

@Controller('invoices')
@UseGuards(AuthGuard('jwt'))
export class InvoiceController {
  constructor(private readonly service: InvoiceService) {}

  @Get()
  async listInvoiceItems(
    @CurrentUser('id') userId: string,
    @Query() query: QueryInvoiceDto,
  ) {
    const itens = await this.service.listInvoicePurchases(userId, query);

    return {
      message: 'Pesquisa realizada com sucesso',
      data: itens,
    };
  }
}
