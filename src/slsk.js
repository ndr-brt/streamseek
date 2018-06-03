var express = require('express')
var app = express()
const slsk = require('slsk-client')
const bodyParser = require('body-parser');

this.client = undefined

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.post('/login', function (req, res) {
  console.log('Login request for user ' + req.body.username)
  try {
    slsk.connect({
      user: req.body.username,
      pass: req.body.password
    }, (err, client) => {
      if (err) {
        res.status(500).json({ message: err.message })
      } else {
        this.client = client
        res.status(204).json({ message: 'client connected'})
      }
    })
  }
  catch(err) {
    console.log('Catched error' + err);
    res.status(500).json({ message: err })
  }
})

app.post('/search', function (req, res) {
  console.log('Search request ' + req.body.req)
  this.client.search(req.body, (err, results) => {
    if (err) {
      res.status(500).json({ message: err })
    }
    else {
      res.json(
        Object.values(
          results.reduce(groupByFolder, {})
        )
        .filter(f => f.songs.length > 0)
        .sort((a, b) => b.speed - a.speed)
      )
    }
  })
})

let groupByFolder = (acc, it) => {
  let lastSlash = it.file.lastIndexOf('\\')
  let folder = it.file.substr(0, lastSlash)

  var entry = acc[folder]
  if (!entry) {
    acc[folder] = {
      name: folder,
      user: it.user,
      speed: it.speed,
      slots: it.slots,
      songs: [],
      images: [],
      files: []
    }
  }

  let name = it.file.substr(lastSlash + 1)

  let file = {
    file: it.file,
    size: it.size,
    bitrate: it.bitrate,
    name: name
  }

  if (name.endsWith('.mp3') || name.endsWith('.m4a') || name.endsWith('.flac')) {
    acc[folder].songs.push(file)
  } else if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('png')) {
    acc[folder].images.push(file)
  } else {
    acc[folder].files.push(file)
  }

  return acc;
}

app.get('/play/:song', function (req, res) {
  let request = Buffer.from(req.params.song, 'base64')
                      .toString('ascii')
                      .split('|')
  console.log('Play from user ' + request[0] + ' this song: ' + request[1])
  this.client.download({
      file: {
        user: request[0],
        file: request[1]
      },
      //path: __dirname + '/random.mp3'
    }, (err, data) => {
      if (err) {
        console.log(err)
        res.status(500).json({ message: err })
      }
      else {
        res.send(data.buffer)
      }
    })
})

app.listen(3000, function () {
  console.log('slsk client listening on port 3000!')
})

app.on('error', (err) => {
  console.log('whoops! there was an error', err.stack);
})
