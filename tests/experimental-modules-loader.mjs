export const resolve = (specifier, referrer, resolve) => {
  console.log('resolve', specifier, referrer, { ...resolve });
  return resolve(specifier, referrer);
}
