import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private userService: UserService, private jwt: JwtService) {}

  async validate(email: string, password: string): Promise<any> {
    const user = await this.userService.find({ email });

    if (!user) return null;

    const { password: hash, ...rest } = user;
    if (!bcrypt.compareSync(password, hash)) return null;

    return { user: rest, access_token: this.jwt.sign({ sub: rest.id }) };
  }

  register(data: any): Promise<User | null> {
    const { confirmPassword, acceptTerms, ...userData } = data;

    if (confirmPassword !== data.password || !acceptTerms) return null;

    return this.userService.create(userData);
  }

  async updatePassword(user: User, data: any): Promise<User | null> {
    if (!bcrypt.compareSync(data.currentPassword, user.password)) return null;

    const hash: string = bcrypt.hashSync(data.password, 10);

    const userData = await this.userService.update(user.id, {
      password: hash,
    });

    delete userData.password;
    delete userData.isValidated;

    return userData;
  }
}
