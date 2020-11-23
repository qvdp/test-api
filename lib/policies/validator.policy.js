'use strict'

/*
 * ### Finish up todo ##
 * - [ ] Add file header + description
 * - [ ] Handle rule definition in inputs (sort of custom inline)
 */
// TODO: let user define his own validation schema in the action file directly
// TODO: Enhance string comparaison
const { validationResult, checkSchema } = require('express-validator')
const { camelCase } = require('lodash')

module.exports = {

  name: 'validator',

  description: 'Validate & sanitize request data.',

  fn: ({ logger, validators }) => async (req, res, next) => {

    // Prepare data
    const schema = {}

    // Get inputs dictionnary
    const { ctx: { name, inputs = {}, reqIdentifiers: { mix } } } = res.locals

    // Build schema validation
    Object.keys(inputs).forEach((key) => {

      // Get validator name from inputs
      const validatorName = camelCase(inputs[key])

      // Then we update the validation schema if validator exits
      // if not, we warn the user.
      const { [`schema/${validatorName}`]: validatorSchema } = validators
      if (validatorSchema) {

        Object.assign(schema, { [key]: validatorSchema })

      } else {

        logger.warn(`${mix} ${name.toUpperCase()} (cont.) - Validator \`${validatorName}\` does not exist. It has been ignored from validation.`)

      }

    })

    // We verify the schema
    const chains = checkSchema(schema)

    // Validate action inputs asynchronously
    await Promise.all(chains.map(chain => chain.run(req)))
    const errors = validationResult(req)

    // If at least one input validation fails, throw `invalid` response
    if (!errors.isEmpty()) {

      return res.invalid({ errors })

    }

    return next() // •-

  }

}
