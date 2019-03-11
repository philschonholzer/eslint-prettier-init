const spawn = require('cross-spawn')
const addPrettierConfig = require('./add-prettier-config')
// const addEditorConfig = require('./add-editor-config')

const eslintPrettierInit = async () => {
  // Init eslint
  spawn.sync('npx', ['--ignore-existing', 'eslint', '--init'], {
    stdio: 'inherit',
  })

  // Install prettier
  spawn.sync(
    'npm',
    ['i', '-D', 'prettier', 'eslint-plugin-prettier', 'eslint-config-prettier'],
    {
      stdio: 'inherit',
    },
  )

  await addPrettierConfig()

  // addEditorConfig()
}

module.exports = eslintPrettierInit
