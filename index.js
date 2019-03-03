const spawn = require('cross-spawn')
const updateEslintRC = require('./add-prettier')
const updateVSCodeSettings = require('./add-eslintfix')

const eslintPrettierInit = async () => {
  // Init eslint
  spawn.sync('npx', ['eslint', '--init'], {
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

  updateEslintRC()

  updateVSCodeSettings()
}

module.exports = eslintPrettierInit
