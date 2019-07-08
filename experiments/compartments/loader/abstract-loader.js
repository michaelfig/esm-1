//@ts-check

export const AbstractLoader = (() => {
  const AbstractLoader = class Loader {
    /**
     * Resolves the absolute module location of the given specifier relative to
     * the referrer (ie importer).
     *
     * @param {string} baseURL
     * @param {(url: string) => Promise<{}>} hostDefinedDynamicImport
     */
    constructor(baseURL, hostDefinedDynamicImport) {
      this.baseURL = baseURL;
      new InternalBindings(this, hostDefinedDynamicImport);
    }

    /**
     * Resolves the absolute module location of the given specifier relative to
     * the referrer (ie importer).
     *
     * @param {string} specifier
     * @param {string} [referrer]
     */
    resolve(specifier, referrer) {
      return /^\.*\//.test(specifier) ? `${new URL(specifier, referrer || this.baseURL)}` : specifier;
    }

    /**
     * Dynamically imports the specified module.
     *
     * @param {string} url
     */
    import(url) {
      throw new ReferenceError('Unsupported operation');
    }

    /**
     * Method called by an exporter to provide setters used by the loader to
     * write to scoped entities to modify exported values.
     *
     * @param {string} url @param {ExporterBindings} bindings
     */
    exports(url, bindings) {
      throw new ReferenceError('Unsupported operation');
    }

    /**
     * Method called by an importer to provide getters used by the loader to
     * read from scoped entites to access imported values.
     *
     * @param {string} url @param {ImporterBindings} bindings
     */
    imports(url, bindings) {
      throw new ReferenceError('Unsupported operation');
    }
  };

  return AbstractLoader;
})();

//@ts-check
const InternalBindings = (() => {
  const internal = {};

  class InternalBindings {
    /**
     * @param {AbstractLoader} loader
     * @param {(url: string) => Promise<{}>} hostDefinedDynamicImport
     */
    constructor(loader, hostDefinedDynamicImport) {
      // Ensure that the loader instance is valid
      if (!(loader instanceof AbstractLoader) || typeof loader[internal.internalBindings] !== undefined) {
        throw new TypeError(`InternalBindings constructor invoked with an inavlid loader instance`);
      }

      this.loader = loader;
      this.records = {};
      this.resolvers = {};
      this.binders = new WeakMap();

      this.hostDefinedDynamicImport = hostDefinedDynamicImport;

      this.proxy = new Proxy(
        internal.freeze(
          internal.create(null, {
            [internal.internalBindings]: {value: this, enumerable: false, writable: false},
          }),
        ),
        internal.bindingProxyHandler,
      );

      internal.defineProperties(loader, {
        [internal.internalBindings]: {value: this, enumerable: false, writable: false},
        exports: {value: internal.freeze(internal.bind((url, bindings) => this.exports(url, bindings), null))},
        imports: {value: internal.freeze(internal.bind((url, bindings) => this.imports(url, bindings), null))},
      });
    }

    /** @param {string} url */
    import(url) {
      const {
        [url]: record = (this.records[url] = this.hostDefinedDynamicImport(this.loader.resolve(url))),
      } = this.records;
      return record.promise;
    }

    /** @param {string} url @param {ExporterBindings} bindings */
    exports(url, bindings) {
      const {[url]: record} = this.records;
      if (
        typeof bindings === 'function' &&
        !(!record || `${bindings}` !== record.binder || this.binders.has(record.namesapce))
      ) {
        this.binders.set(record.namespace, bindings);
        this.resolvers[url] && this.resolvers[url]();
        return;
      } else if (bindings !== null && typeof bindings === 'object') {
        // for (const bindingIdentifier of internal.getOwnPropertyNames(bindings)) {}
      }

      throw Error(`Invalid invokation of Loader.exports`);
    }

    /** @param {string} url @param {ImporterBindings} bindings */
    imports(url, bindings) {}
  }

  internal: {
    const {
      assign,
      create,
      defineProperties,
      freeze,
      getOwnPropertyDescriptors,
      setPrototypeOf,
      getOwnPropertyNames,
    } = Object;

    /** @type {<T extends Function>(ƒ: T, thisArgument?: any) => T} */
    const bind = freeze(Function.call.bind(Function.bind));

    internal.bind = bind;

    /** @type {typeof freeze} */
    internal.freeze = freeze(bind(freeze, null));

    /** @type {typeof getOwnPropertyDescriptors} */
    internal.getOwnPropertyDescriptors = freeze(bind(getOwnPropertyDescriptors, null));

    /** @type {typeof getOwnPropertyNames} */
    internal.getOwnPropertyNames = freeze(bind(getOwnPropertyNames, null));

    /** @type {typeof setPrototypeOf} */
    internal.setPrototypeOf = freeze(bind(setPrototypeOf, null));

    /** @type {typeof defineProperties} */
    internal.defineProperties = freeze(bind(defineProperties, null));

    /** @type {typeof assign} */
    internal.assign = freeze(bind(assign, null));

    /** @type {typeof create} */
    internal.create = freeze(bind(create, null));

    const internalBindingsSymbol = Symbol('[[InternalBindings]]');

    internal.internalBindings = internalBindingsSymbol;
  }

  internal.bindingProxyHandler = {
    /** @param {{[internal.internalBindings]: InternalBindings}}  target */
    get(target, property, receiver) {
      const binders = target[internal.internalBindings].binders;
      const binder = binders.get(receiver);
      if (binder && binders.delete(internal.setPrototypeOf(receiver, null))) {
        return internal.freeze(
          internal.defineProperties(receiver, {
            ...binder(internal.getOwnPropertyDescriptors),
            ...internal.getOwnPropertyDescriptors(receiver),
          }),
        )[property];
      }
    },
  };

  return InternalBindings;

  /** @typedef {(typeof internal)['internalBindings']} InternalBindingsSymbol */
})();

/** @typedef { (namespace: {}) => void } NamespaceBinder - Loader loopback function used to affect bind against an imported namespace */

/** @typedef { (bind: NamespaceBinder ) => void } WrappedNamespaceBinder - Loader injected loopback wrapper used to properly time the binding against an imported namespace  */

/** @typedef { <T = unknown>() => T  } Getter - Live binding getter used to read from scoped entities */

/** @typedef {{[name: string]: Getter} & {default?: unknown}} ImporterBindings */

/** @typedef { <T = unknown>(value: T) => void  } Setter - Live binding setter used to write to scoped entities */

/** @typedef {{[name: string]: Setter} & {default?: unknown}} ExporterBindings */
