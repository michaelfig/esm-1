type ContainerInstance = import('./container').Container;
type ContainerRecord = import('./container').ContainerRecord;
type ContainerReference = import('./container').ContainerReference;

type LoaderInstance = import('./loader').Loader;
type LoaderRecord = import('./loader').LoaderRecord;
type LoaderReference = import('./loader').LoaderReference;

type ScopeInstance<K extends string = string> = import('./scope').Scope<K>;
type ScopeRecord = import('./scope').ScopeRecord;
type ScopeReference = import('./scope').ScopeReference;

type ModuleInstance<K extends string = string> = import('./module').Module<K>;
type ModuleRecord = import('./module').ModuleRecord;
type ModuleReference = import('./module').ModuleReference;

type ModuleSource = string | ArrayBuffer;
type ModuleLocation = URL;

type InternalRecord = ContainerRecord | LoaderRecord | ModuleRecord;
type InternalReference = ContainerReference | LoaderReference | ModuleReference;

type BaseURL<K extends string = string> = URL & {href: K};
type BaseLocation<K extends string = string> = K | BaseURL<K>;
