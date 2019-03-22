import require from './require.js';
import process from 'process';
// import fs from 'fs';

const {type = 'legacy', name, version = 'alpha'} = require('./package.json');

console.log(`${process.title = name}@${version}[${type}]`);
