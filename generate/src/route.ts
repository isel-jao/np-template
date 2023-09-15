import {
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  mkdirSync,
  rmSync,
} from 'fs';
import { ModelType } from '../utils/types';
import { join } from 'path';
import { generateController } from './controller';
import { genarateEntities } from './entities';
import { generateService } from './service';
import config from '../utils/config';

function rm(path: string) {
  if (existsSync(path)) {
    rmSync(path);
  }
}

export function addModelToAppModule(model: ModelType) {
  const { name } = model;
  const lowerName = name.toLowerCase();
  const appModulePath = join(__dirname, '..', '..', 'src/app.module.ts');
  const appModule = readFileSync(appModulePath, 'utf8').replace(
    /(?<=(imports *: *))\[/,
    `\[${name}Module, `,
  );
  // check if model already exists
  const exists = appModule.match(`import *?\{ *?${name}Module *?\}`);
  if (exists) return;
  console.log(`adding ${name}Module to app.module.ts`);
  writeFileSync(
    appModulePath,
    `import { ${name}Module } from './routes/${lowerName}/${lowerName}.module';\n`,
  );

  appendFileSync('./src/app.module.ts', appModule);
}

const SUCCESS = '✅';

export function generateModel(model: ModelType) {
  const { name } = model;
  const lowerName = name.toLowerCase();
  return `import { Module } from '@nestjs/common';
  import { ${name}Service } from './${lowerName}.service';
  import { ${name}Controller } from './${lowerName}.controller';
  import { PrismaModule } from '@/prisma.module';
  
  @Module({
    imports: [PrismaModule],
    controllers: [${name}Controller],
    providers: [${name}Service],
  })
  export class ${name}Module {}
  `;
}

export function generateRoute(model: ModelType, enums: string[]) {
  const { name } = model;
  console.log(`${name} module`);
  const lowerName = name.toLowerCase();
  const routesPath = join(__dirname, '..', '..', 'src/routes');

  // check if routes folder exists , if not create it
  if (!existsSync(routesPath)) mkdirSync(routesPath);
  const modelPath = join(routesPath, lowerName);
  const exist = existsSync(modelPath);
  const { update, entitiesOnly } = config.flags;

  if (!exist) {
    mkdirSync(modelPath);
    addModelToAppModule(model);
    const modelContent = generateModel(model);
    writeFileSync(join(modelPath, `${lowerName}.module.ts`), modelContent);
  }

  if (exist && !update && !entitiesOnly) {
    console.error(`'${name}' module already exists!`);
    return;
  }

  // generate entities
  rm(join(modelPath, 'entities.ts'));
  const entities = genarateEntities(model, enums);
  writeFileSync(join(modelPath, 'entities.ts'), entities);
  console.log(`Entities ${SUCCESS}`);

  if (!entitiesOnly) {
    {
      rm(join(modelPath, `${lowerName}.controller.ts`));
      const controllerContent = generateController(model);
      writeFileSync(
        join(modelPath, `${lowerName}.controller.ts`),
        controllerContent,
      );
      console.log(`Controller ${SUCCESS}`);
      rm(join(modelPath, `${lowerName}.service.ts`));
      const serviceContent = generateService(model);
      writeFileSync(join(modelPath, `${lowerName}.service.ts`), serviceContent);
      console.log(`Service ${SUCCESS}`);
    }
  }
}
