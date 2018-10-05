const fs = require('fs')
const path = require('path')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const FileSync = require('lowdb/adapters/FileSync')
const projectFolder = require('os').homedir().concat(path.sep + '.streamseek')

let jsonData = function () {
  this.db = low(new Memory())
  this.pageNum = 1
  this.per_page = 10
}

jsonData.prototype = {
  write: function (content) {
    var t = this
    t.db.setState({})
    return new Promise((resolve, reject) => {
      if (!content) reject(new Error('Content not specified'))
      // Parsing physical json file:
      //t.db.defaults(JSON.parse(content)).write()

      // Parsing in memory search results:
      t.db.defaults( { results: content } ).write()
      resolve(t.getPage())
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
