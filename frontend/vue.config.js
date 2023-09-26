// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config({ path: 'application.properties' });
const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    port: process.env.PORT,
  },
  transpileDependencies: true,
});
