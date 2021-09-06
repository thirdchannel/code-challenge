const fs = require('fs')

const ERROR_PREFIX = 'Error -'
const Errors = {
  DuplicateInputBindingKey: (inputFile) => `${ERROR_PREFIX} Invalid input: One or more duplicate keys found in ${inputFile}.`,
  InvalidArguments: (dirs) => `${ERROR_PREFIX} Invalid argument: Argument file paths cannot be directories: ${dirs}`,
  InvalidData: (inputFile, lineNumber) => `${ERROR_PREFIX} Invalid data: ${inputFile} contains invalid binding data on line ${lineNumber}.`,
  MissingArguments: (inputTemplate, inputFile, outputFile) => `${ERROR_PREFIX} Missing one or more arguments: ./run.sh ${inputTemplate} < ${inputFile} > ${outputFile}`
}

const Warnings = {
  MultipleDelimiters: (bindingPair, inputFile, lineNumber) => `Warning: Line ${lineNumber} in ${inputFile} contains more than one delimiter - may cause output errors.`
}

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

    throw Errors.MissingArguments(inputTemplate, inputFile, outputFile)
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
    throw Errors.InvalidArguments(dirs)
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

/**
 * Expect binding pair to have length of 2, if not throw appropriate error or warning
 * @param bindingPair
 * @param inputFile
 * @param lineNumber
 * @returns {boolean}
 */

const isBindingAKeyValuePair = (bindingPair, inputFile, lineNumber) => {
  if (!bindingPair || bindingPair.length < 2) {
    throw Errors.InvalidData(inputFile, lineNumber)
  } else if (bindingPair.length > 2) {
    console.warn(Warnings.MultipleDelimiters(bindingPair, inputFile, lineNumber))
  }
  return true
}

/**
 * Reject key value pairs with either key or value empty after trimming
 * @param bindingPair
 * @param inputFile
 * @param lineNumber
 * @returns {boolean}
 */
const isBindingEmpty = (bindingPair, inputFile, lineNumber) => {
  if (!bindingPair[0].trim() || (bindingPair[1] && !bindingPair[1].trim())) {
    throw Errors.InvalidData(inputFile, lineNumber)
  }
  return false
}

/**
 * Check that binding pair is valid
 * @param bindingPair
 * @param inputFile
 * @param lineNumber
 * @returns {boolean}
 */
exports.isValidBindingPair = (bindingPair, inputFile, lineNumber) => {
  return isBindingAKeyValuePair(bindingPair, inputFile, lineNumber) && !isBindingEmpty(bindingPair, inputFile, lineNumber)
}

/**
 * Check for duplicate keys throw if duplicates are found
 * @param dataBindings
 * @param bindingKey
 * @param inputFile
 */
exports.isNotDuplicateBindingKey = (bindingKey, dataBindings, inputFile) => {
  if (dataBindings.has(bindingKey)) {
    throw Errors.DuplicateInputBindingKey(inputFile)
  }
}
