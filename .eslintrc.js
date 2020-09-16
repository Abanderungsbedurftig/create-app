module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: './tsconfig.eslint.json',
  },
  rules: {
    'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
    'import/no-mutable-exports': 0,
    'no-labels': 0,
    'no-restricted-syntax': 0,
    'linebreak-style': 0,
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
  },
  extends: ['airbnb-typescript'],
  env: {
    browser: true,
  },
};
