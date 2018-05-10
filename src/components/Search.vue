<template>
  <div>
    <form>
      <form @submit="onSubmit">
        <input type="text" v-model="search" placeholder="search" />
        <input type="submit" value="Search" />
      </form>
    </form>
    <span>{{ message }}</span>
    <br/>
    <br/>
    <ul>
      <li v-for="song in results" v-bind:key="song.file">
        {{ song }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'Search',
  data () {
    return {
      search: '',
      message: '',
      results: []
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      let self = this
      let body = {
        req: this.search,
        timeout: 2000
      }

      this.$http.post('http://localhost:3000/search', body).then(response => {
        self.results = response.body
      }, response => {
        self.message = response.body.message
      })
    }
  }
}
</script>

<style scoped>
</style>
