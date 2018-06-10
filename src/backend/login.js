const slsk = require('slsk-client')

module.exports = (username, password) => {
  return new Promise((resolve, reject) => {
    slsk.connect({
      user: username,
      pass: password
    }, (err, client) => {
      if (err) {
        reject(err)
      } else {
        resolve(client)
      }
    })
  })
}
