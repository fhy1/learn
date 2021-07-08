
let Vue

class Store {
  constructor (options) {
    this._mutations = options.mutations
    this._actions = options.actions
    this._getters = options.getters
    this._newgetters = {}

    // 定义computed 选项
    const computed = {}
    this.getters = {}
    const store = this
    // {doubleCounter(state) {}}
    Object.keys(this._getters).forEach(key => {
      // 获取用户定义的getter
      const fn = store._getters[key]
      // 转化俄日computed可以使用的无参数形式
      computed[key] = function () {
        return fn(store.state)
      }
      // 为getters定义制度属性
      Object.defineProperty(store.getters, key, {
        get: () => store._vm[key]
      })
    })

    this._vm = new Vue({
      data () {
        // 可加  _  或 $$ 就可以禁止代理
        return {
          $$state: options.state
        }
      },
      computed
      // computed: {
      //   myGetter () {
      //     console.log('state', this.state)
      //     return this._newgetters
      //   }
      // }
    })

    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
  }

  get state () {
    return this._vm._data.$$state
  }

  set state (v) {
    console.error(`想改${v}？ 不存在的`)
  }

  commit (type, payload) {
    const entry = this._mutations[type]
    if (!entry) {
      console.error('不存在')
      return
    }
    entry(this.state, payload)
  }

  dispatch (type, payload) {
    const entry = this._actions[type]
    if (!entry) {
      console.error('不存在')
      return
    }
    entry(this, payload)
  }

  // get getters () {
  //   this._newgetters = this.changeGetter()
  //   // return this._newgetters
  //   return this._newgetters
  // }

  // changeGetter () {
  //   const _newgetters = {}
  //   Object.keys(this._getters).forEach((item) => {
  //     _newgetters[item] = this._getters[item](this.state) // options.getters[item](options.state)
  //   })
  //   return _newgetters
  // }
}

function install (_Vue) {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store
      }
    }
  })
}

// 导出的对象是Vuex
export default { Store, install }
