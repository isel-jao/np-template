const {
  readFileSync,
  writeFileSync,
  appendFileSync,
  mkdirSync,
  rmSync,
  existsSync,
} = require("fs");

String.prototype.capitilize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

const path = require("path");
const config = require("./config.json");

const parseModel = (schema, modelName) => {
  const modelRegex = new RegExp(`(?<=model +${modelName} +?\{).+?(?=\})`, "gm");
  const modelString = schema.match(modelRegex);
  if (!modelString && !modelString.length)
    console.log(`model ${modelName} not found`);
  const entity = modelString[0]
    .split("*")
    .map((v) => v.trim().split(/[\t ]+/g))
    .filter(
      (val) =>
        Object.keys(config.types).includes(val[1]) ||
        Object.keys(config.types).includes(val[1]?.replace(/\?$/, ""))
    )
    .map((val) => {
      const optionalCase = val[1].replace(/\?$/, "");
      const requiredCase = val[1];
      return config.types[requiredCase]
        ? { name: val[0], ...config.types[requiredCase], required: true }
        : { name: val[0], ...config.types[optionalCase], required: false };
    });

  return entity;
};

const getEntities = (entity, modelName) => {
  let entityDto = `export class ${modelName} {\n`;
  entity.forEach((x) => {
    entityDto += `  @ApiProperty({ required: false })\n`;
    if (x.validations) {
      entityDto += x.validations.map((validition) => `  ${validition}\n`);
    }
    entityDto += `  ${x.name}: ${x.type};\n`;
  });
  entityDto += "}\n\n";

  let createEntityDto = `export class Create${modelName}Dto {\n`;
  entity
    .filter((x) => !["id", "createdAt", "updatedAt"].includes(x.name))
    .forEach((x) => {
      createEntityDto += `  @ApiProperty({ required: ${x.required} })\n`;
      if (x.validations) {
        createEntityDto += x.validations.map(
          (validition) => `  ${validition}\n`
        );
        if (!x.required) createEntityDto += `  @IsOptional()\n`;
      }
      createEntityDto += `  ${x.name}: ${x.type};\n`;
    });
  createEntityDto += "}\n\n";

  let updateEntityDto = `export class Update${modelName}Dto {\n`;
  entity
    .filter((x) => !["id", "createdAt", "updatedAt"].includes(x.name))
    .forEach((x) => {
      updateEntityDto += `  @ApiProperty({ required: false })\n`;
      if (x.validations) {
        updateEntityDto += x.validations.map(
          (validition) => `  ${validition}\n`
        );
        updateEntityDto += `  @IsOptional()\n`;
      }
      updateEntityDto += `  ${x.name}: ${x.type};\n`;
    });
  updateEntityDto += "}\n\n";

  const entityFile = path.join(
    __dirname,
    `../src/${modelName.toLowerCase()}/entities.ts`
  );
  console.log(`creating ${modelName.toLowerCase()}.entities.ts`, entityFile);
  writeFileSync(
    entityFile,
    "/* eslint-disable @typescript-eslint/no-unused-vars */\n"
  );

  writeFileSync(
    entityFile,
    "/* eslint-disable @typescript-eslint/no-unused-vars */\n"
  );
  appendFileSync(
    entityFile,
    "import { ApiProperty } from '@nestjs/swagger';\n"
  );
  appendFileSync(
    entityFile,
    "import { IsDateString, IsBoolean, IsEmail, IsInt, MinLength, IsString, IsOptional } from 'class-validator'\n"
  );
  appendFileSync(
    entityFile,
    "import { IsPassword, IsPhoneNumber } from 'src/utils';\n\n"
  );

  appendFileSync(entityFile, entityDto);
  appendFileSync(entityFile, createEntityDto);
  appendFileSync(entityFile, updateEntityDto);
};

const addModelToAppModule = (modelName) => {
  const model = modelName.toLowerCase();
  const appModulePath = path.join(__dirname, "../src/app.module.ts");
  const appModule = readFileSync(appModulePath, "utf8").replace(
    /(?<=(imports *: *))\[/,
    `\[${model.capitilize()}Module, `
  );
  // check if model already exists
  const exists = appModule.match(
    `import *?\{ *?${model.capitilize()}Module *?\}`,
    "g"
  );
  if (exists) return;
  console.log(`adding ${model.capitilize()}Module to app.module.ts`);
  writeFileSync(
    appModulePath,
    `import { ${model.capitilize()}Module } from './${model}/${model}.module';\n`
  );
  appendFileSync("./src/app.module.ts", appModule);
};

const generateModel = (modelName, update) => {
  const model = modelName.toLowerCase();
  const modelPath = path.join(__dirname, `../src/${model}`);
  const exist = existsSync(modelPath);

  if (!exist) console.log(`genrating ${model} folder`);
  else if (update) console.log(`updating ${model} folder`);
  else {
    console.log(`${model} folder already exists`);
    return;
  }
  if (exist) {
    rmSync(modelPath, { recursive: true });
    console.log(`removing ${model} folder`);
  }
  mkdirSync(`./src/${model}`);

  // create the route service
  const modelService = readFileSync(
    path.join(__dirname, "./sample/service"),
    "utf8"
  )
    .replace(/sample/g, model)
    .replace(/Sample/g, model.capitilize());
  writeFileSync(`./src/${model}/${model}.service.ts`, modelService);

  // create the route controller
  const modelController = readFileSync(
    path.join(__dirname, "./sample/controller"),
    "utf8"
  )
    .replace(/sample/g, model)
    .replace(/Sample/g, model.capitilize());
  writeFileSync(
    `${modelPath}/${model.toLowerCase()}.controller.ts`,
    modelController
  );

  // create the route module
  const modelModule = readFileSync(
    path.join(__dirname, "./sample/module"),
    "utf8"
  )
    .replace(/sample/g, model)
    .replace(/Sample/g, model.capitilize());
  writeFileSync(`${modelPath}/${model.toLowerCase()}.module.ts`, modelModule);
};

const newRoutes = (schema, model, update) => {
  generateModel(model, update);
  addModelToAppModule(model);
  const entity = parseModel(schema.replace(/\n/g, "*"), model);
  getEntities(entity, model);
};
module.exports = newRoutes;

// X(?=Y)	lookahead	,(?<=Y)X lookbehind,
//  X(?!Y)	Negative lookahead, (?<!Y)X	Negative lookbehi
