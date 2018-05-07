<template>
  <div class="hello">
    <form @submit="onSubmit">
      <input type="text" v-model="credentials.username" placeholder="Username" />
      <input type="password" v-model="credentials.password" placeholder="Password" />
      <input type="submit" value="Login" />
    </form>
    <span>{{ message }}</span>
  </div>
</template>

<script>
import client from '../client'

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
      self.message = ''

      client.login(this.credentials)
        .then(function (result) {
          console.log('Logged')
          console.log(result)
        }, function (err) {
          console.log(err)
          self.message = err.message
        })
    }
  }
}
</script>

<style scoped>
</style>
