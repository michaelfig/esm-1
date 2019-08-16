//@ts-check
///<reference path="./types.d.ts"/>

import {DefaultBaseMatcher} from './helpers.js';
import {Internal} from './internal.js';
import {Loader} from './loader.js';
// import {Module} from './module.js';
import {Record} from './record.js';

export class ContainerRecord extends Record {}

export class Container {
  /** @param {{base?: BaseLocation, internal?: Internal}} parameters */
  constructor({base, internal = new Internal()}) {
    /** @readonly @type {ContainerRecord} */
    this['(container)'] = undefined;
    /** @readonly @type {BaseURL} */
    this.base = undefined;

    internal.registerContainer({
      constructor: new.target,
      base: `${base || DefaultBaseMatcher[Symbol.replace](import.meta.url, '/')}`.trim(),
      container: this,
    });

    /** @private */
    this.internal = internal;
    /** @readonly @type {Map<string, ModuleRecord>} */
    this.moduleRecords = new Map();
    /** @readonly @type {Map<string, ScopeRecord>} */
    this.scopeRecords = new Map();
    /** @readonly @type {Map<ModuleReference | string, ModuleLocation>} */
    this.locations = new Map();
    /** @readonly @type {Map<ModuleReference | string, ModuleSource>} */
    this.sources = new Map();

    this.loader = new Loader({base: `${this.base}`, container: this});

    Object.freeze(this);
  }
}

/** @typedef {Container | ContainerRecord} ContainerReference */
