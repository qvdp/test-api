'use strict'
/*
 *  helpers.task.js
 *
 *  This task simply reassign all helpers from `api/helpers` directory to the ctx object,
 *  respecting the folder hierarchy
 *
 *  Useful to access api's helpers without the use of require. For example, the following helper
 *  could be used this way:
 *
 *    api/
 *    └── actions/
 *    └── helpers/
 *        └── amazon-s3/
 *            └── get-signed-url.helper.js
 *
 *  ```
 *    const result = ctx.helpers.amazonS3.getSignedUrl()
 *  ```
 */

const getFiles = require('@lib/helpers/get-files')
const getHelper = require('@lib/helpers/templates/get-helper')
const { join, parse } = require('path')
const { compact, camelCase, merge, set } = require('lodash')

module.exports = {

  name: 'helpers',

  description: 'Assign helpers from `api/helpers` directory to the ctx object',

  order: -20,

  fn: async () => {

    // Prepare constant data
    const helpers = {}

    // Prepare promises of `helper.js` files searcher in lib directory and custom directory
    const options = { depth: true, extension: 'helper.js' }
    const helpersDirectory = join(__dirname, './../../api/helpers')
    const helpersFiles = await getFiles(helpersDirectory, options)

    // For each files, create a new helper
    let i = 0
    while (helpersFiles[i]) {

      // Get file content
      const path = helpersFiles[i]
      await getHelper(path)
        .then(async ({ fn }) => {

          // Get splitted path to helper
          const { dir, name } = parse(path)
          const tree = compact(dir.replace(`${helpersDirectory}`, '').split('/'))

          // Assign the new helper with its path
          const helper = { [camelCase(name.replace('.helper', ''))]: fn }
          merge(helpers, tree.length ? set({}, tree.join('.'), helper) : helper)

        })
        .catch(({ message }) => {

          const { name } = parse(path)
          console.log(`\u001b[7m ${name}.js \u001b[0m file ignored.`, message)

        })
        .finally(() => i++)

    }
    return helpers

  } // •-

}
