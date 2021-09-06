const fileAccess = require('./file-access')
const validate = require('./validate')

const main = async () => {
  fileAccess.initializeOutputDir()

  const envVars = process.argv.slice(2)
  validate.hasValidArguments(envVars)

  const inputFile = envVars[1]
  const inputTemplate = envVars[0]
  const outputFile = envVars[2]

  fileAccess.resetOutput(outputFile)

  const templateData = fileAccess.loadTemplateFile(inputTemplate)
  const templateBindings = fileAccess.getUniqueTemplateBindings(templateData)
  const dataBindings = fileAccess.getDataBindings(inputFile)

  fileAccess.outputTemplateToNewFile(dataBindings, templateBindings, templateData, outputFile)
}

main().catch(console.log)
