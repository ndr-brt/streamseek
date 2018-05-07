const slsk = require('slsk-client')
require('fs')

this.login = function (credentials) {
  return new Promise(function (resolve, reject) {
    slsk.connect({
      user: credentials.username,
      pass: credentials.password
    }, (err, client) => {
      if (err) {
        reject(err)
      } else {
        resolve(client)
      }
    })
  })
}
