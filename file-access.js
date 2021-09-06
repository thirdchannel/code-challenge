const fs = require('fs')
const validate = require('./validate')

const BINDING_REGEX = /\(\([^()]+\)\)/g
const DATA_DELIMITER = '='
const PAREN_BACK = '))'
const PAREN_FRONT = '(('

exports.createEmptyOutputFile = (outputFile) => {
  // 'touch' the file to create an empty file
  fs.closeSync(fs.openSync(outputFile, 'w'))
}

exports.getDataBindings = (inputFile) => {
  return new Promise((resolve, reject) => {
    const lineReader = require('readline').createInterface({ input: fs.createReadStream(inputFile) })
    const dataBindings = new Map()
    const duplicateDataBindings = new Set()

    lineReader.on('line', (line) => {

      // split data file on '=' sign
      const splitLine = line.split(DATA_DELIMITER)

      // two parts indicates there is a single '=' sign and the line is valid, ignore others
      if (splitLine.length === 2) {
        const dataBinding = `${PAREN_FRONT}${splitLine[0].trim()}${PAREN_BACK}`

        // key: ((key)); value: value.  Use the parenthesis wrapped binding as the key so we can search and replace
        // in the template without needing to do any other string manipulation
        if (dataBindings.has(dataBinding)) {
          duplicateDataBindings.add(dataBinding)
        }
        dataBindings.set(`${PAREN_FRONT}${splitLine[0].trim()}${PAREN_BACK}`, splitLine[1].trim())
      }
    })

    lineReader.on('error', (e) => {
      reject(e)
    })

    // once the stream has finished reading, resolve the promise
    lineReader.on('close', () => {
      if (duplicateDataBindings.size > 0) {
        reject(`Error - invalid input: Duplicate keys found in ${inputFile}.`)
      }
      resolve(dataBindings)
    })
  })
}

exports.getUniqueTemplateBindings = (inputTemplate) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inputTemplate)
    let templateBindings = []

    // A stream is used here (rather than loading the entire file at once) so that if a very large file is processed,
    // we are not as likely to run out of memory
    readStream.on('data', function (chunk) {

      // get each binding and remove it's parentheses
      const tokens = chunk.toString().match(BINDING_REGEX)

      // store unique bindings, we'll use these later to validate the input variables
      templateBindings = new Set([...tokens, ...templateBindings])
    })

    readStream.on('error', (e) => {
      reject(e)
    })

    // once the stream has finished reading, resolve the promise
    readStream.on('end', () => {
      resolve(templateBindings)
    })
  })
}

exports.writeTemplateToNewFile = (dataBindings, inputTemplate, outputFile) => {
  return new Promise((resolve, reject) => {

    // delete files if they exist
    fs.stat(outputFile, () => {
      fs.unlink(outputFile, () => {})
    })
    const readStream = fs.createReadStream(inputTemplate)
    readStream.on('data', function (chunk) {
      let overwrittenChunk = chunk.toString()
      const tokens = overwrittenChunk.match(BINDING_REGEX)

      tokens.forEach(token => {
        overwrittenChunk = overwrittenChunk.replace(token, dataBindings.get(token))
      })

      fs.appendFile(outputFile, overwrittenChunk, () => {})
    })

    readStream.on('error', (e) => {
      reject(e)
    })
  })
}
