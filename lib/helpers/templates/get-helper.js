'use strict'
/*
 *  get-helper.js
 *
 *  This helper simply verify each files stored in '@/api/helpers' directory by
 *  ensuring the good definition of an helper.
 *
 *  An helper should be composed of an export including at least a name & a function.
 *
 *  ```
 *    module.exports = {
 *
 *     name: 'Hello world',
 *
 *     description: 'Simple first Hello World helper.',
 *
 *     fn: (arguments) => { ... }
 *
 *    }
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

      return reject(new Error(name ? 'You need to export a function under `fn` property in your helper object.' : 'Please, ensure you gave a `name` to your helper.'))

    }

    // Name verification
    if (typeof name !== 'string') {

      return reject(new Error('Please, ensure the `name` of the helper is in string format.'))

    }

    // Description verification
    if (description && typeof description !== 'string') {

      return reject(new Error('Please, ensure the `description` of the helper is in string format.'))

    }

    // Function verification
    if (typeof fn !== 'function') {

      return reject(new Error('Please, ensure the `fn` from this helper is a function (async or synchrounous).'))

    }
    return resolve({ name, description, fn })

  }) // -•

})
