const fs = require('fs-extra')

const addVSCodeSettings = vscodeObj => ({
  ...vscodeObj,
  'eslint.autoFixOnSave': true,
})

const writeToVSCodeSettings = () => {
  console.log('Adding eslint config to VS Code settings')

  fs.readJson('./.vscode/settings.json')
    .then(vsCodeObj => {
      fs.writeJson('./.vscode/settings.json', addVSCodeSettings(vsCodeObj), {
        spaces: 2,
      })
        .then(() => {
          console.log(
            'Added VS Code settings in the current project for eslint to execute prettier.',
          )
        })
        .catch(err => {
          console.error('Could not write prettier config to eslintrc.json', err)
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
              'Created VS Code settings-file in the current project for eslint to execute prettier.',
            ),
          )
        })
        .catch(err => console.log(err))
    })
}
module.exports = writeToVSCodeSettings
