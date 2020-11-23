'use strict'
/*
 *  get-policy.js
 *
 *  This helper simply verify each policy stored in '@/api/policies' directory by
 *  ensuring the good definition of a policy.
 *
 *  An policy should be composed of an export including at least a name & a function.
 *
 *  ```
 *   module.exports = {
 *
 *     name: 'Hello world',
 *
 *     description: 'Simple first Hello World route.',
 *
 *     fn: ({ logger, responses }) => async (req, res, next) => {...}
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

    const { name, description, fn } = content
    if (!name || !fn) {

      return reject(new Error(name ? 'You need to export a function under `fn` property in your policy object.' : 'Please, ensure you gave a `name` to your policy.'))

    }

    // Name verification
    if (typeof name !== 'string') {

      return reject(new Error('Please, ensure the `name` of this policy is in string format.'))

    }

    // Description verification
    if (description && typeof description !== 'string') {

      return reject(new Error('Please, ensure the `description` of this policy is in string format.'))

    }

    // Fn verification
    if (typeof fn !== 'function') {

      return reject(new Error('Please, ensure the `fn` from this policy is a function (async or synchrounous).'))

    }
    return resolve({ name, description, fn })

  }) // -•

})
