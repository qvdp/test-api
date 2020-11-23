'use strict'
/*
 *  get-response.js
 *
 *  This helper simply verify each files stored in '@/api/responses' directory by
 *  ensuring of their correct definition.
 *
 *  A response should be composed of an export including at least a code, a name & a description.
 *
 *  ```
 *    module.exports = {
 *
 *      code: 400,
 *
 *      name: 'invalid',
 *
 *      description: 'Invalid input(s) provided.'
 *
 *    }
 *
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

    const { name, code, description } = content
    if (!name || !code || !description) {

      return reject(new Error('Please, ensure your export contains contains at least a `name`, a `code` and optionally a `description`.'))

    }

    // Name verification
    if (typeof name !== 'string') {

      return reject(new Error('Please, ensure the `name` of the response is in string format.'))

    }

    // Code verification
    if (typeof code !== 'number') {

      return reject(new Error('Please, ensure the `code` of the response is in number format.'))

    }

    // Description verification
    if (description && typeof description !== 'string') {

      return reject(new Error('Please, ensure the `description` of the response is in string format.'))

    }
    return resolve({ code, name, description })

  }) // -•

})
