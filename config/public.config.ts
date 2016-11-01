// libs
import * as webpack from 'webpack';
import * as _ from 'lodash';

// app
import * as helpers from './helpers';
import { preLoaders, plugins } from './defaults';

const context = helpers.root('public/scripts');

const configuration: webpack.Configuration = {
    context,
    devtool: 'source-map',
    entry: {
        scripts: 'main.ts',
        vendor: 'vendor.ts',
        polyfills: 'polyfills.ts'
    },
    output: {
        path: helpers.root('public/scripts'),
        filename: 'scripts.bundle.js',
        sourceMapFilename: '[name].js.map',
        chunkFilename: '[id].chunk.js'
    },
    plugins,
    module: {
        preLoaders: [...preLoaders],
        loaders: [
            { test: /\.(ts|tsx)$/, loader: 'ts-loader' }
        ]
    },
    externals: {
        jquery: 'jQuery',
        foundation: 'Foundation',
        motionUI: 'MotionUI'
    },
    resolve: {
        root: context,
        extensions: ['', '.ts', '.json', '.js']
    }
};

export default configuration;