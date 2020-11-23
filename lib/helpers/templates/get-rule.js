'use strict'
/*
 *  get-rule.js
 *
 *  This helper simply verify each files stored in '@/api/policies/rules' directory by
 *  ensuring of their correct definition.
 *
 *  A rule should be composed of an export including at least a name, a rule & an optional description.
 *
 *  ```
 *    module.exports = {
 *
 *      name: 'email-address',
 *
 *      description: 'Verify email in body',
 *
 *      rule: {
 *        in: ['body'],
 *        isEmail: true
 *      }
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

    const { name, description, rule } = content

    if (!name || !rule) {

      return reject(new Error(name ? 'You need to define the validation under `rule` property.' : 'Please, ensure you gave a `name` to your rule.'))

    }

    // Name verification
    if (typeof name !== 'string') {

      return reject(new Error('Please, ensure the `name` of this rule is in string format.'))

    }

    // Description verification
    if (description && typeof description !== 'string') {

      return reject(new Error('Please, the `description` of this rule is in string format.'))

    }

    // Rule verification
    if (typeof rule !== 'object') {

      return reject(new Error('Please, ensure the `rule` from this rule is an object.'))

    }
    return resolve({ name, description, rule })

  }) // -•

})
