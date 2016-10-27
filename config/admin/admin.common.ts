// libs
import * as webpack from 'webpack';
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractCSS = new ExtractTextPlugin('[name].css');

// app
import * as helpers from '../helpers';

const context = helpers.root('public/admin');

const commonConfig = {
    context,
    entry: {
        polyfills: './polyfills.ts',
        vendor: './vendor.ts',
        app: './main.ts'
    },

    resolve: {
        extensions: ['', '.ts', '.js']
    },

    module: {
        loaders: [
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?tsconfig=' + helpers.root('public/admin/tsconfig.json'), 'angular2-template-loader']
            },
            {
                test: /\.html$/,
                loader: 'html'
            },
            {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file?name=assets/[name].[hash].[ext]'
            },
            {
                test: /\.scss$/,
                exclude: helpers.root('public/admin/styles'),
                loaders: ['raw-loader', 'sass-loader']
            },
            {
                test: /\.css$/,
                exclude: helpers.root('public/admin'),
                loader: ExtractTextPlugin.extract('style', 'css?sourceMap')
            },
            {
                test: /\.css$/,
                include: helpers.root('public/admin'),
                loader: 'raw'
            },
            {
                test: /\.scss$/,
                include: helpers.root('public/admin/styles'),
                loader: extractCSS.extract(['css', 'sass'])
            }
        ]
    },

    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: ['app', 'vendor', 'polyfills']
        }),

        new HtmlWebpackPlugin({
            template: 'index.html'
        }),

        extractCSS
    ]
};

export default commonConfig;