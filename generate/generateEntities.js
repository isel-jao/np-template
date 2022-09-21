const { writeFileSync, appendFileSync } = require('fs');
const path = require('path');

require('./tools');
const config = require('./config.json');

const generateEntities = (entity, model) => {
  // generate the entity dto
  let entityDto = `export class ${model.capitilize()} {\n`;
  entity.forEach((x) => {
    entityDto += `  @ApiProperty({ required: false })\n`;
    entityDto += `  ${x.name}: ${x.type};\n`;
  });
  entityDto += '}\n\n';

  // generate create entity dto
  let createEntityDto = `export class Create${model.capitilize()}Dto {\n`;
  entity
    .filter((x) => !['id', 'createdAt', 'updatedAt'].includes(x.name))
    .forEach((x) => {
      createEntityDto += `  @ApiProperty({ required: ${x.required} })\n`;
      if (x.validations) {
        createEntityDto += x.validations
          .map((validition) => `  @${validition}\n`)
          .join('');
        if (!x.required) createEntityDto += `  @IsOptional()\n`;
      }
      createEntityDto += `  ${x.name}: ${x.type};\n`;
    });
  createEntityDto += '}\n\n';

  // generate update entity dto
  let updateEntityDto = `export class Update${model.capitilize()}Dto {\n`;
  entity
    .filter((x) => !['id', 'createdAt', 'updatedAt'].includes(x.name))
    .forEach((x) => {
      updateEntityDto += `  @ApiProperty({ required: false })\n`;
      if (x.validations) {
        updateEntityDto += x.validations
          .map((validition) => `  @${validition}\n`)
          .join('');
        updateEntityDto += `  @IsOptional()\n`;
      }
      updateEntityDto += `  ${x.name}: ${x.type};\n`;
    });
  updateEntityDto += '}\n\n';

  const entityFile = path.join(
    __dirname,
    `../src/${model.toLowerCase()}/entities.ts`,
  );
  console.log(`creating ${model.toLowerCase()}.entities.ts`, entityFile);
  writeFileSync(
    entityFile,
    '/* eslint-disable @typescript-eslint/no-unused-vars */\n',
  );

  writeFileSync(
    entityFile,
    '/* eslint-disable @typescript-eslint/no-unused-vars */\n',
  );
  appendFileSync(
    entityFile,
    "import { ApiProperty } from '@nestjs/swagger';\n",
  );
  let usedValidations = entity
    .filter((x) => x.validations && x.validations.length)
    .reduce(
      (acc, v) =>
        acc.concat(
          v.validations.map((single) => single.replace(/($\@|\(.*?\))/g, '')),
        ),
      [],
    );
  usedValidations = [...new Set(usedValidations)];
  console.log('usedValidations', usedValidations);

  if (usedValidations.length) {
    appendFileSync(
      entityFile,
      `import { ${usedValidations.join(
        ', ',
      )}, IsOptional } from 'class-validator'\n`,
    );
  }
  appendFileSync(
    entityFile,
    "import { IsPassword, IsPhoneNumber } from 'src/utils';\n\n",
  );

  appendFileSync(entityFile, entityDto);
  appendFileSync(entityFile, createEntityDto);
  appendFileSync(entityFile, updateEntityDto);
};

module.exports = generateEntities;
