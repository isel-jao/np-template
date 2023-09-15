import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { ConvertQueries } from '@/utils';
import { CreatePostDto, UpdatePostDto } from './entities';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  @ConvertQueries()
  async findAll(options?: any) {
    const [totalResult, results] = await Promise.all([
      this.prisma.post.count({ where: options.where }),
      this.prisma.post.findMany(options),
    ]);
    return { totalResult, results };
  }

  @ConvertQueries()
  async findOne(id: number, query?: any) {
    return await this.prisma.post.findUnique({ where: { id: id }, ...query });
  }

  async remove(id: number) {
    return await this.prisma.post.delete({ where: { id: id } });
  }

  async create(data: CreatePostDto) {
    return await this.prisma.post.create({ data });
  }

  async update(id: number, data: UpdatePostDto) {
    return await this.prisma.post.update({ where: { id: id }, data });
  }
}
