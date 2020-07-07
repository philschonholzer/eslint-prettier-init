const chalk = require('chalk')

exports.mainOptions = [
  {
    type: 'list',
    name: 'run',
    message: 'How should Prettier be run?',
    choices: [
      {
        name: 'By the Prettier CLI/plugin',
        value: 'prettier',
      },
      {
        name: 'By ESLint',
        value: 'eslint',
      },
    ],
  },
  {
    type: 'list',
    name: 'type',
    message: 'How do you want to create your Prettier configuration?',
    choices: [
      {
        name: 'Aswering questions about the style',
        value: 'custom',
      },
      {
        name: 'With the default config',
        value: 'default',
      },
    ],
  },
]

const addDescToName = (desc, name) =>
  desc ? `${name} ${chalk.dim(desc)}` : name

exports.propertiesOptions = [
  {
    type: 'checkbox',
    name: 'properties',
    message: 'Select the properties you want to configure in Prettier:',
    choices: [
      {
        name: 'Print Width',
        desc: 'Specify the line length that the printer will wrap on.',
        value: 'printWidth',
      },
      {
        name: `Tab Width`,
        desc: 'Specify the number of spaces per indentation-level.',
        value: 'tabWidth',
      },
      {
        name: 'Tabs',
        desc: 'Indent lines with tabs instead of spaces.',
        value: 'useTabs',
      },
      {
        name: 'Semicolons',
        desc: 'Print semicolons at the ends of statements.',
        value: 'semi',
      },
      {
        name: 'Quotes',
        desc: 'Use single quotes instead of double quotes.',
        value: 'singleQuote',
      },
      {
        name: 'JSX Quotes',
        desc: 'Use single quotes instead of double quotes in JSX.',
        value: 'jsxSingleQuote',
      },
      {
        name: 'Trailing Commas',
        desc: 'Print trailing commas wherever possible when multi-line.',
        value: 'trailingComma',
      },
      {
        name: 'Bracket Spacing',
        desc: 'Print spaces between brackets in object literals.',
        value: 'bracketSpacing',
      },
      {
        name: 'JSX Brackets',
        desc:
          'Put the > of a multi-line JSX element at the end of the last line instead of being alone on the next line',
        value: 'jsxBracketSameLine',
      },
      {
        name: 'Arrow Function Parentheses',
        desc: 'Include parentheses around a sole arrow function parameter.',
        value: 'arrowParens',
      },
      {
        name: 'Parser',
        desc:
          "Prettier automatically infers the parser from the input file path, so you shouldn't have to change this setting.",
        value: 'parser',
      },
      {
        name: 'File Path',
        desc: 'Specify the file name to use to infer which parser to use.',
        value: 'filepath',
      },
      {
        name: 'Require pragma',
        desc:
          'Prettier can restrict itself to only format files that contain a special comment, called a pragma, at the top of the file. This is very useful when gradually transitioning large, unformatted codebases to Prettier.',
        value: 'requirePragma',
      },
      {
        name: 'Insert Pragma',
        desc:
          'Prettier can insert a special @format marker at the top of files specifying that the file has been formatted with Prettier.',
        value: 'insertPragma',
      },
      {
        name: 'Prose Wrap',
        desc:
          'By default, Prettier will wrap markdown text as-is since some services use a linebreak-sensitive renderer, e.g. GitHub comment and BitBucket.',
        value: 'proseWrap',
      },
      {
        name: 'HTML Whitespace Sensitivity',
        desc: 'Specify the global whitespace sensitivity for HTML files.',
        value: 'htmlWhitespaceSensitivity',
      },
      {
        name: 'End of Line',
        desc:
          'By default, Prettier preserves a flavor of line endings a given file has already used. It also converts mixed line endings within one file to what it finds at the end of the first line.',
        value: 'endOfLine',
      },
    ].map(({ name, desc, value }) => ({
      name: addDescToName(desc, name),
      value,
    })),
  },
]

exports.editPropertiesOptions = [
  {
    type: 'rawlist',
    name: 'parser',
    message: 'Select a parser:',
    choices: [
      'babel',
      'babel-flow',
      'flow',
      'typescript',
      'css',
      'less',
      'scss',
      'json',
      'json5',
      'json-stringify',
      'graphql',
      'markdown',
      'mdx',
      'html',
      'vue',
      'angular',
      'yaml',
    ],
    default: 'babylon',
  },
  {
    type: 'input',
    name: 'printWidth',
    message: 'Insert a print width:',
    default: '80',
    validate: input => /\d+/.test(input),
    filter: input => parseInt(input, 10),
  },
  {
    type: 'input',
    name: 'tabWidth',
    message: 'Insert a tab width:',
    default: '2',
    validate: input => /\d+/.test(input) || 'Width must be a number',
    filter: input => parseInt(input, 10),
  },
  {
    type: 'list',
    name: 'semi',
    message: 'What are your preferred end statements?',
    choices: [
      {
        name: 'Add a semicolon at the end of every statement.',
        value: true,
      },
      {
        name:
          'Only add semicolons at the beginning of lines that may introduce ASI failures.',
        value: false,
      },
    ],
    default: 1,
  },
  {
    type: 'list',
    name: 'bracketSpacing',
    message: 'Print spaces between brackets?',
    choices: [
      {
        name: 'Spaces - Example: { foo: bar }',
        value: true,
      },
      {
        key: 'n',
        name: 'No spaces - Example: {foo: bar}',
        value: false,
      },
    ],
    default: 1,
  },
  {
    type: 'list',
    name: 'jsxBracketSameLine',
    message:
      'Where do you want to put > of a multi-line JSX element? (does not apply to self closing elements)',
    choices: [
      {
        key: 'y',
        name: 'End of the last line',
        value: true,
      },
      {
        key: 'n',
        name: 'Alone on the next line',
        value: false,
      },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: 'singleQuote',
    message: 'Quotes',
    choices: [
      {
        name: 'Single quotes',
        value: true,
      },
      {
        name: 'Double quotes',
        value: false,
      },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: 'jsxSingleQuote',
    message: 'JSX quotes',
    choices: [
      {
        name: 'Single quotes',
        value: true,
      },
      {
        name: 'Double quotes',
        value: false,
      },
    ],
    default: 1,
  },
  {
    type: 'list',
    name: 'trailingComma',
    message: 'Print trailing commas wherever possible multi-line:',
    choices: [
      { name: 'None', value: 'none' },
      { name: 'ES5', value: 'es5' },
      { name: 'All', value: 'all' },
    ],
    default: 'none',
  },
  {
    type: 'list',
    name: 'arrowParens',
    message: 'Include parentheses around a sole arrow function parameter?',
    choices: [
      { name: 'Omit parens when possible. Example: x => x', value: 'avoid' },
      { name: 'Always include parens. Example: (x) => x', value: 'always' },
    ],
    default: 'avoid',
  },
  {
    type: 'list',
    name: 'useTabs',
    message: 'Indent with..',
    choices: [
      {
        name: 'Tabs',
        value: true,
      },
      {
        name: 'Spaces',
        value: false,
      },
    ],
    default: 0,
  },
  {
    type: 'expand',
    name: 'requirePragma',
    message:
      'Only format files that contain a special comment, called a pragma, at the top of the file?',
    choices: [
      {
        key: 'y',
        name: 'Yes',
        value: true,
      },
      {
        key: 'n',
        name: 'No',
        value: false,
      },
    ],
    default: 0,
  },
  {
    type: 'expand',
    name: 'insertPragma',
    message: 'Insert a special @format marker at the top of files?',
    choices: [
      {
        key: 'y',
        name: 'Yes',
        value: true,
      },
      {
        key: 'n',
        name: 'No',
        value: false,
      },
    ],
    default: 0,
  },
  {
    type: 'list',
    name: 'proseWrap',
    message:
      'Wrap prose? See https://prettier.io/docs/en/options.html#prose-wrap for more info.',
    choices: [
      {
        name: 'Always wrap prose if it exceeds the print width.',
        value: 'always',
      },
      {
        name: 'Do not wrap prose.',
        value: 'never',
      },
      {
        name: 'Wrap prose as-is.',
        value: 'preserve',
      },
    ],
    default: 'preserve',
  },
  {
    type: 'list',
    name: 'htmlWhitespaceSensitivity',
    message:
      'Specify the global whitespace sensitivity for HTML files, see https://prettier.io/blog/2018/11/07/1.15.0.html#whitespace-sensitive-formatting for more info.',
    choices: [
      {
        name: 'Respect the default value of CSS display property.',
        value: 'css',
      },
      {
        name: 'Whitespaces are considered sensitive.',
        value: 'strict',
      },
      {
        name: 'Whitespaces are considered insensitive.',
        value: 'ignore',
      },
    ],
    default: 'css',
  },
  {
    type: 'list',
    name: 'endOfLine',
    message:
      'End of Line, see https://prettier.io/docs/en/options.html#end-of-line for more info.',
    choices: [
      {
        name:
          "Maintain existing line endings (mixed values within one file are normalised by looking at what's used after the first line).",
        value: 'auto',
      },
      {
        name:
          'Line Feed only (\\n), common on Linux and macOS as well as inside git repos.',
        value: 'lf',
      },
      {
        name:
          'Carriage Return + Line Feed characters (\\r\\n), common on Windows.',
        value: 'crlf',
      },
      {
        name: 'Carriage Return character only (\\r), used very rarely.',
        value: 'cr',
      },
    ],
    default: 'auto',
  },
]

exports.fileOptions = [
  {
    type: 'list',
    name: 'output',
    message: 'What format do you want your config file to be in?',
    choices: ['json', 'yml'],
  },
]
