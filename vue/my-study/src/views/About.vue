<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h1>{{$store.state.count}}</h1>
    <button @click="increment">点击</button>
    <button @click="increment2">点击2</button>
    <div>{{ $store.getters.doubleCounter }}</div>
    <router-view />
  </div>
</template>

<script>

export default {
  data () {
    return {
      interval: null
    }
  },
  created () {},
  destroyed () {
    clearInterval(this.interval)
  },
  methods: {
    increment () {
      this.$store.dispatch('increment')
    },
    increment2 () {
      this.$store.commit('increment')
    }
  }
}
</script>
