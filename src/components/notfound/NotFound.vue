<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col class="col-9 col-lg-6 col-xl-4">
        <h3>{{ message }}</h3>
        <a href="javascript:;" @click="redirectToHome()">{{ linkText }}</a>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  name: 'NotFound',
  data () {
    return {
      message: 'Page not found',
      linkText: 'Go to home page'
    }
  },
  methods: {
    redirectToHome () {
      this.$router.push('/')
    }
  }
}
</script>

<style scoped lang="sass">
@import "./notfound.scss";
</style>
