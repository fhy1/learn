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

function proxy (vm) {
  Object.keys(vm.$data).forEach(key => {
    Object.defineProperty(vm, key, {
      get () {
        return vm.$data[key]
      },
      set (v) {
        vm.$data[key] = v
      }
    })
  })
}

class MyVue {
  constructor (options) {
    // 1、保存选项
    this.$options = options
    this.$data = options.data

    // 2.对data选项做响应式处理
    observe(this.$data)

    // 代理 优化用户体验
    proxy(this)

    // 3、编译
  }

  set (obj, key, val) {
    defineReactive(obj, key, val)
  }
}

console.log(MyVue)
