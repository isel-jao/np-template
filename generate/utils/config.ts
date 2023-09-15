import { z } from 'zod';
import configJson from '../config.json';

const flagsMap = {
  update: ['-u', '--update'],
  all: ['-a', '--all'],
  entitiesOnly: ['-e', '--entities'],
};

const args = process.argv.splice(2);

const targetModels = args.filter(
  (v) => !Object.values(flagsMap).flat().includes(v),
);

const flags = Object.fromEntries(
  Object.entries(flagsMap).map(([flag, values]) => {
    return [flag, values.some((v) => args.includes(v))];
  }),
) as {
  [key in keyof typeof flagsMap]: boolean;
};

if (!flags.all && !targetModels.length) {
  console.log('Usage:');
  console.log('\t"node newRoute.js <route>"\t\tto create a new route');
  console.log('or\t"node newRoute.js (--all|-a)\t\tto create all routes\n\n');
  console.log('\t"node newRoute.js (--update|-u) <route>"\tto update a route');
  console.log(
    'or\t"node newRoute.js (--update|-u) (--all|-a)"\tto update all routes',
  );
  process.exit(1);
}

const configSchema = z.object({
  schema: z.string(),
  types: z.record(
    z.object({
      type: z.string(),
      validations: z.array(z.string()),
    }),
  ),
});

const config = {
  ...configSchema.parse(configJson),
  flags,
  targetModels,
};

export default config;
