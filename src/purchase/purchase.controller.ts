import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { PurchaseService } from './purchase.service';
import { AuthGuard } from '@nestjs/passport';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';

@Controller('purchases')
@UseGuards(AuthGuard('jwt'))
export class PurchaseController {
  constructor(private readonly service: PurchaseService) {}

  @Get()
  async listPurchases(@CurrentUser('id') userId: string, @Query() query: any) {
    const purchases = await this.service.listPurchases(userId, query);

    if (!purchases)
      throw new BadRequestException('Erro ao tentar listar os registros');

    return {
      message: 'Busca realizada com sucesso',
      data: purchases,
    };
  }

  @Post()
  async addPurchase(@CurrentUser('id') userId: string, @Body() body: any) {
    const purchase = await this.service.createPurchase(userId, body);

    if (!purchase)
      throw new BadRequestException('Erro ao tentar adicionar a compra');

    return {
      message: 'Compra registrada com sucesso',
      data: purchase,
    };
  }

  @Put('/:id')
  async updatePurchase(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const purchase = await this.service.updatePurchase(userId, id, body);

    if (!purchase)
      throw new BadRequestException('Erro ao tentar atualizar registro');

    return {
      message: 'Registro atualizado com sucesso',
      data: purchase,
    };
  }

  @Delete('/:id')
  async deletePurchase(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const purchase = await this.service.deletePurchase(userId, id);

    if (!purchase) throw new BadRequestException('Registro não enontrado');

    return {
      message: 'Registro removido com sucesso',
    };
  }
}
