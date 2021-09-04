const fs = require('fs')
const { StringDecoder } = require('string_decoder');

const BINDING_REGEX = /\(\([^()]+\)\)/g
const readStream = fs.createReadStream('huge-file')

let bindings = []

readStream.on("data", function (chunk) {
    // get each binding and remove it's parentheses
    const tokens = chunk.toString().match(BINDING_REGEX).map(binding => binding.replace(/[()]/g, ''))
    // store unique bindings, we'll use these later to validate the input variables
    bindings = new Set([...tokens, ...bindings])
});

// once the stream has finished reading, ouput
readStream.on('end', () => {
    console.log(bindings)
})