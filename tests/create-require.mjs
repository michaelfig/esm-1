import {createRequireFromPath} from 'module';

const require = createRequireFromPath('.');

console.log(require.resolve('./package.json'));
