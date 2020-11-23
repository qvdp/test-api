'use strict'
/*
 * ### Finish up todo ##
 * - [ ] Add file header + description
*/
const http = require('http')
const _ = require('lodash')
const { setup } = require('./../../app')

setup()
  .then(({ app: builtApp, ctx: { logger, settings } }) => {

    // Get default
    const {
      PORT: port = '3000',
      NODE_ENV: appEnv,
      NODE_CONFIG_DIR: appConfigDir,
      npm_package_version: appVersion
    } = process.env

    // Define app port (default on 8080)
    builtApp.set('port', port)

    // Create a server and listen on settled port
    const server = http.createServer(builtApp)
    server.listen(port, () => {

      logger.info('')
      logger.info(`App: ${_.get(settings, 'customs.appName') || 'Express boiler'}`)
      logger.info({ message: `${appVersion}`, faint: true })
      logger.info(' ')
      logger.info({ message: '-------------------------------------------------------', faint: true })
      logger.info({ message: `:: ${Date()}`, faint: true })
      logger.info(' ')
      logger.info(`Environment : ${appEnv}`)
      logger.info(`Config dir. : ${appConfigDir}`)
      logger.info(`Port        : ${port}`)
      logger.info({ message: '-------------------------------------------------------', faint: true })
      logger.info()

    })

    server.on('error', (error) => {

      throw error

    })

  })
  .catch((err) => {

    console.error(err)
    process.exit(1)

  })
