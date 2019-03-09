/* eslint-disable no-console */
const fs = require('fs-extra')
const inquirer = require('inquirer')

const addVSCodeAutoFixOnSave = vscodeObj => ({
  ...vscodeObj,
  'eslint.autoFixOnSave': true,
})

const createVSCodeConfig = () => {
  fs.readJson('./.vscode/settings.json')
    .then(vsCodeObj => {
      fs.writeJson(
        './.vscode/settings.json',
        addVSCodeAutoFixOnSave(vsCodeObj),
        {
          spaces: 2,
        },
      )
        .then(() => {
          console.log(
            'Added VS Code settings in the current project for eslint to execute Prettier.',
          )
        })
        .catch(err => {
          console.error('Could not write Prettier config to eslintrc.json', err)
        })
    })
    .catch(() => {
      console.log('No VS Code settings found. Creating new settings.')
      fs.ensureFile('./.vscode/settings.json')
        .then(() => {
          fs.writeJson(
            './.vscode/settings.json',
            {
              'eslint.autoFixOnSave': true,
            },
            {
              spaces: 2,
            },
          ).then(() =>
            console.log(
              'Created VS Code settings-file in the current project for eslint to execute Prettier.',
            ),
          )
        })
        .catch(err => console.log(err))
    })
}

const questions = () =>
  inquirer
    .prompt([
      {
        type: 'checkbox',
        name: 'type',
        message: 'For which editors do you want a configuration?',
        choices: [
          {
            name: 'VS Code',
            value: 'code',
          },
          {
            name: 'EditorConfig',
            value: 'editorConfig',
          },
        ],
      },
    ])
    .catch(error => console.error(error))

const addEditorConfig = async () => {
  const { type } = await questions()

  switch (type) {
    case 'code':
      await createVSCodeConfig()
      break

    case 'editorConfig':
      console.log('EditorConfig is not yet implemented.')
      break

    default:
      break
  }
}
module.exports = addEditorConfig
