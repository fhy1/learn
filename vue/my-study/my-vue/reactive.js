function defineReactive (obj, key, val) {
  Object.defineProperty(obj, key, {
    get () {
      console.log('get', val)
      return val
    },
    set (v) {
      if (v !== val) {
        val = v
        console.log('set', key)
      }
    }
  })
}

function observe (obj) {
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

const obj = {
  foo: 'foo',
  bar: 'bar'
}

observe(obj)

// 对obj 做响应式处理
