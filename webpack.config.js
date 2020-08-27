const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const fs = require('fs')
const path = require('path')
// const webpack = require('webpack')

const nodeModules = {}
fs.readdirSync(path.resolve(__dirname, 'node_modules'))
  .filter(x => ['.bin'].indexOf(x) === -1)
  .forEach(mod => { nodeModules[mod] = `commonjs ${mod}` })

// es5 style alternative
/* fs.readdirSync(path.resolve(__dirname, 'node_modules'))
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1
  }).forEach(function(mod) {
  nodeModules[mod] = 'commonjs ' + mod
}) */

// https://webpack.js.org/guides/code-splitting/
const outputDirectory = 'lib'
module.exports = {
  mode: 'production',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, outputDirectory),
    filename: 'index.js',
    libraryTarget: 'commonjs2'
  },
  externals: nodeModules,
  module: {
    rules: [{
      test: /\.js?$/,
      include: path.resolve(__dirname, 'src'),
      exclude: [/(node_modules)/, /\.test.jsx?$/],
      use: 'babel-loader'
    }]
  },
  plugins: [
    new CleanWebpackPlugin({ outputPath: outputDirectory })
  ]
}
