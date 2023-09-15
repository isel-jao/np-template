import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma.service';
import { ConvertQueries } from '@/utils';
import { CreateTestTestDto, UpdateTestTestDto } from './entities';

@Injectable()
export class TestTestService {
  constructor(private prisma: PrismaService) {}

  @ConvertQueries()
  async findAll(options?: any) {
    const [totalResult, results] = await Promise.all([
      this.prisma.testTest.count({ where: options.where }),
      this.prisma.testTest.findMany(options),
    ]);
    return { totalResult, results };
  }

  @ConvertQueries()
  async findOne(id: string, query?: any) {
    return await this.prisma.testTest.findUnique({
      where: { testId: id },
      ...query,
    });
  }

  async remove(id: string) {
    return await this.prisma.testTest.delete({ where: { testId: id } });
  }

  async create(data: CreateTestTestDto) {
    return await this.prisma.testTest.create({ data });
  }

  async update(id: string, data: UpdateTestTestDto) {
    return await this.prisma.testTest.update({ where: { testId: id }, data });
  }
}
