// libs
import * as webpack from 'webpack';
import * as _ from 'lodash';

// app
import * as helpers from './helpers';
import { preLoaders, plugins } from './defaults';

const context = helpers.root('public/admin');

const configuration: webpack.Configuration & { htmlLoader: any } = {
    context,
    devtool: 'source-map',
    entry: {
        scripts: 'main.ts',
        vendor: 'vendor.ts',
        polyfills: 'polyfills.ts'
    },
    output: {
        path: helpers.root('public/admin'),
        filename: 'scripts.bundle.js',
        sourceMapFilename: '[name].js.map',
        chunkFilename: '[id].chunk.js'
    },
    plugins,
    module: {
        preLoaders: [...preLoaders],
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?tsconfig=' + helpers.root('public/admin/tsconfig.json'), 'angular2-template-loader']
            },
            {
                test: /\.json$/,
                loader: 'json-loader'
            },
            {
                test: /\.css|scss$/,
                loaders: ['raw-loader', 'sass-loader']
            },
            {
                test: /(?!index)\.html$/,
                loader: 'raw-loader'
            }
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
    },
    htmlLoader: {
        minimize: true,
        removeAttributeQuotes: false,
        caseSensitive: true,
        customAttrSurround: [
        [/#/, /(?:)/],
        [/\*/, /(?:)/],
        [/\[?\(?/, /(?:)/]
        ],
        customAttrAssign: [/\)?\]?=/]
    }
};

export default configuration;