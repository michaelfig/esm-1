import {createRequireFromPath} from 'module';
import {fileURLToPath} from 'url';

const specifier = './package.json';
const [scope, ...paths] = ['../../', '../', './'].map((path, index) =>
  // '/index' fixes createRequireFromPath('…/') resolving against parent (why!)
  fileURLToPath(new URL(index ? path.replace(/\/([?#].*?|)$/, '/index$1') : path, import.meta.url)),
);

for (const path of paths) {
  console.group('\ncreateRequireFromPath(%o)\n  .resolve(%o)', path.replace(scope, '‹scope›/'), specifier);
  try {
    console.log(
      `  => %o`,
      createRequireFromPath(path)
        .resolve(specifier)
        .replace(scope, '‹scope›/'),
    );
  } catch (exception) {
    console.warn(`  => %s`, `${exception}`.split('\n', 1)[0]);
  }
  console.groupEnd();
}
