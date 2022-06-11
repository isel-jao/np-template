/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const {
  readFileSync,
  writeFileSync,
  appendFileSync,
  mkdirSync,
  rmdirSync,
} = require("fs");

function capitilize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

const file = readFileSync(
  "./node_modules/.prisma/client/index.d.ts",
  "utf8"
).replace(/\n/g, "*");

function newRoute(entity, update = false) {
  ////////////////////////////// get Dto class //////////////////////////////

  const knownTypes = [
    "string",
    "number",
    "boolean",
    "Date",
    "DateTime",
    "Time",
  ];
  let entityDto;
  try {
    entityDto = file
      .match(`(?<=(export type ${capitilize(entity)} = {[*])).+?(?=[*]})`)[0]
      .split(`*`)
      .map((x) => x.split(":").map((y) => y.split("|")[0].trim()))
      .filter((x) => knownTypes.includes(x[1]) && x[0]);
  } catch (e) {
    console.log(`${entity} not found in index.d.ts`);
    process.exit(1);
  }

  const upSertEntity = entityDto.filter(
    (x) => !["id", "createdAt", "updatedAt", "deletedAt"].includes(x[0])
  );

  entityDto = entityDto.filter((x) => x[0] !== "password");

  ///////////////////////// create the route folder /////////////////////////
  try {
    if (update) rmdirSync(`./src/${entity}`, { recursive: true });
    mkdirSync(`./src/${entity}`);
  } catch (e) {
    console.log(`${entity} route already exists`);
    return;
  }

  // create the route controller
  const entityController = readFileSync("./sample/controller", "utf8")
    .replace(/sample/g, entity)
    .replace(/Sample/g, capitilize(entity));
  writeFileSync(`./src/${entity}/${entity}.controller.ts`, entityController);

  // create the route service
  const entityService = readFileSync("./sample/service", "utf8")
    .replace(/sample/g, entity)
    .replace(/Sample/g, capitilize(entity));
  writeFileSync(`./src/${entity}/${entity}.service.ts`, entityService);

  if (!update) {
    // create the route module
    const entityModule = readFileSync("./sample/module", "utf8")
      .replace(/sample/g, entity)
      .replace(/Sample/g, capitilize(entity));
    writeFileSync(`./src/${entity}/${entity}.module.ts`, entityModule);
    /////////////////////////// update the app module ///////////////////////////
    const appModule = readFileSync("./src/app.module.ts", "utf8").replace(
      /(?<=(imports *: *))\[/,
      `\[${capitilize(entity)}Module, `
    );
    writeFileSync(
      "./src/app.module.ts",
      `import { ${capitilize(
        entity
      )}Module } from './${entity}/${entity}.module';\n`
    );
    appendFileSync("./src/app.module.ts", appModule);
  }

  ////////////////////////////// create Dto files //////////////////////////////
  const entityFile = `./src/${entity}/${entity}.entities.ts`;

  const addValidation = (x) => {
    if (x[0] === "name") appendFileSync(entityFile, `  @MinLength(2)\n`);
    else if (x[0] === "email") appendFileSync(entityFile, `  @IsEmail()\n`);
    else if (x[0] === "password")
      appendFileSync(entityFile, `  @IsPassword()\n`);
    else if (x[0] === "phone")
      appendFileSync(entityFile, `  @IsPhoneNumber()\n`);
    else if (x[1] === "Date") appendFileSync(entityFile, `  @IsDateString()\n`);
    else if (x[1] === "number") appendFileSync(entityFile, `  @IsInt()\n`);
    else if (x[1] === "boolean") appendFileSync(entityFile, `  @IsBoolean()\n`);
    else if (x[1] === "string") appendFileSync(entityFile, `  @MinLength(2)\n`);
  };
  entity = capitilize(entity);
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
    "import { IsDateString, IsBoolean, IsEmail, IsInt, MinLength } from 'class-validator'\n"
  );
  appendFileSync(
    entityFile,
    "import { IsPassword, IsPhoneNumber } from 'src/utils';\n\n"
  );

  // create the entity dto class
  appendFileSync(entityFile, `export class ${entity} {\n`);
  entityDto.forEach((x) => {
    appendFileSync(entityFile, `  @ApiProperty({ required: false })\n`);
    appendFileSync(entityFile, `  ${x[0]}: ${x[1]};\n`);
  });
  appendFileSync(entityFile, "}\n\n");

  // create the entity create dto class
  appendFileSync(entityFile, `export class Create${entity}Dto {\n`);
  upSertEntity.forEach((x) => {
    appendFileSync(entityFile, `  @ApiProperty({ required: true })\n`);
    addValidation(x);
    appendFileSync(entityFile, `  ${x[0]}: ${x[1]};\n`);
  });
  appendFileSync(entityFile, "}\n\n");

  // create the entity update dto class
  appendFileSync(entityFile, `export class Update${entity}Dto {\n`);
  upSertEntity.forEach((x) => {
    appendFileSync(entityFile, `  @ApiProperty({ required: false })\n`);
    addValidation(x);
    appendFileSync(entityFile, `  ${x[0]}: ${x[1]};\n`);
  });
  appendFileSync(entityFile, "}\n");
}

if (process.argv.length < 3) {
  console.log("Usage:");
  console.log('\t"node newRoute.js <route>"\tto create a new route');
  console.log('or\t"node newRoute.js all\t\tto create all routes');
  process.exit(1);
}

if (process.argv[2] == "all") {
  const {
    readFileSync,
    writeFileSync,
    appendFileSync,
    mkdirSync,
    rmdirSync,
  } = require("fs");

  const schema = readFileSync("./prisma/schema.prisma", "utf8").replace(
    /\n/g,
    ""
  );

  const models = schema
    .match(/(?<=(model *))\w+?(?=( *{ *id))/g)
    .map((x) => x.charAt(0).toLowerCase() + x.slice(1));

  console.log(models);

  models.forEach((model) => {
    newRoute(model);
  });
} else {
  newRoute(process.argv[2]);
}
