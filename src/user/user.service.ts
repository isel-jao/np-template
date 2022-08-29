import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FindAllOptions, HandleRequestErrors } from 'src/utils';
import { CreateUserDto, UpdateUserDto } from './entities';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  @FindAllOptions({})
  @HandleRequestErrors()
  async findAll(options?: any) {
    const totalResult = await this.prisma.user.count({
      where: options.where,
    });
    const results = await this.prisma.user.findMany(options);
    return { totalResult, results };
  }

  @HandleRequestErrors()
  async findOne(id: number, query?: any) {
    return await this.prisma.user.findUnique({ where: { id }, ...query });
  }

  @HandleRequestErrors()
  async create(data: CreateUserDto) {
    return await this.prisma.user.create({ data });
  }

  @HandleRequestErrors()
  async update(id: number, data: UpdateUserDto) {
    return await this.prisma.user.update({ where: { id }, data });
  }

  @HandleRequestErrors()
  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }
}
