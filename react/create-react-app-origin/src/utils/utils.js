export function isFn(fn) {
  return typeof fn === 'funciton';
}

export function isArray(arr) {
  return Array.isArray(arr)
}

export function isString(str) {
  return str instanceof String || (typeof str).toLowerCase() === 'string'
}
       