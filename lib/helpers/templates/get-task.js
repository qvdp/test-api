'use strict'
/*
 *  get-task.js
 *
 *  This helper simply verify each files stored in '@/tasks' directory by
 *  ensuring of their correct definition.
 *
 *  A task should be composed of an export including at least a name,
 *  a description, an optional order and a fn (function).
 *
 *  ```
 *    module.exports = {
 *
 *     name: 'actions',
 *
 *      description: 'Setting up actions',
 *
 *      order: 999,
 *
 *      fn: async (ctx) => {...}
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

    const { name, description, fn, order = 0 } = content
    if (!name || !fn) {

      return reject(new Error(name ? 'You need to export an async function under `fn` property. Task builder will execute it at runtime.' : 'Please, ensure you gave a `name` to your task.'))

    }

    // Name verification
    if (typeof name !== 'string') {

      return reject(new Error('Please, ensure the `name` of the task is in string format.'))

    }

    // Description verification
    if (description && typeof description !== 'string') {

      return reject(new Error('Please, ensure the `description` of the task is in string format.'))

    }

    // Order verification
    if (!Number.isInteger(order)) {

      return reject(new Error('Please, the `order` of the task is in number format.'))

    }

    if (order < -60 || order > 999) {

      return reject(new Error('Please, ensure the `order` you have defined is between -59 && 998.'))

    }

    // Fn verification
    if (typeof fn !== 'function') {

      return reject(new Error('Please, ensure the `fn` from this task is a function.'))

    }

    if (fn.constructor.name !== 'AsyncFunction') {

      return reject(new Error('Please, ensure the `fn` from this task is an async function or a promise.'))

    }
    return resolve({ fn, order })

  }) // -•

})
