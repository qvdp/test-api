const fs = require('fs')

module.exports = (path) => new Promise((resolve, reject) => {

  if (path.includes('README')) {

    return resolve()

  }

  fs.unlink(path, (err) => {

    if (err) {

      return reject(err)

    }
    return resolve()

  })

})
