var express = require('express')
var app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path');
const projectFolder = require('os').homedir().concat('/.streamseek')
const login = require('./login')
const transformResponse = require('./transform-response')
var jsonDB = new (require('./jsondata'))()
// AB for testing only:
function bufferFile(absPath) {
  return fs.readFileSync(absPath, { encoding: 'utf8' });
}
let fakeData = bufferFile(projectFolder + '/json_test.json')

this.client = undefined

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.get('/results/:page/:limit', function(req, res) {
  console.log('in route results/' + req.params.page + '/' + req.params.limit)
  let page = req.params.page || 1,
      limit = req.params.limit || 10,
      jsonOut = {
        count: jsonDB.count(),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pagedResults: jsonDB.getPage(page, limit)
      }
  res.status(200).json(jsonOut)
})

app.post('/login', function (req, res) {
  console.log('Login request for user ' + req.body.username)
  login(req.body.username, req.body.password)
    .then(client => {
      this.client = client
      console.log('Login successful');
      res.status(204).json({ message: 'client connected' })
    })
    .catch(err => {
      console.log('Catched error ' + err)
      res.status(401).json({ message: err.toString() })
    })
})

app.post('/search', function (req, res) {
  // AB se test da file json:
  jsonDB.write(fakeData).then(function(paged) {
    res.status(200).json({
      count: jsonDB.count(),
      page: jsonDB.pageNum,
      limit: jsonDB.per_page,
      pagedResults: paged
    })
  }).catch(error => {
    console.log('in catch! ' + error)
    res.status(500).json({message: error})
  })
  // AB con ricerca:
  // this.client.search(req.body, (err, results) => {
  //   if (err) {
  //     res.status(500).json({ message: err })
  //   } else {
    //  jsonDB.write(transformResponse(results)).then(function(paged) {
    //     res.status(200).json({
    //       count: jsonDB.count(),
    //       pagedResults: paged
    //     })
    //   }).catch(error => {
    //     console.log('in catch! ' + error)
    //     res.status(500).json({message: error})
    //   })

  //     // res.json(transformResponse(results))
  //   }
  // })
})

app.get('/play/:key', function (req, res) {
  console.log('Request to play: ' + req.params.key)
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
          var file = fs.createWriteStream(projectFolder.concat('/').concat(request[1]))
          data.on('data', chunk => {
            res.write(chunk)
            file.write(chunk)
          })
          data.on('end', () => {
            console.log('File fetched')
            res.end()
            file.end()
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

app.listen(9090, function () {
  if (!fs.existsSync(projectFolder)) {
    fs.mkdirSync(projectFolder)
    console.log('Created project folder on ' + projectFolder)
  }
  else {
    console.log('Project folder ' + projectFolder + ' already exists')
  }
  console.log('slsk client listening on port 9090!')
})

app.on('error', (err) => {
  console.log('whoops! there was an error', err.stack);
})
