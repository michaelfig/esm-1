# Opaque Module

## Dealing with Non-`default` exports

### Importer

There are two potential ways to be able to handle this.

1. This one assumes full knowledge of the names ahead of time.

```js
import {imports} from '‹loader›';

import {identifier} from '‹url›';
imports('‹url›', {
  // getter
  identifier: () => identifier,
});
```

2. This assumes one zero-knowledge of the specific names to be exported, providing a layer of separation.

```js
import {imports} from '‹loader›';

import * as namespace from '‹url›';
imports('‹url›', reflect => reflect(namespace));
```

> **Note**: The `*` syntax can affect the loading and execution order of modules in which they occur.

### Exporter

There is technically no way to alter the actual exported names, only their values.

```js
import {exports} from '‹loader›';

export let identifier;
export default exports('‹url›', {
  // setter
  identifier: value => (identifier = value),
});
```

The set of names exported will thus always be a burden for the loader to work out before creating opaque modules to that effect.

## Dealing with `default` exports

Default exports further complicate the burden of a loader in that a `default` export is an assigned value computed during the execution cycle of a module. In essance, this exporter will likely make it impossible to conceive of cyclic references (not that any of this will do any better at this point).

```js
import {exports} from '‹loader›';

import default_export from '‹url›';
export let identifier;
export default loader.exports('‹url›', {
  // passthru or attenuate
  default: default_export,
  // setter
  identifier: value => (identifier = value),
});
```

> **Note**: The `default` syntax can affect the loading and execution order of modules in which they occur.
