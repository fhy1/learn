function defineReactive (obj, key, val) {
  // 如果val本身还是对象，则需要递归处理
  observe(val)

  Object.defineProperty(obj, key, {
    get () {
      // console.log('get', key)
      return val
    },
    set (v) {
      if (v !== val) {
        // 如果传入的是一个对象仍需要做响应式处理
        val = v
        observe(v)
        // console.log('set', key)
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

    const com = new Compile(options.el, this)
    console.log(com)
  }

  set (obj, key, val) {
    defineReactive(obj, key, val)
  }
}

class Compile {
  constructor (el, vm) {
    // 保存KVue 实例
    this.$vm = vm
    // 编译模板树
    this.compile(document.querySelector(el))
  }

  // el 模板根节点
  compile (el) {
    // 遍历el
    // 获取el所有子节点
    el.childNodes.forEach(node => {
      // 2.判断node类型
      if (node.nodeType === 1) {
        // 元素
        console.log('element', node.nodeName)

        this.compileElement(node)
        if (node.childNodes.length > 0) {
          this.compile(node)
        }
        // 递归
      } else if (this.isInter(node)) {
        // 插值文本
        console.log('text', node.textContent)
        this.compileText(node)
      }
    })
  }

  // 处理插值文本 {{xx}}
  compileText (node) {
    this.update(node, RegExp.$1, 'text')
    // node.textContent = this.$vm[RegExp.$1]
  }

  update (node, exp, dir) {
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])
  }

  textUpdater (node, val) {
    node.textContent = val
  }

  // 编译element
  compileElement (node) {
    // 1 获取当前元素的素有属性，并判断他们是不是动态的
    const nodeAttrs = node.attributes
    Array.from(nodeAttrs).forEach(attr => {
      const attrName = attr.name
      const exp = attr.value
      // 判断attrName是否是指令或事件等动态
      if (attrName.startsWith('k-')) {
        const dir = attrName.substring(2)
        this[dir] && this[dir](node, exp)
      }
    })
  }

  // k-text
  text (node, exp) {
    node.textContent = this.$vm[exp]
  }

  isInter (node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}

console.log(MyVue)

const watchers = []
// 负责具体更新任务的 Watcher
class Watcher {
  constructor (vm, key, updaterFn) {
    this.vm = vm
    this.key = key
    this.updaterFn = updaterFn

    watchers.push(this)
  }

  update () {
    this.updaterFn.call(this.vm, this.vm[this.key])
  }
}
