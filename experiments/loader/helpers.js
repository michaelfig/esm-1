export const generateHash = (...args) => Date.now().toString(36);

export const resolvedPromise = Promise.resolve();

export const ValidModuleId = /(?:[A-Za-z]+:\/*)?[-@-Z_a-z~]+[!,-9@-Z_a-z|~]*[!,-.0-9A-Za-z~]+/;
export const ValidScopeId = /(?:@[A-Za-z][-0-9A-Z_a-z]+\/)?[A-Z_a-z][-.0-9A-Z_a-z]/;

/** @type {<K extends string>(moduleId) => moduleId is K} */
export const isValidModuleId = moduleId => ValidModuleId.test(moduleId);

/** @type {<K extends string>(scopeId) => scopeId is K} */
export const isValidScopeId = scopeId => ValidScopeId.test(scopeId);

/** @type {<K extends string>(scope) => scope is K} */
export const isValidBase = base => ValidModuleId.test(base);

export const DefaultBaseMatcher = /\/node_modules\/.*|\/loader\/.*?|\/\b.*$/;
