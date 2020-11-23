'use strict'

/*
 * ### Finish up todo ##
 * - [ ] Add file header + description
 * - [ ] Add verbose logs
 * - [ ] Handle error
 *        - [ ] Mal formated file (send warn at startup)
*/
const getFiles = require('@lib/helpers/get-files')
const getRule = require('@lib/helpers/templates/get-rule')
const { compact, camelCase, merge, set } = require('lodash')
const { join, parse } = require('path')
const { validationResult, checkSchema } = require('express-validator')

module.exports = {

  name: 'validators',

  description: 'Setting up validators',

  order: -40,

  fn: async () => {

    // Prepare data
    const validators = {}

    // Prepare promises of `rule.js` files searcher in api directory
    const options = { depth: true, extension: 'rule.js' }
    const rulesDirectory = join(__dirname, './../../api/policies/rules')
    const ruleFiles = await getFiles(rulesDirectory, options)

    // For each files, create a new rule validator
    let i = 0
    while (ruleFiles[i]) {

      // Get file content
      const path = ruleFiles[i]
      await getRule(path)
        .then(async ({ rule }) => {

          // Build a function that will let us use stand-alone validation every where
          const runner = async (data) => {

            // Prepare validation chain from schema
            const chains = checkSchema({ data: rule })

            // Build an objet similar to `req` with the data you want to validate
            const sample = { body: { data } }

            // Run all validation from the chain
            await Promise.all(chains.map(chain => chain.run(sample)))
            return new Promise((resolve, reject) => {

              const errors = validationResult(sample)
              if (errors.isEmpty()) {

                return resolve()

              }
              return reject(errors)

            })

          }

          // Assign validators
          // Get splitted path to rule
          const { dir, name } = parse(path)
          const tree = compact(dir.replace(`${rulesDirectory}`, '').split('/'))

          // Assign the new validator with its path
          const camelizedName = camelCase(name.replace('.rule', ''))
          const validator = {
            [camelizedName]: runner,
            [`schema/${camelizedName}`]: rule
          }
          merge(validators, tree.length ? set({}, tree.join('.'), validator) : validator)

        })
        .catch(({ message }) => {

          const { name } = parse(path)
          console.log(`\u001b[7m ${name}.js \u001b[0m file ignored.`, message)

        })
        .finally(() => i++)

    }

    // Return built validators
    return validators

  } // •-

}
