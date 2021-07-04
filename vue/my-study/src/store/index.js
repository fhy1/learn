import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../my-vuex'

Vue.use(Vuex)

console.log(Vuex)

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment ({ dispatch, commit, state }) {
      console.log(state)
      dispatch('showLog')
      commit('increment')
    },
    showLog () {
      console.log(1111)
    }
  },
  // 动态追加key 用户需要的是函数的结果
  // 结合 computed 增加性能
  getters: {
    doubleCounter: state => {
      return state * 2
    }
  },
  modules: {}
})
