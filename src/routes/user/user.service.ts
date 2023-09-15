import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { ConvertQueries } from '@/utils';
import { CreateUserDto, UpdateUserDto } from './entities';
import { DeleteManyDto } from '@/utils/types';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  @ConvertQueries()
  async findAll(options?: any) {
    const [totalResult, results] = await Promise.all([
      this.prisma.user.count({ where: options.where }),
      this.prisma.user.findMany(options),
    ]);
    return { totalResult, results };
  }

  @ConvertQueries()
  async findOne(id: number, query?: any) {
    return await this.prisma.user.findUnique({ where: { id: id }, ...query });
  }

  async remove(id: number) {
    return await this.prisma.user.delete({ where: { id: id } });
  }

  async removeMany({ ids }: DeleteManyDto) {
    return await this.prisma.user.deleteMany({
      where: { id: ids && { in: ids } },
    });
  }

  async create({
    posts,
    ...data
  }: CreateUserDto & { avatarUrl: string | undefined }) {
    return await this.prisma.user.create({
      data: {
        ...data,
        posts: posts && { createMany: { data: posts } },
      },
      include: { posts: true },
    });
  }

  async update(
    id: number,
    data: UpdateUserDto & { avatarUrl: string | undefined },
  ) {
    return await this.prisma.user.update({
      where: { id: id },
      data: {
        ...data,
        posts: undefined,
      },
    });
  }
}
