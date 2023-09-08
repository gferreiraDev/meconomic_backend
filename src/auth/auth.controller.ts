import {
  BadRequestException,
  Body,
  Controller,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { CurrentUser } from './decorator/current-user.decorator';
import { User } from '@prisma/client';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('/signin')
  signin(@Req() request: Request) {
    const data = request.user;

    console.log('User login', data);

    return {
      message: 'Login realizado com sucesso',
      data,
    };
  }

  @Post('/signup')
  async signup(@Body() body: any) {
    const user = await this.service.register(body);

    if (!user) throw new BadRequestException('Usuário já cadastrado');

    return {
      message: 'Cadastro realizado com sucesso',
    };
  }

  @Post('/forgot-password')
  async forgotPassword(@Body() body: any) {
    await this.service.forgotPassword(body);

    return {
      message: 'Link de recuperação enviado com sucesso',
    };
  }

  @Patch('/update-password')
  async updatePassword(@CurrentUser() user: User, @Body() body: any) {
    const data = await this.service.updatePassword(user, body);

    if (!data) throw new BadRequestException('Usuário já cadastrado');

    return {
      message: 'Senha atualizada com sucesso',
      data,
    };
  }

  @Patch('/reset-password')
  async resetPassword(@Body() body: any) {
    const user = await this.service.resetPassword(body);

    if (!user) throw new BadRequestException('Código inválido ou expirado');

    return {
      message: 'Senha atualizada com sucesso',
    };
  }
}
