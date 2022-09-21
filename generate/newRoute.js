const {
  readFileSync,
  writeFileSync,
  appendFileSync,
  mkdirSync,
  rmSync,
  existsSync,
} = require('fs');
const path = require('path');

const config = require('./config.json');
require('./tools');

const generateEntities = require('./generateEntities');

const parseModel = (schema, model) => {
  const modelRegex = new RegExp(
    `(?<=model +${model.capitilize()} +?\{).+?(?=\})`,
    'gm',
  );
  const modelString = schema.match(modelRegex);
  if (!modelString || !modelString.length) {
    throw new Error(`model ${model} not found`);
  }
  const entity = modelString[0]
    .split('*')
    .map((v) => v.trim().split(/[\t ]+/g))
    .filter(
      (val) =>
        Object.keys(config.types).includes(val[1]) ||
        Object.keys(config.types).includes(val[1]?.replace(/\?$/, '')),
    )
    .map((val) => {
      const optionalCase = val[1].replace(/\?$/, '');
      const requiredCase = val[1];
      return config.types[requiredCase]
        ? { name: val[0], ...config.types[requiredCase], required: true }
        : { name: val[0], ...config.types[optionalCase], required: false };
    });

  return entity;
};

const addModelToAppModule = (model) => {
  const appModulePath = path.join(__dirname, '../src/app.module.ts');
  const appModule = readFileSync(appModulePath, 'utf8').replace(
    /(?<=(imports *: *))\[/,
    `\[${model.capitilize()}Module, `,
  );
  // check if model already exists
  const exists = appModule.match(
    `import *?\{ *?${model.capitilize()}Module *?\}`,
    'g',
  );
  if (exists) return;
  console.log(`adding ${model.capitilize()}Module to app.module.ts`);
  writeFileSync(
    appModulePath,
    `import { ${model.capitilize()}Module } from './${model.toLowerCase()}/${model.toLowerCase()}.module';\n`,
  );
  appendFileSync('./src/app.module.ts', appModule);
};

const generateModel = (model) => {
  const modelPath = path.join(__dirname, `../src/${model.toLowerCase()}`);
  // const exist = existsSync(modelPath);

  // create the route service
  const modelService = readFileSync(
    path.join(__dirname, './sample/service'),
    'utf8',
  )
    .replace(/samPle/g, model.revCapitilize())
    .replace(/sample/g, model.toLowerCase())
    .replace(/Sample/g, model.capitilize());
  writeFileSync(`${modelPath}/${model.toLowerCase()}.service.ts`, modelService);

  // create the route controller
  const modelController = readFileSync(
    path.join(__dirname, './sample/controller'),
    'utf8',
  )
    .replace(/samPle/g, model.revCapitilize())
    .replace(/sample/g, model.toLowerCase())
    .replace(/Sample/g, model.capitilize());
  writeFileSync(
    `${modelPath}/${model.toLowerCase()}.controller.ts`,
    modelController,
  );

  // create the route module
  const modelModule = readFileSync(
    path.join(__dirname, './sample/module'),
    'utf8',
  )
    .replace(/samPle/g, model.revCapitilize())
    .replace(/sample/g, model.toLowerCase())
    .replace(/Sample/g, model.capitilize());
  writeFileSync(`${modelPath}/${model.toLowerCase()}.module.ts`, modelModule);
};

const newRoutes = (schema, model, update) => {
  try {
    const modelPath = path.join(__dirname, `../src/${model.toLowerCase()}`);
    const exist = existsSync(modelPath);
    if (!exist) console.log(`genrating ${model} folder`);
    else if (update) console.log(`updating ${model} folder`);
    else {
      console.log(`${model} folder already exists`);
      console.log(`provide --update or -u to update the folder`);
      return;
    }
    if (exist) {
      rmSync(modelPath, { recursive: true });
      console.log(`removing ${model} folder`);
    }
    mkdirSync(modelPath);
    generateModel(model, update);
    addModelToAppModule(model);
    const entity = parseModel(schema.replace(/\n/g, '*'), model);
    generateEntities(entity, model);
  } catch (err) {
    console.log(err);
  }
};
module.exports = newRoutes;
