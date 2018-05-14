<template>
  <div>

    <aplayer autoplay :music="music"/>

    <form>
      <form @submit="onSubmit">
        <input type="text" v-model="search" placeholder="search" autofocus />
        <input type="submit" value="Search" />
      </form>
    </form>
    <span>{{ message }}</span>

    <br/>
    <br/>

    <div>
      <div v-for="user in results" v-bind:key="user.user">
        <strong><p>User: {{ user.user }} / Speed: {{ user.speed }}</p></strong>

        <div v-for="(value, key) in user.folders" v-bind:key="key">
          <p>Folder: {{ key }}</p>

          <div v-for="song in value" v-bind:key="song.name">
            <p>File: {{ song.name }} - Size: {{ song.size }} bytes / Bitrate: {{ song.bitrate }} bps</p>
            <input type="button" value="Play" @click="play(user.user, song.file)" />
          </div>

        </div>

      </div>
    </div>

  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'

export default {
  name: 'Search',
  components: { Aplayer },
  data () {
    return {
      search: '',
      message: '',
      results: [],
      music: {}
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
        self.results = response.body.filter(it => it.slots)
      }, response => {
        self.message = response.body.message
      })
    },
    play (user, file) {
      this.music = {
        title: file,
        artist: 'yeah',
        src: 'http://localhost:3000/play/' + btoa(user + '|' + file)
      }
    }
  }
}
</script>

<style scoped>
</style>
