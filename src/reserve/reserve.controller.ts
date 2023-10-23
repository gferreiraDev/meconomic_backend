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
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/auth/decorator/current-user.decorator';
import { ReserveService } from './reserve.service';
import { ReserveDto } from './dto/reserve.dto';

@Controller('reserves')
@UseGuards(AuthGuard('jwt'))
export class ReserveController {
  constructor(private readonly service: ReserveService) {}
  @Post()
  async create(@CurrentUser('id') userId: string, @Body() body: ReserveDto) {
    const data = await this.service.addReserve(userId, body);

    if (!data)
      throw new BadRequestException('Erro ao tentar incluir o registro');

    return {
      message: 'Registro incluído com sucesso',
      data,
    };
  }

  @Get()
  async list(@CurrentUser('id') userId: string) {
    const data = await this.service.listReserves(userId);

    return {
      message: 'Busca realizada com sucesso',
      data,
    };
  }

  @Patch('/:id')
  async update(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: ReserveDto,
  ) {
    console.log('isString or isNumber', body.amount, typeof body.amount);
    const data = await this.service.updateReserve(userId, id, body);

    if (!data) throw new BadRequestException('Registro não encontrado');

    return {
      message: 'Registro alterado com sucesso',
      data,
    };
  }

  @Delete('/:id')
  async remove(@CurrentUser('id') userId: string, @Param('id') id: string) {
    const data = await this.service.deleteReserve(userId, id);

    if (!data) throw new BadRequestException('Registro não econtrado');

    return {
      message: 'Registro removido com sucesso',
    };
  }
}
