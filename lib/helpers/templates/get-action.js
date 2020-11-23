'use strict'
/*
 *  get-action.js
 *
 *  This helper simply verify each files stored in '@/api/helpers' directory by
 *  ensuring the good definition of an helper.
 *
 *  An helper should be composed of an export including at least a name & a function.
 *
 *  ```
 *   module.exports = {
 *
 *     name: 'Hello world',
 *
 *     description: 'Simple first Hello World route.',
 *
 *     method: 'GET',
 *
 *     route: '/hello',
 *
 *     policies: ['is-authorized'],
 *
 *     inputs: {
 *
 *       success: {
 *         description: 'My custom description'
 *       }
 *
 *     },
 *
 *     responses: {
 *
 *       success: {
 *         description: 'My custom description'
 *       }
 *
 *     },
 *
 *     fn: ({ logger, responses }) => async (req, res) => {...}
 *
 *   }
 *  ```
 */
const { access, F_OK } = require('fs')
module.exports = (filePath = '') => new Promise((resolve, reject) => {

  // Verify path exist
  access(filePath, F_OK, (err) => {

    if (err) {

      // Trigger warning if there is an error
      return reject(new Error('E_FILE_UNFOUND'))

    }

    // Get file content
    const content = require(filePath)

    // Verify this is an object
    if (typeof content !== 'object' || Array.isArray(content)) {

      return reject(new Error('Please, ensure your exporting an object.'))

    }

    const { name, description, method = 'ALL', route, policies, inputs, responses, fn } = content
    if (!name || !fn || !method || !route) {

      return reject(new Error('Please, ensure you gave a `name`, a `method`, a `route` and a `fn` (function) to this action.'))

    }

    // Name verification
    if (typeof name !== 'string') {

      return reject(new Error('Please, ensure the `name` of this action is in string format.'))

    }

    // Description verification
    if (description && typeof description !== 'string') {

      return reject(new Error('Please, ensure the `description` of this action is in string format.'))

    }

    // Method verification
    if (typeof method !== 'string' || !['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'ALL'].includes(method.toUpperCase())) {

      return reject(new Error(`Please, ensure the \`method\` of this action is a string and match one of ['GET', 'PUT', 'PATCH', 'POST', 'DELETE', 'ALL'].`))

    }

    // Route verifiation
    if (typeof route !== 'string') {

      return reject(new Error('Please, the `route` of this action is in string format.'))

    }

    // Policies verification
    if (policies && (typeof policies !== 'object' || !Array.isArray(policies) || !policies.every((policy) => typeof policy === 'string'))) {

      return reject(new Error('Please, ensure `policies` of this action is an array of policy\'s name in string format.'))

    }

    // Inputs verification
    if (inputs && (typeof inputs !== 'object' || !Object.values(inputs).every((value) => typeof value === 'string'))) {

      return reject(new Error('Please, ensure `inputs` of this action are well defined.'))

    }

    // Responses verification
    // ...TODO

    // Fn verification
    if (typeof fn !== 'function') {

      return reject(new Error('Please, ensure the `fn` from this action is a function.'))

    }
    return resolve({ name, description, method, route, policies, inputs, responses, fn })

  }) // -•

})
