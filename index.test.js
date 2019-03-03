import test from 'ava'
import rewire from 'rewire'

const addPrettier = rewire('./add-prettier.js').__get__('addPrettier')

test('addPrettier default', t => {
  const eslintObj = addPrettier({ extends: 'airbnb', rules: {} })

  const expected = {
    extends: ['airbnb', 'plugin:prettier/recommended'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          semi: false,
        },
      ],
    },
  }

  t.deepEqual(eslintObj, expected)
})

test('addPrettier no rules', t => {
  const eslintObj = addPrettier({ extends: 'airbnb' })

  const expected = {
    extends: ['airbnb', 'plugin:prettier/recommended'],
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          semi: false,
        },
      ],
    },
  }

  t.deepEqual(eslintObj, expected)
})

test('addPrettier no extends and rules', t => {
  const eslintObj = addPrettier({})

  const expected = {
    extends: 'plugin:prettier/recommended',
    rules: {
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          semi: false,
        },
      ],
    },
  }

  t.deepEqual(eslintObj, expected)
})

test('addPrettier has already rules', t => {
  const eslintObj = addPrettier({ rules: { 'no-underscore-dangle': 'off' } })

  const expected = {
    extends: 'plugin:prettier/recommended',
    rules: {
      'no-underscore-dangle': 'off',
      'prettier/prettier': [
        'error',
        {
          singleQuote: true,
          trailingComma: 'all',
          semi: false,
        },
      ],
    },
  }

  t.deepEqual(eslintObj, expected)
})
