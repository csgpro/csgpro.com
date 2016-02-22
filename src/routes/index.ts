'use strict';

import * as hapi from 'hapi';
import * as fs from 'fs';
import * as _ from 'lodash';
import * as publicRoutes from './public.routes';
import * as sitemap from '../modules/sitemap';

export function init(server: hapi.Server) {
    // Set public routes
    server.route(publicRoutes);
    
    // Set controller routes
    fs.readdirSync(__dirname + '/../controllers').forEach((fileName) => {
        if (/\.js$/.test(fileName)) {
            let obj = require(__dirname + '/../controllers/' + fileName);
            let name = fileName.substring(0, fileName.indexOf('.'));
            console.log(`\n   ${name}:`);
            
            let prefix = obj.prefix || '';
            
            for (let key in obj) {
                
                if (~['name', 'prefix', 'engine', 'before'].indexOf(key)) continue;
                
                let handler: hapi.IRequestHandler<any> = obj[key];
                let method: string; /* GET | POST | PUT | DELETE */
                let path: string;
                let config: any;
                
                let inSitemap: string;
                
                const sitemapXmlExcludeConfig = {
                    plugins: {
                        sitemap: {
                            exclude: true
                        }
                    }
                };
                
                switch(key) {
                    case 'create':
                        method = 'POST';
                        path = `/${name}`;
                        config = sitemapXmlExcludeConfig;
                        break;
                    case 'show':
                        method = 'GET';
                        path = `/${name}/{slug}`;
                        config = sitemapXmlExcludeConfig;
                        break;
                    case _.camelCase(name):
                        method = 'GET';
                        path = (name === 'main') ? '/' : `/${name}`;
                        break;
                    default:
                        throw new Error(`unrecognized route: ${name}.${key}`);
                }
                
                path = prefix + path;
                
                // Add page to sitemap -> `/sitemap`
                if (handler.title) {
                    sitemap.addPage(path, handler.title);
                    inSitemap = '(in sitemap)';
                }
                
                server.route({ method, path, handler, config });
            
                console.log(`     ${method} ${path} -> ${key} ${inSitemap || ''}`);
            }
        }
    });
}