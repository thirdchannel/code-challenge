const fileAccess = require('./file-access')

const main = async () => {
    const templateBindings = await fileAccess.getUniqueTemplateBindings()
    const dataBindings = await fileAccess.getDataBindings()
    if (fileAccess.isHasValidBindings(dataBindings, templateBindings)) {
        await fileAccess.writeTemplateToNewFile(dataBindings)
    } else {
        fileAccess.createEmptyOutputFile()
    }
}

main()
