import {
  Body,
  Controller,
  Delete,
  Param,
  Patch,
  Post,
  // UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Post()
  async createUser(@Body() body: any) {
    await this.service.create(body);

    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Patch()
  async updateUser(@Body() body: any) {
    const user = await this.service.update('', body);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return {
      message: 'Usuário atualizado com sucesso',
      data: user,
    };
  }

  @Delete('/:id')
  async deleteUser(@Param('id') id: string) {
    const user = await this.service.remove(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return {
      message: 'Usuário excluído com sucesso',
    };
  }
}
