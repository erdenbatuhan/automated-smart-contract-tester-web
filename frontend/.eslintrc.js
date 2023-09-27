module.exports = {
  env: { node: true, browser: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module'
  },
  extends: ['eslint:recommended', 'plugin:vue/vue3-recommended'],
  ignorePatterns: ['node_modules', 'dist'],
  rules: {
    'max-len': ['error', 130],
    'no-underscore-dangle': ['off'],
    'no-unused-vars': ['warn'],
    'comma-dangle': ['error', 'never'],
    'semi': ['error', 'always']
  }
};
