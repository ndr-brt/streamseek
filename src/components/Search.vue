<template>
  <div>

    <b-container class="search-form">
      <b-row class="justify-content-center">
        <b-col class="col-9 col-lg-6 col-xl-4">
          <form @submit="onSubmit">
            <b-input-group class="mb-3 mb-lg-4">
              <input class="form-control" type="text" v-model="search" placeholder="search" autofocus />
              <b-input-group-append>
                <b-btn type="submit" variant="primary"><icon name="search"></icon></b-btn>
              </b-input-group-append>
            </b-input-group>
            <div class="overlay-spinner" v-if="searching">
              <icon scale="2.3" name="spinner" pulse></icon>
            </div>
            <span>{{ message }}</span>
          </form>
        </b-col>
      </b-row>
    </b-container>
    <div>
      <b-container>

        <b-pagination-nav
          align="center"
          v-if="results.count && results.count > 0"
          size="md"
          :use-router="true"
          :link-gen="linkGen"
          :number-of-pages="results.pageCount"
          v-model="currentPage" />

        <b-row class="mt-4 mb-1" v-if="results.count && results.count > 0">
          <b-col class="col-12 col-lg-6 text-center text-lg-left">
            <span>
            {{ results.count }} results
          </span>
          </b-col>
          <b-col class="col-12 col-lg-6 text-center text-lg-right">
            <span>
              page {{ currentPage }} of {{ results.pageCount }}
            </span>
          </b-col>
        </b-row>

        <div v-for="(folder, index) in results.pagedResults" v-bind:key="folder.folder" class="border bg-light rounded my-2">
          <b-row class="py-2">

            <b-col class="col-2 col-lg-1 col-actions flex-column">
                <a :key="'play' + index" href="#" @click="playAll(folder, folder.songs)">
                  <icon name="play-circle-o" scale="2"></icon>
                </a>
              <b-btn v-bind:ref="'btn_expand_' + index" v-b-toggle="'collapse-' + index" variant="outline-info btn-sm">
                <icon name="angle-down"></icon>
              </b-btn>
            </b-col>

            <b-col class="col-2 col-lg-1" v-if="folder.cover">
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

            <b-col class="offset-1 offset-lg-0 col-11 col-lg-3 text-left">
            <ul>
              <li><icon scale="1.3" v-b-tooltip title="Songs" placement="top" name="folder" class="icon-folder"></icon> {{ folder.songs.length }} songs</li>
              <li><icon scale="1.3" v-b-tooltip title="User" placement="top" name="user" class="icon-user"></icon> {{ folder.user }}</li>
              <li><icon scale="1.3" v-b-tooltip title="Speed" placement="top" name="dashboard" class="icon-speed"></icon> {{ folder.speed }} Kbps</li>
            </ul>
            </b-col>
          </b-row>
          <b-row>

            <b-collapse class="collapse-wrapper w-100" :id="'collapse-' + index">

              <!-- <b-container> -->
                <b-container v-for="(song, idx) in folder.songs" v-bind:key="song.name">
                  <b-row>
                    <!-- <b-col cols="1">
                      <span/>
                    </b-col> -->
                    <b-col class="d-flex justify-content-center align-items-center" cols="1" offset="1">
                      <a :key="'playSong' + idx + '_' + index" href="#" @click="play(folder, song)">
                        <icon name="play-circle-o" scale="2"></icon>
                      </a>
                    </b-col>

                    <b-col class="d-flex align-items-center">
                      <p class="text-left">{{ song.name }}</p>
                    </b-col>

                    <b-col class="d-flex align-items-center" cols="12" lg="3" align-self="end">
                      <ul>
                        <li><icon scale="1.3" v-b-tooltip title="File size" placement="top" name="file-audio-o" class="icon-size"></icon> {{ song.size }} KB<br/></li>
                        <li><icon scale="1.3" v-b-tooltip title="Bitrate" placement="top" name="area-chart" class="icon-chart"></icon> {{ song.bitrate }} bps</li>
                      </ul>
                    </b-col>
                  </b-row>
                </b-container>
              <!-- </b-container> -->

            </b-collapse>
          </b-row>
        </div>

        <b-pagination-nav
          align="center"
          v-if="results.count && results.count > 0"
          size="md"
          :use-router="true"
          :link-gen="linkGen"
          :number-of-pages="results.pageCount"
          v-model="currentPage" />

      </b-container>
    </div>

    <div v-for="(player, index) in players" v-bind:key="index" style="position: fixed; bottom: 0px; width: 100%;">
      <aplayer autoplay listFolded listMaxHeight="5" :music="player.queue[0]" :list="player.queue"/>
    </div>

  </div>
</template>

<script>
import Aplayer from 'vue-aplayer'

// import jsonData from '../backend/jsondata'
// var jsonData = require('../backend/jsondata')
// console.log(typeof jsonData)
export default {
  name: 'Search',
  components: {
    Aplayer: Aplayer
  },
  data () {
    return {
      search: '',
      searching: false,
      message: '',
      currentPage: 1,
      limit: 10,
      results: [], // jsonData.getPage(1, 10),
      players: []
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'Results') {
        this.searching = true

        // workaround to force collapsing of expanded folders when changing page
        Object.values(this.$refs).forEach(el => {
          el.forEach(btn => {
            if (!btn.classList.contains('collapsed')) btn.click()
          })
        })
        let reqBody = { username: localStorage.getItem('username') }
        this.$http.post('/api' + to.path, reqBody).then(response => {
          // console.log('XHR to /api' + to.path + ' done')
          this.results = response.body
          this.currentPage = response.body.page
          this.searching = false
        }, response => {
          this.message = response.body.message
          this.searching = false
        })
      }
    }
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      let self = this
      let body = {
        req: this.search,
        timeout: 2000,
        username: localStorage.getItem('username') || (new Date()).getTime()
      }
      this.searching = true
      this.$http.post('/api/search', body).then(response => {
        self.limit = response.body.limit
        self.results = response.body
        this.searching = false
        this.$router.push('/results/' + response.body.page + '/' + response.body.limit)
      }, response => {
        self.message = response.body.message
        this.searching = false
      })
    },

    linkGen (pageNum) {
      return '/results/' + pageNum + '/' + this.limit
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
.border.bg-light.rounded {
  overflow-x: hidden;
}

ul {
  margin-bottom: 0;
}

ul li {
  list-style: none;
  text-align: left;
}
.icon-user, .icon-folder, .icon-speed,
.icon-chart, .icon-size {
  vertical-align: sub;
  margin-right: 10px;
}
button > svg {
  vertical-align:middle;
}
.collapse-wrapper ul {
  margin: 10px 0;
}
.collapse-wrapper p {
  margin-bottom:0;
}
.collapse-wrapper > .container:nth-child(even) .row {
  background: #eee none;
}
.collapse-wrapper > .container:nth-child(odd) .row {
  background: #ddd none;
}
@media screen and (max-width: 991px) {
  ul li {
    display:inline-block;
    font-size:12px;
  }
  ul li:not(:first-child)::before {
    content: "|";
    margin: 0 10px;
  }
}
.col-actions {
  display: flex;
  justify-content: space-between;
}
.col-actions a:link, .col-actions a:visited {
  display: block;
}
.btn-outline-info {
  display: flex;
  align-self: center;
}

</style>
