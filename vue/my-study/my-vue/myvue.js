// 数组响应式
// 1、替换数组原型中7个方法
const orginalProto = Array.prototype
// 备份一份，修改备份
const arrayProto = Object.create(orginalProto);

['push', 'pop', 'shift', 'unshift'].forEach(method => {
  arrayProto[method] = function () {
    // 原始操作
    arrayProto[method].apply(this, arguments)
    // 覆盖操作: 通知更新
    console.log('数组执行 ' + method + '操作')
  }
})

// 对象响应式
function defineReactive (obj, key, val) {
  // 如果val本身还是对象，则需要递归处理
  observe(val)

  // 创建一个Dep实例和key对应
  const dep = new Dep()

  Object.defineProperty(obj, key, {
    get () {
      // 依赖收集
      Dep.target && dep.addDep(Dep.target)
      // console.log('get', key)
      return val
    },
    set (v) {
      if (v !== val) {
        // 如果传入的是一个对象仍需要做响应式处理
        observe(v)
        val = v
        dep.notify()
        // 粗暴更新法 已不需要
        // watchers.forEach(w => w.update())
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

  // 判断传入的obj类型
  if (Array.isArray(obj)) {
    // 覆盖原型，替换7个变更操作
    // eslint-disable-next-line no-proto
    obj.__proto__ = arrayProto

    // 对数组内部元素执行响应化
    for (let i = 0; i < obj.length; i++) {
      observe(obj[i])
    }
  } else {
    Object.keys(obj).forEach(key => {
      defineReactive(obj, key, obj[key])
    })
  }
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
    this.$methods = options.methods

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

  // 统一做初始化和更新处理
  update (node, exp, dir) {
    const fn = this[dir + 'Updater']
    fn && fn(node, this.$vm[exp])

    const watch = new Watcher(this.$vm, exp, function (val) {
      fn && fn(node, val)
    })
    console.log(watch)
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
      } else if (attrName.startsWith('@')) {
        const dir = attrName.substring(1)
        this.bindEvent(node, dir, exp)
      }
    })
  }

  bindEvent (node, dir, exp) {
    node.addEventListener(dir, this.$vm.$methods[exp].bind(this.$vm))
  }

  // k-text
  text (node, exp) {
    this.update(node, exp, 'text')
  }

  html (node, exp) {
    this.update(node, exp, 'html')
  }

  htmlUpdater (node, val) {
    node.innerHTML = val
  }

  model (node, exp) {
    node.addEventListener('input', (e) => {
      this.$vm[exp] = e.target.value
    })
    this.update(node, exp, 'model')
  }

  modelUpdater (node, val) {
    node.value = val
  }

  isInter (node) {
    return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent)
  }
}

console.log(MyVue)

// 有了dep 不需要了
// const watchers = []
// 负责具体更新任务的 Watcher
class Watcher {
  constructor (vm, key, updaterFn) {
    this.vm = vm
    this.key = key
    this.updaterFn = updaterFn

    // 触发依赖收集
    Dep.target = this // 尤大这么写的
    console.log(111)
    // eslint-disable-next-line no-unused-expressions
    vm[key] // 触发数据劫持的 get 收集依赖
    Dep.target = null
    // 粗暴更新法已不需要
    // watchers.push(this)
  }

  update () {
    this.updaterFn.call(this.vm, this.vm[this.key])
  }
}

// 和data中响应式key 之间是 一一对应的关系
class Dep {
  constructor () {
    // 保存关联的watcher实例
    this.deps = []
  }

  addDep (dep) {
    this.deps.push(dep)
  }

  notify () {
    this.deps.forEach(dep => dep.update())
  }
}
