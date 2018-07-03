// libs
import * as webpack from 'webpack';
const ForkCheckerPlugin = require('awesome-typescript-loader').ForkCheckerPlugin;

// app
import * as helpers from './helpers';
import config from './admin.config';

export const preLoaders = [
    {
        test: /\.js$/,
        loader: 'source-map-loader',
        exclude: [
            // these packages have problems with their sourcemaps
            helpers.root('node_modules/rxjs'),
            helpers.root('node_modules/@angular'),
            helpers.root('node_modules/@ngrx'),
            helpers.root('node_modules/@angular2-material'),
            helpers.root('node_modules/moment')
        ]
    },
    {
        test: /\.ts$/,
        rule: 'tslint-loader'
    }

];

export const plugins = [
    /*
    * Plugin: ForkCheckerPlugin
    * Description: Do type checking in a separate process, so webpack don't need to wait.
    *
    * See: https://github.com/s-panferov/awesome-typescript-loader#forkchecker-boolean-defaultfalse
    */
    new ForkCheckerPlugin(),

    /*
    * Plugin: OccurrenceOrderPlugin
    * Description: Varies the distribution of the ids to get the smallest id length
    * for often used ids.
    *
    * See: https://webpack.github.io/docs/list-of-plugins.html#occurrenceorderplugin
    * See: https://github.com/webpack/docs/wiki/optimization#minimize
    */
    new webpack.optimize.OccurrenceOrderPlugin(true),

    /*
    * Plugin: CommonsChunkPlugin
    * Description: Shares common code between the pages.
    * It identifies common modules and put them into a commons chunk.
    *
    * See: https://webpack.github.io/docs/list-of-plugins.html#commonschunkplugin
    * See: https://github.com/webpack/docs/wiki/optimization#multi-page-app
    */
    new webpack.optimize.CommonsChunkPlugin({ names: ['polyfills', 'vendor'].reverse(), filename: '[name].bundle.js' }),
    //new config.optimization.slitchunks({ names: ['polyfills', 'vendor'].reverse(), filename: '[name].bundle.js' }),
];