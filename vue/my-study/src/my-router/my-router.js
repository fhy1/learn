let Vue
class MyRouter {
  constructor (options) {
    this.$options = options

    Vue.util.defineReactive(
      this,
      'current',
      window.location.hash.slice(1) || '/'
    )

    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1)
    })
  }
}

MyRouter.install = (_Vue) => {
  Vue = _Vue
  Vue.mixin({
    beforeCreate () {
      if (this.$options.router) {
        // 如果存在说明是根实例
        Vue.prototype.$router = this.$options.router
      }
    }
  })

  Vue.component('router-link', {
    props: {
      to: {
        type: String,
        required: true
      }
    },
    render (h) {
      return h(
        'a', // 标签名称
        {
          attrs: {
            href: '#' + this.to
          }
        },
        this.$slots.default // 子节点数组
      )
    }
  })

  Vue.component('router-view', {
    render (h) {
      let component = null
      // 1.获取当前url的hash部分
      // 2.根据hash部分从路由表中获取对应的组件
      const route = this.$router.$options.routes.find(
        (route) => route.path === this.$router.current
      )
      // console.log(this.$router.current, this.$router.$options)
      if (route) {
        component = route.component
      }
      return h(component)
    }
  })
}

export default MyRouter
