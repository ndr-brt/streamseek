<template>
  <div>

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
              <b-button variant="primary" @click="playAll(folder.user, folder.songs, folder.images)">Play {{ folder.songs.length }} songs</b-button>
            </b-col>

            <b-col>
              <strong>{{ folder.name }}</strong>
            </b-col>

            <b-col>
              <p>User: {{ folder.user }} / Speed: {{ folder.speed }}</p>
            </b-col>

          </b-row>
          <b-row>

            <b-container>
              <div v-for="song in folder.songs" v-bind:key="song.name">
                <b-row>

                  <b-col>
                    <b-button value="Play" @click="play(folder.user, song, folder.images)">Play</b-button>
                  </b-col>

                  <b-col>
                    <p>{{ song.name }}</p>
                  </b-col>

                  <b-col>
                    <p>Size: {{ song.size }} bytes</p>
                  </b-col>

                  <b-col>
                    <p>Bitrate: {{ song.bitrate }} bps</p>
                  </b-col>
                </b-row>
              </div>
            </b-container>

          </b-row>
        </div>
      </b-container>
    </div>

    <div v-if="music" style="position: fixed; bottom: 0px; width: 100%;">
      <aplayer autoplay :music="music" :list="queue"/>
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
      queue: undefined,
      music: undefined
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

    play (user, song, images) {
      this.playAll(user, [ song ], images)
    },

    playAll (user, songs, images) {
      var picture = images[0]
        ? 'http://localhost:3000/play/' + btoa(user + '|' + images[0].file)
        : undefined

      this.queue = []
      songs.forEach(song => this.queue.push({
        title: song.name,
        artist: song.file,
        src: 'http://localhost:3000/play/' + btoa(user + '|' + song.file),
        pic: picture
      }))

      this.music = this.queue[0]
    }
  }
}
</script>

<style scoped>
</style>
