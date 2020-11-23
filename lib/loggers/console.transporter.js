const util = require('util')
const { transports, format: formaters } = require('winston')

module.exports = {

  name: 'console',

  description: 'Formated console transport for winston logger',

  fn: () => {

    // Get formatter & prepare constant
    const { combine, colorize, printf } = formaters
    const beginningLog = '\u001b[37;2m|\u001b[0m'
    const endingLog = '\u001b[37;2m°\u001b[0m'

    const transporter = new transports.Console({
      format: combine(
        colorize(),
        printf(({ level = 'info', faint = false, message, ...args }) => {

          // Get all arguments (if exist) & prepare pieces to join to main message
          const splat = args[Symbol.for('splat')]
          const pieces = []

          // Combine & pre-process the arguments passed into the log fn
          if (splat && splat.length) {

            // Util options
            const utilOptions = { showHidden: true, depth: null, colors: true, compact: false }
            splat.forEach((arg) => {

              // Push a new line to make log more readable
              pieces.push('\n')

              // Non-strings
              // (miscellaneous arrays, dictionaries, mysterious objects, etc)
              if (typeof arg !== 'string') {

                pieces.push(util.inspect(arg, utilOptions))

              } else {

                pieces.push(arg)

              }

            })

          }

          // Compose `str` of all the arguments
          // (include the appropriate prefix if specified)
          const str = `${beginningLog} ${level.padEnd(19)} ${faint ? `\u001b[37;2m${message}\u001b[0m` : message} ${util.format.apply(util, pieces)}`

          return `${message ? str : endingLog}`

        })
      )

    })
    return transporter

  }

}
