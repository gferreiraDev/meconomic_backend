import {
  Body,
  Controller,
  Delete,
  Patch,
  UseGuards,
  NotFoundException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from '../auth/decorator/current-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('user')
export class UserController {
  constructor(private readonly service: UserService) {}

  @Patch()
  async updateUser(@CurrentUser('id') id: string, @Body() body: any) {
    const user = await this.service.update(id, body);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return {
      message: 'Usuário atualizado com sucesso',
      data: user,
    };
  }

  @Delete()
  async deleteUser(@CurrentUser('id') id: string) {
    const user = await this.service.remove(id);

    if (!user) throw new NotFoundException('Usuário não encontrado');

    return {
      message: 'Usuário excluído com sucesso',
    };
  }
}
