'use strict'

/**
 * Customs configuration
 * (ctx.config.customs)
 *
 * One-off settings specific to your application.
 *
 */

module.exports = Object.freeze({

  /**************************************************************************
  *                                                                         *
  * The base URL to use during development.                                 *
  *                                                                         *
  * • No trailing slash at the end                                          *
  * • `http://` or `https://` at the beginning.                             *
  *                                                                         *
  * > This is for use in custom logic that builds URLs.                     *
  * > It is particularly handy for building dynamic links in emails         *
  *                                                                         *
  **************************************************************************/

  baseUrl: 'http://localhost:3000',
  appName: 'My light express app'

})
