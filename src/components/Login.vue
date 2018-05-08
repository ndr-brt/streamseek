<template>
  <div>
    <form @submit="onSubmit">
      <input type="text" v-model="credentials.username" placeholder="Username" />
      <input type="password" v-model="credentials.password" placeholder="Password" />
      <input type="submit" value="Login" />
    </form>
    <span>{{ message }}</span>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
      credentials: {
        username: '',
        password: ''
      },
      message: ''
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      let self = this

      this.$http.post('http://localhost:3000/login', this.credentials).then(response => {
        self.message = response.body.message
        this.$router.go('/search')
      }, response => {
        self.message = response.body.message
      })
    }
  }
}
</script>

<style scoped>
</style>
