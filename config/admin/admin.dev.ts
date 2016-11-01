// libs
import * as webpack from 'webpack';
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// app
import commonConfig from './admin.common';
import * as helpers from '../helpers';

const ENV = process.env.NODE_ENV = process.env.ENV = 'development';

export default webpackMerge(commonConfig, {
  devtool: 'cheap-module-eval-source-map',

  output: {
    path: helpers.root('public/admin'),
    publicPath: 'http://localhost:8080/admin',
    filename: '[name].js',
    chunkFilename: '[id].chunk.js'
  },

  plugins: [
    new ExtractTextPlugin('[name].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ],

  devServer: {
    historyApiFallback: {
      index: '/admin/index.html'
    },
    stats: 'minimal',
    proxy: {
      '/api/*': {
        target: 'http://localhost:3000'
      },
      '/file/*': {
        target: 'http://localhost:3000'
      },
      '/resources/*': {
        target: 'http://localhost:3000'
      }
    }
  }
});
