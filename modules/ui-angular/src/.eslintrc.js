module.exports = {
  root: true,
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/coverage/**',
    '**/e2e/**',
    '**/test/**',
    'karma.conf.js',
  ],
  overrides: [
    {
      files: ['*.ts'],
      parserOptions: {
        project: ['tsconfig.json'],
        sourceType: 'module',
        createDefaultProgram: true,
      },
      extends: [
        'plugin:@angular-eslint/ng-cli-compat',
        'plugin:@angular-eslint/ng-cli-compat--formatting-add-on',
        'plugin:@angular-eslint/template/process-inline-templates',
        'prettier', // keep last
      ],
      plugins: ['simple-import-sort'],
      rules: {
        'simple-import-sort/imports': 'error',
        'simple-import-sort/exports': 'error',
        'import/first': 'error',
        'import/newline-after-import': 'error',
        'import/no-duplicates': 'error',
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: ['app', 'app'],
            style: 'kebab-case',
          },
        ],
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: ['app', 'eui'],
            style: 'camelCase',
          },
        ],
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/ban-types': 'error',
        '@typescript-eslint/consistent-type-definitions': 'off',
        '@typescript-eslint/dot-notation': 'off',
        '@typescript-eslint/explicit-member-accessibility': [
          'off',
          {
            accessibility: 'explicit',
          },
        ],
        '@typescript-eslint/no-require-imports': 'error',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-var-requires': 'error',
        '@typescript-eslint/require-await': 'error',
        // "brace-style": ["error", "1tbs"], // handled by prettier
        'id-blacklist': 'off',
        'id-match': 'off',
        'no-duplicate-case': 'error',
        'no-duplicate-imports': 'off',
        'no-invalid-this': 'error',
        // "no-multiple-empty-lines": ["error", { "max": 1 }], // handled by prettier
        'no-multiple-empty-lines': [
          'error',
          {
            max: 1,
          },
        ],
        'no-new-func': 'error',
        'no-redeclare': 'off',
        '@typescript-eslint/no-redeclare': ['error'],
        'no-template-curly-in-string': 'error',
        'no-underscore-dangle': 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'enum',
            format: ['PascalCase', 'UPPER_CASE'],
          },
        ],
        '@typescript-eslint/member-ordering': [
          'error',
          {
            default: [
              'public-static-field',
              'public-instance-field',
              'private-static-field',
              'private-instance-field',
              'public-constructor',
              'private-constructor',
              'public-instance-method',
              'protected-instance-method',
              'private-instance-method',
            ],
          },
        ],
      },
    },
    {
      files: ['*.html'],
      extends: ['plugin:@angular-eslint/template/recommended'],
      rules: {},
    },
  ],
};
