import test from 'ava'
import rewire from 'rewire'

// eslint-disable-next-line no-underscore-dangle
const extendESLintConfig = rewire('./add-prettier-config.js').__get__(
  'extendESLintConfig',
)

const prettier = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
}

test('extendESLintConfig default', t => {
  const eslintObj = extendESLintConfig(
    { extends: 'airbnb', rules: {} },
    prettier,
  )

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

test('extendESLintConfig no rules', t => {
  const eslintObj = extendESLintConfig({ extends: 'airbnb' }, prettier)

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

test('extendESLintConfig no extends and rules', t => {
  const eslintObj = extendESLintConfig({}, prettier)

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

test('extendESLintConfig has already rules', t => {
  const eslintObj = extendESLintConfig(
    { rules: { 'no-underscore-dangle': 'off' } },
    prettier,
  )

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

test('extendESLintConfig no prettier', t => {
  const eslintObj = extendESLintConfig({})

  const expected = {
    extends: 'plugin:prettier/recommended',
    rules: { 'prettier/prettier': 'error' },
  }

  t.deepEqual(eslintObj, expected)
})

test('extendESLintConfig empty prettier', t => {
  const eslintObj = extendESLintConfig({}, {})

  const expected = {
    extends: 'plugin:prettier/recommended',
    rules: { 'prettier/prettier': ['error', {}] },
  }

  t.deepEqual(eslintObj, expected)
})
