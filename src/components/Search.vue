<template>
  <div>

    <form>
      <form @submit="onSubmit">
        <input type="text" v-model="search" placeholder="search" autofocus />
        <b-btn type="submit"><icon name="search"></icon></b-btn>
      </form>
    </form>
    <icon name="spinner" pulse v-if="searching"></icon>
    <span>{{ message }}</span>

    <br/>
    <br/>

    <div>
      <b-container>
        <div v-for="(folder, index) in results" v-bind:key="folder.folder" class="border bg-light rounded mb-2 pt-2">
          <b-row>

            <b-col cols="1">
              <b-btn variant="primary" @click="playAll(folder, folder.songs)">
                <icon name="play"></icon>
              </b-btn>
            </b-col>

            <b-col cols="1" v-if="folder.cover">
              <div style="height:70px; width: 70px;">
                    <b-img-lazy width="75px" height="75px" :src="'/api/play/' + folder.cover" fluid style="
                      width:100%;
                      height:100%;
                      object-position: center;
                      object-fit: cover;
                    "/>
                </div>
            </b-col>

            <b-col>
              <p align="left">
                <strong>{{ folder.name }}</strong>
              </p>
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
                      <b-btn @click="play(folder, song)">
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

    <div v-for="(player, index) in players" v-bind:key="index" style="position: fixed; bottom: 0px; width: 100%;">
      <aplayer autoplay listFolded listMaxHeight="5" :music="player.queue[0]" :list="player.queue"/>
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
      searching: false,
      message: '',
      results: [],
      players: []
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

      this.searching = true
      this.$http.post('/api/search', body).then(response => {
        self.results = response.body
        this.searching = false
      }, response => {
        self.message = response.body.message
        this.searching = false
      })
    },

    play (user, song, images) {
      this.playAll(user, [ song ], images)
    },

    playAll (folder, songs, images) {
      let queue = songs.map(song => {
        return {
          title: song.name,
          artist: song.file,
          src: '/api/play/' + song.key,
          pic: folder.cover
        }
      })

      // async function fetchSongs (http, players) {
      //   console.log('Start fetching all the songs')
      //
      //   for (var index = 0; index < songs.length; ++index) {
      //     var song = songs[index]
      //     console.log('Fetch ' + song.name)
      //     await http.get('/api/fetch/' + song.key)
      //   }
      // }

      console.log('First song fetched, let\'s add player!')
      this.players.push({
        queue: queue
      })

      // fetchSongs(this.$http, this.players).then(data => console.log('All songs fetched'))
    }

  }
}
</script>

<style scoped>
</style>
