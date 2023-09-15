import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { ConvertQueries } from '@/utils';
import { CreateGroupDto, UpdateGroupDto } from './entities';

@Injectable()
export class GroupService {
  constructor(private prisma: PrismaService) {}

  @ConvertQueries()
  async findAll(options?: any) {
    const [totalResult, results] = await Promise.all([
      this.prisma.group.count({ where: options.where }),
      this.prisma.group.findMany(options),
    ]);
    return { totalResult, results };
  }

  @ConvertQueries()
  async findOne(id: number, query?: any) {
    return await this.prisma.group.findUnique({ where: { id: id }, ...query });
  }

  async remove(id: number) {
    return await this.prisma.group.delete({ where: { id: id } });
  }

  async create(data: CreateGroupDto) {
    return await this.prisma.group.create({ data });
  }

  async update(id: number, data: UpdateGroupDto) {
    return await this.prisma.group.update({ where: { id: id }, data });
  }
}
