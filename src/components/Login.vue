<template>
  <b-container>
    <b-row class="justify-content-center">
      <b-col class="col-9 col-lg-6 col-xl-4">
        <b-form @submit="onSubmit">
          <b-form-group description="Use your soulseek credentials.">
            <b-form-input type="text" v-model="credentials.username" placeholder="Username" autofocus />
            <b-form-input type="password" v-model="credentials.password" placeholder="Password" />
          </b-form-group>
          <b-button type="submit" variant="primary">Login</b-button>
        </b-form>
        <p>{{ message }}</p>
      </b-col>
    </b-row>
  </b-container>
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
      this.$http.post('/api/login', this.credentials).then(response => {
        self.message = response.body.message
        if ('localStorage' in window) {
          localStorage.setItem('streamseek_username', self.credentials.username)
        }
        this.$router.push('/search')
      }, response => {
        self.message = response.body.message
      })
    }
  }
}
</script>

<style scoped>
form {
  margin: 24px auto;
}
form input[type='text'] {
  margin: 15px 0;
}

</style>
