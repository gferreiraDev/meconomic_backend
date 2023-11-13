import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { TransactionDto } from './dtos/transaction.dto';
import { TransactionQueryDto } from './dtos/transaction-query.dto';

@Controller('transactions')
@UseGuards(AuthGuard('jwt'))
export class TransactionsController {
  constructor(private readonly service: TransactionsService) {}

  @Post()
  async createTransaction(
    @CurrentUser('id') id: string,
    @Body() body: TransactionDto,
  ) {
    const transaction = await this.service.create(id, body);

    if (!transaction)
      throw new BadRequestException('Erro ao tentar criar registro.');

    return {
      message: 'Registro criado com sucesso',
      data: transaction,
    };
  }

  @Get()
  async listTransactions(
    @CurrentUser('id') userId: string,
    @Query() query: any,
  ) {
    const transactions = await this.service.list(userId, query);

    return {
      message: 'Pesquisa realizada com sucesso',
      data: transactions,
    };
  }

  @Put('/registerPayment')
  async registerPayment(@CurrentUser('id') userId: string, @Body() body: any) {
    const transaction = await this.service.registerPayment(userId, body);

    if (!transaction)
      throw new BadRequestException(
        'Não foi possível registrar o pagamento. Tente novamente mais tarde',
      );

    return {
      message: 'Pagamento registrado com sucesso',
      data: transaction,
    };
  }

  @Put('/:id')
  async updateTransaction(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const transaction = await this.service.update(userId, id, body);

    if (!transaction) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro atualizado com sucesso',
      data: transaction,
    };
  }

  @Delete('/:id')
  async deleteTransaction(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const transaction = await this.service.remove(userId, id);

    if (!transaction) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro excluído com sucesso',
      data: transaction,
    };
  }
}
