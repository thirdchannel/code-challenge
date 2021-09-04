const fs = require('fs')

const BINDING_REGEX = /\(\([^()]+\)\)/g
const DATA_DELIMITER = '='
const PAREN_BACK = '))'
const PAREN_FRONT = '(('

const envVars = process.argv.slice(2)

const inputFile = `${envVars[1]}`
const inputTemplate = envVars[0]
const outputFilepath = `${envVars[2]}`

exports.createEmptyOutputFile = () => {
  fs.closeSync(fs.openSync(outputFilepath, 'w'))
}

exports.getDataBindings = () => {
  return new Promise((resolve, reject) => {
    const lineReader = require('readline').createInterface({ input: fs.createReadStream(inputFile) })
    const bindingData = new Map()

    lineReader.on('line', (line) => {
      const splitLine = line.split(DATA_DELIMITER)
      if (splitLine.length === 2) {
        bindingData.set(`${PAREN_FRONT}${splitLine[0].trim()}${PAREN_BACK}`, splitLine[1].trim())
      }
    })

    lineReader.on('error', (e) => {
      reject(e)
    })

    // once the stream has finished reading, resolve the promise
    lineReader.on('close', () => {
      resolve(bindingData)
    })
  })
}

exports.getUniqueTemplateBindings = () => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inputTemplate)
    let bindings = []

    readStream.on('data', function (chunk) {
      // get each binding and remove it's parentheses
      const tokens = chunk.toString().match(BINDING_REGEX)
      // store unique bindings, we'll use these later to validate the input variables
      bindings = new Set([...tokens, ...bindings])
    })

    readStream.on('error', (e) => {
      reject(e)
    })

    // once the stream has finished reading, resolve the promise
    readStream.on('end', () => {
      resolve(bindings)
    })
  })
}

exports.isHasValidBindings = (dataBindings, templateBindings) => {
  // if either of the lists is undefined -> stop
  if (!dataBindings || !templateBindings) return false
  // if either of the lists is empty -> stop
  if (dataBindings.length === 0 || templateBindings === 0) return false
  // if there are more bindings in the template -> stop
  if (dataBindings.length < templateBindings.length) return false

  // check that all keys from the template are present in the data file
  return Array.from(templateBindings).every(binding => dataBindings.has(binding))
}

exports.writeTemplateToNewFile = (dataBindings) => {
  return new Promise((resolve, reject) => {
    fs.stat(outputFilepath, () => {
      fs.unlink(outputFilepath, () => {})
    })
    const readStream = fs.createReadStream(inputTemplate)
    readStream.on('data', function (chunk) {
      let overwrittenChunk = chunk.toString()
      const tokens = overwrittenChunk.match(BINDING_REGEX)

      tokens.forEach(token => {
        overwrittenChunk = overwrittenChunk.replace(token, dataBindings.get(token))
      })

      fs.appendFile(outputFilepath, overwrittenChunk, () => {})
    })

    readStream.on('error', (e) => {
      reject(e)
    })
  })
}
