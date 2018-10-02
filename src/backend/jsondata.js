const fs = require('fs')
const low = require('lowdb')
const path = require('path')
const FileSync = require('lowdb/adapters/FileSync')
const projectFolder = require('os').homedir().concat(path.sep + '.streamseek')
const filename = 'json_test.json'

let jsonData = function () {
  this.fName = ''
  this.db = null
  this.pageNum = 1
  this.per_page = 10
}

jsonData.prototype = {
  checkFile: function () {
    return fs.existsSync(this.fName)
  },
  createDb: function(filename) {
    // this.fName = projectFolder.concat(path.sep +
    //   filename.replace(/\s+/g, "_") + "_" + (new Date()).getTime() + ".json")
    this.fName = projectFolder.concat(path.sep + filename)
    this.db = low(new FileSync(this.fName))
  },
  write: function (fName, content, cb) {
    if (!this.checkFile()) this.createDb(fName)
    fs.writeFile(this.fName, JSON.stringify(content), 'utf8', cb)
  },
  all: function () {
    return JSON.stringify(
      this.db.get('results').value()
    )
  },
  count: function () {
    return JSON.stringify(
      this.db.get('results').size()
    )
  },
  getPage: function (start, limit) {
    start = start || this.pageNum
    limit = limit || this.per_page
    var offset = (start - 1) * limit
    return JSON.stringify(
      this.db.get('results')
        .drop(offset)
        .take(limit)
        .value()
    )
  }
}

module.exports = jsonData

/*
var objJson = new jsonData(filename)
objJson.createDb(filename)
console.log(objJson.fName)
console.log('totale oggetti in file json: ' + objJson.count())
console.log(objJson.getPage())*/
