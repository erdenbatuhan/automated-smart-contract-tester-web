module.exports = {
  env: { node: true, browser: true },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@babel/eslint-parser',
    sourceType: 'module',
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:vue/vue3-recommended'],
  rules: {
    'max-len': ['error', 130],
  },
};
