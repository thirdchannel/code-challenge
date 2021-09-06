const fs = require('fs')

/**
 * Validate that:
 *  Bindings exist for the template
 *  Bindings contain at least one value
 *  Template file has more bindings than data file (must have at least one missing)
 *  If all else passes, full check that all template bindings exist in the data file
 * @param dataBindings
 * @param templateBindings
 * @returns {boolean|this is unknown[]}
 */
exports.hasValidBindings = (dataBindings, templateBindings) => {
  if (!dataBindings || !templateBindings) return false
  if (dataBindings.length <= 0 || templateBindings <= 0) return false
  if (dataBindings.length < templateBindings.length) return false
  return Array.from(templateBindings).every(binding => dataBindings.has(binding))
}

/**
 * Check if any of the required args are missing (except for template which is checked in the shell script)
 * @param args
 * @returns {boolean}
 */
const hasEmptyArguments = (args) => {
  if (args && args.length !== 3 || args.some(envVar => envVar === '')) {
    const inputFile = args[1] ? args[1] : 'input-file-missing'
    const inputTemplate = args[0] ? args[0] : 'template-missing'
    const outputFile = args[2] ? args[2] : 'output-file-missing'

    throw `Error: Missing one or more arguments: ./run.sh ${inputTemplate} < ${inputFile} > ${outputFile}`
  }
  return false
}

/**
 * Check if any of the args contain directory paths when files are necessary, throw if so
 * @param args
 * @returns {boolean}
 */
hasDirectoryAsFilePath = (args) => {
  const dirs = args.filter(arg => fs.existsSync(arg) && fs.lstatSync(arg).isDirectory())
  if (dirs.length) {
    throw `Error - Invalid argument: Argument file paths cannot be existing directories: ${dirs}`
  }
  return false
}

/**
 * Validate input arguments
 * @param args
 * @returns {boolean}
 */
exports.hasValidArguments = (args) => {
  return !hasEmptyArguments(args) && !hasDirectoryAsFilePath(args)
}
