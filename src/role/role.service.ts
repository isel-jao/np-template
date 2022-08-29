import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { FindAllOptions, HandleRequestErrors } from 'src/utils';
import { CreateRoleDto, UpdateRoleDto } from './entities';

@Injectable()
export class RoleService {
  constructor(private prisma: PrismaService) { }

  @FindAllOptions({})
  @HandleRequestErrors()
  async findAll(options?: any) {
    const totalResult = await this.prisma.role.count({
      where: options.where,
    });
    const results = await this.prisma.role.findMany(options);
    return { totalResult, results };
  }

  @HandleRequestErrors()
  async findOne(id: number, query?: any) {
    return await this.prisma.role.findUnique({ where: { id }, ...query });
  }

  @HandleRequestErrors()
  async create(data: CreateRoleDto) {
    return await this.prisma.role.create({ data });
  }

  @HandleRequestErrors()
  async update(id: number, data: UpdateRoleDto) {
    return await this.prisma.role.update({ where: { id }, data });
  }

  @HandleRequestErrors()
  async remove(id: number) {
    return await this.prisma.role.delete({ where: { id } });
  }
}
