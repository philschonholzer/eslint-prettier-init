/* eslint-disable no-nested-ternary */
/* eslint-disable no-console */
const inquirer = require('inquirer')
const fs = require('fs-extra')

const defaults = require('./prettier-defaults')
const configFile = require('./config-file')

const {
  mainOptions,
  propertiesOptions,
  editPropertiesOptions,
  // fileOptions,
} = require('./prettier-questions')

const addPrettierToExtends = eslintObj => {
  return Array.isArray(eslintObj.extends)
    ? [...eslintObj.extends, 'plugin:prettier/recommended']
    : eslintObj.extends
    ? [eslintObj.extends, 'plugin:prettier/recommended']
    : 'plugin:prettier/recommended'
}

const addPrettierToRules = (prettierObj, eslintObj) => ({
  ...eslintObj.rules,
  'prettier/prettier': prettierObj ? ['error', prettierObj] : 'error',
})

const extendESLintConfig = (eslintObj, prettierObj) => ({
  ...eslintObj,
  extends: addPrettierToExtends(eslintObj),
  rules: addPrettierToRules(prettierObj, eslintObj),
})

const prettierQuestions = () =>
  inquirer
    .prompt(mainOptions)
    .then(({ type, run }) =>
      type === 'custom'
        ? inquirer
            .prompt(propertiesOptions)
            .then(({ properties }) =>
              inquirer
                .prompt(
                  editPropertiesOptions.filter(
                    question => properties.indexOf(question.name) !== -1,
                  ),
                )
                .then(prettier => ({ run, prettier })),
            )
        : defaults,
    )
    .catch(error => console.error(error))

const createPrettierrc = prettier => {
  return fs
    .ensureFile('./.prettierrc')
    .then(() => {
      fs.writeJson('./.prettierrc', prettier, {
        spaces: 2,
      }).then(() => console.log('Created .prettierrc.'))
    })
    .catch(err => console.log(err))
}

const addPrettierConfig = async () => {
  const { prettier, run } = await prettierQuestions()
  console.log(`Adding prettier config.`)

  const file = configFile.getFilenameForDirectory(process.cwd())
  const eslint = configFile.loadConfigFile({ filePath: file })

  configFile.write(
    extendESLintConfig(eslint, run === 'eslint' ? prettier : null),
    file,
  )

  if (run === 'prettier') {
    await createPrettierrc(prettier)
  }
}
module.exports = addPrettierConfig
