import { lowercaseFirst } from '../utils';
import config from '../utils/config';
import { ModelType } from '../utils/types';

export function generateService(model: ModelType) {
  const idTyp = config.types[model.id.type].type;
  const idName = model.id.name;
  const { name } = model;
  const lowerName = lowercaseFirst(name);
  const isFormData = Object.values(model.attributes).some(
    (attr) => attr.isFile,
  );
  const [fileName, fileAttr] = Object.entries(model.attributes).find(
    ([, attr]) => attr.isFile,
  ) || [null, null];

  // imports
  let service = `import { Injectable } from '@nestjs/common';
    import { PrismaService } from '@/prisma.service';
    import { ConvertQueries } from '@/utils';
    import { Create${name}Dto, Update${name}Dto } from './entities';
    \n\n`;

  // controller service
  service += `@Injectable()
    export class ${name}Service {
      constructor(private prisma: PrismaService) {}\n\n`;

  // findMany
  service += `@ConvertQueries()
    async findAll(options?: any) {
      const [totalResult, results] = await Promise.all([
        this.prisma.${lowerName}.count({ where: options.where }),
        this.prisma.${lowerName}.findMany(options),
      ]);
      return { totalResult, results };
    }\n\n`;

  // find by id
  service += `@ConvertQueries()
    async findOne(id: ${idTyp}, query?: any) {
      return await this.prisma.${lowerName}.findUnique({ where: {  ${idName}: id}, ...query });
    }\n\n`;

  // delete by id
  service += `async remove(id: ${idTyp}) {
      return await this.prisma.${lowerName}.delete({ where: { ${idName}: id}});
    }\n\n`;

  // create
  if (isFormData) {
    service += `async create(data: Create${name}Dto & { ${fileName}: string ${
      !fileAttr.isRequired ? '| undefined' : ''
    } }) {
        return await this.prisma.${lowerName}.create({ data });
      }\n\n`;
  } else {
    service += `async create(data: Create${name}Dto) {
        return await this.prisma.${lowerName}.create({ data });
      }\n\n`;
  }

  // update
  if (isFormData) {
    service += `async update(id: ${idTyp}, data: Update${name}Dto & { ${fileName}: string | undefined }) {
        return await this.prisma.${lowerName}.update({ where: { ${idName}: id }, data });
      }\n\n`;
  } else {
    service += `async update(id: ${idTyp}, data: Update${name}Dto) {
        return await this.prisma.${lowerName}.update({ where: { ${idName}: id }, data });
      }\n\n`;
  }

  service += '}\n';

  return service;
}
