'use strict';

const webpack = require('webpack');
const helpers = require('./helpers');

/*
 * Webpack Plugins
 */
// problem with copy-webpack-plugin
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;
const HtmlElementsPlugin = require('./html-elements-plugin');

const mainConfig = {
    context: helpers.root('src/browser-scripts'),
    devtool: "#source-map",
    entry: {
        scripts: 'main.ts',
        vendor: 'vendor.ts',
        polyfills: 'polyfills.ts'
    },
    output: {
        path: helpers.root('dist/public/scripts'),
        filename: 'scripts.bundle.js',
        sourceMapFilename: '[name].js.map',
        chunkFilename: '[id].chunk.js',
        devtoolModuleFilenameTemplate: function(info){
            if(info.absoluteResourcePath.charAt(0) === '/') {
                return 'file://'+info.absoluteResourcePath;
            } else {
                return 'file:///'+info.absoluteResourcePath;
            }      
        },
        devtoolFallbackModuleFilenameTemplate: function(info){
            if(info.absoluteResourcePath.charAt(0) === '/') {
                return 'file://'+info.absoluteResourcePath+'?'+info.hash;
            } else {
                return 'file:///'+info.absoluteResourcePath+'?'+info.hash;
            }      
        }
    },
    plugins: [
        /*
        * Plugin: ForkCheckerPlugin
        * Description: Do type checking in a separate process, so webpack don't need to wait.
        *
        * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
        */
        new ForkCheckerPlugin(),

        /*
        * Plugin: OccurenceOrderPlugin
        * Description: Varies the distribution of the ids to get the smallest id length
        * for often used ids.
        *
        * See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
        * See: https://github.com/webpack/docs/wiki/optimization#minimize
        */
        new webpack.optimize.OccurenceOrderPlugin(true),

        /*
        * Plugin: CommonsChunkPlugin
        * Description: Shares common code between the pages.
        * It identifies common modules and put them into a commons chunk.
        *
        * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
        * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
        */
        new webpack.optimize.CommonsChunkPlugin({ names: ['polyfills', 'vendor'].reverse(), filename: '[name].bundle.js' }),

        /*
        * Plugin: CopyWebpackPlugin
        * Description: Copy files and directories in webpack.
        *
        * Copies project static assets.
        *
        * See: https://www.npmjs.com/package/copy-webpack-plugin
        */
        new CopyWebpackPlugin([
            { from: 'index.html' },
            { from: 'assets', to: helpers.root('dist/public/assets') }
        ]),

        /*
        * Plugin: HtmlHeadConfigPlugin
        * Description: Generate html tags based on javascript maps.
        *
        * If a publicPath is set in the webpack output configuration, it will be automatically added to
        * href attributes, you can disable that by adding a "=href": false property.
        * You can also enable it to other attribute by settings "=attName": true.
        *
        * The configuration supplied is map between a location (key) and an element definition object (value)
        * The location (key) is then exported to the template under then htmlElements property in webpack configuration.
        *
        * Example:
        *  Adding this plugin configuration
        *  new HtmlElementsPlugin({
        *    headTags: { ... }
        *  })
        *
        *  Means we can use it in the template like this:
        *  <%= webpackConfig.htmlElements.headTags %>
        *
        * Dependencies: HtmlWebpackPlugin
        */
        new HtmlElementsPlugin({
            headTags: require('./head-config')
        }),
    ],
    externals: {
        jquery: "jQuery",
        foundation: "Foundation",
        motionUI: "MotionUI"
    },
    module: {
        noParse: [],
        preLoaders: [

            /*
            * Source map loader support for *.js files
            * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
            *
            * See: https://github.com/webpack/source-map-loader
            */
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                // these packages have problems with their sourcemaps
                helpers.root('node_modules/rxjs'),
                helpers.root('node_modules/@angular'),
                helpers.root('node_modules/@ngrx'),
                helpers.root('node_modules/@angular2-material'),
                ]
            },
            {
                test: /\.ts$/,
                loader: 'tslint-loader'
            }

        ],
        loaders: [
            { test: /\.(ts|tsx)$/, loader: 'ts-loader' }
        ]
    },
    resolve: {
        root: helpers.root('src/browser-scripts'),
        extensions: ['', '.js', '.ts', '.json']
    },
    /*
    * Include polyfills or mocks for various node stuff
    * Description: Node configuration
    *
    * See: https://webpack.github.io/docs/configuration.html#node
    */
    node: {
        global: 'window',
        crypto: 'empty',
        module: false,
        clearImmediate: false,
        setImmediate: false
    }
};

const METADATA = {
  title: 'CSG Pro Admin Portal',
  baseUrl: '/admin/',
  isDevServer: helpers.isWebpackDevServer()
};

const adminConfig = {
    devtool: "#source-map",
    metadata: METADATA,
    context: helpers.root('src/admin'),
    entry: {
        scripts: 'main.ts',
        vendor: 'vendor.ts',
        polyfills: 'polyfills.ts'
    },
    output: {
        path: helpers.root('dist/public/admin'),
        filename: 'scripts.bundle.js',
        sourceMapFilename: '[name].js.map',
        chunkFilename: '[id].chunk.js',
        devtoolModuleFilenameTemplate: function(info){
            if(info.absoluteResourcePath.charAt(0) === '/') {
                return 'file://'+info.absoluteResourcePath;
            } else {
                return 'file:///'+info.absoluteResourcePath;
            }      
        },
        devtoolFallbackModuleFilenameTemplate: function(info){
            if(info.absoluteResourcePath.charAt(0) === '/') {
                return 'file://'+info.absoluteResourcePath+'?'+info.hash;
            } else {
                return 'file:///'+info.absoluteResourcePath+'?'+info.hash;
            }      
        }
    },

/*
output: {
    path: root('__build__'),
    filename: '[name].js',
    // filename: '[name].[hash].js',
    sourceMapFilename: '[name].js.map',
    chunkFilename: '[id].chunk.js',
    // publicPath: 'http://mycdn.com/'
    devtoolModuleFilenameTemplate: function(info){
      return "file:///"+info.absoluteResourcePath;
    }
  },
*/

    plugins: mainConfig.plugins,
    module: {
        noParse: [],
        preLoaders: [

            /*
            * Source map loader support for *.js files
            * Extracts SourceMaps for source files that as added as sourceMappingURL comment.
            *
            * See: https://github.com/webpack/source-map-loader
            */
            {
                test: /\.js$/,
                loader: 'source-map-loader',
                exclude: [
                // these packages have problems with their sourcemaps
                helpers.root('node_modules/rxjs'),
                helpers.root('node_modules/@angular'),
                helpers.root('node_modules/@ngrx'),
                helpers.root('node_modules/@angular2-material'),
                helpers.root('node_modules/moment'),
                ]
            },
            {
                test: /\.ts$/,
                loader: 'tslint-loader'
            }

        ],
        loaders: [
            /*
            * Typescript loader support for .ts and Angular 2 async routes via .async.ts
            *
            * See: https://github.com/s-panferov/awesome-typescript-loader
            */
            {
                test: /\.ts$/,
                loaders: ['awesome-typescript-loader?tsconfig=' + helpers.root('src/admin/tsconfig.json'), 'angular2-template-loader'],
                exclude: [/\.(spec|e2e)\.ts$/]
            },

            /*
            * Json loader support for *.json files.
            *
            * See: https://github.com/webpack/json-loader
            */
            {
                test: /\.json$/,
                loader: 'json-loader'
            },

            /*
            * to string and css loader support for *.css files
            * Returns file content as string
            *
            */
            {
                test: /\.css|scss$/,
                loaders: ['raw-loader', 'sass-loader']
            },

            /* Raw loader support for *.html
            * Returns file content as string
            *
            * See: https://github.com/webpack/raw-loader
            */
            {
                test: /\.html$/,
                loader: 'raw-loader',
                exclude: [helpers.root('src/admin/index.html')]
            }

        ]
    },

    /**
     * Html loader advanced options
     *
     * See: https://github.com/webpack/html-loader#advanced-options
     */
    // TODO: Need to workaround Angular 2's html syntax => #id [bind] (event) *ngFor
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
    },
    resolve: {
        root: helpers.root('src/admin'),
        extensions: ['', '.js', '.ts', '.json']
    },
    externals: {
        jquery: "jQuery",
        foundation: "Foundation",
        motionUI: "MotionUI"
    }
}

module.exports = [mainConfig, adminConfig];