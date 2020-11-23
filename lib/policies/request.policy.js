'use strict'
/*
 *  request.js
 *
 *  Get all informations on request & assign it to the ctx object.
 *
 *  Useful for keeping in mind details of incoming request and use it
 *  step of an action.
 *
 */

module.exports = {

  name: 'Request',

  description: 'Parse incoming request informations.',

  fn: () => ({ id, method, originalUrl, ip, useragent }, res, next) => {

    // Prepare request timer
    const timer = process.hrtime()

    // Prepare request identification object
    const reqIdentifiers = {
      mix: `\u001b[37;2m[${method} ${originalUrl} - ${id} - ${ip} - ${useragent.source}]\u001b[0m`,
      timer
    }

    // Assign all request details in a ctx object stored in res locals
    Object.assign(res.locals, {
      ctx: {
        reqIdentifiers
      }
    })

    return next()

  }

}
