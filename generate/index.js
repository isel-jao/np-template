/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable @typescript-eslint/no-unused-vars */
const { readFileSync } = require('fs');
const path = require('path');
const config = require('./config.json');
const newRoute = require('./newRoute');

// // (todo) own module
String.prototype.capitilize = function () {
  return this.charAt(0).toUpperCase() + this.slice(1);
};
String.prototype.revCapitilize = function () {
  return this.charAt(0).toLowerCase() + this.slice(1);
};

Array.prototype.intersect = function (arr) {
  return arr.filter((v) => this.includes(v));
};
// //

const args = process.argv.splice(2);

const models = args.filter(
  (v) => !['-u', '-a', '--update', '--all'].includes(v),
);

const flagsMap = {
  update: ['-u', '--update'],
  all: ['-a', '--all'],
};

const flags = Object.fromEntries(
  Object.entries(flagsMap).map(([flag, values]) => {
    return [flag, values.some((v) => args.includes(v))];
  }),
);
// .replace(/\n/g, "*");
const schemaPath = path.join(__dirname, config.schema);
console.log(`schema: ${schemaPath}`);
const schema = readFileSync(schemaPath, 'utf8');

const schemaModels = schema.match(/(?<=\n *?model )\w+(?= +\{)/g);

if (!flags.all && !models.length) {
  console.log('Usage:');
  console.log('\t"node newRoute.js <route>"\t\tto create a new route');
  console.log('or\t"node newRoute.js (--all|-a)\t\tto create all routes');
  process.exit(1);
}

if (flags.all) {
  schemaModels.forEach((model) => {
    newRoute(schema, model, flags.update);
  });
} else {
  models.forEach((model) => {
    newRoute(schema, model, flags.update);
  });
}
// X(?=Y)	lookahead	,(?<=Y)X lookbehind,
//  X(?!Y)	Negative lookahead, (?<!Y)X	Negative lookbehind
