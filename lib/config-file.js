/* eslint-disable global-require */
/**
 * @fileoverview Helper to locate and load configuration files. Copied from eslint-project
 */

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const debug = require('debug')('eslint:config-file')
const fs = require('fs')
const path = require('path')
const stripComments = require('strip-json-comments')
const stringify = require('json-stable-stringify-without-jsonify')
const importFresh = require('import-fresh')

//------------------------------------------------------------------------------
// Helpers
//------------------------------------------------------------------------------

/**
 * Determines sort order for object keys for json-stable-stringify
 *
 * see: https://github.com/samn/json-stable-stringify#cmp
 *
 * @param   {Object} a The first comparison object ({key: akey, value: avalue})
 * @param   {Object} b The second comparison object ({key: bkey, value: bvalue})
 * @returns {number}   1 or -1, used in stringify cmp method
 */
function sortByKey(a, b) {
  return a.key > b.key ? 1 : -1
}

//------------------------------------------------------------------------------
// Private
//------------------------------------------------------------------------------

const CONFIG_FILES = [
  '.eslintrc.js',
  '.eslintrc.yaml',
  '.eslintrc.yml',
  '.eslintrc.json',
  '.eslintrc',
  'package.json',
]

/**
 * Convenience wrapper for synchronously reading file contents.
 * @param {string} filePath The filename to read.
 * @returns {string} The file contents, with the BOM removed.
 * @private
 */
function readFile(filePath) {
  return fs.readFileSync(filePath, 'utf8').replace(/^\ufeff/u, '')
}

/**
 * Loads a YAML configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {Object} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadYAMLConfigFile(filePath) {
  debug(`Loading YAML config file: ${filePath}`)

  // lazy load YAML to improve performance when not used
  const yaml = require('js-yaml')

  try {
    // empty YAML file can be null, so always use
    return yaml.safeLoad(readFile(filePath)) || {}
  } catch (e) {
    debug(`Error reading YAML file: ${filePath}`)
    e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`
    throw e
  }
}

/**
 * Loads a JSON configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {Object} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadJSONConfigFile(filePath) {
  debug(`Loading JSON config file: ${filePath}`)

  try {
    return JSON.parse(stripComments(readFile(filePath)))
  } catch (e) {
    debug(`Error reading JSON file: ${filePath}`)
    e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`
    e.messageTemplate = 'failed-to-read-json'
    e.messageData = {
      path: filePath,
      message: e.message,
    }
    throw e
  }
}

/**
 * Loads a legacy (.eslintrc) configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {Object} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadLegacyConfigFile(filePath) {
  debug(`Loading config file: ${filePath}`)

  // lazy load YAML to improve performance when not used
  const yaml = require('js-yaml')

  try {
    return (
      yaml.safeLoad(stripComments(readFile(filePath))) ||
      /* istanbul ignore next */ {}
    )
  } catch (e) {
    debug(`Error reading YAML file: ${filePath}`)
    e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`
    throw e
  }
}

/**
 * Loads a JavaScript configuration from a file.
 * @param {string} filePath The filename to load.
 * @returns {Object} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadJSConfigFile(filePath) {
  debug(`Loading JS config file: ${filePath}`)
  try {
    return importFresh(filePath)
  } catch (e) {
    debug(`Error reading JavaScript file: ${filePath}`)
    e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`
    throw e
  }
}

/**
 * Loads a configuration from a package.json file.
 * @param {string} filePath The filename to load.
 * @returns {Object} The configuration object from the file.
 * @throws {Error} If the file cannot be read.
 * @private
 */
function loadPackageJSONConfigFile(filePath) {
  debug(`Loading package.json config file: ${filePath}`)
  try {
    return loadJSONConfigFile(filePath).eslintConfig || null
  } catch (e) {
    debug(`Error reading package.json file: ${filePath}`)
    e.message = `Cannot read config file: ${filePath}\nError: ${e.message}`
    throw e
  }
}

/**
 * Creates an error to notify about a missing config to extend from.
 * @param {string} configName The name of the missing config.
 * @returns {Error} The error object to throw
 * @private
 */
function configMissingError(configName) {
  const error = new Error(
    `Failed to load config "${configName}" to extend from.`,
  )

  error.messageTemplate = 'extend-config-missing'
  error.messageData = {
    configName,
  }
  return error
}

/**
 * Loads a configuration file regardless of the source. Inspects the file path
 * to determine the correctly way to load the config file.
 * @param {Object} file The path to the configuration.
 * @returns {Object} The configuration information.
 * @private
 */
function loadConfigFile(file) {
  const { filePath } = file
  let config

  switch (path.extname(filePath)) {
    case '.js':
      config = loadJSConfigFile(filePath)
      if (file.configName) {
        config = config.configs[file.configName]
        if (!config) {
          throw configMissingError(file.configFullName)
        }
      }
      break

    case '.json':
      if (path.basename(filePath) === 'package.json') {
        config = loadPackageJSONConfigFile(filePath)
        if (config === null) {
          return null
        }
      } else {
        config = loadJSONConfigFile(filePath)
      }
      break

    case '.yaml':
    case '.yml':
      config = loadYAMLConfigFile(filePath)
      break

    default:
      config = loadLegacyConfigFile(filePath)
  }

  return config
}

/**
 * Writes a configuration file in JSON format.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @returns {void}
 * @private
 */
function writeJSONConfigFile(config, filePath) {
  debug(`Writing JSON config file: ${filePath}`)

  const content = stringify(config, { cmp: sortByKey, space: 4 })

  fs.writeFileSync(filePath, content, 'utf8')
}

/**
 * Writes a configuration file in YAML format.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @returns {void}
 * @private
 */
function writeYAMLConfigFile(config, filePath) {
  debug(`Writing YAML config file: ${filePath}`)

  // lazy load YAML to improve performance when not used
  const yaml = require('js-yaml')

  const content = yaml.safeDump(config, { sortKeys: true })

  fs.writeFileSync(filePath, content, 'utf8')
}

/**
 * Writes a configuration file in JavaScript format.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @throws {Error} If an error occurs linting the config file contents.
 * @returns {void}
 * @private
 */
function writeJSConfigFile(config, filePath) {
  debug(`Writing JS config file: ${filePath}`)

  const stringifiedContent = `module.exports = ${stringify(config, {
    cmp: sortByKey,
    space: 4,
  })};`

  fs.writeFileSync(filePath, stringifiedContent, 'utf8')
}

/**
 * Writes a configuration file.
 * @param {Object} config The configuration object to write.
 * @param {string} filePath The filename to write to.
 * @returns {void}
 * @throws {Error} When an unknown file type is specified.
 * @private
 */
function write(config, filePath) {
  switch (path.extname(filePath)) {
    case '.js':
      writeJSConfigFile(config, filePath)
      break

    case '.json':
      writeJSONConfigFile(config, filePath)
      break

    case '.yaml':
    case '.yml':
      writeYAMLConfigFile(config, filePath)
      break

    default:
      throw new Error("Can't write to unknown file type.")
  }
}

/**
 * Checks whether the given filename points to a file
 * @param {string} filename A path to a file
 * @returns {boolean} `true` if a file exists at the given location
 */
function isExistingFile(filename) {
  try {
    return fs.statSync(filename).isFile()
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false
    }
    throw err
  }
}

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

module.exports = {
  loadConfigFile,
  write,
  CONFIG_FILES,

  /**
   * Retrieves the configuration filename for a given directory. It loops over all
   * of the valid configuration filenames in order to find the first one that exists.
   * @param {string} directory The directory to check for a config file.
   * @returns {?string} The filename of the configuration file for the directory
   *      or null if there is no configuration file in the directory.
   */
  getFilenameForDirectory(directory) {
    return (
      CONFIG_FILES.map(filename => path.join(directory, filename)).find(
        isExistingFile,
      ) || null
    )
  },
}
