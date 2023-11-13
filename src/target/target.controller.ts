import { TargetService } from './target.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

@Controller('targets')
@UseGuards(AuthGuard('jwt'))
export class TargetController {
  constructor(private readonly service: TargetService) {}

  @Post()
  async createTarget(@CurrentUser('id') userId: string, @Body() body: any) {
    const target = await this.service.createTarget(userId, body);

    if (!target)
      throw new BadRequestException('Erro ao tentar criar o registro');

    return {
      message: 'Registro criado com sucesso',
      data: target,
    };
  }

  @Get()
  async listTargets(@CurrentUser('id') userId: string) {
    const targets = await this.service.listTargets(userId);

    return {
      message: 'Pesquisa realizada com sucesso',
      data: targets,
    };
  }

  @Patch('/:id')
  async updateTarget(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const target = await this.service.updateTarget(userId, id, body);

    if (!target)
      throw new BadRequestException('Erro ao tentar atualizar o registro');

    return {
      message: 'Registro atualizado com sucesso',
      data: target,
    };
  }

  @Delete('/:id')
  async deletePurchase(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const target = await this.service.deleteTarget(userId, id);

    if (!target) throw new BadRequestException('Registro não enontrado');

    return {
      message: 'Registro removido com sucesso',
    };
  }
}
