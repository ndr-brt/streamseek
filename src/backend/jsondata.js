const fs = require('fs')
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const filename = 'json_test.json'

// module.exports = {
let jsonData = {
  checkFile: function() {
    return fs.existsSync(filename)
  },
  write: function(content) {
    fs.writeFile(filename, JSON.stringify(content), function(err) {
        if (err) return false
        return true
    })
  },
  db: low(new FileSync(filename)),
  page: 1,
  per_page: 10,
  all: function() {
    return JSON.stringify(
      this.db.get('results').value()
    )
  },
  count: function() {
    return JSON.stringify(
      this.db.get('results').size()
    )
  },
  page: function(start, limit) {
    var start = start || this.page,
        limit = limit || this.per_page,
        offset = (start - 1) * limit
    return JSON.stringify(
      this.db.get('results')
        .drop(offset)
        .take(limit)
        .value()
    )
  }
}

console.log(jsonData.checkFile())
 console.log(jsonData.count())
// console.log(obj.all())
console.log(jsonData.page())
