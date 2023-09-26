module.exports = {
  env: { node: true, browser: true },
  parser: '@babel/eslint-parser',
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:vue/vue3-recommended'],
  rules: {
    'max-len': ['error', 130],
  },
};
