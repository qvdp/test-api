const path = require('path')
const fs = require('fs')
const removeFile = require('./remove-file')

module.exports = async (dirPath) => new Promise((resolve, reject) => {

  fs.readdir(dirPath, async (err, files) => {

    if (err) {

      return reject(err)

    }

    let i = 0
    while (files[i]) {

      await removeFile(path.join(dirPath, files[i])).catch((err) => reject(err))
      i++

    }
    return resolve()

  })

})
