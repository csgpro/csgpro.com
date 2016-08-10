'use strict';

import * as fs from 'fs';
const handlebars = require('handlebars');

function getPaths(server, baseUri, filter) {
    let routeTable = server.table();
    let results = [];

    for (let i = 0; i < routeTable.length; i++) {
        let route = routeTable[i];

        for (let j = 0; j < route.table.length; j++) {
            let table = route.table[j];

            let sitemapSettings = table.settings.plugins.sitemap || { exclude: false };
            if (!sitemapSettings.exclude) {
                let path = trimPathParams(table.path);
                results.push(baseUri + path);
            }
        }
    }

    return results;
};

function trimPathParams(path: string) {
    let pathLength = path.length;
    let newPath = path.replace(/(\{[a-zA-Z0-9\*\?-_].*\})/, '').trim();
    if (newPath.length > 1 && newPath.lastIndexOf('/') === (newPath.length - 1)) {
        newPath = newPath.slice(0, -1);
    }
    if (newPath === path) {
        return newPath;
    } else {
        return trimPathParams(newPath);
    }
}

export function register(server, options, next) {
    let endpoint = options.endpoint || '/sitemap.xml';
    let baseUri = options.baseUri || '';
    let filter = options.filter || function() { return true; };

    server.route({
        method: 'GET',
        path: endpoint,
        handler: function(request, reply) {
            let paths = getPaths(server, baseUri, filter);
            let source = fs.readFileSync(__dirname + '/sitemap.xml.hbs', 'utf8');

            let template = handlebars.compile(source);
            reply(template({paths: paths}))
                .type('application/xml');
        },
        config: {
            description: 'Provides a list of routes to be indexed by search engines',
            plugins: {
                sitemap: {
                    exclude: true
                }
            }
        }
    });

    next();
}

register['attributes'] = {
    pkg: {name: 'hapi-sitemap'}
};