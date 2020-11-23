'use strict'
/*
 * ### Finish up todo ##
 * - [ ] Add file header + description
 * - [ ] Add verbose logs
 * - [ ] Add db logger if configured in file
*/
const getFiles = require('@lib/helpers/get-files')
const { flattenDeep } = require('lodash')
const { createLogger } = require('winston')
const { join } = require('path')

module.exports = {

  name: 'logger',

  description: 'Setting up logger transporters',

  order: -50,

  fn: async ({ settings: { logs = {} } }) => {

    // Prepare constant data
    let { level = 'silly', transporters = ['console'] } = logs
    if (typeof transporters === 'string') { // TODO: + enhanced verification

      transporters = transporters.split(',')

    }

    // Prepare promises of `transporter.js` files searcher in lib directory and custom directory
    const options = { depth: true, extension: 'transporter.js' }
    const libTransportersPromise = getFiles(join(__dirname, './../loggers'), options)
    const customTransportersPromise = getFiles(join(__dirname, './../../api/loggers'), options)

    // Recursively flattens built arrays of transporters'paths from promises
    const transporterFiles = flattenDeep(await Promise.all([libTransportersPromise, customTransportersPromise]))

    // For each files, add the new transporter in logger
    const transports = []
    transporterFiles.forEach((filePath) => {

      // Get file content
      const { name, fn } = require(filePath)

      // If transporter is enabled in settings, add it to logger
      if (transporters.includes(name)) { // TODO: lowercase compare + enhanced verification

        transports.push(fn())

      }

    })

    // Return logger
    return createLogger({ level, transports })

  } // •-

}
