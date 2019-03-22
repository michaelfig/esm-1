const {process} = require('process');

const {type = 'legacy', name, version = 'alpha'} = require('./package.json');

console.log(`${process.title = name}@${version}[${type}]`);
