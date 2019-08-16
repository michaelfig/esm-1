//@ts-check
///<reference path="./types.d.ts"/>

import {Record} from './record.js';

export class ScopeRecord extends Record {}

/** @template {string} K */
export class Scope {
  /** @param {{loader: LoaderInstance, scopeId: K, base: BaseLocation}} parameters */
  constructor({loader, base}) {
    /** @readonly @type {ScopeRecord} */
    this['(scope)'] = undefined;
    /** @readonly @type {string} */
    this.id = undefined;
    /** @readonly @type {BaseURL}*/
    this.base = undefined;
    /** @readonly @type {LoaderInstance} */
    this.loader = undefined;
    /** @readonly @type {ContainerInstance} */
    this.container = undefined;

    loader.internal.registerScope({
      constructor: new.target,
      scopeId,
      base: `${base || ''}`.trim(),
      loader,
      scope: this,
    });

    /** @private */
    this.internal = loader.container.internal;
    Object.freeze(this);
  }
}

/** @typedef {Scope | ScopeRecord} ScopeReference */
