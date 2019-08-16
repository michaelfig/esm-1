//@ts-check
///<reference path="./types.d.ts"/>

import {Record} from './record.js';
import {Scope} from './scope.js';

export class LoaderRecord extends Record {}

export class Loader {
  /** @param {{base?: BaseLocation, container: ContainerInstance}} parameters */
  constructor({base, container}) {
    /** @readonly @type {LoaderRecord} */
    this['(loader)'] = undefined;
    /** @readonly @type {ContainerInstance} */
    this.container = undefined;
    /** @readonly @type {BaseURL} */
    this.base = undefined;

    container.internal.registerLoader({
      constructor: new.target,
      base: `${base || (container && container.base) || ''}`.trim(),
      container,
      loader: this,
    });

    /** @private */
    this.internal = container.internal;
    /** @readonly @type {Map<string, ModuleInstance<string>>} */
    this.modules = new Map();
    /** @readonly @type {Map<ModuleInstance | string, string>} */
    this.scopes = new Map();
    this.locations = this.container.locations;
    this.sources = this.container.sources;

    this.scope = new Scope({base: `${this.base}`, scopeId: '~', loader: this});

    Object.freeze(this);
  }

  // /**
  //  * Creates a new unique module record.
  //  *
  //  * @param {ModuleRecord} moduleRecord
  //  */
  // register(moduleRecord) {
  //   this.internal.registerModule(moduleRecord);
  // }

  /**
   * Returns the unique module identifier for the module specifier
   * string to be imported by a referrer.
   *
   * @param {string} specifier - required module specifier
   * @param {string.moduleId | URL} referrer - requiring module identifier or URL
   * @returns {string.moduleId}
   */
  resolve(specifier, referrer) {
    return this.internal.resolveSpecifier(specifier, referrer);
  }

  /**
   * Returns the location for a unique module identifier.
   *
   * @param {string.moduleId} moduleId
   * @returns {ModuleLocation | Promise<ModuleLocation>}
   */
  locate(moduleId) {
    return this.locations.get(moduleId) || this.internal.locateModule(this.modules.get(moduleId));
  }

  /**
   * Returns the location for a unique module identifier.
   * TODO: Move from source to linkage record
   *
   * @param {ModuleLocation | URL} location
   * @returns {ModuleSource | Promise<ModuleSource>}
   */
  retrieve(location) {
    return;
    // return this.sources.get(location) || this.internal.retrieveModule(this.modules.get(location));
  }

  /**
   * Returns a promise that resolves once the module is instantiated.
   *
   * @param {ModuleInstance} module
   * @param {ContainerRecord} module
   * @returns {Promise<void>}
   */
  instantiate(module) {
    return this.internal.instantiateModule(module);
  }
}

/** @typedef {Loader | LoaderRecord} LoaderReference */
/** @typedef {string} string.moduleId */
