//@ts-check
///<reference path="./types.d.ts"/>

import {Record} from './record.js';

export class ModuleRecord extends Record {}

/** @template {string} K */
export class Module {
  /** @param {{loader: LoaderInstance, moduleId: K, moduleScope?: ScopeReference}} parameters */
  constructor({loader, moduleId, moduleScope}) {
    /** @readonly @type {ModuleRecord} */
    this['(module)'] = undefined;
    /** @readonly @type {string} */
    this.id = undefined;
    /** @readonly @type {ScopeInstance} */
    this.scope = undefined;
    /** @readonly @type {LoaderInstance} */
    this.loader = undefined;
    /** @readonly @type {ContainerInstance} */
    this.container = undefined;

    loader.internal.registerModule({constructor: new.target, moduleId, moduleScope, module: this, loader});

    /** @private */
    this.internal = loader.container.internal;

    Object.freeze(this);
  }

  /** @type {ModuleLocation} */
  get location() {
    return this.loader.locations.get(this);
  }

  /** @type {ModuleSource} */
  get source() {
    return this.loader.sources.get(this);
  }
}

/** @typedef {Module | ModuleRecord} ModuleReference */

// async locate() {
//   if (this.url === undefined) {
//     Object.defineProperty(this, 'url', {
//       value: await this.loader.locate(this.id),
//       writable: false,
//       configurable: false,
//     });
//   }
// }

// async retrieve() {
//   if (this.source === undefined) {
//     Object.defineProperty(this, 'source', {
//       value: await this.loader.retrieve(this.id),
//       writable: false,
//       configurable: false,
//     });
//   }
// }
