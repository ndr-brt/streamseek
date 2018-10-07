const fs = require('fs')
const path = require('path')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const FileSync = require('lowdb/adapters/FileSync')
const projectFolder = require('os').homedir().concat(path.sep + '.streamseek')

module.exports = jsonDB = {
  _dbs : {},
  _add : function (dbName) {
    console.log('adding ' + dbName)
    this._dbs[dbName] = {
      db : low(new Memory()),
      pageNum : 1,
      per_page : 10
    }
  },

  write: function (dbName, content) {
    !this.exists(dbName) && this._add(dbName)
    var t = this,
        db = t._dbs[dbName].db
    db.setState({})
    return new Promise((resolve, reject) => {
      console.log('in promise storing ' + content.length + ' results')
      if (!content) reject(new Error('Content not specified'))
      // storing physical json file:
      // t.db.defaults(JSON.parse(content)).write()
      // storing in memory search results:
      db.defaults( { results: content } ).write()
      console.log('stored ' + t.count(dbName) + ' results')
      resolve(t.getPage(dbName))
    })
  },

  all: function (db_idx) {
    return this.exists(db_idx)
          && this._dbs[db_idx].db.get('results').value()
  },

  count: function (db_idx) {
    return this.exists(db_idx)
          && this._dbs[db_idx].db.get('results').size()
  },

  getPage: function(dbName, start, limit) {
    if (!this.exists(dbName)) return false
    start = start || this._dbs[dbName].pageNum
    limit = limit || this._dbs[dbName].per_page
    var offset = (start - 1) * limit
    return this._dbs[dbName].db.get('results')
        .drop(offset).take(limit).value()
  },

  exists: function(dbName) {
    return this._dbs.hasOwnProperty(dbName)
  }
}
