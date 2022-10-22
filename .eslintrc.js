module.exports = {
  env: {
    browser: true,
    es6: true
  },
  extends: ['airbnb-base', 'eslint-config-prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly'
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module'
  },
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'off',
    'func-names': ['error', 'as-needed']
  }
  // overrides: [
  //   {
  //     files: ['*.js'],
  //     rules: {
  //       quotes: ['error', 'single']
  //     }
  //   }
  // ]
};
