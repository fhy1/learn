let Vue
class MyRouter {
  constructor (options) {
    this.$options = options

    this.current = window.location.hash.slice(1) || '/'
    Vue.util.defineReactive(
      this,
      'matched',
      []
    )
    // match 方法可以递归路由表，获得匹配关系数组
    this.match()

    // 已不需要current 做响应式了
    // Vue.util.defineReactive(
    //   this,
    //   'current',
    //   window.location.hash.slice(1) || '/'
    // )

    window.addEventListener('hashchange', () => {
      this.current = window.location.hash.slice(1) || '/'
      this.matched = []
      this.match()
    })
  }

  match (routes) {
    routes = routes || this.$options.routes

    // 递归遍历
    for (const route of routes) {
      if (route.path === '/' && this.current === '/') {
        this.matched.push(route)
        return
      }

      //  /about/info
      if (route.path !== '/' && this.current.indexOf(route.path) !== -1) {
        this.matched.push(route)
        if (route.children) {
          this.match(route.children)
        }
        return
      }
    }
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
      // 标记当前router-view深度
      this.$vnode.data.routerView = true
      let depth = 0
      let parent = this.$parent
      while (parent) {
        const vnodeData = parent.$vnode && parent.$vnode.data
        if (vnodeData) {
          if (vnodeData.routerView) {
            depth++
          }
        }
        parent = parent.$parent
      }

      let component = null

      // 路由嵌套版本
      const route = this.$router.matched[depth]
      if (route) {
        component = route.component
      }

      // 无嵌套路由版
      // 1.获取当前url的hash部分
      // 2.根据hash部分从路由表中获取对应的组件
      // const route = this.$router.$options.routes.find(
      //   (route) => route.path === this.$router.current
      // )
      // if (route) {
      //   component = route.component
      // }
      return h(component)
    }
  })
}

export default MyRouter

// 1 router-view 深度标记
// 2 路由匹配是获取代表深度层级的metched数组
