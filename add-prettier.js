const configFile = require('./config-file')

const addPrettierToExtends = eslintObj => {
  return Array.isArray(eslintObj.extends)
    ? [...eslintObj.extends, 'plugin:prettier/recommended']
    : eslintObj.extends
    ? [eslintObj.extends, 'plugin:prettier/recommended']
    : 'plugin:prettier/recommended'
}

const addPrettier = eslintObj => ({
  ...eslintObj,
  extends: addPrettierToExtends(eslintObj),
  rules: {
    ...eslintObj.rules,
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        trailingComma: 'all',
        semi: false,
      },
    ],
  },
})

const writeToEslintRC = () => {
  console.log('Adding prettier config to eslintrc.json')

  const file = configFile.getFilenameForDirectory(process.cwd())

  console.log('file', file)

  const config = configFile.loadConfigFile({ filePath: file })

  console.log('config', config)

  configFile.write(addPrettier(config), file)
}
module.exports = writeToEslintRC
