'use strict'

/*
 * ### Finish up todo ##
 * - [ ] Add file header + description
 * - [ ] Add verbose logs
 * - [ ] Handle setting defined only in json files ?
 */
const getFiles = require('@lib/helpers/get-files')
const config = require('config')
const _ = require('lodash')
const { join, parse } = require('path')

module.exports = {

  name: 'settings',

  description: 'Setting up configurations',

  order: -60,

  fn: async () => {

    // Prepare constant data
    const configurationSettings = {}
    const configurationDirectory = 'config'

    // Build configuration settings object
    // Get config directory path
    const directoryPath = join(__dirname, `./../../${configurationDirectory}`)

    // Get all `config.js` files at config directory root
    const configFiles = await getFiles(directoryPath)

    // For each files, assign its content to the config object recursively
    configFiles.forEach((filePath) => {

      // Bufferize file settings
      const buff = {}

      // Get file content & name
      const { name: file } = parse(filePath)
      const fileContent = require(filePath)

      // Here we do the recursive logic in order to be able to assign all config variable
      // of each file one by one with this priority
      //    -> Environment variables: process.env
      //    -> Environment config files: config/env/production.js
      //    -> Config dedicated files: config/customs.js
      if (fileContent && typeof fileContent === 'object' && Object.keys(fileContent).length) {

        const flattenKey = (path, key) => (`${path}${path ? '.' : ''}${key}`)

        const iterate = (object, path) => {

          Object.keys(object).forEach((key) => {

            const builtKey = flattenKey(path, key)
            if (typeof object[key] === 'object' && !Array.isArray(object[key])) {

              iterate(object[key], builtKey)

            } else {

              let val
              if (config.has(`${file}.${builtKey}`)) {

                val = config.get(`${file}.${builtKey}`)

              }
              _.set(buff, builtKey, val || object[key] || undefined)

            }

          })

        }

        iterate(fileContent, '')

        Object.assign(configurationSettings, { [file]: buff })

      }

    })
    return configurationSettings

  } // •-

}
