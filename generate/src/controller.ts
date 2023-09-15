import config from '../utils/config';
import { ModelType } from '../utils/types';

export function generateController(model: ModelType) {
  const idTyp = config.types[model.id.type].type;
  const { name } = model;
  const lowerName = name.toLowerCase();
  const isFormData = Object.values(model.attributes).some(
    (attr) => attr.isFile,
  );
  const [fileName, fileAttr] = Object.entries(model.attributes).find(
    ([, attr]) => attr.isFile,
  ) || [null, null];

  // imports
  let controller = `import {
      Controller,
      Get,
      Post,
      Body,
      Patch,
      Param,
      Delete,
      Query,
      ${model.id.type === 'Int' ? 'ParseIntPipe,' : ''}
      ${isFormData ? 'UseInterceptors, UploadedFile,ParseFilePipe,' : ''}
    } from '@nestjs/common';
    import { FindAllQuery, FindOneQuery } from '@/utils/types';
    import { ${name}Service } from './${lowerName}.service';
    import { ${name}Dto, Create${name}Dto, Update${name}Dto } from './entities';
    import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';\n`;
  if (isFormData) {
    controller += `import { storage } from '@/utils';
      import { FileInterceptor } from '@nestjs/platform-express';\n`;
  }
  controller += '\n';

  // controller class
  controller += `@ApiTags('${lowerName}')
    @Controller('${lowerName}')
    export class ${name}Controller {
      constructor(private readonly ${lowerName}Service: ${name}Service) {}\n\n`;

  // findMany
  controller += `@ApiOkResponse({ type: [${name}Dto] })
    @Get()
    findAll(@Query() query: FindAllQuery) {
      return this.${lowerName}Service.findAll(query);
    }\n\n`;

  // find by id
  controller += `@ApiOkResponse({ type: ${name}Dto })
    @Get(':id')
    findOne(@Query() query: FindOneQuery, @Param('id'${
      idTyp === 'number' ? ', ParseIntPipe' : ''
    }) id: ${idTyp}) {
      return this.${lowerName}Service.findOne(${
        idTyp === 'number' ? '+' : ''
      }id, query);
    }\n\n`;

  // delete by id
  controller += `@ApiOkResponse({ type: ${name}Dto })
    @Delete(':id')
    remove(@Param('id'${
      idTyp === 'number' ? ', ParseIntPipe' : ''
    }) id: ${idTyp}) {
      return this.${lowerName}Service.remove(${
        idTyp === 'number' ? '+' : ''
      }id);
    }\n\n`;

  // create
  controller += `@ApiCreatedResponse({ type: ${name}Dto })
    @Post()\n`;
  if (isFormData) {
    controller += `@UseInterceptors( FileInterceptor('${fileName}', { storage }))
      async create(
        @UploadedFile( new ParseFilePipe( {fileIsRequired: ${!!fileAttr?.isRequired}}))
        file: Express.Multer.File,
        @Body() data: Create${model.name}Dto,
        ) {
          try {
            return await this.${lowerName}Service.create({
              ...data,
              avatarUrl: file?.filename,
            });
          } catch (e) {
            if (file) {
              storage._removeFile(null, file, () => {});
            }
            throw e;
          }
        }`;
  } else {
    controller += `create(@Body() data: Create${name}Dto) {
        return this.${lowerName}Service.create(data);
      }`;
  }
  controller += '\n\n';

  // update
  controller += `@ApiOkResponse({ type: ${name}Dto })
    @Patch(':id')\n`;
  if (isFormData) {
    controller += `@UseInterceptors( FileInterceptor('${fileName}', { storage }))
      async update(
        @UploadedFile( new ParseFilePipe({ fileIsRequired: false}))
        file: Express.Multer.File,
        @Param('id'${idTyp === 'number' ? ', ParseIntPipe' : ''}) id: ${idTyp},
        @Body() data: Update${model.name}Dto,
        ) {
          try {
            return await this.${lowerName}Service.update(+id, {
              ...data,
              avatarUrl: file?.filename,
            });
          } catch (e) {
            if (file) {
              storage._removeFile(null, file, () => {});
            }
            throw e;
          }
        }`;
  } else {
    controller += `update(@Param('id'${
      idTyp === 'number' ? ', ParseIntPipe' : ''
    }) id: ${idTyp}, @Body() data: Update${name}Dto) {
        return this.${lowerName}Service.update(${
          idTyp === 'number' ? '+' : ''
        }id, data);
      }`;
  }
  controller += '\n\n';

  // controller class end
  controller += '}\n';

  return controller;
}
