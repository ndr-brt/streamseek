<template>
  <div>

    <form>
      <form @submit="onSubmit">
        <input type="text" v-model="search" placeholder="search" autofocus />
        <b-btn type="submit"><icon name="search"></icon></b-btn>
      </form>
    </form>
    <span>{{ message }}</span>

    <br/>
    <br/>

    <div>
      <b-container>
        <div v-for="(folder, index) in results" v-bind:key="folder.folder">
          <b-row>

            <b-col cols="1">
              <b-btn variant="primary" @click="playAll(folder.user, folder.songs, folder.images)">
                <icon name="play"></icon>
              </b-btn>
            </b-col>

            <b-col>
              <strong>{{ folder.name }}</strong>
            </b-col>

            <b-col cols="3">
              <p align="left">
                <i>Songs:</i> {{ folder.songs.length }} <br/>
                <i>User:</i> {{ folder.user }}<br />
                <i>Speed:</i> {{ Math.trunc(folder.speed / 1024) }} Kbps
              </p>
            </b-col>

            <b-col cols="1">
              <b-btn v-b-toggle="'collapse-' + index" variant="info">
                <icon name="plus"></icon>
              </b-btn>
            </b-col>

          </b-row>
          <b-row>

            <b-collapse :id="'collapse-' + index">

              <b-container>
                <div v-for="song in folder.songs" v-bind:key="song.name">
                  <b-row>

                    <b-col cols="1">
                      <span/>
                    </b-col>

                    <b-col cols="1">
                      <b-btn @click="play(folder.user, song, folder.images)">
                        <icon name="play"></icon>
                      </b-btn>
                    </b-col>

                    <b-col cols="5">
                      <p>{{ song.name }}</p>
                    </b-col>

                    <b-col cols="5">
                      <p>
                        Size: {{ Math.trunc(song.size / 1024) }} KB<br/>
                        Bitrate: {{ song.bitrate }} bps
                      </p>
                    </b-col>
                  </b-row>
                </div>
              </b-container>

            </b-collapse>

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
