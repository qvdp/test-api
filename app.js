// Starting dependencies

/*
 * ### Finish up todo ##
 * - [ ] Add file header + description
 * - [ ] Add verbose logs
*/

require('module-alias/register')
const express = require('express')
const useragent = require('express-useragent')
const addRequestId = require('express-request-id')
const bodyParser = require('body-parser')
const builder = require('@lib/builder')
const { fn: $setRequestCtx } = require('@lib/policies/request.policy.js')

module.exports = {

  setup: async () => {

    // Initialisation log
    console.log(`\u001b[37;2mStarting ${process.env.npm_package_name}...\u001b[0m`)

    // Before all, create app
    const app = express()

    // Then we build the context thanks to different tasks
    const ctx = await builder()
    Object.freeze(ctx)

    // Parser
    app.use(bodyParser.json())
    app.use(express.urlencoded({ extended: false }))

    // Generate UUID for request and add it to X-Request-Id
    app.use(addRequestId())

    // Automatically parse user-agent
    app.use(useragent.express())

    // Serve documentation
    app.use(express.static('docs/.vuepress/dist'))

    // Enable response middleware
    app.use(ctx.responses.middlewares)

    app.use($setRequestCtx(ctx))

    // Start routing
    app.use('/api/v1', ctx.actions)

    return { app, ctx }

  }

}
