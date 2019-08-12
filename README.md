# @smotaal/esm [<kbd>Definitions</kbd>](./Definitions.md)

Everything needed to work on pure ESM projects (eventually).

> **Note**: This is work in progress is only meant to make my life a little easier as I do actual project work.

<!--

## Modules

Modular ECMAScript projects in the post-ESM era do not only work with the *ECMAScript modules*, but may also include standard formats like *JSON*, *WebAssembly*… and so fourth, along with transient formats like *Builtins* or *Dynamic modules*. Coupled with a good loader architecture, they could also deliver potentially infinite dynamic permutations of those module formats.

### ECMAScript Modules

Such modules are directly constructed by evaluating an explicitly defined source text relative to an absolute `content`-facing URL permanently linked to the source text from the moment of linking. Any number of ECMAScript modules can share the same `content`-facing URL, given that each one is the idempotent module record of the same `content`-facing URL for a unique context or realm.

These rules predictable linking of relative specifiers, while making it possible to back any `content`-facing URL with transport-specific manifestations of the same URLs, aka `resource`-facing URLs.

Those distinctions are meant to separate specifier resolution from resource location to the extent where each platform can determine how to go about transport-specific considerations and/or constraints. But, the general principle is that a `content`-facing URL should always make it possible for evaluated modules to resolve modules and other resources relative to their own `import.meta.url` for both `import` and `access` operations — the latter referring to actual resources, and that the same resource locations are retained for the respective resolved specifiers for a unique context or realm.

In that sense, and specifically for cases where modules are to be remapped for a specific context or realm, there is an additional consideration that the `content`-facing URL of a remapped module may sometimes not reconcile with the actual resource location mapped to it, leading to unpredictable evaluation outcomes that are undersirable at best.

A layered strategy can help mitigate this discrepency:

1. Use scopes to encapsulate and partition remapping manifestations.

2. Consider remapped modules to be `proxy` modules, where the `content`-facing URL of the actual evaluated modules does not diverge from the original URL, allowing it direct access to it's relative resources.

3. …


### JSON and WebAssembly

Such modules are indirectly constructed by respective loaders, where the `content`-facing URL only impacts their addressability by other modules and has no internal manifestations (ie `import.meta.url`).

The same rules apply here

-->
