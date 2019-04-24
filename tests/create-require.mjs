import {createRequireFromPath} from 'module';
import {fileURLToPath} from 'url';

const specifier = './package.json';
const [scope, ...paths] = ['../../', '../', './'].map((path, index) =>
  // Adding '/index' since createRequireFromPath('…/') drops trailing slash
  fileURLToPath(new URL(index ? path.replace(/\/([?#].*?|)$/, '/index$1') : path, import.meta.url)),
);
const sanitize = path => path.replace(scope, '‹scope›/');

for (const path of paths) {
  console.group('\ncreateRequireFromPath(%o)\n  .resolve(%o)', sanitize(path), specifier);
  try {
    console.log(`  => %o`, sanitize(createRequireFromPath(path).resolve(specifier)));
  } catch (exception) {
    console.warn(`  => %s`, `${exception}`.split('\n', 1)[0]);
  }
  console.groupEnd();
}

/*******************************************************************************
 * @console
 *
 * createRequireFromPath('‹scope›/esm/index')
 *   .resolve('./package.json')
 *     => '‹scope›/esm/package.json'
 *
 * createRequireFromPath('‹scope›/esm/tests/index')
 *   .resolve('./package.json')
 *     => '‹scope›/esm/tests/package.json'
 *
 ******************************************************************************/
