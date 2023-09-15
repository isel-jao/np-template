import config from '../utils/config';
import { ModelType } from '../utils/types';

export function genarateEntities(model: ModelType, enums: string[]) {
  const usedValidations = new Set<string>();
  const usedEnums = new Set<string>();
  let hasOptional: boolean = false;
  const isFormData = Object.values(model.attributes).some(
    (attr) => attr.isFile,
  );
  const name = model.name;
  let imports = `import { ApiProperty, OmitType } from '@nestjs/swagger';
  import { PartialType } from '@nestjs/swagger';`;

  // model class
  let entities = `export class ${name}Dto {\n`;
  if (model.id) {
    entities += '@ApiProperty({ required: false })\n';
    entities += `${model.id.name}: ${config.types[model.id.type].type};\n`;
  }
  for (const [name, attr] of Object.entries(model.attributes)) {
    let type = config.types[attr.type]?.type;
    if (attr.isEnum) type = enums.find((e) => e === attr.type) ?? type;
    if (!type) continue;
    const { isRequired, isFile, validations, isEnum } = attr;
    entities += `@ApiProperty({ required: ${JSON.stringify(isRequired)} ${
      isEnum ? `, type: 'enum', enum: ${type}` : ''
    }})\n`;
    if (['createdAt', 'updatedAt'].includes(name) || isFile) {
      entities += `${name}: ${type};\n`;
      continue;
    }

    if (isFormData && type !== 'string' && !isEnum)
      entities += `@Transform(({ value }) => safeParse(value ))\n`;

    const combinedValidations = validations.length
      ? validations
      : config.types[attr.type]?.validations ?? [];
    if (isEnum) {
      usedEnums.add(attr.type);
      combinedValidations.push(`IsEnum(${attr.type})`);
    }
    for (const v of combinedValidations)
      usedValidations.add(v.replace(/^@|\(.*\)$/g, ''));

    entities += combinedValidations.map((v) => `@${v}\n`).join('');

    if (!isRequired) {
      entities += `@IsOptional()\n`;
      hasOptional = true;
    }
    console.log({ name, type });

    entities += `${name}: ${type};\n`;
  }
  entities += '}\n\n';

  entities += `export class Create${name}Dto extends OmitType(${name}Dto, [
    '${model.id?.name}',
    ${model.attributes.createdAt ? "'createdAt'," : ''}
    ${model.attributes.updatedAt ? "'updatedAt'," : ''}
  ]) {}`;

  entities += `export class Update${name}Dto extends PartialType(Create${name}Dto) {}\n`;

  imports += `import { ${hasOptional ? 'IsOptional,' : ''} ${[
    ...usedValidations,
  ].join(', ')} } from '@/utils/validations';\n`;
  if (usedEnums.size)
    imports += `import { ${[...usedEnums].join(
      ', ',
    )} } from '@prisma/client';\n`;
  if (isFormData) {
    imports += `import { safeParse } from '@/utils/';\n`;
    imports += `import { Transform } from 'class-transformer';\n`;
  }

  return imports + '\n' + entities;
}
