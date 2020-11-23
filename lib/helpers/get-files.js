'use strict'
/*
 * ### Finish up todo ##
 * - [ ] Add file header + description
 * - [ ] Add verbose logs
*/
const path = require('path')
const fs = require('fs')
const defaultExceptions = ['README', 'README.md', '.gitkeep']

module.exports = (directoryPath, options = {}) => new Promise((resolve, reject) => {

  // Prepare array to return
  const entries = []

  // Build recursive logic to parse a directory to an
  // array of dictory entries.
  const { depth = false, extension, exceptions = [] } = options
  const getFiles = (dir, functionPointer) => {

    fs.readdirSync(dir).forEach(fileEntry => {

      // Build file entry path
      const dirPath = path.join(dir, fileEntry)
      const isDir = fs.statSync(dirPath).isDirectory()
      // If path correspond to a directoy, get files deeper
      if (isDir && depth) {

        getFiles(dirPath, functionPointer)

      } else if (!isDir && ![...exceptions, ...defaultExceptions].includes(fileEntry) && ((extension && fileEntry.includes(extension)) || !extension)) {

        // Finally, just apply the function
        functionPointer(dirPath)

      }

    })

  }

  // Verify directory exist
  if (fs.existsSync(directoryPath)) {

    // Call the recursive logic
    getFiles(directoryPath, (filePath) => entries.push(filePath))

  }

  // TODO: Handle error
  if (!entries) {

    return reject(new Error('E_EMPTY'))

  }

  // Return built arrays
  return resolve(entries)

}) // -•
