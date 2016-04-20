'use strict';

import * as hapi from 'hapi';
import * as fs from 'fs';
import * as path from 'path';
import * as publicRoutes from './public.routes';
import * as sitemap from '../modules/sitemap';

var Server: hapi.Server;

function configureRoutes(baseRoute: string, controller: any) {
    console.log(`\n   ${baseRoute}[controller]:`);
    
    let prefix = controller.prefix ? controller.prefix : '';
    
    for (let a in controller) {
        
        let action: string = a;
        
        if (~['name', 'prefix', 'engine', 'before'].indexOf(action)) continue;
        
        let handler: hapi.IRequestHandler<any> = controller[action];
        let method: 'GET' | 'POST' | 'PUT' | 'DELETE';
        let path: string;
        let auth: string;
        let payload: any;
        let inSitemap = '';
        
        switch(action) {
            case 'index':
                method = 'GET';
                path = (baseRoute === 'main') ? '/' : `/${baseRoute}`;
                break;
            case 'create':
                method = 'POST';
                path = `/${baseRoute}`;
                break;
            case 'read':
            case 'show':
                method = 'GET';
                path = `/${baseRoute}/{slug}`;
                break;
            case 'update':
                method = 'PUT';
                path = `/${baseRoute}/{slug}`;
                break;
            case 'remove':
                method = 'DELETE';
                path = `/${baseRoute}/{slug}`;
                break;
            default:
                method = 'GET';
                path = `/${baseRoute}/${action.toLowerCase()}`;
                break;
        }
        
        if (controller[action].hasOwnProperty('auth')) {
            auth = controller[action].auth;
        }
        
        if (controller[action].hasOwnProperty('method')) {
            method = controller[action].method;
        }
        
        if (controller[action].hasOwnProperty('prefix')) {
            prefix = prefix + controller[action].prefix;
        }
        
        path = prefix + path;
        
        if (controller[action].hasOwnProperty('sitemap') && !!(controller[action]['sitemap'])) {
            let title =  controller[action]['sitemap']['title'];
            if (!title) {
                title = baseRoute;
                title += (action !== 'index') ? `: ${action}` : '';
            }
            sitemap.addPage(path, title, (prefix));
            inSitemap = '(in sitemap)';
        }
        
        if (controller[action].hasOwnProperty('route')) {
            if (controller[action].hasOwnProperty('prefix')) {
                throw new Error('route and prefix cannot be used together');
            } else {
                path = controller[action].route;
            }
        }
        
        if (/^(POST|PUT)$/.test(method)) {
            payload = { parse: true };
        }
        
        Server.route({ method, path, handler: null, config: { auth, handler, payload } });
    
        console.log(`     ${method} ${path} -> ${action} ${inSitemap}`);
        if (auth) {
            console.log(`    auth: ${JSON.stringify(auth)}`);
        }
    }
}

function walkDirectory(directory: string) {
    let directoryContents = fs.readdirSync(directory);
    
    directoryContents.forEach((item) => {
        let filePath = path.join(directory, item);
        let stats = fs.lstatSync(filePath);
        
        if (stats.isDirectory()) {
            walkDirectory(filePath)
        } else if (stats.isFile()) {
            if (/\.controller\.js$/.test(item)) {
                let route = item.substring(0, item.indexOf('.'));
                configureRoutes(route, require(filePath));
            }
        }
    });
}

export function init(server: hapi.Server) {
    Server = server;
    // Set public routes
    server.route(publicRoutes);
    walkDirectory(__dirname + '/..');
}