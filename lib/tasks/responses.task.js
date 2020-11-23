'use strict'
/*
 *  responses.task.js
 *
 *  This task builds responses from response directory `api/responses` and assign it to
 *  both ctx & res objects.
 *
 *  Useful to handle pre defined http responses with custom name, description, data...
 *
 *  TODO:
 *   - [ ] Enhance customisation by handling function .response file (to act like a ending policy)
 */
const getFiles = require('@lib/helpers/get-files')
const getResponse = require('@lib/helpers/templates/get-response')
const { flattenDeep, camelCase } = require('lodash')
const { parse, join } = require('path')

module.exports = {

  name: 'responses',

  description: 'Setting up predefined response',

  order: -30,

  fn: async ({ logger }) => {

    // Prepare constant data
    const responses = {}

    // Prepare promises of `response.js` files searcher in lib directory and custom directory
    const options = { depth: true, extension: 'response.js' }
    const libResponsesPromise = getFiles(join(__dirname, './../responses'), options)
    const customResponsesPromise = getFiles(join(__dirname, './../../api/responses'), options)

    // Recursively flattens built arrays of responses'paths from promises
    const responsesFiles = flattenDeep(await Promise.all([libResponsesPromise, customResponsesPromise]))

    // For each files, create a new response & assign it to responses object
    let i = 0
    while (responsesFiles[i]) {

      // Get file content
      const path = responsesFiles[i]
      await getResponse(path)
        .then(async ({ code, description }) => {

          // Get name from path
          const { name: fileName } = parse(path)
          const name = camelCase(fileName.replace('.response', ''))

          // Assign the new response
          Object.assign(responses, {
            [name]: (res, args) => {

              // Get custom responses dictionnary from locals
              const { ctx: { name: actionName = 'UNFOUND', responses = {}, reqIdentifiers: { mix, timer } } } = res.locals

              // Build custom data
              let custom = {}
              if (Object.keys(responses).includes(name)) {

                const { code: customCode, description: customDescription, ...customization } = responses[name]
                code = customCode || code
                description = customDescription || description
                custom = customization

              }

              // Prepare request duration measurement fn
              const getDuration = (start) => Math.ceil(process.hrtime(start)[1] / 1e6)

              // Trigger the response & log
              const level = code < 400 ? 'info' : code < 500 ? 'warn' : 'error'
              logger[level](`${mix} ${actionName.toUpperCase()} (cont.) - Ended with ${name} \u001b[37;2m(${getDuration(timer)}ms - \u001b[0m\u001B[32m${code}\u001b[37;2m)\u001b[0m`)
              logger.info('')
              return res.status(code).send({ name, description, ...custom, ...args })

            }

          })

        })
        .catch((err) => {

          // Build file entry path
          const { name } = parse(path)
          console.log(`\u001b[7m ${name}.js \u001b[0m file ignored.`, err.message)

        })
        .finally(() => i++)

    }

    // Build a middlewares function from responses object
    // & handle custom responses
    const middlewares = (req, res, next) => {

      Object.keys(responses).forEach((response) => {

        Object.assign(res, { [response]: (args) => responses[response](res, args) })

      })
      next()

    }

    // Return built responses & middlewares
    return { middlewares, ...responses }

  } // •-

}
