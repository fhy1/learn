import Vue from 'vue'
// import Vuex from 'vuex'
import Vuex from '../my-vuex'

Vue.use(Vuex)

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
    increment ({ commit }) {
      commit('increment')
    },
    showLog ({ dispatch }) {
      dispatch('showLog')
    }
  },
  // 动态追加key 用户需要的是函数的结果
  // 结合 computed 增加性能
  getters: {
    doubleCounter: state => {
      return state.count * 2
    }
  },
  modules: {}
})
