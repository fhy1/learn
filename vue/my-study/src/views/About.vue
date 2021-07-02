<template>
  <div class="about">
    <h1>This is an about page</h1>
    <h1>{{$store.state.count}}</h1>
  </div>
</template>

<script>

export default {
  data () {
    return {}
  },
  created () {
    setInterval(() => {
      this.increment()
    }, 2000)
  },
  methods: {
    increment () {
      this.$store.commit('increment')
      console.log(this.$store.state.count)
    }
  }
}
</script>
