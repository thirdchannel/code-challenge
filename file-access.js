const fs = require('fs')
const validate = require('./validate')

const BINDING_REGEX = /\(\([^()]+\)\)/g

/**
 * Load file to memory and parse valid data binding key value pairs
 * @param inputFile
 * @returns {Map<any, any>}
 */
exports.getDataBindings = (inputFile) => {
  const data = fs.readFileSync(inputFile, 'utf-8').split('\n').filter(line => line !== '')
  const dataBindings = new Map()

  data.forEach(line => {
    const bindingPair = line.split('=')

    if (bindingPair.length !== 2) {
      console.warn(`Warning: ${bindingPair} in ${inputFile} invalid delimitation - omitted.`)
    }
    const bindingKey = `((${bindingPair[0].trim()}))`

    if (dataBindings.has(bindingKey)) {
      throw `Error - invalid input: One or more duplicate keys found in ${inputFile}.`
    }
    dataBindings.set(bindingKey, bindingPair[1].trim())
  })

  return dataBindings
}

/**
 * Create output dir if not exists
 */
exports.initializeOutputDir = () => {
  if (!fs.existsSync('output')) {
    fs.mkdirSync('output')
  }
}

/**
 * Get template file data from disk
 * @param inputTemplate
 * @returns {Buffer}
 */
exports.loadTemplateFile = (inputTemplate) => {
  return fs.readFileSync(inputTemplate)
}

/**
 * Parse template data file and get all unique binding values
 * @param templateData
 * @returns {Set<string|*>}
 */
exports.getUniqueTemplateBindings = (templateData) => {
  return new Set(templateData.toString().match(BINDING_REGEX) || [])
}

/**
 * Deletes previous output file if exists and creates a new, empty one
 * @param outputFile
 */
exports.resetOutput = (outputFile) => {
  if (fs.existsSync(outputFile)) {
    fs.unlinkSync(outputFile)
  }
}

/**
 * Replace bindings in template file with values from data file
 * @param dataBindings
 * @param templateData
 * @returns {string}
 */
const overwriteBindings = (dataBindings, templateData) => {
  let templateAsString = templateData.toString()
  const tokens = templateData.toString().match(BINDING_REGEX) || []

  tokens.forEach(token => {
    templateAsString = templateAsString.replace(token, dataBindings.get(token))
  })
  return templateAsString
}

/**
 * Truncate file and rewrite contents with overwritten template data
 * @param dataBindings
 * @param templateBindings
 * @param templateData
 * @param outputFile
 */
exports.outputTemplateToNewFile = (dataBindings, templateBindings, templateData, outputFile) => {
  fs.writeFileSync(outputFile, '')
  if (validate.hasValidBindings(dataBindings, templateBindings)) {
    fs.writeFileSync(outputFile, overwriteBindings(dataBindings, templateData))
  }
}
