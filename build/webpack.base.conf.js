'use strict';
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { _resolve, assetsPath } = require('./utils');
const { entryList, pageList } = require('./setting.js');
const baseConf = {
  entry: entryList(),
  output: {
    path: _resolve('../dist')
  },
  resolve: {
    extensions: ['.js', '.json'],
    alias: {
      '@': _resolve('../src'),
      common: _resolve('../src/common')
    }
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader', include: _resolve('../src') },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: assetsPath('/img/[name].[hash:8].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: assetsPath('media/[name].[hash:8].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 8192,
          name: assetsPath('fonts/[name].[hash:8].[ext]')
        }
      }
    ]
  },
  plugins: [...pageList()]
};
module.exports = baseConf;
