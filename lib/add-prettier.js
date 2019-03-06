/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
const inquirer = require('inquirer')

const defaults = require('./prettier-defaults')
const configFile = require('./config-file')

const {
  mainOptions,
  propertiesOptions,
  editPropertiesOptions,
  fileOptions,
} = require('./prettier-questions')

const addPrettierToExtends = eslintObj => {
  return Array.isArray(eslintObj.extends)
    ? [...eslintObj.extends, 'plugin:prettier/recommended']
    : eslintObj.extends
    ? [eslintObj.extends, 'plugin:prettier/recommended']
    : 'plugin:prettier/recommended'
}

const addPrettier = (eslintObj, prettier) => ({
  ...eslintObj,
  extends: addPrettierToExtends(eslintObj),
  rules: {
    ...eslintObj.rules,
    'prettier/prettier': ['error', prettier],
  },
})

const questions = () =>
  inquirer
    .prompt(mainOptions)
    .then(({ type }) =>
      type === 'custom'
        ? inquirer
            .prompt(propertiesOptions)
            .then(({ properties }) =>
              inquirer.prompt(
                editPropertiesOptions.filter(
                  question => properties.indexOf(question.name) !== -1,
                ),
              ),
            )
        : defaults,
    )
    // .then(options => JSON.stringify(options, null, 2))
    .catch(error => console.error(error))

const writeToEslintRC = async () => {
  const prettier = await questions()
  console.log('Adding prettier config to eslintrc.json')

  const file = configFile.getFilenameForDirectory(process.cwd())

  const eslint = configFile.loadConfigFile({ filePath: file })

  configFile.write(addPrettier(eslint, prettier), file)
}
module.exports = writeToEslintRC
