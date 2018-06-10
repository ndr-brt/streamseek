var express = require('express')
var app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const projectFolder = require('os').homedir().concat('/.streamseek')
const login = require('./login')

this.client = undefined

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.post('/login', function (req, res) {
  console.log('Login request for user ' + req.body.username)
  login(req.body.username, req.body.password)
    .then(client => {
      this.client = client
      console.log('Login successful');
      res.status(204).json({ message: 'client connected' })
    })
    .catch(err => {
      console.log('Catched error ' + err);
      res.status(500).json({ message: err.toString() })
    })
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
        .filter(it => it.slots)
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
    key: Buffer.from(it.user + '|' + it.file).toString('base64'),
    file: it.file,
    size: it.size,
    bitrate: it.bitrate,
    name: name
  }

  if (name.endsWith('.mp3') || name.endsWith('.m4a') || name.endsWith('.flac')) {
    acc[folder].songs.push(file)
  } else if (name.endsWith('.jpg') || name.endsWith('.jpeg') || name.endsWith('png')) {
    acc[folder].images.push(file)

    var smallestImage = acc[folder].images.sort((a, b) => b.size - a.size)[0]
    acc[folder].cover = smallestImage.key
  } else {
    acc[folder].files.push(file)
  }

  return acc;
}

app.get('/play/:key', function (req, res) {
  console.log('Request to play')
  let request = Buffer.from(req.params.key, 'base64')
                      .toString('ascii')
                      .split('|')
  let prefetch = projectFolder.concat('/').concat(request[1])
  if (fs.existsSync(prefetch)) {
    console.log('Prefetch file exists: ' + prefetch)
    var stream = fs.createReadStream(prefetch)
    stream.on('data', chunk => res.write(chunk))
    stream.on('end', () => res.end())
  } else {
    console.log('Prefetch not exists, get: ' + request[1] + ' directly from peer')
    this.client.downloadStream({
        file: {
          user: request[0],
          file: request[1]
        },
      }, (err, data) => {
        if (err) {
          console.log(err)
          res.status(500).json({ message: err })
        }
        else {
          console.log('Start getting data')
          data.on('data', chunk => res.write(chunk))
          data.on('end', () => {
            res.end()
          })
        }
      })
  }
})

app.get('/fetch/:file', function (req, res) {
  let request = Buffer.from(req.params.file, 'base64')
                      .toString('ascii')
                      .split('|')
  console.log('Fetch from user ' + request[0] + ' this song: ' + request[1])
  this.client.downloadStream({
      file: {
        user: request[0],
        file: request[1]
      }
    }, (err, data) => {
      if (err) {
        console.log(err)
        res.status(500).json({ message: err })
      }
      else {
        var file = fs.createWriteStream(projectFolder.concat('/').concat(request[1]))

        data.on('data', chunk => file.write(chunk))

        data.on('end', function () {
          file.end()
          console.log('File ' + request[1] + ' fetched correctly')
          res.status(200).json({ message: request[1] + ' fetched'})
        })
      }
    })
})

app.listen(3000, function () {
  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder)
    console.log('Created project folder on ' + projectFolder)
  }
  else {
    console.log('Project folder ' + projectFolder + ' already exists')
  }

  console.log('slsk client listening on port 3000!')
})

app.on('error', (err) => {
  console.log('whoops! there was an error', err.stack);
})
