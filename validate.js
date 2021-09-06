exports.hasValidBindings = (dataBindings, templateBindings) => {

  // if either of the lists is undefined -> stop
  if (!dataBindings || !templateBindings) return false

  // if either of the lists is empty -> stop
  if (dataBindings.length === 0 || templateBindings === 0) return false

  // if there are more bindings in the template -> stop
  if (dataBindings.length < templateBindings.length) return false

  // check that all bindings in template are also in data file
  return Array.from(templateBindings).every(binding => dataBindings.has(binding))
}

exports.hasValidArguments = (envVars) => {
  if (envVars && envVars.length === 3 && envVars.every(envVar => envVar !== '')) {
    return true
  }

  const inputFile = envVars[1] ? envVars[1] : 'input-file-missing'
  const inputTemplate = envVars[0] ? envVars[0] : 'template-missing'
  const outputFile = envVars[2] ? envVars[2] : 'output-file-missing'

  throw new Error(`Error: Missing one or more arguments: ./run.sh ${inputTemplate} < ${inputFile} > ${outputFile}`)
}
