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
import { StatementsService } from './statements.service';
import { CurrentUser } from '../auth/decorator/current-user.decorator';
import { AuthGuard } from '@nestjs/passport';
import { StatementDto } from './dtos/statement.dto';

@Controller('statements')
@UseGuards(AuthGuard('jwt'))
export class StatementsController {
  constructor(private readonly service: StatementsService) {}

  @Post()
  async createStatement(
    @CurrentUser('id') id: string,
    @Body() body: StatementDto,
  ) {
    const statement = await this.service.create(id, body);

    if (!statement)
      throw new BadRequestException('Erro ao tentar criar registro.');

    return {
      message: 'Registro criado com sucesso',
      data: statement,
    };
  }

  @Get()
  async listStatements(@CurrentUser('id') id: string) {
    const statements = await this.service.list(id);

    return {
      message: 'Pesquisa realizada com sucesso',
      data: statements,
    };
  }

  @Put('/:id')
  async updateStatement(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
    @Body() body: any,
  ) {
    const statement = await this.service.update(userId, id, body);

    if (!statement) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro atualizado com sucesso',
      data: statement,
    };
  }

  @Delete('/:id')
  async deleteStatement(
    @CurrentUser('id') userId: string,
    @Param('id') id: string,
  ) {
    const statement = await this.service.remove(userId, id);

    if (!statement) throw new NotFoundException('Registro não encontrado');

    return {
      message: 'Registro excluído com sucesso',
      data: statement,
    };
  }
}
