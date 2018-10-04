const fs = require('fs')
const path = require('path')
const low = require('lowdb')
//const FileSync = require('lowdb/adapters/FileSync')
const Memory = require('lowdb/adapters/Memory')
const projectFolder = require('os').homedir().concat(path.sep + '.streamseek')

let jsonData = function () {
  this.db = low(new Memory())
  this.pageNum = 1
  this.per_page = 10
}

jsonData.prototype = {
  write: function (/* filename, */ content) {
    var t = this
    // this.db = low(new Memory())
    // this.db.defaults(content).write()
    // return this.db
    // projectFolder.concat(path.sep + filename)
    // this.fName = projectFolder.concat(path.sep +
    //   filename.replace(/\s+/g, "_") + "_" + (new Date()).getTime() + ".json")
    // this.fName = projectFolder.concat(path.sep + filename)
    return new Promise((resolve, reject) => {
      if (!content) reject()
      t.db = low(new Memory())
      t.db.defaults(JSON.stringify(content)).write()
      resolve(t.db)
    // fs.writeFile(t.fName, JSON.stringify(content), 'utf8', function (err) {
    //   if (err) {
    //     reject(err)
    //   } else {
    //     t.db = low(new FileSync(t.fName))
    //     resolve()
    //   }
    // })
    })
  },
  all: function () {
    return this.db.get('results').value()
  },
  count: function () {
    return this.db.get('results').size()
  },
  getPage: function (start, limit) {
    start = start || this.pageNum
    limit = limit || this.per_page
    var offset = (start - 1) * limit
    return this.db.get('results')
        .drop(offset)
        .take(limit)
        .value()
  }
}

module.exports = jsonData
