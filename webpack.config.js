'use strict';

var webpack = require('webpack');

var webpackConfig = {
    context: __dirname + '/src/browser-scripts',
    devtool: "#inline-source-map",
    entry: {
        scripts: './main.ts',
        vendor: './vendor.ts'
    },
    output: {
        path: __dirname + '/lib/public/scripts',
        filename: 'scripts.bundle.js'
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */ "vendor", /* filename= */ "vendor.bundle.js")
    ],
    externals: {
        jquery: "jQuery",
        foundation: "Foundation"
    },
    module: {
        noParse: [],
        loaders: [
            { test: /\.(ts|tsx)$/, loader: 'ts-loader' }
        ]
    },
    resolve: {
        alias: {},
        extensions: ['', '.js', '.ts', '.json']
    }
};

module.exports = webpackConfig;