import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { DatabaseService } from '../database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(private db: DatabaseService) {}

  async create(data: Prisma.UserCreateInput): Promise<User> {
    const hash: string = bcrypt.hashSync(data.password, 10);

    return this.db.user.create({ data: { ...data, password: hash } });
  }

  async find(query: Prisma.UserWhereUniqueInput): Promise<User | null> {
    try {
      return await this.db.user.findUniqueOrThrow({
        where: query,
      });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async update(id: string, data: Prisma.UserUpdateInput): Promise<User | null> {
    try {
      return this.db.user.update({ data, where: { id } });
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async remove(id: string): Promise<User | null> {
    try {
      return this.db.user.delete({ where: { id } });
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
