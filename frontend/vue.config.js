const { defineConfig } = require('@vue/cli-service');

module.exports = defineConfig({
  devServer: {
    port: process.env.PORT
  },
  transpileDependencies: true
});
