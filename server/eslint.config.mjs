import globals from 'globals'
import pluginJs from '@eslint/js'
import tseslint from 'typescript-eslint'
import prettierPlugin from 'eslint-plugin-prettier'
import prettierConfig from 'eslint-config-prettier'
/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts}'] },
  { languageOptions: { globals: globals.node } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      prettier: prettierPlugin
    },
    rules: {
      'no-console': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      ...prettierConfig.rules,
      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: true,
          printWidth: 120,
          jsxSingleQuote: true
        }
      ]
    },
    ignores: ['**/node_modules/', '**/dist/']
  }
]
