import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { InvestmentService } from './investment.service';
import { Body, UseGuards } from '@nestjs/common/decorators';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@Controller('investments')
@UseGuards(AuthGuard('jwt'))
export class InvestmentController {
  constructor(private readonly service: InvestmentService) {}

  @Post()
  async addInvestment(@CurrentUser('id') userId: string, @Body() body: any) {
    const data = await this.service.addInvestment(userId, body);

    if (!data)
      throw new BadRequestException('Erro ao tentar registrar o investimento');

    return {
      message: 'Registro incluído com sucesso',
      data,
    };
  }

  @Get()
  async listInvestments(@CurrentUser('id') userId: string) {
    const data = await this.service.listInvestments(userId);

    return {
      message: 'Pesquisa realizada com sucesso',
      data,
    };
  }

  @Patch('/:id')
  async updateInvestment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const data = await this.service.updateInvestment(userId, id, body);

    if (!data) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro atualizado com sucesso',
      data,
    };
  }

  @Delete('/:id')
  async deleteInvestment(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const data = await this.service.deleteInvestment(userId, id);

    if (!data) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro removido com sucesso',
    };
  }
}
