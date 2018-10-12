const fs = require('fs')
const path = require('path')
const low = require('lowdb')
const Memory = require('lowdb/adapters/Memory')
const FileSync = require('lowdb/adapters/FileSync')
const projectFolder = require('os').homedir().concat(path.sep + '.streamseek')

module.exports = jsonDB = (function(){
  var _dbs = {};
  return {
    add : function (dbName) {
      console.log('adding ' + dbName)
      _dbs[dbName] = {
        db : low(new Memory()),
        pageNum : 1,
        per_page : 10
      }
    },
    getProp: function(prop, dbName) {
      if (this.exists(dbName)) {
        return _dbs[dbName].hasOwnProperty(prop)
              && _dbs[dbName][prop]
      } else return false
    },
    write: function (dbName, content) {
      !this.exists(dbName) && this.add(dbName)
      var t = this,
          db = t.getProp("db", dbName)
      db.setState({})
      return new Promise((resolve, reject) => {
        console.log('in promise storing ' + content.length + ' results')
        if (!content) reject(new Error('Content not specified'))
        // storing physical json file:
        //db.defaults(JSON.parse(content)).write()

        // storing in memory search results:
        db.defaults( { results: content } ).write()
        console.log('stored ' + t.count(dbName) + ' results')
        resolve(t.getPage(dbName))
      })
    },

    all: function (db_idx) {
      return this.exists(db_idx)
            && this.getProp("db", db_idx).get('results').value()
    },

    count: function (db_idx) {
      return this.exists(db_idx)
            && this.getProp("db", db_idx).get('results').size()
    },

    getPage: function(dbName, start, limit) {
      if (!this.exists(dbName)) return false
      start = start || this.getProp("pageNum", dbName)
      limit = limit || this.getProp("per_page", dbName)
      var offset = (start - 1) * limit
      return this.getProp("db", dbName).get('results')
          .drop(offset).take(limit).value()
    },

    exists: function(dbName) {
      return _dbs.hasOwnProperty(dbName)
    }
  }
}())
