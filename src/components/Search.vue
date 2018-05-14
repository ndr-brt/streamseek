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
        <div v-for="song in user.files" v-bind:key="song.file">
          <p>File: {{ song.file }}</p>
          <p>Size: {{ song.size }} bytes / Bitrate: {{ song.bitrate }} bps</p>
          <input type="button" value="Play" @click="play(song)" />
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
    play (song) {
      this.music = {
        title: song.file,
        artist: 'yeah',
        src: 'http://localhost:3000/play/' + btoa(song.user + '|' + song.file)
      }
    }
  }
}
</script>

<style scoped>
</style>
