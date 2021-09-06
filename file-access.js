const fs = require('fs')

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

    lineReader.on('line', (line) => {

      // split data file on '=' sign
      const splitLine = line.split(DATA_DELIMITER)

      // two parts indicates there is a single '=' sign and the line is valid, ignore others
      if (splitLine.length === 2) {
        const dataBinding = `${PAREN_FRONT}${splitLine[0].trim()}${PAREN_BACK}`

        // key: ((key)); value: value.  Use the parenthesis wrapped binding as the key so we can search and replace
        // in the template without needing to do any other string manipulation
        if (dataBindings.has(dataBinding)) {
          reject(`Error - invalid input: One or more duplicate keys found in ${inputFile}.`)
        }
        dataBindings.set(dataBinding, splitLine[1].trim())
      }
    })

    lineReader.on('error', (e) => {
      reject(e)
    })

    // once the stream has finished reading, resolve the promise
    lineReader.on('close', () => {
      resolve(dataBindings)
    })
  })
}

exports.getUniqueTemplateBindings = (inputTemplate) => {
  return new Promise((resolve, reject) => {
    const readStream = fs.createReadStream(inputTemplate)
    let templateBindings = []

    // A stream is used here (rather than loading the entire file at once) so that
    // if a very large file is processed we are not as likely to run out of memory
    readStream.on('data', function (chunk) {
      // get each binding and remove its parentheses
      const tokens = chunk.toString().match(BINDING_REGEX) || []
      // store unique bindings, these will be used later to validate the input data
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

const createOutputFolderIfNotExist = (outputFile) => {
  let outputPathArray = outputFile.split('/')
  // remove output filename
  outputPathArray.pop()
  const outputDir = `./${outputPathArray.join('/')}`
  // create path for only the folders
  if(!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
  }
}

const deleteOutputFileIfExists = (outputFile) => {
  fs.stat(outputFile, () => {
    fs.unlink(outputFile, () => {})
  })
}

const overwriteBindings = (chunk, dataBindings) => {
  let overwrittenChunk = chunk.toString()
  const tokens = overwrittenChunk.match(BINDING_REGEX) || []

  tokens.forEach(token => {
    overwrittenChunk = overwrittenChunk.replace(token, dataBindings.get(token))
  })
  return overwrittenChunk
}

exports.writeTemplateToNewFile = (dataBindings, inputTemplate, outputFile) => {
  return new Promise((resolve, reject) => {
    createOutputFolderIfNotExist(outputFile)
    deleteOutputFileIfExists(outputFile)

    const readStream = fs.createReadStream(inputTemplate)
    readStream.on('data', function (chunk) {
      fs.appendFile(outputFile,
        overwriteBindings(chunk, dataBindings),
        () => {})
    })

    readStream.on('error', (e) => {
      reject(e)
    })

    readStream.on('close', () => {
      resolve()
    })
  })
}
