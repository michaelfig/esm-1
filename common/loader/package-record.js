import {parsedObjectFrom} from './helpers.js';
import {SourceRecord} from './source-record.js';

const TypeOfExports = Object.freeze(['string', 'object']);
const TypeOfMain = Object.freeze(['string']);
const TypeOfType = Object.freeze(['string']);
const Types = Object.freeze(['module']);

const SUPPORTS_PACKAGE_EXPORTS = false;
const SUPPORTS_PACKAGE_TYPE = true;

/**
 * Loader-specific record for a package.
 *
 * @typedef {{[name:string]} | string} PackageRecordSource
 *
 * @export
 * @class PackageRecord
 */
export class PackageRecord extends SourceRecord {
  /** @param {Partial<PackageRecord>} [record] */
  constructor(record) {
    let exists, isValid, hasMain, isESM, main, exports;
    record && ({exists, isValid, hasMain, isESM, main, exports} = record);
    // TODO: Validate values before calling super
    super();
    /** @type {boolean} */
    this.exists = exists;
    /** @type {boolean} */
    this.isValid = isValid;
    /** @type {boolean} */
    this.hasMain = hasMain;
    /** @type {boolean} */
    this.isESM = isESM;
    /** @type {string} */
    this.main = main;
    /** @type {{[name:string]: string} | string} */
    this.exports = exports;
    // Object.freeze(this);
  }

  /**
   * Create PackageRecord from an existing string or object source.
   *
   * @static
   * @param {PackageRecordSource} source
   * @returns {PackageRecord}
   * @memberof PackageRecord
   */
  static fromSource(source) {
    let exists, isValid, isESM, main, exports, type;

    isValid = (exists = source !== undefined) || source === undefined;
    isESM = false;

    if (exists) {
      const parsedSource = parsedObjectFrom(source);

      // Invalid source returns { exists: true, isValid: false }
      if ((isValid = !!parsedSource)) {
        ({main, exports, type} = parsedSource);

        // TODO: Is empty/malformed considered valid

        type === undefined || TypeOfType.includes(typeof type) || (type = void (isValid = false));

        main === undefined || TypeOfMain.includes(typeof main) || (main = void (isValid = false));

        exports === undefined || TypeOfExports.includes(typeof exports) || (exports = void (isValid = false));

        isESM = !(
          (!SUPPORTS_PACKAGE_TYPE || type !== 'module') &&
          (!SUPPORTS_PACKAGE_EXPORTS || exports === undefined)
        );
      }
    }

    return new PackageRecord({
      exists,
      isValid,
      hasMain: main !== undefined,
      hasExports: exports !== undefined,
      hasType: type !== undefined,
      isESM,
      main,
      exports,
      type,
    });
  }

  [Symbol.for('nodejs.util.inspect.custom')](depth, {stylize = String} = {}) {
    // try {
    let string = '';
    for (const [key, value] of Object.entries(this)) {
      if (!value && value !== '') continue;
      string +=
        value === true
          ? ` <${stylize(key, 'name')}>`
          : ` ${stylize(key, 'name')}: ${stylize(JSON.stringify(value), typeof value)}`;
    }
    return `PackageRecord {${string} }`;
    // } catch (exception) {
    //   return this;
    // }
  }
}
