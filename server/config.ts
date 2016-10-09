// libs
import {Store} from 'confidence';
import * as path from 'path';

const criteria = {
    server_group: process.env.SERVER_GROUP || 'development',
    log_level: process.env.LOG_LEVEL || 'verbose'
};

const config = {
    $meta: 'server config',
    server: {
        host: '0.0.0.0',
        port: process.env.PORT || 3000,
        routes: {
            files: {
                relativeTo: path.join(__dirname, '..', 'public')
            },
            cors: {
                origin: [process.env.CORS_ORIGIN || 'http://localhost:3000']
            }
        },
        router: {
            isCaseSensitive: true,
            stripTrailingSlash: true
        },
        labels: ['web']
    },
    good: {
        ops: {
            interval: 1000
        },
        reporters: {
            console: [
                {
                    module: 'good-squeeze',
                    name: 'Squeeze',
                    args: [
                        {
                            '$filter': 'log_level',
                            minimal: {
                                log: '*',
                                response: '*',
                                request: '*'
                            },
                            verbose: {
                                log: '*',
                                error: '*',
                                response: '*',
                                request: '*'
                            }
                        }
                    ]
                },
                {
                    module: 'good-console'
                },
                'stdout'
            ]
        }
    },
    qs: {
        qsOptions: {
            depth: 10
        }
    },
    visionary: {
        engines: { html: 'handlebars' },
        relativeTo: __dirname,
        path: 'views',
        layout: true,
        layoutPath: path.join('views', 'layouts'),
        helpersPath: path.join('views', 'helpers'),
        partialsPath: path.join('views', 'partials'),
        context: {
            sitename: 'CSG Pro',
            GTM_KEY: process.env.GOOGLE_TAG_MANAGER_KEY
        }
    },
    sitemap: {
        baseUri: 'https://www.csgpro.com'
    },
    routes: {
        feed: {
            feedPingInterval: (process.env.FEED_PING_INTERVAL || 30) * 1000
        }
    }
};

const store = new Store(config);

export const get = key => store.get(key, criteria);
export const meta = key => store.meta(key, criteria);
