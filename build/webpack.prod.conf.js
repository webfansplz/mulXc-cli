'use strict';
const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const baseConf = require('./webpack.base.conf');
const prodConfig = require('../config').build;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { assetsPath } = require('./utils');
const { entryList } = require('./setting.js');
const { rulesList, stylePlugins } = require('./style.js');
const prodConf = merge(baseConf, {
  output: {
    publicPath: '/',
    filename: assetsPath('/js/[name].[chunkhash].js')
  },
  devtool: prodConfig.devtoolType,
  module: {
    rules: [...rulesList()]
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      parallel: true,
      compress: {
        warnings: false
      }
    }),
    new OptimizeCSSPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'app',
      children: true,
      minChunks: 3
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      minChunks: 2
    }),
    ...stylePlugins
  ]
});
module.exports = prodConf;
