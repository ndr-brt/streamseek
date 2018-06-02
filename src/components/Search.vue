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
      <b-container>
        <div v-for="folder in results" v-bind:key="folder.folder">
          <b-row>
            <b-col>
              <b-button variant="primary" @click="enqueueAll(folder.user, folder.songs)">Play {{ folder.songs.length }} songs</b-button>
            </b-col>
            <b-col>
              <strong>{{ folder.name }}</strong>
            </b-col>
            <b-col>
              <p>User: {{ folder.user }} / Speed: {{ folder.speed }}</p>
            </b-col>
          </b-row>
          <b-row>
            <div v-for="song in folder.songs" v-bind:key="song.name">
              <p>
                <input type="button" value="Play" @click="enqueue(folder.user, song)" />
                File: {{ song.name }} - Size: {{ song.size }} bytes / Bitrate: {{ song.bitrate }} bps
              </p>
            </div>
          </b-row>
        </div>
      </b-container>
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
