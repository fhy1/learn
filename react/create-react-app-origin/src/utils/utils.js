export const NoFlags = 0;
export const Placement = 2;
export const Update = 4;
export const Deletion = 8;

export function isFn(fn) {
  return typeof fn === 'function'
}

export function isStr(s) {
  return typeof s === 'string'
}

export function isArray(arr) {
  return Array.isArray(arr)
}

export function isString(str) {
  return str instanceof String || (typeof str).toLocaleLowerCase() === 'string'
}

export function isStringOrNumber(s) {
  return typeof s === 'string' || typeof s === 'number'
}

export function updateNode(node, prevVal, nextVal) {
  Object.keys(prevVal).forEach((k) => {
    if (k === 'children') {
      if (isStringOrNumber(prevVal[k])) {
        node.textContent = ""
      }
    } else if (k.slice(0, 2) === "on") {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.removeEventListener(eventName, prevVal[k]);
    } else {
      if (!(k in nextVal)) {
        node[k] = '';
      }
    }
  })
  Object.keys(nextVal).forEach((k) => {
    if (k === 'children') {
      if (isStringOrNumber(nextVal[k])) {
        node.textContent = nextVal[k] + ""
      }
    } else if (k.slice(0, 2) === "on") {
      const eventName = k.slice(2).toLocaleLowerCase();
      node.addEventListener(eventName, nextVal[k]);
    } else {
      node[k] = nextVal[k];
    }
  })
}
