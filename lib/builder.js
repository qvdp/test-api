const getFiles = require('@lib/helpers/get-files')
const getTask = require('@lib/helpers/templates/get-task')
const ora = require('ora')
const { flattenDeep, sortBy, camelCase } = require('lodash')
const { join, parse } = require('path')

module.exports = async () => {

  // Start the task builder
  const spinner = ora('').start()

  // Prepare data
  const ctx = {}

  // Prepare promises of `task.js` files searcher in lib directory and custom directory
  const options = { depth: true, extension: 'task.js' }
  const libTaskPromise = getFiles(join(__dirname, './../lib/tasks'), options)
  const customTaskPromise = getFiles(join(__dirname, './../tasks'), options)

  // Recursively flattens built arrays of tasks'paths from promises
  const taskFilePaths = flattenDeep(await Promise.all([libTaskPromise, customTaskPromise]))

  // Build unordered array of verified tasks with their initialisation index for further ordering
  const unorderedTaskFiles = []
  let i = 0
  while (taskFilePaths[i]) {

    const path = taskFilePaths[i]
    await getTask(path)
      .then(async ({ order = 0 }) => unorderedTaskFiles.push({ order, path }))
      .catch((err) => {

        // Build file entry path
        const { name } = parse(path)
        console.log(`\u001b[7m ${name}.js \u001b[0m task file ignored.`, err.message)

      })
      .finally(() => i++)

  }

  // We need to re-order tasks array to determine order of initialisation
  const orderedTaskFiles = sortBy(unorderedTaskFiles, ['order'])

  // For each task files, execute their async task
  i = 0
  while (orderedTaskFiles[i]) {

    // Get file content
    const { path } = orderedTaskFiles[i]
    const { name } = parse(path)
    const { fn } = require(path)

    // Build the new task & assign a shortcut to its content in ctx object
    const taskResult = await fn(ctx)
    Object.assign(ctx, { [camelCase(name.replace('.task', ''))]: taskResult })
    i++

  }

  // Built went well, return ctx to start the app with it
  spinner.succeed('\u001b[37;2mInitialisation complete.\u001b[0m')
  return ctx

}
