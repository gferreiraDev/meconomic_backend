import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { CardsService } from './cards.service';
import { User } from '@prisma/client';
import { AuthGuard } from '@nestjs/passport';
import { CardDto } from './dtos/Card.dto';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';

@Controller('cards')
@UseGuards(AuthGuard('jwt'))
export class CardsController {
  constructor(private readonly service: CardsService) {}

  @Post()
  async createCard(@CurrentUser() user: User, @Body() body: CardDto) {
    const card = await this.service.create(user, body);

    if (!card) throw new BadRequestException('Erro');

    return {
      message: 'Registro incluído com sucesso',
      data: card,
    };
  }

  @Get()
  async listCards(@CurrentUser('id') userId: string) {
    const cards = await this.service.list(userId);

    return {
      message: 'Pesquisa realizada com sucesso',
      data: cards,
    };
  }

  @Get('/:id')
  async findCard(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const card = await this.service.find(userId, id);

    if (!card) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Pesquisa realizada com sucesso',
      data: card,
    };
  }

  @Put('/:id')
  async updateCard(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const card = await this.service.update(userId, id, body);

    if (!card) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro atualizado com sucesso',
      data: card,
    };
  }

  @Delete('/:id')
  async deleteCard(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const card = await this.service.remove(userId, id);

    if (!card) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro excluído com sucesso',
      data: card,
    };
  }
}
