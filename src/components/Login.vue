<template>
  <div>
    <b-form @submit="onSubmit">
      <b-form-group description="Use your soulseek credentials.">
        <b-form-input type="text" v-model="credentials.username" placeholder="Username" autofocus />
        <b-form-input type="password" v-model="credentials.password" placeholder="Password" />
      </b-form-group>
      <b-button type="submit" variant="primary">Login</b-button>
    </b-form>
    <p>{{ message }}</p>
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
        this.$router.push('/search')
      }, response => {
        self.message = response.body.message
      })
    }
  }
}
</script>

<style scoped>
</style>
