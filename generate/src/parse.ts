import { ModelType } from '../utils/types';

// Lookahead X(?=Y) x followed by y
// Lookbehind (?<=Y)X x preceded by y
// Negative lookahead X(?!Y) x not followed by y
// Negative lookbehind (?<!Y)X x not preceded by y

export function parseSchema(schema: string) {
  const lines = schema.split('\n').map((l) => l.trim());
  const models: ModelType[] = [];
  const startModelRegex = /^model\s+(\w+)\s+{/;
  const validationRegex = /^\w+\(.*\)$/;
  const enumRegex = /(?<=^enum\s+)\w+/;
  const enums: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    if (enumRegex.test(lines[i])) {
      enums.push(enumRegex.exec(lines[i])![0]);
    }
  }

  for (let i = 0; i < lines.length; i++) {
    if (startModelRegex.test(lines[i])) {
      const model: ModelType = {
        name: startModelRegex.exec(lines[i])![1],
        attributes: {},
      };
      while (lines[++i] !== '}') {
        const line = lines[i];
        if (!line || line.startsWith('@') || line.startsWith('//')) continue;

        const [main, comments] = line.split('//');
        const [name, type, ...rest] = main.split(/\s+/);
        if (rest.includes('@id')) {
          model.id = { name, type };
          continue;
        }
        const isEnum = enums.includes(type);
        const validations = comments
          ?.split(/\s+/)
          .filter((v) => validationRegex.test(v));

        const isRequired =
          !type.endsWith('?') &&
          !rest.some(
            (v) => v.startsWith('@default') || v.startsWith('@updatedAt'),
          );
        const isFile = !!comments?.split(/\s+/).includes('file');
        model.attributes[name] = {
          isEnum,
          isRequired,
          validations: validations ?? [],
          type: type.replace('?', ''),
          isFile,
        };
      }
      models.push(model);
    }
  }
  return { models, enums };
}
