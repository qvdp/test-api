'use strict'
/*
 *  set-context.js
 *
 *  Set the context of a request before any further validation or verification in res.
 *
 *  Useful for keeping in mind the context of a request and use it at any
 *  step of an action.
 *
 */
module.exports = {

  name: 'Context',

  description: 'Define request context.',

  fn: (ctx, name, inputs, responses) => (req, res, next) => {

    // Assign all request details in a ctx object stored in res locals
    Object.assign(res.locals.ctx, {
      name,
      inputs,
      responses
    })

    return next()

  }

}
