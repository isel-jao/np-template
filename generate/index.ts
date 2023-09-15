import { readFileSync } from 'fs';
import { join } from 'path';
import config from './utils/config';
import { parseSchema } from './src/parse';
import { generateRoute } from './src/route';

const filePath = join(__dirname, config.schema);

const schema = readFileSync(filePath, 'utf-8');

const { models, enums } = parseSchema(schema);

console.log({
  flags: Object.entries(config.flags)
    .filter(([, v]) => v === true)
    .map(([k]) => k as keyof typeof config.flags),
  models: models.map((m) => m.name),
  targets: config.targetModels,
});

const targetModels = config.targetModels;

if (config.flags.all) {
  for (const model of models) {
    generateRoute(model, enums);
  }
} else {
  // check of target models exist in schema
  const invalidModels = targetModels.filter(
    (m) => !models.some((model) => model.name === m),
  );

  if (invalidModels.length) {
    console.log(
      `Invalid models: ${invalidModels.join(
        ', ',
      )}\nThese models don't exist in schema`,
    );
    process.exit(1);
  }

  for (const model of models) {
    if (targetModels.includes(model.name)) {
      generateRoute(model, enums);
    }
  }
}
