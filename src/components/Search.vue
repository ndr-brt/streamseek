<template>
  <div>

    <aplayer autoplay :music="music" :list="queue"/>

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

        <div v-for="(songs, folder) in user.folders" v-bind:key="folder">
          <p>Folder: {{ folder }}</p>
          <input type="button" value="Play All" @click="enqueueAll(user.user, songs)" />

          <div v-for="song in songs" v-bind:key="song.name">
            <p>
              <input type="button" value="Play" @click="enqueue(user.user, song)" />
              File: {{ song.name }} - Size: {{ song.size }} bytes / Bitrate: {{ song.bitrate }} bps
            </p>
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
      queue: [],
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

    enqueue (user, song) {
      this.queue.push({
        title: song.name,
        artist: song.file,
        src: 'http://localhost:3000/play/' + btoa(user + '|' + song.file)
      })
    },

    enqueueAll (user, songs) {
      songs.forEach(song => this.queue.push({
        title: song.name,
        artist: song.file,
        src: 'http://localhost:3000/play/' + btoa(user + '|' + song.file)
      }))
    }
  }
}
</script>

<style scoped>
</style>
