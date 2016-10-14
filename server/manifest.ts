// libs
import {Store} from 'confidence';

// app
import * as config from './config';

const criteria = {
    env: process.env.NODE_ENV || 'development'
};

let store: Store,
    manifest: any;

manifest = {
    $meta: 'server setup',
    connections: [config.get('/server')],
    registrations: [
        // Third Party Plugins
        {
            plugin: {
                register: 'good',
                options: config.get('/good')
            }
        },
        {
            plugin: {
                register: 'hapi-qs',
                options: config.get('/qs')
            }
        },
        {
            plugin: 'inert'
        },
        {
            plugin: 'scooter'
        },
        {
            plugin: 'vision'
        },
        {
            plugin: {
                register: 'visionary',
                options: config.get('/visionary')
            }
        },
        {
            plugin: {
                register: './shared/hapi-sitemap',
                options: config.get('/sitemap')
            }
        },
        {
            plugin: {
                register: './shared/error-handler'
            }
        },

        // Authentication
        {
            plugin: {
                register: './auth'
            }
        },

        // App Routes
        {
            plugin: {
                register: './routes',
                options: config.get('/routes')
            }
        }
    ]
};

store = new Store(manifest);

export const get = (key) => {
    return store.get(key, criteria);
};

export const meta = (key) => {
    return store.meta(key, criteria);
};
