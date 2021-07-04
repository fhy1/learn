
let Vue

class Store {
  constructor (options) {
    this._mutations = options.mutations
    this._actions = options.actions
    // this.state = options.state

    this._vm = new Vue({
      data () {
        // 可加  _  或 $$ 就可以禁止代理
        return { $$state: options.state }
      }
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
