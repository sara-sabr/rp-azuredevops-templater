const baseConfig = require('./webpack.config.js');
const { mergeWithRules } = require('webpack-merge');
const path = require("path");

console.log("---- DEVELOPMENT MODE -------");
console.log("---- DEVELOPMENT MODE -------");
console.log("---- DEVELOPMENT MODE -------");

module.exports = mergeWithRules({
  module: {
    rules: {
      test: "match",
      options: "replace"
    },
  },
})(baseConfig, {
  devtool: 'eval-cheap-module-source-map',
  devServer: {
    proxy: {
      '/dist': {
        target: 'https://localhost:3000',
        pathRewrite: { '^/dist': '' },
        secure: false,
      },
    },
    server: {
      type: 'https'
    },
    port: 3000
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        options: {
          configFile: 'tsconfig.dev.json',
          transpileOnly: true
        },
      },
    ]
  }
})
