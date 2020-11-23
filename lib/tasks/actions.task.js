'use strict'
/*
 * IDEA: All policies applied by default -> disable policies in a config file ?
 * ### Finish up todo ##
 * - [ ] Add file header + description
 * - [✓] midd. $updateCtx(name, responses)
 * - [ ] midd. $can(permissions)
 * - [✓] midd. $validator(inputs)
 * - [ ] handle routes in config file instead of directly in action file ?
*/
const getFiles = require('@lib/helpers/get-files')
const getAction = require('@lib/helpers/templates/get-action')
const getPolicy = require('@lib/helpers/templates/get-policy')
const { fn: $validator } = require('@lib/policies/validator.policy')
const { fn: $updateCtx } = require('@lib/policies/context.policy')
const { Router } = require('express')
const { join, parse } = require('path')

module.exports = {

  name: 'actions',

  description: 'Setting up actions',

  order: 999,

  fn: async (ctx) => {

    // Prepare constant data
    const router = Router()

    // Prepare promises of `action.js` files searcher in api directory
    const options = { depth: false, extension: 'action.js' }
    const actionsDirectory = join(__dirname, './../../api/actions')
    const actionFiles = await getFiles(actionsDirectory, options)

    // For each files, create a new action
    let i = 0
    while (actionFiles[i]) {

      // Get file content
      const path = actionFiles[i]
      await getAction(path)
        .then(async ({ name = 'n/c.', method = 'ALL', route, policies = [], inputs = {}, responses = {}, fn }) => {

          // Build route policies
          const defaultPolicies = []

          let j = 0
          while (policies[j]) {

            // TODO: Hanle policy exits
            const { fn } = await getPolicy(join(__dirname, './../../api/policies', `${policies[j]}.policy.js`))
            defaultPolicies.push(fn(ctx))
            j++

          }

          // We add the new route here such as defined in its action file
          router[method.toLowerCase()](route, [$updateCtx(ctx, name, inputs, responses), ...defaultPolicies, $validator(ctx)], fn.call(null, ctx)) // eslint-disable-line

        })
        .catch(({ message }) => {

          const { name } = parse(path)
          console.log(`\u001b[7m ${name}.js \u001b[0m file ignored.`, message)

        })
        .finally(() => i++)

    }

    // Unfound for any other request
    router.use('/*', (req, res) => res.unfound())

    return router

  } // •-

}
