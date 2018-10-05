const fs = require('fs')
const path = require('path')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const FileSync = require('lowdb/adapters/FileSync')
const projectFolder = require('os').homedir().concat(path.sep + '.streamseek')

module.exports = jsonDB = {
  _dbs : {},
  _add : function (dbName) {
    this._dbs[dbName] = {
      db : low(new Memory()),
      pageNum : 1,
      per_page : 10
    }
  },
  write: function (dbName, content) {
    if ( !this._dbs[dbName] )
      this._add(dbName)
    var t = this._dbs[dbName].db
    t.setState({})
    return new Promise((resolve, reject) => {
      if (!content) reject(new Error('Content not specified'))
      // Parsing physical json file:
      // t.db.defaults(JSON.parse(content)).write()

      // Parsing in memory search results:
      t.defaults( { results: content } ).write()
      resolve(t.getPage())
    })
  },
  all: function (db_idx) {
    return this._dbs[db_idx].db.get('results').value()
  },

  count: function (db_idx) {
    return this._dbs[db_idx].db.get('results').size()
  },

  getPage: function (start, limit, dbName) {
    start = start || this.pageNum
    limit = limit || this.per_page
    var offset = (start - 1) * limit
    return this._dbs[dbName].db.get('results')
        .drop(offset)
        .take(limit)
        .value()
  }
}
