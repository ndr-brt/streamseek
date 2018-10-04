const fs = require('fs')
const path = require('path')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const projectFolder = require('os').homedir().concat(path.sep + '.streamseek')

let jsonData = function () {
  this.db = low(new Memory())
  this.pageNum = 1
  this.per_page = 10
}

jsonData.prototype = {
  write: function (content) {
    var t = this
    return new Promise((resolve, reject) => {
      if (!content) reject(new Error('Content not specified'))
      // AB se test da file json devo chiamare JSON.parse
      t.db.defaults(JSON.parse(content)).write()
      // altrimenti la chiamata risulta essere:
      // t.db.defaults(content).write()
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
