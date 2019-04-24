import {createRequireFromPath} from 'module';
import {fileURLToPath} from 'url';

const specifier = './package.json';
const [scope, ...paths] = ['../../', '../', './'].map((path, index) => fileURLToPath(new URL(path, import.meta.url)));
const sanitize = path => path.replace(scope, '‹scope›/');

for (const path of process.argv.includes('-t2') ? paths.reverse() : paths) {
  process.chdir(path);
  console.group('\nprocess.chdir(%o)', sanitize(process.cwd()));
  console.log();
  try {
    const require = createRequireFromPath('.');
    console.log(
      `createRequireFromPath(%o)\n  .resolve(%o)\n    => %o`,
      '.',
      specifier,
      sanitize(require.resolve(specifier)),
    );
  } catch (exception) {
    console.warn(
      `createRequireFromPath(%o)\n  .resolve(%o)\n    => %o`,
      '.',
      specifier,
      `${exception}`.split('\n', 1)[0],
    );
  }
  console.log();
  console.groupEnd();
}

/*******************************************************************************
 * $ node --experimental-modules esm/tests/create-require.mjs
 *
 *   process.chdir('‹scope›/esm/')
 *
 *     createRequireFromPath('.')
 *       .resolve('./package.json')
 *         => '‹scope›/esm/package.json'
 *
 *   process.chdir('‹scope›/esm/tests/')
 *
 *     createRequireFromPath('.')
 *       .resolve('./package.json')
 *         => '‹scope›/esm/package.json'
 *
 ******************************************************************************
 * $ node --experimental-modules esm/tests/create-require.mjs -t2
 *
 *   process.chdir('‹scope›/esm/tests/')
 *
 *     createRequireFromPath('.')
 *       .resolve('./package.json')
 *         => '‹scope›/esm/tests/package.json'
 *
 *   process.chdir('‹scope›/esm/')
 *
 *     createRequireFromPath('.')
 *       .resolve('./package.json')
 *         => '‹scope›/esm/tests/package.json'
 *
 ******************************************************************************/
