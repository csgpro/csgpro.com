'use strict';

import * as hapi from 'hapi';
import * as fs from 'fs';
import * as publicRoutes from './public.routes';

export function init(server: hapi.Server) {
    // Set public routes
    server.route(publicRoutes);
    
    // Set controller routes
    fs.readdirSync(__dirname + '/../controllers').forEach((fileName) => {
        if (/\.js$/.test(fileName)) {
            let obj = require(__dirname + '/../controllers/' + fileName);
            let name = fileName.substring(0, fileName.indexOf('.'));
            console.log('\n   %s:', name);
            
            let prefix = obj.prefix || '';
            
            for (let key in obj) {
                let handler = obj[key];
                let method: string; /* GET | POST | PUT | DELETE */
                let path: string;
                
                switch(key) {
                    case 'create':
                        method = 'POST';
                        path = `/${name}`;
                        break;
                    case 'show':
                        method = 'GET';
                        path = `/${name}/{slug}`;
                        break;
                    case name:
                        method = 'GET';
                        path = (name === 'main') ? '/' : `/${name}`;
                        break;
                    default:
                        throw new Error('unrecognized route: ' + name + '.' + key);
                }
                
                server.route({
                    method: method,
                    path: prefix + path,
                    handler: handler
                });
            
                console.log('     %s %s -> %s', method, path, key);
            }
        }
    });
}