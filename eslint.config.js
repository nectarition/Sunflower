import eslint from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import importPlugin from 'eslint-plugin-import'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    files: ['**/*.{js,ts,jsx,tsx}']
  },
  {
    ignores: [
      '.gitignore',
      'node_modules',
      '**/dist/**',
      '.yarn'
    ]
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-explicit-any': 'off'
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
              pattern: '{react,react-dom/**,react-router-dom,react-icons/**,@emotion/**,@phosphor-icons/**}',
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
      '@stylistic/semi': ['error', 'never'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/eol-last': 'error',
      '@stylistic/indent': ['error', 2],
      '@stylistic/multiline-ternary': ['error', 'always-multiline'],
      '@stylistic/member-delimiter-style': 'off',
      '@stylistic/prop-types': 'off',
      '@stylistic/jsx-first-prop-new-line': ['error', 'multiline'],
      '@stylistic/jsx-max-props-per-line': ['error', { maximum: 1 }],
      '@stylistic/jsx-indent-props': ['error', 2],
      '@stylistic/jsx-sort-props': 'error',
      '@stylistic/react-in-jsx-scope': 'off',
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/comma-spacing': ['error', { after: true }],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/jsx-tag-spacing': ['error', { beforeSelfClosing: 'always' }],
      '@stylistic/jsx-quotes': ['error', 'prefer-double'],
      '@stylistic/comma-dangle': ['error', 'never'],
      '@stylistic/no-multiple-empty-lines': ['error', { 'max': 1, 'maxEOF': 0 }]
    }
  }
)
