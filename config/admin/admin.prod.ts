// libs
import * as webpack from 'webpack';
const webpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// app
import commonConfig from './admin.common';
import * as helpers from '../helpers';

const ENV = process.env.NODE_ENV = process.env.ENV = 'production';

export default webpackMerge(commonConfig, {
  devtool: 'source-map',

  output: {
    path: helpers.root('/public/admin'),
    publicPath: '/admin/resources',
    filename: '[name].[hash].js',
    chunkFilename: '[id].[hash].chunk.js'
  },
  
  // htmlLoader: {
  //   minimize: false // workaround for ng2
  // },

  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ // https://github.com/angular/angular/issues/10618
      mangle: {
        keep_fnames: true
      }
    }),
    new ExtractTextPlugin('[name].[hash].css'),
    new webpack.DefinePlugin({
      'process.env': {
        'ENV': JSON.stringify(ENV)
      }
    })
  ]
});
