const fileAccess = require('./file-access')
const validate = require('./validate')

const main = async () => {
  const envVars = process.argv.slice(2)
  validate.hasValidArguments(envVars)

  const inputFile = envVars[1]
  const inputTemplate = envVars[0]
  const outputFile = envVars[2]

  const templateBindings = await fileAccess.getUniqueTemplateBindings(inputTemplate)
  const dataBindings = await fileAccess.getDataBindings(inputFile)

  if (validate.hasValidBindings(dataBindings, templateBindings)) {
    await fileAccess.writeTemplateToNewFile(dataBindings, inputTemplate, outputFile)
  } else {
    fileAccess.createEmptyOutputFile(outputFile)
  }
}

main().catch(console.log)
