'use strict';

import * as webpack from 'webpack';
import * as path from 'path';

var webpackConfig: webpack.Configuration = {
    
    context: __dirname + '/scripts',
    devtool: "#inline-source-map",
    
    entry: {
        scripts: './main.ts',
        vendor: './vendor.ts'
    },
    
    output: {
        path: __dirname + '/public/scripts',
        filename: 'scripts.bundle.js'
    },
    
    plugins: [
        new webpack.optimize.CommonsChunkPlugin(/* chunkName= */"vendor", /* filename= */"vendor.bundle.js")
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
        extensions: ['', '.js',  '.ts', '.json']
    }
};

export = webpackConfig;