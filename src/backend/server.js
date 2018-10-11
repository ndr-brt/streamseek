var express = require('express')
var app = express()
const bodyParser = require('body-parser')
const fs = require('fs')
const path = require('path');
const projectFolder = require('os').homedir().concat('/.streamseek')
const login = require('./login')
const transformResponse = require('./transform-response')
var jsonDB = require('./jsondata')
// AB for testing only:
// function bufferFile(absPath) {
//   return fs.readFileSync(absPath, { encoding: 'utf8' });
// }
// let fakeData = bufferFile(projectFolder + '/json_test.json')

this.client = undefined

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(bodyParser.json());

app.post('/results/:page/:limit', (req, res) => {
  //console.log(req.body.username + ' in route results/' + req.params.page + '/' + req.params.limit)
  let pagCnt = Math.ceil(jsonDB.count(req.body.username)
              / jsonDB._dbs[req.body.username].per_page)
  if (1 > pagCnt) pagCnt = 1
  let page = req.params.page || 1,
      limit = req.params.limit || jsonDB.per_page,
      jsonOut = {
        count: jsonDB.count(req.body.username),
        page: parseInt(page, 10),
        limit: parseInt(limit, 10),
        pageCount: pagCnt,
        pagedResults: jsonDB.getPage(req.body.username, page, limit)
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
      console.log('/login Catched error ' + err)
      res.status(401).json({ message: err.toString() })
    })
})

app.post('/search', function (req, res) {
  // TESTING ONLY! using physical json file:
  // jsonDB.write(req.body.username, fakeData).then(function(paged) {
  //   var pagCnt = Math.ceil(jsonDB.count(req.body.username)
  //             / jsonDB._dbs[req.body.username].per_page)
  //   if (0 === pagCnt) pagCnt = 1
  //   res.status(200).json({
  //     count: jsonDB.count(req.body.username),
  //     page: jsonDB._dbs[req.body.username].pageNum,
  //     pageCount: pagCnt,
  //     limit: jsonDB._dbs[req.body.username].per_page,
  //     pagedResults: paged
  //   })
  // }).catch(error => {
  //   console.log('in catch! ' + error)
  //   res.status(500).json({message: error})
  // })

  // using ram to store the actual search results:
  this.client.search(req.body, (err, results) => {
    if (err) {
      res.status(500).json({ message: err, type: typeof err })
    } else {
      jsonDB.write(req.body.username, transformResponse(results)).then(function(paged) {
        var pagCnt = Math.ceil(jsonDB.count(req.body.username)
                    / jsonDB._dbs[req.body.username].per_page)
        if (0 === pagCnt) pagCnt = 1
        res.status(200).json({
          count: jsonDB.count(req.body.username),
          page: jsonDB._dbs[req.body.username].pageNum,
          pageCount: pagCnt,
          limit: jsonDB._dbs[req.body.username].per_page,
          pagedResults: paged
        })
      }).catch(error => {
        console.log(error)
        res.status(500).json({message: error, type:'catch! ' + typeof err})
      })
      // res.json(transformResponse(results))
    }
  })
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
