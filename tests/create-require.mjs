import {createRequireFromPath} from 'module';
import {fileURLToPath} from 'url';

const specifier = './package.json';
const [scope, ...paths] = ['../../', '../', './'].map((path, index) =>
  fileURLToPath(new URL(index ? path : path, import.meta.url)),
);
const sanitize = path => path.replace(scope, '‹scope›/');

for (let path of paths) {
  process.chdir(path);
  console.group('\nprocess.chdir(%o)', sanitize(path));
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
 * @console
 *
 * process.chdir('‹scope›/esm/')
 *
 *   createRequireFromPath('.')
 *     .resolve('./package.json')
 *       => '‹scope›/esm/package.json'
 *
 *
 *
 * process.chdir('‹scope›/esm/tests/')
 *
 *   createRequireFromPath('.')
 *     .resolve('./package.json')
 *       => '‹scope›/esm/package.json'
 *
 ******************************************************************************/
