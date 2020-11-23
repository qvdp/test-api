'use strict'
/*
 * Built-in Log Configuration
 *
 * Configure the log level for the app
 *
 */

module.exports = Object.freeze({

  /***************************************************************************
  *                                                                          *
  * The order of precedence for log levels from lowest to highest is:        *
  * silly, server, debug, warn, error, silent                                *
  *                                                                          *
  * You may also set the level to "silent" to suppress all logs.             *
  *                                                                          *
  * Details of logs levels:                                                  *
  *                                                                          *
  *  - silly [all]                                                           *
  *  - debug [warn,error,info,verbose,debug]                                 *
  *  - verbose [warn,error,info,verbose]                                     *
  *  - info [warn,error,info]                                                *
  *  - warn [warn,error]                                                     *
  *  - error [error]                                                         *
  *                                                                          *
  ***************************************************************************/

  level: 'silly',

  transporters: ['console']

})
