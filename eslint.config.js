import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import reactJSXRuntime from 'eslint-plugin-react/configs/jsx-runtime.js'
import reactRecommended from 'eslint-plugin-react/configs/recommended.js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    files: ['**/*.{js,ts,jsx,tsx}']
  },
  {
    ignores: [
      '.gitignore',
      'node_modules',
      '**/dist/**'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off'
    }
  },
  {
    plugins: {
      import: importPlugin
    },
    rules: {
      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'internal',
            'unknown',
            'parent',
            'sibling',
            'index',
            'object',
            'type'
          ],
          pathGroups: [
            {
              pattern: '{react,react-dom/**,react-router-dom,react-icons/**,styled-components}',
              group: 'builtin',
              position: 'before'
            }
          ],
          pathGroupsExcludedImportTypes: ['builtin'],
          alphabetize: {
            order: 'asc'
          }
        }
      ]
    }
  },
  {
    ...stylistic.configs['recommended-flat'],
    rules: {
      '@stylistic/semi': 'off',
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/eol-last': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/prop-types': 'off',
      '@stylistic/react-in-jsx-scope': 'off',
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/comma-spacing': ['error', { after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
      '@stylistic/comma-dangle': ['error', 'never']
    }
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ...reactRecommended,
    ...reactJSXRuntime,
    settings: {
      react: {
        version: 'detect'
      }
    },
    plugins: {
      ...reactRecommended.plugins,
      ...reactJSXRuntime.plugins
    },
    languageOptions: {
      ...reactRecommended.languageOptions,
      ...reactJSXRuntime.languageOptions
    },
    rules: {
      ...reactRecommended.rules,
      ...reactJSXRuntime.rules,
      'react/prop-types': 'off',
      'react/jsx-closing-bracket-location': ['error', 'after-props']
    }
  }
)
