import {Container, ContainerRecord} from './container.js';
import {Loader, LoaderRecord} from './loader.js';
import {Module, ModuleRecord} from './module.js';
import {Scope, ScopeRecord} from './scope.js';
import {isValidModuleId} from './helpers.js';
// import {Record, ContainerRecord, LoaderRecord, ModuleRecord} from './records.js';

export class Internal {
  constructor() {
    /** @readonly @type {WeakSet<ContainerRecord>} */
    this.containers = new WeakSet();
    /** @readonly @type {WeakSet<LoaderInstance>} */
    this.loaders = new WeakSet();
    /** @readonly @type {WeakSet<ScopeInstance>} */
    this.scopes = new WeakSet();
    /** @readonly @type {WeakSet<ModuleInstance>} */
    this.modules = new WeakSet();
    /** @readonly @type {WeakSet<ContainerRecord|LoaderRecord|ModuleRecord>} */
    this.records = new WeakSet();
  }

  /** @template {{container?: ContainerInstance, base: string}} T @param {T} record @returns {ContainerRecord & T} */
  registerContainer(record) {
    let hash, id;
    if (
      record == null ||
      this.records.has(record) ||
      typeof record !== 'object' ||
      record.id != null ||
      record.hash != null
    )
      throw ReferenceError(`registerContainer invoked with an invalid container record`);

    if (!record.base || typeof record.base !== 'string' || !isValidBase(record.base))
      throw ReferenceError(`registerContainer invoked with an invalid base "${record.base}"`);

    record.id = `${(record.type = 'container')} #${(record.hash = generateHash())}`;
    record = new ContainerRecord(record);
    record[`(${record.type})`] = record;
    record.base = new URL(record.base);

    if (record.container != null) {
      if (
        this.containers.has(record.container) ||
        typeof record.container !== 'object' ||
        record.container[`(${record.type})`] != null
      )
        throw TypeError(`registerContainer invoked with an invalid container instance`);

      Object.defineProperties(record.loader, {
        [`(${record.type})`]: {value: record, configurable: false, writable: false},
        base: {value: record.base, configurable: false, writable: false},
      });

      this.containers.add(record.container);
    } else {
      record.container = null;
    }

    Object.freeze(record);

    this.records.add(record);
  }

  /** @template {{loader?: LoaderInstance, base: string}} T @param {T} record @returns {LoaderRecord & T} */
  registerLoader(record) {
    if (
      record == null ||
      this.records.has(record) ||
      typeof record !== 'object' ||
      record.id != null ||
      record.hash != null
    )
      throw ReferenceError(`registerLoader invoked with an invalid loader record`);

    if (!record.base || typeof record.base !== 'string' || !isValidBase(record.base))
      throw ReferenceError(`registerLoader invoked with an invalid base "${record.base}"`);

    record.id = `${(record.type = 'loader')} #${(record.hash = generateHash())}`;
    record = new LoaderRecord(record);
    record[`(${record.type})`] = record;
    record.base = new URL(record.base);

    if (record.loader != null) {
      if (
        record.container == null ||
        !this.containers.has(record.container) ||
        typeof record.container !== 'object' ||
        !Container[Symbols.hasInstance](record.container) ||
        record.container.loader != null
      )
        throw TypeError(`registerLoader invoked with an invalid container instance`);

      if (
        this.loaders.has(record.loader) ||
        typeof record.loader !== 'object' ||
        record.loader[`(${record.type})`] != null ||
        record.loader.container !== undefined
      )
        throw TypeError(`registerLoader invoked with an invalid loader instance`);
      Object.defineProperties(record.loader, {
        [`(${record.type})`]: {value: record, configurable: false, writable: false},
        container: {value: container, configurable: false, writable: false},
        base: {value: record.base, configurable: false, writable: false},
      });
      this.loaders.add(record.loader);
    } else {
      record.loader = null;
    }

    Object.freeze(record);

    this.records.add(record);
  }

  /** @template {{scope?: ScopeInstance, base: string, scopeId: string}} T @param {T} record @returns {ModuleRecord & T} */
  registerScope(record) {
    if (
      record == null ||
      this.records.has(record) ||
      typeof record !== 'object' ||
      record.id != null ||
      record.hash != null
    )
      throw ReferenceError(`registerScope invoked with an invalid record`);

    if (!record.base || typeof record.base !== 'string' || !isValidBase(record.base))
      throw TypeError(`registerScope invoked with an invalid base "${record.base}"`);
    if (!record.scopeId || !isValidScopeId(record.scopeId))
      throw TypeError(`registerScope invoked with an invalid scope id "${record.scopeId}"`);

    record.id = `${(record.type = 'scope')} #${(record.hash = generateHash())}`;
    record = new ScopeRecord(record);
    record[`(${record.type})`] = record;
    record.base = new URL(record.base);

    if (record.scope != null) {
      if (
        record.loader == null ||
        !this.loaders.has(record.loader) ||
        typeof record.loader !== 'object' ||
        !Loader[Symbols.hasInstance](record.loader)
      )
        throw TypeError(`registerScope invoked with an invalid loader instance`);

      if (
        this.scopes.has(record.scope) ||
        typeof record.scope !== 'object' ||
        record.scope[`(${record.type})`] != null ||
        !Scope[Symbols.hasInstance](record.scope) ||
        record.scope.loader !== undefined
      )
        throw TypeError(`registerScope invoked with an invalid scope instance`);

      if (record.loader.scopes.has(record.base))
        throw ReferenceError(`registerScope invoked with an existing base "${record.base}"`);
      if (record.loader.scopes.has(record.scopeId))
        throw ReferenceError(`registerScope invoked with an existing scope "${record.scopeId}"`);

      record.loader.scopes.set(record.base, record.scope);
      record.loader.scopes.set(record.scopeId, record.scope);
      // record.loader.container.scopes.set(record.base, record);

      Object.defineProperties(record.scope, {
        [`(${record.type})`]: {value: record, configurable: false, writable: false},
        id: {value: record.scopeId, configurable: false, writable: false},
        base: {value: record.base, configurable: false, writable: false},
        loader: {value: record.loader, configurable: false, writable: false},
        container: {value: record.loader.container, configurable: false, writable: false},
      });

      this.scopes.add(record.scope);

      // record.scope.loader.register(scope);
    } else {
      record.scope = null;
    }

    Object.freeze(record);

    this.records.add(record);
  }

  /** @template {{module?: ModuleInstance}} T @param {T} record @returns {ModuleRecord & T} */
  registerModule(record) {
    if (
      record == null ||
      this.records.has(record) ||
      typeof record !== 'object' ||
      record.id != null ||
      record.hash != null
    )
      throw ReferenceError(`registerModule invoked with an invalid record`);

    if (!record.moduleId || typeof record.moduleId !== 'string' || !isValidModuleId(record.moduleId))
      throw ReferenceError(`registerModule invoked with an invalid module identifier "${record.moduleId}"`);

    record.id = `${(record.type = 'module')} #${(record.hash = generateHash())}`;
    record = new ModuleRecord(record);
    record[`(${record.type})`] = record;

    if (record.module != null) {
      if (
        record.loader == null ||
        !this.loaders.has(record.loader) ||
        typeof record.loader !== 'object' ||
        !Loader[Symbols.hasInstance](record.loader)
      )
        throw TypeError(`registerModule invoked with an invalid loader instance`);

      if (
        this.modules.has(record.module) ||
        typeof record.module !== 'object' ||
        record.module[`(${record.type})`] != null ||
        !Module[Symbols.hasInstance](record.module) ||
        record.module.loader !== undefined
      )
        throw TypeError(`registerModule invoked with an invalid module instance`);

      if (record.loader.modules.has(record.moduleId))
        throw ReferenceError(`registerModule invoked with an existing module identifier "${record.moduleId}"`);

      record.loader.modules.set(record.moduleId, record.module);
      // record.loader.container.modules.set(record.moduleId, record);

      Object.defineProperties(record.module, {
        [`(${record.type})`]: {value: record, configurable: false, writable: false},
        id: {value: record.moduleId, configurable: false, writable: false},
        loader: {value: record.loader, configurable: false, writable: false},
        container: {value: record.loader.container, configurable: false, writable: false},
      });

      this.modules.add(record.module);

      // record.module.loader.register(module);
    } else {
      record.module = null;
    }

    Object.freeze(record);

    this.records.add(record);
  }

  /** @param {ModuleInstance} module */
  async locateModule(module) {
    let location;

    if (module == null || !this.module.has(module))
      throw ReferenceError(`locateModule invoked with an invalid module (module.id: ${module && module.id})`);

    location = await this.locate(module.id);

    Object.defineProperty(module, 'location', {value: location, writable: false, configurable: true});

    module.loader.locations.set(module, location);
    module.loader.locations.set(module.id, location);
    module.loader.locations.set(`${location}`, location);

    return location;
  }

  /** @param {ModuleInstance} module */
  async retrieveModule(module) {
    let source, location;

    if (module == null || !this.module.has(module))
      throw ReferenceError(`retrieveModule invoked with an invalid module (module.id: ${module && module.id})`);

    location = module.location || (await this.locateModule(module));
    source = await this.retrieve(location);

    Object.defineProperty(module, 'source', {value: source, writable: false, configurable: true});

    module.loader.sources.set(module, source);
    module.loader.sources.set(module.id, source);
    module.loader.sources.set(`${location}`, source);

    return source;
  }

  async instantiateModule(module) {
    let record;

    if (module == null || !this.module.has(module))
      throw ReferenceError(`instantiateModule invoked with an invalid module (module.id: ${module && module.id})`);

    record = this.records.get(module);

    if (record !== undefined) {
      await record.instance;
      return;
    }

    throw Error(`instantiateModule failed (module.id: ${module && module.id})`);
  }

  /** @param {string} id @returns {Location | Promise<Location>} */
  locate(id) {
    return new URL(id);
  }

  /** @param {Location} location @returns {Source | Promise<Source>} */
  retrieve(location) {
    return '';
  }

  /** @param {string} specifier @param {string | URL} referrer */
  resolveSpecifier(specifier, referrer) {
    // TODO: Cover ../
    return new URL(
      specifier,
      typeof referrer === 'string' ? `file:///${referrer}` : referrer || this.base,
    ).pathname.slice(1);
  }
  // moduleId — @scope/package/module.js
}

// /** @typedef {import('./records.js').Record} Record */
// /** @typedef {import('./records.js').ContainerRecord} ContainerRecord */
// /** @typedef {import('./records.js').LoaderRecord} LoaderRecord */
// /** @typedef {import('./records.js').ModuleRecord} ModuleRecord */
// /** @typedef {import('./records.js').NamespaceRecord} NamespaceRecord */

/** @typedef {import('./container.js').Container} Container */
/** @typedef {import('./loader.js').Loader} Loader */
/** @template {string} K @typedef {import('./module.js').Module<K>} Module */
/** @typedef {import('./module.js').ModuleSource} Source */
/** @typedef {import('./module.js').ModuleLocation} Location */

// if (!(loader != null && typeof loader === 'object' && loader instanceof Loader))
// throw TypeError(`Loader.registerModule invoked with an invalid loader argument (${loader && loader.id})`);
// if (!(module != null && typeof module === 'object' && module instanceof Module))
//   throw TypeError(`Loader.registerModule invoked with an invalid module argument (${loader.id}: "${module.id}")`);
