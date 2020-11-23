const fs = require('fs')

module.exports = (path, template) => new Promise((resolve, reject) => {

  fs.writeFile(path, template, (err) => {

    if (err) {

      return reject(err)

    }
    return resolve()

  })

})
