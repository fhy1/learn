function defineReactive (obj, key, val) {
  // 如果val本身还是对象，则需要递归处理
  observe(val)

  Object.defineProperty(obj, key, {
    get () {
      console.log('get', key)
      return val
    },
    set (v) {
      if (v !== val) {
        // 如果传入的是一个对象仍需要做响应式处理
        val = v
        observe(v)
        console.log('set', key)
      }
    }
  })
}

function observe (obj) {
  // 判断obj的值， 必须是object
  if (typeof obj !== 'object' || obj === null) {
    return obj
  }
  Object.keys(obj).forEach(key => {
    defineReactive(obj, key, obj[key])
  })
}

function set (obj, key, val) {
  defineReactive(obj, key, val)
}

const obj = {
  foo: 'foo',
  bar: 'bar',
  baz: {
    a: 1
  }
}

observe(obj)

// obj.bar = 'aaa'
// obj.baz.a

// obj.baz = {
//   a: 10
// }

set(obj, 'dong', 'dong')
// obj.dong = 'don'

// 对obj 做响应式处理
// 数组7个变更方法 push、pop、shift、unshift
