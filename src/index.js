const _ = require('lodash'); // eslint-disable-line no-unused-vars
const replaceInFiles = require('./replaceInFiles.js').default;

const regexpPathToFiles = '/home/wj42/work/training/replace-in-files/src/sandbox/index.js';
const optionsForRegexpPathToFiles = {};

const regexp = / *const (.*) = loopback\.getModel\((.*)\);.*\s *const (.*) = \1.create\((.*)\);.*/gm;

const replaceFunction = (match, p1, p2, p3, p4) => {
  console.log('|42| ->    match', match);
  console.log('|42| ->    p1', p1);
  console.log('|42| ->    p2', p2);
  console.log('|42| ->    p3', p3);
  console.log('|42| ->    p4', p4);
  return `const ${p3} = createModel(${p2}, ${p4});`;
};


replaceInFiles({
  regexpPathToFiles,
  optionsForRegexpPathToFiles,
  regexp,
  replaceFunction,
});
